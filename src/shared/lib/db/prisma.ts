/**
 * Database - Prisma Client Singleton
 *
 * Singleton pattern để tránh tạo nhiều Prisma client instances
 * trong development mode (hot reload).
 *
 * Prisma v7: Sử dụng Driver Adapter cho PostgreSQL
 *
 * Usage: import { prisma } from "@/shared/lib/db"
 */

import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
