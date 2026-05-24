import type { TestType } from "@prisma/client";

import { AccessDeniedError } from "../api";
import { KAM_KKM, TOPICS } from "../constants";
import { generateAutomaticFeedback, type FeedbackTestType } from "../feedback";
import { canAccessKey, getStudentLearningAccess, type StudentAccessKey } from "../learning-access";
import {
  calculateModuleReadProgress,
  canCompleteModuleStudy,
  getEffectiveRequiredSectionCount,
  normalizeModuleSections
} from "../module-learning";
import { prisma } from "../prisma";
import {
  lkmSubmissionSchema,
  learningFeedbackSchema,
  moduleCompletionSchema,
  moduleStudyProgressSchema,
  peerAssessmentSchema,
  testSubmissionSchema
} from "../validations";

export async function getStudentByUserId(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { user: true, class: true }
  });
  if (!student) throw new AccessDeniedError("Profil mahasiswa tidak ditemukan.");
  return student;
}

export async function assertStudentAccess(studentId: string, key: StudentAccessKey) {
  const access = await getStudentLearningAccess(studentId);
  if (!canAccessKey(access, key)) {
    throw new AccessDeniedError(access.lockReasons[key] || "Tahap pembelajaran masih terkunci.");
  }
  return access;
}

export async function getTestForAttempt(type: TestType) {
  const test = await prisma.test.findFirst({
    where: { type },
    include: { questions: { orderBy: { createdAt: "asc" } } }
  });
  if (!test) throw new Error("Tes belum tersedia.");
  return test;
}

/**
 * Returns test data for student attempt WITHOUT correctAnswer and explanation.
 * Used for Pre Test to prevent answer key leakage.
 * Security: uses Prisma select to exclude sensitive fields at the DB query level.
 */
export async function getTestForStudentAttemptSecure(type: TestType) {
  const test = await prisma.test.findFirst({
    where: { type },
    include: {
      questions: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          testId: true,
          topic: true,
          questionNumber: true,
          questionText: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionE: true,
          questionImage: true,
          imageAlt: true,
          createdAt: true,
          updatedAt: true
          // correctAnswer: EXCLUDED
          // explanation: EXCLUDED
        }
      }
    }
  });
  if (!test) throw new Error("Tes belum tersedia.");
  return test;
}

export async function getTestAnswerKey(type: TestType) {
  const test = await getTestForAttempt(type);
  return {
    testId: test.id,
    type: test.type,
    title: test.title,
    answers: test.questions.map((question, index) => ({
      number: index + 1,
      questionId: question.id,
      topic: question.topic,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation ?? "Pembahasan resmi belum tersedia."
    }))
  };
}

export async function getLatestTestAttempt(studentId: string, type: TestType) {
  return prisma.studentTestAttempt.findFirst({
    where: { studentId, test: { type }, status: "SUBMITTED" },
    include: { test: true, answers: { include: { question: true } } },
    orderBy: { submittedAt: "desc" }
  });
}

/**
 * Returns the latest test attempt for Pre Test WITHOUT exposing correctAnswer/explanation.
 * Only returns: score, status, and a confirmation message.
 */
export async function getPreTestResultSecure(studentId: string) {
  const attempt = await prisma.studentTestAttempt.findFirst({
    where: { studentId, test: { type: "PRE_TEST" }, status: "SUBMITTED" },
    select: {
      id: true,
      score: true,
      status: true,
      attemptNumber: true,
      submittedAt: true,
      test: { select: { title: true, type: true } }
    },
    orderBy: { submittedAt: "desc" }
  });
  if (!attempt) return null;
  return {
    ...attempt,
    message: "Jawaban Pre Test berhasil disimpan."
  };
}

/**
 * Returns KAM result WITH full review including correctAnswer and explanation.
 * KAM is allowed to show answer keys after submission.
 */
