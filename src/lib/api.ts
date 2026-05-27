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
    const msg = error.message;

    // Safe server-side diagnostic (never expose to client)
    if (process.env.NODE_ENV !== "production") {
      console.error("[API Error]", msg);
    } else {
      // Production: log category only, not full message
      const category = classifyDatabaseError(msg);
      if (category !== "other") {
        console.error(`[API DB Error] category=${category} env_check: DATABASE_URL=${!!process.env.DATABASE_URL}, DIRECT_DATABASE_URL=${!!process.env.DIRECT_DATABASE_URL}, AUTH_SECRET=${!!process.env.AUTH_SECRET}`);
      }
    }

    // A. DATABASE_URL env not set
    if (msg.includes("DATABASE_URL") && msg.includes("environment variable")) {
      return jsonError("Konfigurasi database belum tersedia. Hubungi administrator.", 500);
    }

    // B. Cannot connect to database (Neon cold start, network, SSL)
    if (msg.includes("Can't reach database server") || msg.includes("Connection refused") || msg.includes("ECONNREFUSED") || msg.includes("connect ETIMEDOUT") || msg.includes("Connection terminated")) {
      return jsonError("Koneksi database sedang bermasalah. Silakan coba beberapa saat lagi.", 503);
    }

    // C. Table/relation does not exist (migration not run)
    if (msg.includes("does not exist") || msg.includes("relation") || msg.includes("P2021") || msg.includes("P2010")) {
      return jsonError("Database belum selesai disiapkan. Hubungi administrator.", 500);
    }

    // D. Unique constraint violation
    if (msg.includes("Unique constraint")) {
      return jsonError("Data sudah digunakan. Periksa kembali email, NIM, atau kode yang dimasukkan.", 409);
    }

    // E. Other Prisma/database errors
    if (msg.includes("Invalid `prisma.") || msg.includes("PrismaClient")) {
      return jsonError("Terjadi masalah pada sistem. Silakan coba lagi.", 500);
    }

    // F. Application-level errors (thrown intentionally)
    return jsonError(msg, 400);
  }
  return jsonError("Terjadi kesalahan. Silakan coba lagi.", 500);
}

function classifyDatabaseError(msg: string): string {
  if (msg.includes("DATABASE_URL")) return "env_missing";
  if (msg.includes("Can't reach") || msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT")) return "connection";
  if (msg.includes("does not exist") || msg.includes("P2021")) return "migration";
  if (msg.includes("PrismaClient") || msg.includes("prisma.")) return "prisma";
  return "other";
}
