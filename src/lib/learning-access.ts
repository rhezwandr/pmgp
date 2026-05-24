import { LOCK_MESSAGES, type StudentStage } from "./constants";

export type LkmGateState = {
  submitted: boolean;
  feedbackSubmitted: boolean;
};

export type StudentLearningSnapshot = {
  kamCompleted: boolean;
  kamPassed: boolean;
  prerequisiteModulesCompleted: boolean;
  preTestCompleted: boolean;
  lkm: Record<1 | 2 | 3 | 4 | 5 | 6, LkmGateState>;
  postTestCompleted: boolean;
};

export type StudentLearningAccess = {
  hasCompletedKAM: boolean;
  hasPassedKAM: boolean;
  needsPrerequisiteModules: boolean;
  hasCompletedPrerequisiteModules: boolean;
  canRetakeKAM: boolean;
  canAccessDashboard: boolean;
  canAccessPreTest: boolean;
  canAccessLKM1: boolean;
  canAccessLKM2: boolean;
  canAccessLKM3: boolean;
  canAccessLKM4: boolean;
  canAccessLKM5: boolean;
  canAccessLKM6: boolean;
  canAccessPostTest: boolean;
  activeStage: StudentStage;
  lockedStages: string[];
  lockReasons: Record<string, string>;
  progressPercentage: number;
};

export function deriveStudentLearningAccess(snapshot: StudentLearningSnapshot): StudentLearningAccess {
  const hasCompletedKAM = snapshot.kamCompleted;
  const hasPassedKAM = snapshot.kamPassed;
  const needsPrerequisiteModules = hasCompletedKAM && !hasPassedKAM;
  const hasCompletedPrerequisiteModules = snapshot.prerequisiteModulesCompleted;
  const canRetakeKAM = needsPrerequisiteModules && hasCompletedPrerequisiteModules;
  const canAccessDashboard = hasCompletedKAM && hasPassedKAM;
  const canAccessPreTest = hasPassedKAM;
  const canAccessLKM1 = hasPassedKAM && snapshot.preTestCompleted;
  const canAccessLKM2 = canAccessLKM1 && snapshot.lkm[1].submitted && snapshot.lkm[1].feedbackSubmitted;
  const canAccessLKM3 = canAccessLKM2 && snapshot.lkm[2].submitted && snapshot.lkm[2].feedbackSubmitted;
  const canAccessLKM4 = canAccessLKM3 && snapshot.lkm[3].submitted && snapshot.lkm[3].feedbackSubmitted;
  const canAccessLKM5 = canAccessLKM4 && snapshot.lkm[4].submitted && snapshot.lkm[4].feedbackSubmitted;
  const canAccessLKM6 = canAccessLKM5 && snapshot.lkm[5].submitted && snapshot.lkm[5].feedbackSubmitted;
  const canAccessPostTest = canAccessLKM6 && snapshot.lkm[6].submitted && snapshot.lkm[6].feedbackSubmitted;

  const lockReasons: Record<string, string> = {};
  if (!canAccessDashboard) lockReasons.dashboard = LOCK_MESSAGES.dashboard;
  if (!canAccessPreTest) lockReasons.preTest = LOCK_MESSAGES.preTest;
  if (needsPrerequisiteModules && !canRetakeKAM) lockReasons.modulRemedial = LOCK_MESSAGES.modulRemedial;
  if (!canAccessLKM1) lockReasons.lkm1 = LOCK_MESSAGES.lkm1;
  if (!canAccessLKM2) lockReasons.lkm2 = LOCK_MESSAGES.lkm2;
  if (!canAccessLKM3) lockReasons.lkm3 = LOCK_MESSAGES.lkm3;
  if (!canAccessLKM4) lockReasons.lkm4 = LOCK_MESSAGES.lkm4;
  if (!canAccessLKM5) lockReasons.lkm5 = LOCK_MESSAGES.lkm5;
  if (!canAccessLKM6) lockReasons.lkm6 = LOCK_MESSAGES.lkm6;
  if (!canAccessPostTest) lockReasons.postTest = LOCK_MESSAGES.postTest;

  let activeStage: StudentStage = "TES_KAM";
  if (!hasCompletedKAM) activeStage = "TES_KAM";
  else if (!hasPassedKAM) activeStage = "MODUL_REMEDIAL";
  else if (!snapshot.preTestCompleted) activeStage = "PRE_TEST";
  else if (!snapshot.lkm[1].submitted) activeStage = "LKM_1";
  else if (!snapshot.lkm[2].submitted) activeStage = "LKM_2";
  else if (!snapshot.lkm[3].submitted) activeStage = "LKM_3";
  else if (!snapshot.lkm[4].submitted) activeStage = "LKM_4";
  else if (!snapshot.lkm[5].submitted) activeStage = "LKM_5";
  else if (!snapshot.lkm[6].submitted) activeStage = "LKM_6";
  else if (!snapshot.postTestCompleted) activeStage = "POST_TEST";
  else activeStage = "HASIL";

  const completedWeight = [
    hasCompletedKAM,
    hasPassedKAM || (!needsPrerequisiteModules),
    snapshot.preTestCompleted,
    snapshot.lkm[1].submitted,
    snapshot.lkm[2].submitted,
    snapshot.lkm[3].submitted,
    snapshot.lkm[4].submitted,
    snapshot.lkm[5].submitted,
    snapshot.lkm[6].submitted,
    snapshot.postTestCompleted
  ].filter(Boolean).length;

  return {
    hasCompletedKAM,
    hasPassedKAM,
    needsPrerequisiteModules,
    hasCompletedPrerequisiteModules,
    canRetakeKAM,
    canAccessDashboard,
    canAccessPreTest,
    canAccessLKM1,
    canAccessLKM2,
    canAccessLKM3,
    canAccessLKM4,
    canAccessLKM5,
    canAccessLKM6,
    canAccessPostTest,
    activeStage,
    lockedStages: Object.keys(lockReasons),
    lockReasons,
    progressPercentage: Math.round((completedWeight / 10) * 100)
  };
}

