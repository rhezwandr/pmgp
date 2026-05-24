/**
 * Hapus semua akun dummy staging (@example.test) dari database.
 * Cascade delete akan menghapus student, jawaban, feedback, dll.
 *
 * Guard: hanya jalan jika NODE_ENV !== "production" ATAU ALLOW_TEST_DATA_CLEANUP=true
 *
 * Jalankan: npm run cleanup:test-students
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Safety guard
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TEST_DATA_CLEANUP !== "true") {
    console.error("❌ DITOLAK: Tidak boleh cleanup di production tanpa ALLOW_TEST_DATA_CLEANUP=true");
    process.exit(1);
  }

  console.log("═══════════════════════════════════════════════");
  console.log("  Cleanup Test Students (@example.test)");
  console.log("═══════════════════════════════════════════════");

  // Find all test accounts
  const testUsers = await prisma.user.findMany({
    where: { email: { endsWith: "@example.test" } },
    select: { id: true, email: true, role: true }
  });

  console.log(`  Ditemukan: ${testUsers.length} akun @example.test`);

  if (testUsers.length === 0) {
    console.log("  Tidak ada yang perlu dihapus.");
    return;
  }

  // Delete all (cascade handles relations)
  const result = await prisma.user.deleteMany({
    where: { email: { endsWith: "@example.test" } }
  });

  console.log(`  ✅ Dihapus: ${result.count} akun`);

  // Also clean up orphaned classes
  const testClasses = await prisma.class.findMany({
    where: { code: { startsWith: "KELAS-" } },
    select: { id: true, code: true }
  });

  if (testClasses.length > 0) {
    await prisma.class.deleteMany({
      where: { code: { startsWith: "KELAS-" } }
    });
    console.log(`  ✅ Dihapus: ${testClasses.length} kelas staging`);
  }

  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
