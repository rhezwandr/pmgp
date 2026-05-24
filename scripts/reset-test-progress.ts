/**
 * Reset progress/jawaban/feedback milik akun @example.test.
 * TIDAK menghapus akun mahasiswa dummy — hanya progress mereka.
 *
 * Jalankan: npm run reset:test-progress
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production" && process.env.ALLOW_TEST_DATA_SIMULATION !== "true") {
  console.error("❌ DITOLAK: Tidak boleh di production tanpa ALLOW_TEST_DATA_SIMULATION=true");
  process.exit(1);
}

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  Reset Test Progress (@example.test)");
  console.log("═══════════════════════════════════════════════");

  const students = await prisma.student.findMany({
    where: { user: { email: { endsWith: "@example.test" } } },
    select: { id: true }
  });

  const ids = students.map((s) => s.id);
  console.log(`  Mahasiswa dummy: ${ids.length}`);

  if (ids.length === 0) { console.log("  Tidak ada data."); return; }

  const r1 = await prisma.teacherLkmFeedback.deleteMany({ where: { studentId: { in: ids } } });
  const r2 = await prisma.learningFeedback.deleteMany({ where: { studentId: { in: ids } } });
  const r3 = await prisma.studentLKMSubmission.deleteMany({ where: { studentId: { in: ids } } });
  const r4 = await prisma.studentModuleProgress.deleteMany({ where: { studentId: { in: ids } } });
  const r5 = await prisma.studentAnswer.deleteMany({ where: { studentId: { in: ids } } });
  const r6 = await prisma.studentTestAttempt.deleteMany({ where: { studentId: { in: ids } } });
  const r7 = await prisma.automaticFeedback.deleteMany({ where: { studentId: { in: ids } } });
  const r8 = await prisma.activityLog.deleteMany({ where: { studentId: { in: ids } } });

  console.log(`  ✅ TeacherLkmFeedback : ${r1.count}`);
  console.log(`  ✅ LearningFeedback   : ${r2.count}`);
  console.log(`  ✅ LKMSubmission      : ${r3.count}`);
  console.log(`  ✅ ModuleProgress     : ${r4.count}`);
  console.log(`  ✅ StudentAnswer      : ${r5.count}`);
  console.log(`  ✅ TestAttempt        : ${r6.count}`);
  console.log(`  ✅ AutomaticFeedback  : ${r7.count}`);
  console.log(`  ✅ ActivityLog        : ${r8.count}`);
  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
