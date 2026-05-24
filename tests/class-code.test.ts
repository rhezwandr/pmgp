import { describe, expect, it } from "vitest";

import { normalizeClassCode, looksLikeClassCode } from "@/lib/class-code";

describe("class code helpers", () => {
  it("normalizes class codes for lookup", () => {
    expect(normalizeClassCode(" kls-a1b2c3 ")).toBe("KLS-A1B2C3");
  });

  it("accepts short readable class codes", () => {
    expect(looksLikeClassCode("KLS-A1B2C3")).toBe(true);
    expect(looksLikeClassCode("WRONG")).toBe(false);
  });
});
