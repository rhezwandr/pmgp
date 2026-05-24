import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

// Cache di global untuk SEMUA environment (termasuk production serverless)
// Mencegah pembuatan koneksi baru setiap cold start di Vercel/serverless
globalForPrisma.prisma = prisma;
