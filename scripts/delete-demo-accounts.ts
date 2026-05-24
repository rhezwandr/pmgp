/**
 * Hapus akun demo dari database production.
 * Hanya menghapus akun dengan email yang terdaftar di DEMO_EMAILS.
 * Tidak menghapus data mahasiswa asli.
 *
 * Jalankan: npm run delete:demo
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_EMAILS = [
  "guru@example.com",
  "mahasiswa1@example.com",
  "mahasiswa2@example.com"
];

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  Hapus Akun Demo");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Target: ${DEMO_EMAILS.join(", ")}`);
  console.log("");

  let deleted = 0;
  let notFound = 0;

  for (const email of DEMO_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`  ⚠️  ${email} — tidak ditemukan (sudah dihapus atau belum ada)`);
      notFound++;
      continue;
    }

    // Cascade delete: User → Student/Teacher → semua relasi
    await prisma.user.delete({ where: { email } });
    console.log(`  ✅ ${email} — dihapus (role: ${user.role})`);
    deleted++;
  }

  console.log("");
  console.log("───────────────────────────────────────────────");
  console.log(`  Dihapus    : ${deleted}`);
  console.log(`  Tidak ada  : ${notFound}`);
  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
