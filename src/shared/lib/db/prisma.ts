/**
 * Database - Prisma Client Singleton
 *
 * Singleton pattern để tránh tạo nhiều Prisma client instances
 * trong development mode (hot reload).
 *
 * Usage: import { prisma } from "@/lib/db"
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