export async function getKamResultWithReview(studentId: string) {
  const attempt = await prisma.studentTestAttempt.findFirst({
    where: { studentId, test: { type: "KAM" }, status: "SUBMITTED" },
    include: {
      test: true,
      answers: {
        include: {
          question: true
        }
      }
    },
    orderBy: { submittedAt: "desc" }
  });
  if (!attempt) return null;

  const passed = (attempt.score ?? 0) >= (attempt.test.kkm || KAM_KKM);

  const review = attempt.answers.map((answer, index) => {
    const q = answer.question as Record<string, unknown>;
    return {
      questionNumber: (q.questionNumber as number | null) ?? index + 1,
      questionText: answer.question.questionText,
      imageUrl: (q.questionImage as string | null) ?? null,
      imageAlt: (q.imageAlt as string | null) ?? null,
      optionA: answer.question.optionA,
      optionB: answer.question.optionB,
      optionC: answer.question.optionC,
      optionD: answer.question.optionD,
      optionE: (q.optionE as string | null) ?? null,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.question.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: (q.explanation as string | null) ?? null
    };
  });

  // Sort by questionNumber
  review.sort((a, b) => a.questionNumber - b.questionNumber);

  return {
    score: attempt.score,
    passed,
    kkm: attempt.test.kkm || KAM_KKM,
    attemptNumber: attempt.attemptNumber,
    submittedAt: attempt.submittedAt,
    review
  };
}

/**
 * Returns Post Test result WITH full review including correctAnswer and explanation.
 * Post Test is allowed to show answer keys after submission.
 */
export async function getPostTestResultWithReview(studentId: string) {
  const attempt = await prisma.studentTestAttempt.findFirst({
    where: { studentId, test: { type: "POST_TEST" }, status: "SUBMITTED" },
    include: {
      test: true,
      answers: {
        include: {
          question: true
        }
      }
    },
    orderBy: { submittedAt: "desc" }
  });
  if (!attempt) return null;

  const review = attempt.answers.map((answer, index) => {
    const q = answer.question as Record<string, unknown>;
    return {
      questionNumber: (q.questionNumber as number | null) ?? index + 1,
      questionText: answer.question.questionText,
      imageUrl: (q.questionImage as string | null) ?? null,
      imageAlt: (q.imageAlt as string | null) ?? null,
      optionA: answer.question.optionA,
      optionB: answer.question.optionB,
      optionC: answer.question.optionC,
      optionD: answer.question.optionD,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.question.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: (q.explanation as string | null) ?? null
    };
  });

  review.sort((a, b) => a.questionNumber - b.questionNumber);

  return {
    score: attempt.score,
    submittedAt: attempt.submittedAt,
    review
  };
}

function calculateTopicBreakdown(
  questions: Array<{ id: string; topic: string; correctAnswer: string }>,
  answers: Record<string, "A" | "B" | "C" | "D" | "E">
) {
  const grouped = new Map<string, { correct: number; total: number }>();
  for (const question of questions) {
    const item = grouped.get(question.topic) ?? { correct: 0, total: 0 };
    item.total += 1;
    if (answers[question.id] === question.correctAnswer) item.correct += 1;
    grouped.set(question.topic, item);
  }

  return Object.fromEntries(
    TOPICS.map((topic) => {
      const item = grouped.get(topic);
      return [topic, item ? Math.round((item.correct / item.total) * 100) : 0];
    })
  );
}

