/**
 * Buat kelas dummy untuk staging/load test.
 * Membuat KELAS-A sampai KELAS-F dan satu akun dosen staging.
 *
 * Jalankan: npx tsx scripts/setup-staging-classes.ts
 */

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLASS_CODES = ["KELAS-A", "KELAS-B", "KELAS-C", "KELAS-D", "KELAS-E", "KELAS-F"];

async function main() {
  console.log("Setting up staging classes...");

  // Create staging teacher
  const passwordHash = await bcrypt.hash("DosenStaging123!", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "dosen-staging@example.test" },
    update: {},
    create: {
      name: "Dosen Staging",
      email: "dosen-staging@example.test",
      passwordHash,
      role: "TEACHER",
      teacher: { create: { lecturerNumber: "DSN-STAGING-001" } }
    },
    include: { teacher: true }
  });

  // Create classes
  for (const code of CLASS_CODES) {
    await prisma.class.upsert({
      where: { code },
      update: {},
      create: {
        name: `Kelas Staging ${code.replace("KELAS-", "")}`,
        code,
        semester: "Genap",
        academicYear: "2025/2026",
        teacherId: teacher.teacher!.id
      }
    });
    console.log(`  ✅ ${code} created/exists`);
  }

  console.log(`\n  Dosen staging: dosen-staging@example.test / DosenStaging123!`);
  console.log("  Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
