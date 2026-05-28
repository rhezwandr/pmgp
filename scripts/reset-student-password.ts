/**
 * Reset password mahasiswa dari CMD.
 *
 * Cara pakai:
 *   npm run reset:student-password -- email@example.com PasswordBaru123
 *
 * Aturan:
 * - Hanya untuk role STUDENT
 * - Password minimal 8 karakter
 * - Tidak mengubah data jawaban/progress mahasiswa
 */

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("❌ Cara pakai: npm run reset:student-password -- email@example.com PasswordBaru");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("❌ Password baru minimal 8 karakter.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌ User dengan email "${email}" tidak ditemukan.`);
    process.exit(1);
  }

  if (user.role !== "STUDENT") {
    console.error(`❌ User "${email}" bukan mahasiswa (role: ${user.role}). Script ini hanya untuk STUDENT.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { email },
    data: { passwordHash }
  });

  console.log("═══════════════════════════════════════════════");
  console.log("  ✅ Password berhasil direset");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Email    : ${email}`);
  console.log(`  Nama     : ${user.name}`);
  console.log(`  Password : (sudah diperbarui)`);
  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
