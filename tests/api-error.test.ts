import { describe, expect, it } from "vitest";

import { handleApiError } from "@/lib/api";

describe("handleApiError", () => {
  it("returns a clean database setup message when PostgreSQL is unreachable", async () => {
    const response = handleApiError(new Error("Can't reach database server at `localhost:5432`"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Konfigurasi database belum siap. Isi DATABASE_URL di .env, jalankan migrasi, lalu seed data.");
  });

  it("does not leak raw Prisma unique constraint messages", async () => {
    const response = handleApiError(new Error("Unique constraint failed on the fields: (`nim`)"));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("Data sudah digunakan. Periksa kembali email, NIM, atau kode yang dimasukkan.");
  });

  it("does not leak raw Prisma invocation messages", async () => {
    const response = handleApiError(new Error("Invalid `prisma.user.findUnique()` invocation: stack details"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Terjadi masalah pada database. Periksa konfigurasi dan coba lagi.");
  });
});
