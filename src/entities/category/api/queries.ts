"use server";

import { prisma } from "@/shared/lib/db";

// ============================================
// Category Queries
// ============================================

/**
 * Lấy danh sách categories (cho admin)
 */
export async function getCategoriesAdmin() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}
