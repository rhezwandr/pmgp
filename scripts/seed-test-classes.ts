/**
 * Buat kelas dummy KELAS-A sampai KELAS-F untuk staging/testing.
 * Terhubung ke guru demo (guru@example.com) yang dibuat oleh seed utama.
 * Aman dijalankan ulang (upsert).
 *
 * Jalankan: npm run seed:test-classes
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEST_CLASSES = [
  { code: "KELAS-A", name: "Kelas Staging A (001–050)" },
  { code: "KELAS-B", name: "Kelas Staging B (051–100)" },
  { code: "KELAS-C", name: "Kelas Staging C (101–150)" },
  { code: "KELAS-D", name: "Kelas Staging D (151–200)" },
  { code: "KELAS-E", name: "Kelas Staging E (201–250)" },
  { code: "KELAS-F", name: "Kelas Staging F (251–300)" },
];

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  Seed Test Classes (KELAS-A sampai KELAS-F)");
  console.log("═══════════════════════════════════════════════");

  // Find the demo teacher
  const teacherUser = await prisma.user.findUnique({
    where: { email: "guru@example.com" },
    include: { teacher: true }
  });

  if (!teacherUser?.teacher) {
    console.error("❌ Guru demo (guru@example.com) tidak ditemukan.");
    console.error("   Jalankan 'npx prisma db seed' terlebih dahulu.");
    process.exit(1);
  }

  const teacherId = teacherUser.teacher.id;
  console.log(`  Guru: ${teacherUser.name} (${teacherUser.email})`);
  console.log("");

  for (const cls of TEST_CLASSES) {
    await prisma.class.upsert({
      where: { code: cls.code },
      update: { name: cls.name },
      create: {
        name: cls.name,
        code: cls.code,
        semester: "Genap",
        academicYear: "2025/2026",
        teacherId
      }
    });
    console.log(`  ✅ ${cls.code} — ${cls.name}`);
  }

  console.log("");
  console.log(`  Total: ${TEST_CLASSES.length} kelas dibuat/diperbarui`);
  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
