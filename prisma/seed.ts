import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

import { CURRICULUM_LKMS, CURRICULUM_MODULES, CURRICULUM_TESTS, type CurriculumTest } from "../src/lib/curriculum-content";

const prisma = new PrismaClient();

async function main() {
  await cleanDatabase();

  const passwordHash = await bcrypt.hash("password123", 12);

  // ─── Dosen ────────────────────────────────────────────────────────────────────
  const teacherUser = await prisma.user.create({
    data: {
      name: "Dosen Geometri",
      email: "guru@example.com",
      passwordHash,
      role: "TEACHER",
      teacher: { create: { lecturerNumber: "DSN-GEO-001" } }
    },
    include: { teacher: true }
  });

  // ─── Kelas ────────────────────────────────────────────────────────────────────
  const kelas = await prisma.class.create({
    data: {
      name: "Kelas Geometri dan Pengukuran",
      code: "KLS-GEO-2026",
      semester: "Genap",
      academicYear: "2025/2026",
      teacherId: teacherUser.teacher!.id
    }
  });

  // ─── Mahasiswa Demo ───────────────────────────────────────────────────────────
  const student1 = await prisma.user.create({
    data: {
      name: "Mahasiswa Satu",
      email: "mahasiswa1@example.com",
      passwordHash,
      role: "STUDENT",
      student: { create: { nim: "MHS-001", classId: kelas.id } }
    },
    include: { student: true }
  });
  await prisma.classMember.create({ data: { classId: kelas.id, studentId: student1.student!.id } });

  const student2 = await prisma.user.create({
    data: {
      name: "Mahasiswa Dua",
      email: "mahasiswa2@example.com",
      passwordHash,
      role: "STUDENT",
      student: { create: { nim: "MHS-002", classId: kelas.id } }
    },
    include: { student: true }
  });
  await prisma.classMember.create({ data: { classId: kelas.id, studentId: student2.student!.id } });

  // ─── Seed Curriculum ──────────────────────────────────────────────────────────
  await seedCurriculum();

  // ─── Summary ──────────────────────────────────────────────────────────────────
  const testCount = await prisma.test.count();
  const questionCount = await prisma.question.count();
  const lkmCount = await prisma.lKM.count();
  const moduleCount = await prisma.module.count();

  console.log("═══════════════════════════════════════════════");
  console.log("  Seed complete!");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Tests: ${testCount} (KAM, PRE_TEST, POST_TEST)`);
  console.log(`  Questions: ${questionCount} total`);
  console.log(`  LKM: ${lkmCount}`);
  console.log(`  Modules (remedial): ${moduleCount}`);
  console.log("───────────────────────────────────────────────");
  console.log("  Dosen: guru@example.com / password123");
  console.log("  Mahasiswa 1: mahasiswa1@example.com / password123 / NIM: MHS-001");
  console.log("  Mahasiswa 2: mahasiswa2@example.com / password123 / NIM: MHS-002");
  console.log("  Kelas: Kelas Geometri dan Pengukuran / KLS-GEO-2026");
  console.log("═══════════════════════════════════════════════");
}

async function cleanDatabase() {
  await prisma.teacherLkmFeedback.deleteMany();
  await prisma.teacherNote.deleteMany();
  await prisma.teacherMessage.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.automaticFeedback.deleteMany();
  await prisma.learningFeedback.deleteMany();
  await prisma.peerAssessment.deleteMany();
  await prisma.studentLKMSubmission.deleteMany();
  await prisma.studentModuleProgress.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.studentTestAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();
  await prisma.classMember.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.module.deleteMany();
  await prisma.lKM.deleteMany();
}

async function seedCurriculum() {
  // ─── Tests (KAM, PRE_TEST, POST_TEST) ─────────────────────────────────────────
  for (const test of CURRICULUM_TESTS) {
    await createTest(test);
  }

  // ─── Modules (remedial) ────────────────────────────────────────────────────────
  for (const module of CURRICULUM_MODULES) {
    await prisma.module.create({
      data: {
        title: module.title,
        topic: module.topic,
        description: module.description,
        content: module.content,
        learningObjectives: module.learningObjectives,
        sections: module.sections,
        estimatedMinutes: module.estimatedMinutes,
        minimumReadSeconds: module.minimumReadSeconds,
        requiredSectionCount: module.requiredSectionCount,
        isPrerequisite: module.isPrerequisite
      }
    });
  }

  // ─── LKM 1-6 ──────────────────────────────────────────────────────────────────
  for (const lkm of CURRICULUM_LKMS) {
    await prisma.lKM.upsert({
      where: { number: lkm.number },
      update: {
        title: lkm.title,
        description: lkm.description,
        instruction: lkm.instruction,
        topic: lkm.topic
      },
      create: {
        number: lkm.number,
        title: lkm.title,
        description: lkm.description,
        instruction: lkm.instruction,
        topic: lkm.topic
      }
    });
  }

  console.log(`  Seeded: ${CURRICULUM_TESTS[0].questions.length} soal KAM`);
  console.log(`  Seeded: ${CURRICULUM_TESTS[1].questions.length} soal Pre Test`);
  console.log(`  Seeded: ${CURRICULUM_TESTS[2].questions.length} soal Post Test`);
  console.log(`  Seeded: ${CURRICULUM_LKMS.length} LKM`);
}

async function createTest(test: CurriculumTest) {
  return prisma.test.create({
    data: {
      type: test.type,
      title: test.title,
      description: test.description,
      durationMinutes: test.durationMinutes,
      kkm: test.kkm,
      questions: {
        create: test.questions.map((question) => ({
          topic: question.topic,
          questionNumber: question.questionNumber,
          questionText: question.questionText,
          optionA: question.options.A,
          optionB: question.options.B,
          optionC: question.options.C,
          optionD: question.options.D,
          optionE: question.options.E ?? null,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          questionImage: question.imageUrl ?? null,
          imageAlt: question.imageAlt ?? null
        }))
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
