/**
 * Simulasi progress dummy untuk 300 mahasiswa @example.test
 * HANYA untuk staging/local testing — JANGAN jalankan di production.
 *
 * Jalankan: npm run simulate:test-progress
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Guard ──────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production" && process.env.ALLOW_TEST_DATA_SIMULATION !== "true") {
  console.error("╔══════════════════════════════════════════════════════════╗");
  console.error("║  ❌ DITOLAK: Script ini HANYA untuk staging/testing.     ║");
  console.error("║  Set ALLOW_TEST_DATA_SIMULATION=true untuk override.    ║");
  console.error("╚══════════════════════════════════════════════════════════╝");
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function recentDate(daysBack = 7) {
  const d = new Date();
  d.setDate(d.getDate() - rand(0, daysBack));
  d.setHours(rand(7, 22), rand(0, 59));
  return d;
}

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  Simulate Test Progress (@example.test)");
  console.log("  ⚠️  HANYA UNTUK STAGING/TESTING");
  console.log("═══════════════════════════════════════════════\n");

  // Get test students
  const students = await prisma.student.findMany({
    where: { user: { email: { endsWith: "@example.test" } } },
    include: { user: true }
  });

  if (students.length === 0) {
    console.log("❌ Tidak ada mahasiswa @example.test. Jalankan import dulu.");
    return;
  }

  console.log(`  Mahasiswa dummy: ${students.length}`);

  // Get curriculum data
  const tests = await prisma.test.findMany({ include: { questions: true } });
  const kamTest = tests.find((t) => t.type === "KAM");
  const preTest = tests.find((t) => t.type === "PRE_TEST");
  const postTest = tests.find((t) => t.type === "POST_TEST");
  const lkms = await prisma.lKM.findMany({ orderBy: { number: "asc" } });
  const modules = await prisma.module.findMany();
  const teacher = await prisma.teacher.findFirst();

  if (!kamTest || !preTest || !postTest || lkms.length < 6 || !teacher) {
    console.log("❌ Kurikulum belum di-seed. Jalankan prisma db seed dulu.");
    return;
  }

  // Clean existing dummy progress
  console.log("  Membersihkan progress dummy lama...");
  const studentIds = students.map((s) => s.id);
  await prisma.teacherLkmFeedback.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.learningFeedback.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.studentLKMSubmission.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.studentModuleProgress.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.studentAnswer.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.studentTestAttempt.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.automaticFeedback.deleteMany({ where: { studentId: { in: studentIds } } });
  await prisma.activityLog.deleteMany({ where: { studentId: { in: studentIds } } });

  // ─── Distribute ─────────────────────────────────────────────────────────────
  const total = students.length;
  const stats = { kamNotDone: 0, kamFail: 0, kamPass: 0, preNotDone: 0, preDone: 0, postNotDone: 0, postDone: 0, lkmStatus: [0, 0, 0, 0] };

  for (let i = 0; i < total; i++) {
    const student = students[i];
    const pct = i / total; // 0.0 to 1.0

    // A. KAM
    let kamPassed = false;
    if (pct < 0.20) {
      // 20% belum mengerjakan
      stats.kamNotDone++;
      continue; // skip everything else
    } else if (pct < 0.50) {
      // 30% tidak lulus
      const score = rand(30, 65);
      await createTestAttempt(student.id, kamTest, score);
      stats.kamFail++;

      // B. Modul Remedial
      if (modules.length > 0) {
        const modPct = Math.random();
        if (modPct > 0.40) { // 60% buka modul
          const modStatus = modPct > 0.80 ? "COMPLETED" : "IN_PROGRESS";
          await prisma.studentModuleProgress.create({
            data: {
              studentId: student.id,
              moduleId: modules[0].id,
              status: modStatus as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED",
              openedAt: recentDate(),
              lastReadAt: recentDate(),
              readSectionCount: modStatus === "COMPLETED" ? 3 : rand(1, 2),
              readProgress: modStatus === "COMPLETED" ? 100 : rand(30, 80),
              reflectionText: modStatus === "COMPLETED" ? "Saya sudah memahami materi geometri dasar." : null,
              completedAt: modStatus === "COMPLETED" ? recentDate() : null
            }
          });
        }
      }
      continue;
    } else {
      // 50% lulus
      const score = rand(70, 100);
      await createTestAttempt(student.id, kamTest, score);
      kamPassed = true;
      stats.kamPass++;
    }

    // C. Pre Test (hanya jika lulus KAM)
    if (!kamPassed) continue;
    if (pct < 0.575) { // ~15% dari yang lulus belum pre test
      stats.preNotDone++;
      continue;
    }
    const preScore = rand(20, 90);
    await createTestAttempt(student.id, preTest, preScore);
    stats.preDone++;

    // D. LKM 1-6
    const lkmProgress = rand(0, 6); // how many LKMs completed
    for (let lkmIdx = 0; lkmIdx < lkmProgress && lkmIdx < 6; lkmIdx++) {
      const lkm = lkms[lkmIdx];
      const statusRoll = Math.random();
      let status: "DRAFT" | "SUBMITTED" = "SUBMITTED";
      if (statusRoll < 0.15) status = "DRAFT";

      await prisma.studentLKMSubmission.create({
        data: {
          studentId: student.id,
          lkmId: lkm.id,
          answerText: JSON.stringify({
            [`section_0`]: `Jawaban simulasi mahasiswa untuk LKM ${lkm.number} bagian Concrete.`,
            [`section_1`]: `Jawaban simulasi mahasiswa untuk LKM ${lkm.number} bagian Pictorial.`,
            [`section_2`]: `Jawaban simulasi mahasiswa untuk LKM ${lkm.number} bagian Abstract.`,
          }),
          status,
          submittedAt: status === "SUBMITTED" ? recentDate() : null
        }
      });

      // Learning feedback (refleksi)
      if (status === "SUBMITTED" && Math.random() > 0.3) {
        await prisma.learningFeedback.create({
          data: {
            studentId: student.id,
            lkmId: lkm.id,
            reflectionText: `Saya memahami materi LKM ${lkm.number} dan masih perlu latihan pada beberapa bagian.`,
            rating: rand(3, 5)
          }
        });
      }

      // Teacher feedback (20% chance)
      if (status === "SUBMITTED" && Math.random() < 0.20) {
        await prisma.teacherLkmFeedback.create({
          data: {
            teacherId: teacher.id,
            studentId: student.id,
            lkmId: lkm.id,
            feedbackText: pick([
              "Jawaban sudah cukup baik. Perjelas langkah penyelesaian dan tambahkan contoh konkret.",
              "Bagus! Coba kembangkan penjelasan pada bagian abstract.",
              "Perlu perbaikan pada bagian pictorial. Gambarkan lebih detail.",
              "Sangat baik. Lanjutkan ke LKM berikutnya.",
            ])
          }
        });
      }
    }

    // E. Post Test (hanya jika LKM 6 selesai)
    if (lkmProgress >= 6 && Math.random() < 0.75) {
      const postScore = rand(40, 100);
      await createTestAttempt(student.id, postTest, postScore);
      stats.postDone++;
    } else {
      stats.postNotDone++;
    }
  }

  console.log("\n═══════════════════════════════════════════════");
  console.log("  HASIL SIMULASI");
  console.log("═══════════════════════════════════════════════");
  console.log(`  KAM belum      : ${stats.kamNotDone}`);
  console.log(`  KAM tidak lulus: ${stats.kamFail}`);
  console.log(`  KAM lulus      : ${stats.kamPass}`);
  console.log(`  Pre Test belum : ${stats.preNotDone}`);
  console.log(`  Pre Test done  : ${stats.preDone}`);
  console.log(`  Post Test belum: ${stats.postNotDone}`);
  console.log(`  Post Test done : ${stats.postDone}`);
  console.log("═══════════════════════════════════════════════");
}

async function createTestAttempt(
  studentId: string,
  test: { id: string; questions: Array<{ id: string; correctAnswer: string }> },
  targetScore: number
) {
  const totalQ = test.questions.length;
  const correctCount = Math.round((targetScore / 100) * totalQ);
  const options = ["A", "B", "C", "D"];

  await prisma.studentTestAttempt.create({
    data: {
      studentId,
      testId: test.id,
      attemptNumber: 1,
      score: targetScore,
      status: "SUBMITTED",
      submittedAt: recentDate(),
      answers: {
        create: test.questions.map((q, idx) => {
          const isCorrect = idx < correctCount;
          return {
            studentId,
            questionId: q.id,
            selectedAnswer: isCorrect ? q.correctAnswer : pick(options.filter((o) => o !== q.correctAnswer)),
            isCorrect
          };
        })
      }
    }
  });
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
