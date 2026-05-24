import { describe, expect, it } from "vitest";

import { deriveStudentLearningAccess } from "@/lib/learning-access";

const defaultLkm = {
  1: { submitted: false, feedbackSubmitted: false },
  2: { submitted: false, feedbackSubmitted: false },
  3: { submitted: false, feedbackSubmitted: false },
  4: { submitted: false, feedbackSubmitted: false },
  5: { submitted: false, feedbackSubmitted: false },
  6: { submitted: false, feedbackSubmitted: false }
};

describe("deriveStudentLearningAccess", () => {
  it("locks the dashboard before a student completes Tes KAM", () => {
    const access = deriveStudentLearningAccess({
      kamCompleted: false,
      kamPassed: false,
      prerequisiteModulesCompleted: false,
      preTestCompleted: false,
      lkm: { ...defaultLkm },
      postTestCompleted: false
    });

    expect(access.canAccessDashboard).toBe(false);
    expect(access.activeStage).toBe("TES_KAM");
    expect(access.lockReasons.dashboard).toBe("Dashboard belum tersedia. Selesaikan Tes KAM terlebih dahulu.");
  });

  it("shows modul remedial stage when KAM not passed", () => {
    const access = deriveStudentLearningAccess({
      kamCompleted: true,
      kamPassed: false,
      prerequisiteModulesCompleted: false,
      preTestCompleted: false,
      lkm: { ...defaultLkm },
      postTestCompleted: false
    });

    expect(access.needsPrerequisiteModules).toBe(true);
    expect(access.canRetakeKAM).toBe(false);
    expect(access.canAccessPreTest).toBe(false);
    expect(access.activeStage).toBe("MODUL_REMEDIAL");
  });

  it("unlocks LKM stages sequentially after submission and feedback", () => {
    const access = deriveStudentLearningAccess({
      kamCompleted: true,
      kamPassed: true,
      prerequisiteModulesCompleted: true,
      preTestCompleted: true,
      lkm: {
        1: { submitted: true, feedbackSubmitted: true },
        2: { submitted: true, feedbackSubmitted: true },
        3: { submitted: false, feedbackSubmitted: false },
        4: { submitted: false, feedbackSubmitted: false },
        5: { submitted: false, feedbackSubmitted: false },
        6: { submitted: false, feedbackSubmitted: false }
      },
      postTestCompleted: false
    });

    expect(access.canAccessLKM1).toBe(true);
    expect(access.canAccessLKM2).toBe(true);
    expect(access.canAccessLKM3).toBe(true);
    expect(access.canAccessLKM4).toBe(false);
    expect(access.canAccessPostTest).toBe(false);
    expect(access.activeStage).toBe("LKM_3");
  });

  it("unlocks post test after all 6 LKMs are submitted", () => {
    const access = deriveStudentLearningAccess({
      kamCompleted: true,
      kamPassed: true,
      prerequisiteModulesCompleted: true,
      preTestCompleted: true,
      lkm: {
        1: { submitted: true, feedbackSubmitted: true },
        2: { submitted: true, feedbackSubmitted: true },
        3: { submitted: true, feedbackSubmitted: true },
        4: { submitted: true, feedbackSubmitted: true },
        5: { submitted: true, feedbackSubmitted: true },
        6: { submitted: true, feedbackSubmitted: true }
      },
      postTestCompleted: false
    });

    expect(access.canAccessPostTest).toBe(true);
    expect(access.activeStage).toBe("POST_TEST");
  });

  it("shows HASIL stage after post test completed", () => {
    const access = deriveStudentLearningAccess({
      kamCompleted: true,
      kamPassed: true,
      prerequisiteModulesCompleted: true,
      preTestCompleted: true,
      lkm: {
        1: { submitted: true, feedbackSubmitted: true },
        2: { submitted: true, feedbackSubmitted: true },
        3: { submitted: true, feedbackSubmitted: true },
        4: { submitted: true, feedbackSubmitted: true },
        5: { submitted: true, feedbackSubmitted: true },
        6: { submitted: true, feedbackSubmitted: true }
      },
      postTestCompleted: true
    });

    expect(access.activeStage).toBe("HASIL");
    expect(access.progressPercentage).toBe(100);
  });
});
