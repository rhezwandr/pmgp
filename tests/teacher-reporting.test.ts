import { describe, expect, it } from "vitest";

import { groupRowsByClass } from "@/lib/services/teacher-service";
import { teacherMessageSchema } from "@/lib/validations";

describe("teacher reporting helpers", () => {
  it("groups rows by class for recap/progress/export views", () => {
    const grouped = groupRowsByClass([
      { classId: "b", className: "Kelas B", name: "Bima" },
      { classId: "a", className: "Kelas A", name: "Anisa" },
      { classId: "a", className: "Kelas A", name: "Citra" }
    ]);

    expect(grouped.map((group) => group.className)).toEqual(["Kelas A", "Kelas B"]);
    expect(grouped[0].rows).toHaveLength(2);
  });

  it("validates teacher messages before sending notifications", () => {
    expect(() => teacherMessageSchema.parse({ title: "Hi", content: "pendek" })).toThrow();
    expect(
      teacherMessageSchema.parse({
        title: "Arahan Belajar",
        content: "Silakan lengkapi modul dan feedback pembelajaran terlebih dahulu."
      }).title
    ).toBe("Arahan Belajar");
  });
});
