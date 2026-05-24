/**
 * Import Mahasiswa dari CSV
 * Target: 300+ mahasiswa
 * 
 * Format CSV: name,email,nim,password,classCode
 * 
 * Jalankan: npm run import:students -- path/to/file.csv
 * Atau: npx tsx scripts/import-students.ts path/to/file.csv
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

interface CsvRow {
  name: string;
  email: string;
  nim: string;
  password: string;
  classCode: string;
}

interface ImportResult {
  total: number;
  success: number;
  duplicateEmail: string[];
  duplicateNim: string[];
  invalidClass: string[];
  errors: string[];
}

function parseCsv(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  
  if (lines.length < 2) {
    throw new Error("CSV harus memiliki header dan minimal 1 baris data.");
  }

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredFields = ["name", "email", "nim", "password", "classcode"];
  for (const field of requiredFields) {
    if (!header.includes(field)) {
      throw new Error(`Header CSV harus memiliki kolom: ${requiredFields.join(", ")}. Tidak ditemukan: ${field}`);
    }
  }

  const nameIdx = header.indexOf("name");
  const emailIdx = header.indexOf("email");
  const nimIdx = header.indexOf("nim");
  const passwordIdx = header.indexOf("password");
  const classCodeIdx = header.indexOf("classcode");

  return lines.slice(1).map((line, lineNum) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 5) {
      throw new Error(`Baris ${lineNum + 2}: kolom tidak lengkap (butuh 5, dapat ${cols.length}).`);
    }
    return {
      name: cols[nameIdx],
      email: cols[emailIdx],
      nim: cols[nimIdx],
      password: cols[passwordIdx],
      classCode: cols[classCodeIdx]
    };
  });
}

async function importStudents(csvPath: string): Promise<ImportResult> {
  const rows = parseCsv(csvPath);
  const result: ImportResult = {
    total: rows.length,
    success: 0,
    duplicateEmail: [],
    duplicateNim: [],
    invalidClass: [],
    errors: []
  };

  console.log(`\n📋 Membaca ${rows.length} baris dari CSV...`);

  // Pre-fetch existing emails and NIMs for fast lookup
  const existingEmails = new Set(
    (await prisma.user.findMany({ select: { email: true } })).map((u) => u.email)
  );
  const existingNims = new Set(
    (await prisma.student.findMany({ select: { nim: true } })).map((s) => s.nim)
  );

  // Pre-fetch classes
  const classMap = new Map(
    (await prisma.class.findMany({ select: { id: true, code: true } })).map((c) => [c.code, c.id])
  );

  // Process in batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    console.log(`  Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}...`);

    for (const row of batch) {
      try {
        // Validate
        if (!row.email || !row.nim || !row.name || !row.password || !row.classCode) {
          result.errors.push(`${row.email || row.nim}: data tidak lengkap`);
          continue;
        }

        if (existingEmails.has(row.email)) {
          result.duplicateEmail.push(row.email);
          continue;
        }

        if (existingNims.has(row.nim)) {
          result.duplicateNim.push(row.nim);
          continue;
        }

        const classId = classMap.get(row.classCode);
        if (!classId) {
          result.invalidClass.push(`${row.email}: classCode "${row.classCode}" tidak ditemukan`);
          continue;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(row.password, BCRYPT_ROUNDS);

        // Create user + student + class membership
        const user = await prisma.user.create({
          data: {
            name: row.name,
            email: row.email,
            passwordHash,
            role: "STUDENT",
            student: {
              create: {
                nim: row.nim,
                classId
              }
            }
          },
          include: { student: true }
        });

        // Add to class membership
        await prisma.classMember.create({
          data: { classId, studentId: user.student!.id }
        });

        existingEmails.add(row.email);
        existingNims.add(row.nim);
        result.success++;
      } catch (error) {
        result.errors.push(`${row.email}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  }

  return result;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("❌ Gunakan: npx tsx scripts/import-students.ts <path-to-csv>");
    console.error("   Contoh: npx tsx scripts/import-students.ts data/mahasiswa.csv");
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ File tidak ditemukan: ${resolvedPath}`);
    process.exit(1);
  }

  console.log("═══════════════════════════════════════════════");
  console.log("  Import Mahasiswa dari CSV");
  console.log("  Target: 300+ mahasiswa");
  console.log("═══════════════════════════════════════════════");

  const result = await importStudents(resolvedPath);

  console.log("\n═══════════════════════════════════════════════");
  console.log("  HASIL IMPORT");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Total baris CSV    : ${result.total}`);
  console.log(`  ✅ Berhasil         : ${result.success}`);
  console.log(`  ⚠️  Duplikat email  : ${result.duplicateEmail.length}`);
  console.log(`  ⚠️  Duplikat NIM    : ${result.duplicateNim.length}`);
  console.log(`  ❌ Kelas tidak ada  : ${result.invalidClass.length}`);
  console.log(`  ❌ Error lain       : ${result.errors.length}`);
  console.log("═══════════════════════════════════════════════");

  if (result.duplicateEmail.length > 0) {
    console.log("\nDuplikat email (di-skip):");
    result.duplicateEmail.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
    if (result.duplicateEmail.length > 10) console.log(`  ... dan ${result.duplicateEmail.length - 10} lainnya`);
  }

  if (result.invalidClass.length > 0) {
    console.log("\nKelas tidak ditemukan:");
    result.invalidClass.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
  }

  if (result.errors.length > 0) {
    console.log("\nError:");
    result.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
  }
}

main()
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
