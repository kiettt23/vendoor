"use server";

import { prisma } from "@/shared/lib/db";
import type { Category, CategoryWithCount } from "../model";

// ============================================
// Category Queries
// ============================================

/**
 * Lấy tất cả categories (cho dropdown, filter)
 */
export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

/**
 * Lấy categories với product count (cho homepage, sidebar)
 */
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { products: true } },
    },
  });
  return categories as CategoryWithCount[];
}

/**
 * Lấy danh sách categories cho admin (với count)
 */
export async function getCategoriesAdmin(): Promise<CategoryWithCount[]> {
  return getCategoriesWithCount();
}