export async function submitTest(studentId: string, type: TestType, input: unknown) {
  if (type === "PRE_TEST") await assertStudentAccess(studentId, "preTest");
  if (type === "POST_TEST") await assertStudentAccess(studentId, "postTest");
  if (type === "KAM") {
    const access = await getStudentLearningAccess(studentId);
    if (access.hasCompletedKAM && !access.hasPassedKAM && !access.canRetakeKAM) {
      throw new AccessDeniedError(access.lockReasons.retakeKAM ?? "Ulang Tes KAM masih terkunci.");
    }
  }

  const parsed = testSubmissionSchema.parse(input);
  const test = await getTestForAttempt(type);
  const attemptCount = await prisma.studentTestAttempt.count({ where: { studentId, testId: test.id } });
  const correctCount = test.questions.filter((question) => parsed.answers[question.id] === question.correctAnswer).length;
  const score = Math.round((correctCount / test.questions.length) * 100);
  const topicBreakdown = calculateTopicBreakdown(test.questions, parsed.answers);
  const sourceType = type === "PRE_TEST" ? "PRE_TEST" : type === "POST_TEST" ? "POST_TEST" : "KAM";
  const feedback = generateAutomaticFeedback(score, sourceType as FeedbackTestType, topicBreakdown);

  const result = await prisma.$transaction(async (tx) => {
    const attempt = await tx.studentTestAttempt.create({
      data: {
        studentId,
        testId: test.id,
        attemptNumber: attemptCount + 1,
        score,
        status: "SUBMITTED",
        submittedAt: new Date(),
        answers: {
          create: test.questions.map((question) => ({
            questionId: question.id,
            studentId,
            selectedAnswer: parsed.answers[question.id] ?? "A",
            isCorrect: parsed.answers[question.id] === question.correctAnswer
          }))
        }
      }
    });

    await tx.automaticFeedback.create({
      data: {
        studentId,
        sourceType,
        sourceId: attempt.id,
        score,
        strongTopics: feedback.strongTopics,
        weakTopics: feedback.weakTopics,
        recommendation: feedback.recommendation,
        nextAction: feedback.nextAction
      }
    });

    await tx.activityLog.create({
      data: {
        studentId,
        activityType: sourceType,
        description: `Menyelesaikan ${test.title} dengan skor ${score}.`
      }
    });

    return { attempt, feedback, passed: score >= (test.kkm || KAM_KKM) };
  });

  // For Pre Test: return minimal response without answer details
  if (type === "PRE_TEST") {
    return {
      message: "Jawaban Pre Test berhasil disimpan.",
      score: result.attempt.score,
      status: result.attempt.status
    };
  }

  return result;
}

