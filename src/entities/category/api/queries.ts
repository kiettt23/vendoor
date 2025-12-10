import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import type { Category, CategoryWithCount } from "../model";

// Category Queries

/**
 * Lấy tất cả categories (cho dropdown, filter)
 *
 * @cached React cache cho request deduplication
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});

/**
 * Lấy categories với product count (cho homepage, sidebar)
 *
 * @cached React cache cho request deduplication
 */
export const getCategoriesWithCount = cache(
  async (): Promise<CategoryWithCount[]> => {
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
);

/**
 * Lấy danh sách categories cho admin (với count)
 *
 * @cached React cache cho request deduplication
 */
export const getCategoriesAdmin = cache(
  async (): Promise<CategoryWithCount[]> => {
    return getCategoriesWithCount();
  }
);
