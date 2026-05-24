import { describe, expect, it } from "vitest";

import { CURRICULUM_LKMS, CURRICULUM_MODULES, CURRICULUM_TESTS, getAnswerKeys } from "@/lib/curriculum-content";

describe("curriculum content", () => {
  it("provides answer keys for KAM, pre test, and post test", () => {
    const keys = getAnswerKeys();

    expect(keys.map((item) => item.type)).toEqual(["KAM", "PRE_TEST", "POST_TEST"]);
    expect(keys.every((item) => item.answers.length > 0)).toBe(true);
    expect(keys.every((item) => item.answers.every((answer) => ["A", "B", "C", "D", "E"].includes(answer.correctAnswer)))).toBe(true);
  });

  it("has real questions with explanations and module sections", () => {
    expect(CURRICULUM_TESTS.every((test) => test.questions.every((question) => question.explanation.length > 0))).toBe(true);
    expect(CURRICULUM_MODULES.every((module) => module.sections.length >= module.requiredSectionCount)).toBe(true);
    expect(CURRICULUM_MODULES.every((module) => module.learningObjectives.length > 0)).toBe(true);
  });

  it("has 6 LKMs with CPA sections", () => {
    expect(CURRICULUM_LKMS.length).toBe(6);
    expect(CURRICULUM_LKMS.every((lkm) => lkm.sections.length === 3)).toBe(true);
    expect(CURRICULUM_LKMS.every((lkm) => lkm.sections[0].phase === "Concrete")).toBe(true);
    expect(CURRICULUM_LKMS.every((lkm) => lkm.sections[1].phase === "Pictorial")).toBe(true);
    expect(CURRICULUM_LKMS.every((lkm) => lkm.sections[2].phase === "Abstract")).toBe(true);
  });
});