export async function getStudentDashboardData(studentId: string) {
  const access = await getStudentLearningAccess(studentId);
  const [attempts, submissions, feedback, activities, modules] = await Promise.all([
    prisma.studentTestAttempt.findMany({
      where: { studentId, status: "SUBMITTED" },
      include: { test: true },
      orderBy: { submittedAt: "desc" }
    }),
    prisma.studentLKMSubmission.findMany({ where: { studentId }, include: { lkm: true } }),
    prisma.automaticFeedback.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.activityLog.findMany({ where: { studentId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.studentModuleProgress.findMany({ where: { studentId }, include: { module: true } })
  ]);

  const scoreByType = (type: TestType) => attempts.find((attempt) => attempt.test.type === type)?.score ?? null;
  const lkmSubmitted = (number: number) => submissions.some((submission) => submission.lkm.number === number && submission.submittedAt !== null);
  const latestFeedback = feedback[0];
  const strongTopics = Array.from(new Set(feedback.flatMap((item) => item.strongTopics))).slice(0, 3);
  const weakTopics = Array.from(new Set(feedback.flatMap((item) => item.weakTopics))).slice(0, 3);

  return {
    access,
    scores: {
      kam: scoreByType("KAM"),
      preTest: scoreByType("PRE_TEST"),
      postTest: scoreByType("POST_TEST")
    },
    lkmStatus: {
      lkm1: lkmSubmitted(1),
      lkm2: lkmSubmitted(2),
      lkm3: lkmSubmitted(3),
      lkm4: lkmSubmitted(4),
      lkm5: lkmSubmitted(5),
      lkm6: lkmSubmitted(6)
    },
    chart: [
      { name: "KAM", score: scoreByType("KAM") },
      { name: "Pre Test", score: scoreByType("PRE_TEST") },
      { name: "Post Test", score: scoreByType("POST_TEST") }
    ].filter((item) => item.score !== null),
    strongTopics,
    weakTopics,
    automaticSummary: latestFeedback?.recommendation ?? "Belum ada ringkasan otomatis.",
    nextAction: latestFeedback?.nextAction ?? "Mulai Tes KAM untuk membuka alur pembelajaran.",
    activities,
    moduleProgress: modules
  };
}

export async function getModulesForStudent(studentId: string) {
  const access = await getStudentLearningAccess(studentId);
  const modules = await prisma.module.findMany({
    include: {
      studentProgress: { where: { studentId } }
    },
    orderBy: { title: "asc" }
  });

  return modules.map((m) => {
    const sections = normalizeModuleSections(m.sections, m.content);
    const requiredSectionCount = getEffectiveRequiredSectionCount(m.requiredSectionCount, sections);
    return {
      ...m,
      emphasized: access.needsPrerequisiteModules && m.isPrerequisite,
      sections,
      requiredSectionCount,
      progress: m.studentProgress[0]?.status ?? "NOT_STARTED",
      readProgress: m.studentProgress[0]?.readProgress ?? 0,
      readSectionCount: m.studentProgress[0]?.readSectionCount ?? 0,
      openedAt: m.studentProgress[0]?.openedAt ?? null,
      reflectionText: m.studentProgress[0]?.reflectionText ?? "",
      canComplete: canCompleteModuleStudy({
        readProgress: m.studentProgress[0]?.readProgress ?? 0,
        readSectionCount: m.studentProgress[0]?.readSectionCount ?? 0,
        requiredSectionCount,
        reflectionText: m.studentProgress[0]?.reflectionText
      })
    };
  });
}

export async function getModuleForStudent(studentId: string, moduleId: string) {
  const modules = await getModulesForStudent(studentId);
  const mod = modules.find((item) => item.id === moduleId);
  if (!mod) throw new AccessDeniedError("Modul tidak ditemukan.");
  return mod;
}

export async function startModuleStudy(studentId: string, moduleId: string) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new AccessDeniedError("Modul tidak ditemukan.");
  const existing = await prisma.studentModuleProgress.findUnique({
    where: { studentId_moduleId: { studentId, moduleId } }
  });

  const progress = await prisma.studentModuleProgress.upsert({
    where: { studentId_moduleId: { studentId, moduleId } },
    update: {
      status: existing?.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
      openedAt: existing?.openedAt ?? new Date(),
      lastReadAt: new Date()
    },
    create: {
      studentId,
      moduleId,
      status: "IN_PROGRESS",
      openedAt: new Date(),
      lastReadAt: new Date()
    }
  });

  await prisma.activityLog.create({
    data: { studentId, activityType: "MODULE_OPENED", description: `Mulai mempelajari ${mod.title}.` }
  });

  return progress;
}

export async function updateModuleStudyProgress(studentId: string, moduleId: string, input: unknown) {
  const parsed = moduleStudyProgressSchema.parse(input);
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new AccessDeniedError("Modul tidak ditemukan.");
  const existing = await prisma.studentModuleProgress.findUnique({
    where: { studentId_moduleId: { studentId, moduleId } }
  });
  if (!existing?.openedAt) {
    throw new AccessDeniedError("Buka modul terlebih dahulu sebelum mencatat progres membaca.");
  }

  const sections = normalizeModuleSections(mod.sections, mod.content);
  const requiredSectionCount = getEffectiveRequiredSectionCount(mod.requiredSectionCount, sections);
  const readSectionCount = Math.min(parsed.readSectionCount, requiredSectionCount);
  const readProgress = calculateModuleReadProgress(readSectionCount, requiredSectionCount);

  const progress = await prisma.studentModuleProgress.update({
    where: { studentId_moduleId: { studentId, moduleId } },
    data: {
      status: existing.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
      lastReadAt: new Date(),
      readSectionCount: Math.max(existing.readSectionCount, readSectionCount),
      readProgress: Math.max(existing.readProgress, readProgress)
    }
  });

  await prisma.activityLog.create({
    data: { studentId, activityType: "MODULE_PROGRESS", description: `Membaca ${mod.title} hingga ${readProgress}%.` }
  });

  return progress;
}

export async function markModuleCompleted(studentId: string, moduleId: string, input: unknown) {
  const parsed = moduleCompletionSchema.parse(input);
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new AccessDeniedError("Modul tidak ditemukan.");

  const existing = await prisma.studentModuleProgress.findUnique({
    where: { studentId_moduleId: { studentId, moduleId } }
  });

  if (!existing?.openedAt) {
    throw new AccessDeniedError("Modul belum dapat diselesaikan. Buka dan pelajari materi terlebih dahulu.");
  }

  const sections = normalizeModuleSections(mod.sections, mod.content);
  const requiredSectionCount = getEffectiveRequiredSectionCount(mod.requiredSectionCount, sections);
  const readProgress = calculateModuleReadProgress(existing.readSectionCount, requiredSectionCount);
  if (existing.readSectionCount < requiredSectionCount || readProgress < 100) {
    throw new AccessDeniedError("Modul belum dapat diselesaikan. Selesaikan progres membaca materi terlebih dahulu.");
  }

  const progress = await prisma.studentModuleProgress.upsert({
    where: { studentId_moduleId: { studentId, moduleId } },
    update: {
      status: "COMPLETED",
      readProgress: 100,
      readSectionCount: requiredSectionCount,
      reflectionText: parsed.reflectionText,
      completedAt: new Date()
    },
    create: {
      studentId,
      moduleId,
      status: "COMPLETED",
      openedAt: new Date(),
      lastReadAt: new Date(),
      readProgress: 100,
      readSectionCount: requiredSectionCount,
      reflectionText: parsed.reflectionText,
      completedAt: new Date()
    }
  });
  await prisma.activityLog.create({
    data: { studentId, activityType: "MODULE", description: `Menyelesaikan ${mod.title} setelah membaca materi dan menulis refleksi.` }
  });
  return progress;
}

export async function getLkmListForStudent(studentId: string) {
  const access = await getStudentLearningAccess(studentId);
  const lkms = await prisma.lKM.findMany({
    orderBy: { number: "asc" },
    include: {
      submissions: { where: { studentId } },
      learningFeedback: { where: { studentId } }
    }
  });

  const canAccessMap: Record<number, boolean> = {
    1: access.canAccessLKM1,
    2: access.canAccessLKM2,
    3: access.canAccessLKM3,
    4: access.canAccessLKM4,
    5: access.canAccessLKM5,
    6: access.canAccessLKM6
  };

  const lockMap: Record<number, string | undefined> = {
    1: access.lockReasons.lkm1,
    2: access.lockReasons.lkm2,
    3: access.lockReasons.lkm3,
    4: access.lockReasons.lkm4,
    5: access.lockReasons.lkm5,
    6: access.lockReasons.lkm6
  };

  return lkms.map((lkm) => ({
    ...lkm,
    submission: lkm.submissions[0] ?? null,
    feedback: lkm.learningFeedback[0] ?? null,
    canAccess: canAccessMap[lkm.number] ?? false,
    lockReason: lockMap[lkm.number]
  }));
}

export async function getLkmForStudent(studentId: string, number: number) {
  const key = `lkm${number}` as StudentAccessKey;
  await assertStudentAccess(studentId, key);
  const lkm = await prisma.lKM.findUnique({
    where: { number },
    include: {
      submissions: { where: { studentId } },
      learningFeedback: { where: { studentId } },
      peerAssessments: { where: { studentId } }
    }
  });
  if (!lkm) throw new Error("LKM tidak ditemukan.");
  return lkm;
}

export async function submitLkm(studentId: string, number: number, input: unknown) {
  const lkm = await getLkmForStudent(studentId, number);
  const parsed = lkmSubmissionSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const submission = await tx.studentLKMSubmission.upsert({
      where: { studentId_lkmId: { studentId, lkmId: lkm.id } },
      update: {
        answerText: parsed.answerText,
        uploadedFileUrl: parsed.uploadedFileUrl || null,
        status: "SUBMITTED",
        submittedAt: new Date()
      },
      create: {
        studentId,
        lkmId: lkm.id,
        answerText: parsed.answerText,
        uploadedFileUrl: parsed.uploadedFileUrl || null,
        status: "SUBMITTED",
        submittedAt: new Date()
      }
    });

    await tx.activityLog.create({
      data: { studentId, activityType: `LKM_${number}`, description: `Mengumpulkan LKM ${number}.` }
    });

    return { submission, message: `LKM ${number} berhasil disubmit.` };
  });
}

