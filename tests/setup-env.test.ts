import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { ensureEnvFile } = require("../scripts/setup-env.js") as {
  ensureEnvFile: (options: { cwd: string; log: (message: string) => void }) => "created" | "exists";
};

describe("ensureEnvFile", () => {
  it("creates .env from .env.example when .env is missing", () => {
    const cwd = mkdtempSync(join(tmpdir(), "kam-lkm-env-"));
    const messages: string[] = [];
    try {
      writeFileSync(join(cwd, ".env.example"), "DATABASE_URL=\"postgresql://example\"\n");

      ensureEnvFile({ cwd, log: (message: string) => messages.push(message) });

      expect(readFileSync(join(cwd, ".env"), "utf8")).toBe("DATABASE_URL=\"postgresql://example\"\n");
      expect(messages).toEqual([".env created from .env.example"]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("does not overwrite an existing .env file", () => {
    const cwd = mkdtempSync(join(tmpdir(), "kam-lkm-env-"));
    const messages: string[] = [];
    try {
      writeFileSync(join(cwd, ".env.example"), "DATABASE_URL=\"postgresql://example\"\n");
      writeFileSync(join(cwd, ".env"), "DATABASE_URL=\"postgresql://custom\"\n");

      ensureEnvFile({ cwd, log: (message: string) => messages.push(message) });

      expect(readFileSync(join(cwd, ".env"), "utf8")).toBe("DATABASE_URL=\"postgresql://custom\"\n");
      expect(messages).toEqual([".env already exists, skipping"]);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
