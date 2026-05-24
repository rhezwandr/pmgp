import { describe, expect, it } from "vitest";

import { generateAutomaticFeedback } from "@/lib/feedback";

describe("generateAutomaticFeedback", () => {
  it("classifies scores and identifies strong and weak topics", () => {
    const feedback = generateAutomaticFeedback(72, "PRE_TEST", {
      "Segitiga, Segiempat, dan Lingkaran": 90,
      "Keliling Bidang Datar": 85,
      "Luas Bidang Datar": 80,
      "Simetri, Pengubinan, dan Pencerminan": 60,
      "Bangun Ruang Sederhana": 55,
      "Volume Bangun Ruang": 50
    });

    expect(feedback.achievementStatus).toBe("Baik");
    expect(feedback.strongTopics).toContain("Segitiga, Segiempat, dan Lingkaran");
    expect(feedback.weakTopics).toContain("Volume Bangun Ruang");
    expect(feedback.recommendation.length).toBeGreaterThan(0);
  });
});