export async function submitPeerAssessment(studentId: string, number: number, input: unknown) {
  const lkm = await getLkmForStudent(studentId, number);
  const parsed = peerAssessmentSchema.parse(input);
  return prisma.peerAssessment.create({
    data: { studentId, lkmId: lkm.id, ...parsed }
  });
}

export async function skipPeerAssessment(studentId: string, number: number) {
  const lkm = await getLkmForStudent(studentId, number);
  await prisma.activityLog.create({
    data: { studentId, activityType: "PEER_SKIPPED", description: `Melewati penilaian sejawat untuk ${lkm.title}.` }
  });
  return { skipped: true };
}

export async function submitLearningFeedback(studentId: string, number: number, input: unknown) {
  const lkm = await getLkmForStudent(studentId, number);
  const hasSubmission = await prisma.studentLKMSubmission.findUnique({
    where: { studentId_lkmId: { studentId, lkmId: lkm.id } }
  });
  if (!hasSubmission) throw new AccessDeniedError("Feedback hanya dapat diisi setelah LKM dikumpulkan.");
  const parsed = learningFeedbackSchema.parse(input);

  const feedback = await prisma.learningFeedback.upsert({
    where: { studentId_lkmId: { studentId, lkmId: lkm.id } },
    update: { reflectionText: parsed.reflectionText, rating: parsed.rating },
    create: { studentId, lkmId: lkm.id, reflectionText: parsed.reflectionText, rating: parsed.rating }
  });

  await prisma.activityLog.create({
    data: { studentId, activityType: "LEARNING_FEEDBACK", description: `Mengisi feedback pembelajaran LKM ${number}.` }
  });
  return feedback;
}