export async function getStudentLearningAccess(studentId: string): Promise<StudentLearningAccess> {
  const { prisma } = await import("./prisma");

  const [tests, attempts, prerequisiteModules, moduleProgress, lkms, submissions, feedback] = await Promise.all([
    prisma.test.findMany({ select: { id: true, type: true, kkm: true } }),
    prisma.studentTestAttempt.findMany({
      where: { studentId, status: "SUBMITTED" },
      include: { test: { select: { type: true, kkm: true } } },
      orderBy: { submittedAt: "desc" }
    }),
    prisma.module.findMany({ where: { isPrerequisite: true }, select: { id: true } }),
    prisma.studentModuleProgress.findMany({ where: { studentId } }),
    prisma.lKM.findMany({ select: { id: true, number: true } }),
    prisma.studentLKMSubmission.findMany({ where: { studentId, submittedAt: { not: null } }, include: { lkm: true } }),
    prisma.learningFeedback.findMany({ where: { studentId }, include: { lkm: true } })
  ]);

  const kamAttempts = attempts.filter((attempt) => attempt.test.type === "KAM");
  const hasCompletedKAM = kamAttempts.length > 0;
  const hasPassedKAM = kamAttempts.some((attempt) => (attempt.score ?? 0) >= attempt.test.kkm);
  const preTestId = tests.find((test) => test.type === "PRE_TEST")?.id;
  const postTestId = tests.find((test) => test.type === "POST_TEST")?.id;
  const preTestCompleted = attempts.some((attempt) => attempt.testId === preTestId);
  const postTestCompleted = attempts.some((attempt) => attempt.testId === postTestId);
  const completedModules = new Set(
    moduleProgress
      .filter((progress) => progress.status === "COMPLETED" && progress.readProgress >= 100 && Boolean(progress.reflectionText?.trim()))
      .map((progress) => progress.moduleId)
  );
  const prerequisiteModulesCompleted =
    prerequisiteModules.length > 0 && prerequisiteModules.every((module) => completedModules.has(module.id));

  const lkmByNumber = Object.fromEntries(lkms.map((lkm) => [lkm.number, lkm.id])) as Record<number, string>;
  const submissionSet = new Set(submissions.map((submission) => submission.lkmId));
  const feedbackSet = new Set(feedback.map((item) => item.lkmId));

  const lkmState = (n: number): LkmGateState => ({
    submitted: submissionSet.has(lkmByNumber[n]),
    feedbackSubmitted: feedbackSet.has(lkmByNumber[n])
  });

  return deriveStudentLearningAccess({
    kamCompleted: hasCompletedKAM,
    kamPassed: hasPassedKAM,
    prerequisiteModulesCompleted,
    preTestCompleted,
    lkm: {
      1: lkmState(1),
      2: lkmState(2),
      3: lkmState(3),
      4: lkmState(4),
      5: lkmState(5),
      6: lkmState(6)
    },
    postTestCompleted
  });
}

export type StudentAccessKey =
  | "dashboard"
  | "preTest"
  | "lkm1"
  | "lkm2"
  | "lkm3"
  | "lkm4"
  | "lkm5"
  | "lkm6"
  | "postTest"
  | "retakeKAM";

export function canAccessKey(access: StudentLearningAccess, key: StudentAccessKey): boolean {
  const map: Record<StudentAccessKey, boolean> = {
    dashboard: access.canAccessDashboard,
    preTest: access.canAccessPreTest,
    lkm1: access.canAccessLKM1,
    lkm2: access.canAccessLKM2,
    lkm3: access.canAccessLKM3,
    lkm4: access.canAccessLKM4,
    lkm5: access.canAccessLKM5,
    lkm6: access.canAccessLKM6,
    postTest: access.canAccessPostTest,
    retakeKAM: access.canRetakeKAM
  };
  return map[key];
}
