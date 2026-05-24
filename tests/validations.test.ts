import { describe, expect, it } from "vitest";

import { learningFeedbackSchema, moduleCompletionSchema, moduleStudyProgressSchema } from "@/lib/validations";

describe("learningFeedbackSchema", () => {
  it("rejects feedback shorter than 50 characters", () => {
    expect(() => learningFeedbackSchema.parse({ reflectionText: "terlalu pendek" })).toThrow();
  });

  it("rejects feedback that only contains symbols or dashes", () => {
    expect(() => learningFeedbackSchema.parse({ reflectionText: "----------------------------------------------------" })).toThrow();
    expect(() => learningFeedbackSchema.parse({ reflectionText: "!!!! ???? .... //// **** ++++ ==== ~~~~ !!!!" })).toThrow();
  });

  it("accepts a meaningful reflection", () => {
    expect(
      learningFeedbackSchema.parse({
        reflectionText:
          "Saya memahami strategi penyelesaian dengan lebih baik dan perlu mengulang langkah pemeriksaan jawaban."
      }).reflectionText
    ).toContain("strategi");
  });

  it("validates module reading progress and completion reflection", () => {
    expect(moduleStudyProgressSchema.parse({ readSectionCount: 2 }).readSectionCount).toBe(2);
    expect(() => moduleStudyProgressSchema.parse({ readSectionCount: 0 })).toThrow();
    expect(() => moduleCompletionSchema.parse({ reflectionText: "------------------------------" })).toThrow();
    expect(
      moduleCompletionSchema.parse({
        reflectionText: "Saya sudah membaca materi dan memahami bagian yang perlu diulang."
      }).reflectionText
    ).toContain("membaca");
  });
});