export async function getUnreadTeacherMessageCount(studentId: string) {
  return prisma.teacherMessage.count({ where: { studentId, readAt: null } });
}

export async function getTeacherMessagesForStudent(studentId: string) {
  return prisma.teacherMessage.findMany({
    where: { studentId },
    include: { teacher: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function markTeacherMessageRead(studentId: string, messageId: string) {
  return prisma.teacherMessage.update({
    where: { id: messageId, studentId },
    data: { readAt: new Date() }
  });
}

export async function getFinalResult(studentId: string) {
  const [pre, post, feedback] = await Promise.all([
    getLatestTestAttempt(studentId, "PRE_TEST"),
    getLatestTestAttempt(studentId, "POST_TEST"),
    prisma.automaticFeedback.findMany({ where: { studentId }, orderBy: { createdAt: "desc" } })
  ]);
  const preScore = pre?.score ?? 0;
  const postScore = post?.score ?? 0;
  const strongTopics = Array.from(new Set(feedback.flatMap((item) => item.strongTopics))).slice(0, 3);
  const weakTopics = Array.from(new Set(feedback.flatMap((item) => item.weakTopics))).slice(0, 3);

  return {
    preScore,
    postScore,
    improvement: postScore - preScore,
    strongTopics,
    weakTopics,
    recommendation:
      feedback[0]?.recommendation ??
      "Gunakan hasil pembelajaran untuk menentukan latihan lanjutan pada topik yang belum stabil.",
    finalFeedback:
      postScore >= preScore
        ? "Terjadi peningkatan hasil belajar dibandingkan Pre Test."
        : "Hasil Post Test belum meningkat. Lakukan penguatan kembali pada topik prioritas."
  };
}
