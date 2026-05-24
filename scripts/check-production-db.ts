/**
 * Health Check Database Production
 * Mengecek kesiapan database untuk 300 mahasiswa.
 *
 * Jalankan: npm run check:production-db
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function maskUrl(url: string | undefined): string {
  if (!url) return "❌ TIDAK TERSEDIA";
  if (url.includes("localhost") || url.includes("127.0.0.1")) return "⚠️  localhost (bukan production)";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host.includes("neon.tech")) return `✅ Neon (${host.split(".")[0]}...neon.tech)`;
    if (host.includes("supabase")) return `✅ Supabase (${host.split(".")[0]}...supabase.co)`;
    if (host.includes("railway")) return `✅ Railway`;
    return `✅ Managed (${host.substring(0, 15)}...)`;
  } catch {
    return "⚠️  Format tidak dikenali";
  }
}

function checkSecret(secret: string | undefined): string {
  if (!secret) return "❌ TIDAK TERSEDIA — WAJIB diisi sebelum production";
  if (secret.length < 20) return "⚠️  Terlalu pendek (minimal 32 karakter)";
  if (secret.includes("development") || secret.includes("change-me")) return "⚠️  Masih default development";
  return `✅ Tersedia (${secret.length} karakter)`;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  DATABASE PRODUCTION HEALTH CHECK");
  console.log("  Target: 300 mahasiswa");
  console.log("═══════════════════════════════════════════════════════════\n");

  // 1. Environment Variables
  console.log("── Environment Variables ──────────────────────────────────");
  console.log(`  DATABASE_URL       : ${maskUrl(process.env.DATABASE_URL)}`);
  console.log(`  DIRECT_DATABASE_URL: ${maskUrl(process.env.DIRECT_DATABASE_URL)}`);
  console.log(`  AUTH_SECRET        : ${checkSecret(process.env.AUTH_SECRET)}`);
  console.log(`  NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || "❌ belum diset"}`);
  console.log(`  NODE_ENV           : ${process.env.NODE_ENV || "tidak diset"}`);

  // Warnings
  if (process.env.DATABASE_URL === process.env.DIRECT_DATABASE_URL) {
    console.log(`  ⚠️  DATABASE_URL dan DIRECT_DATABASE_URL sama — pastikan pooling aktif di provider`);
  }
  console.log("");

  // 2. Database Connection
  console.log("── Database Connection ───────────────────────────────────");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("  Prisma connection  : ✅ OK");
  } catch (e) {
    console.log(`  Prisma connection  : ❌ GAGAL — ${e instanceof Error ? e.message : "unknown"}`);
    console.log("\n  ❌ Tidak bisa melanjutkan tanpa koneksi database.");
    return;
  }
  console.log("");

  // 3. Data Counts
  console.log("── Data Counts ──────────────────────────────────────────");
  const [users, students, teachers, classes, tests, questions, lkms, modules] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.test.count(),
    prisma.question.count(),
    prisma.lKM.count(),
    prisma.module.count(),
  ]);

  console.log(`  Users     : ${users}`);
  console.log(`  Students  : ${students}`);
  console.log(`  Teachers  : ${teachers}`);
  console.log(`  Classes   : ${classes}`);
  console.log(`  Tests     : ${tests} ${tests === 3 ? "✅" : "⚠️  (seharusnya 3: KAM, PRE_TEST, POST_TEST)"}`);
  console.log(`  Questions : ${questions} ${questions === 30 ? "✅" : "⚠️  (seharusnya 30)"}`);
  console.log(`  LKM       : ${lkms} ${lkms === 6 ? "✅" : "⚠️  (seharusnya 6)"}`);
  console.log(`  Modules   : ${modules} ${modules >= 1 ? "✅" : "⚠️  (seharusnya minimal 1)"}`);
  console.log("");

  // 4. Demo & Dummy Accounts
  console.log("── Akun Demo & Dummy ────────────────────────────────────");
  const demoEmails = ["guru@example.com", "mahasiswa1@example.com", "mahasiswa2@example.com"];
  const demoCount = await prisma.user.count({ where: { email: { in: demoEmails } } });
  const dummyCount = await prisma.user.count({ where: { email: { endsWith: "@example.test" } } });
  const realStudents = students - dummyCount - (await prisma.student.count({
    where: { user: { email: { in: demoEmails } } }
  }));

  console.log(`  Akun demo (example.com) : ${demoCount} ${demoCount === 0 ? "✅" : "⚠️  HAPUS sebelum production (npm run delete:demo)"}`);
  console.log(`  Akun dummy (@example.test): ${dummyCount} ${dummyCount === 0 ? "✅" : "⚠️  HAPUS sebelum production (npm run cleanup:test-students)"}`);
  console.log(`  Mahasiswa asli          : ${realStudents}`);
  console.log("");

  // 5. Kurikulum Check
  console.log("── Kurikulum ────────────────────────────────────────────");
  const kamTest = await prisma.test.findFirst({ where: { type: "KAM" }, include: { _count: { select: { questions: true } } } });
  const preTest = await prisma.test.findFirst({ where: { type: "PRE_TEST" }, include: { _count: { select: { questions: true } } } });
  const postTest = await prisma.test.findFirst({ where: { type: "POST_TEST" }, include: { _count: { select: { questions: true } } } });

  console.log(`  KAM       : ${kamTest ? `✅ ${kamTest._count.questions} soal` : "❌ belum ada"}`);
  console.log(`  Pre Test  : ${preTest ? `✅ ${preTest._count.questions} soal` : "❌ belum ada"}`);
  console.log(`  Post Test : ${postTest ? `✅ ${postTest._count.questions} soal` : "❌ belum ada"}`);
  console.log(`  LKM 1-6   : ${lkms === 6 ? "✅ lengkap" : `⚠️  hanya ${lkms}`}`);
  console.log(`  Modul     : ${modules >= 1 ? "✅ ada" : "❌ belum ada"}`);
  console.log("");

  // 6. Summary
  console.log("── KESIMPULAN ───────────────────────────────────────────");
  const issues: string[] = [];
  if (process.env.DATABASE_URL?.includes("localhost")) issues.push("DATABASE_URL masih localhost");
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 20) issues.push("AUTH_SECRET belum aman");
  if (demoCount > 0) issues.push("Akun demo belum dihapus");
  if (dummyCount > 0) issues.push("Akun dummy testing belum dihapus");
  if (tests !== 3 || questions !== 30 || lkms !== 6) issues.push("Kurikulum belum lengkap");

  if (issues.length === 0) {
    console.log("  ✅ DATABASE SIAP PRODUCTION");
  } else {
    console.log("  ⚠️  ADA YANG PERLU DIPERBAIKI:");
    issues.forEach((issue) => console.log(`     - ${issue}`));
  }
  console.log("═══════════════════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
