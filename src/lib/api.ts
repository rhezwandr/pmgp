import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessDeniedError";
  }
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AccessDeniedError) return jsonError(error.message, 403);
  if (error instanceof ZodError) {
    const details = error.flatten();
    const firstMessage = Object.values(details.fieldErrors).flat()[0] ?? details.formErrors[0] ?? "Validasi gagal.";
    return jsonError(firstMessage, 422, details);
  }
  if (error instanceof Error) {
    if (error.message.includes("DATABASE_URL") || error.message.includes("Can't reach database server")) {
      return jsonError("Konfigurasi database belum siap. Isi DATABASE_URL di .env, jalankan migrasi, lalu seed data.", 500);
    }
    if (error.message.includes("Unique constraint")) {
      return jsonError("Data sudah digunakan. Periksa kembali email, NIM, atau kode yang dimasukkan.", 409);
    }
    if (error.message.includes("Invalid `prisma.") || error.message.includes("PrismaClient") || error.message.includes("prisma.")) {
      return jsonError("Terjadi masalah pada database. Periksa konfigurasi dan coba lagi.", 500);
    }
    return jsonError(error.message, 400);
  }
  return jsonError("Terjadi kesalahan.", 500);
}
