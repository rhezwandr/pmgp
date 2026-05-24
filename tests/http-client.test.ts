import { describe, expect, it } from "vitest";

import { readJsonResponse } from "@/lib/http-client";

describe("readJsonResponse", () => {
  it("returns a fallback error instead of throwing on an empty error response", async () => {
    const response = new Response(null, { status: 500 });

    const data = await readJsonResponse<{ error: string }>(response, "Login gagal.");

    expect(data.error).toBe("Login gagal.");
  });

  it("parses a normal json response", async () => {
    const response = Response.json({ redirectTo: "/mahasiswa/tes-kam" });

    const data = await readJsonResponse<{ redirectTo: string }>(response, "Login gagal.");

    expect(data.redirectTo).toBe("/mahasiswa/tes-kam");
  });
});
