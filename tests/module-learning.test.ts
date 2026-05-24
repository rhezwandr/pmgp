import { describe, expect, it } from "vitest";

import {
  calculateModuleReadProgress,
  canCompleteModuleStudy,
  getEffectiveRequiredSectionCount,
  normalizeModuleSections
} from "@/lib/module-learning";

describe("module learning progress", () => {
  it("calculates reading progress from required sections", () => {
    expect(calculateModuleReadProgress(0, 3)).toBe(0);
    expect(calculateModuleReadProgress(2, 3)).toBe(67);
    expect(calculateModuleReadProgress(4, 3)).toBe(100);
  });

  it("requires full reading progress and reflection before module completion", () => {
    expect(canCompleteModuleStudy({ readSectionCount: 3, readProgress: 100, requiredSectionCount: 3, reflectionText: "" })).toBe(false);
    expect(canCompleteModuleStudy({ readSectionCount: 2, readProgress: 67, requiredSectionCount: 3, reflectionText: "Saya memahami isi modul." })).toBe(false);
    expect(canCompleteModuleStudy({ readSectionCount: 3, readProgress: 100, requiredSectionCount: 3, reflectionText: "Saya memahami isi modul." })).toBe(true);
  });

  it("normalizes stored module sections and falls back to content", () => {
    expect(normalizeModuleSections([{ title: "Bagian 1", content: "Isi" }], "fallback")).toEqual([{ title: "Bagian 1", content: "Isi" }]);
    expect(normalizeModuleSections(null, "fallback")).toEqual([{ title: "Materi Utama", content: "fallback" }]);
    expect(getEffectiveRequiredSectionCount(3, [{ title: "Materi Utama", content: "fallback" }])).toBe(1);
  });
});
