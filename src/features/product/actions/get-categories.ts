"use server";

import { prisma } from "@/shared/lib/prisma";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("ProductActions");

// ============================================
// GET CATEGORIES
// ============================================

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GetCategoriesResult {
  success: boolean;
  categories?: Category[];
  error?: string;
}

export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      categories,
    };
  } catch (error) {
    logger.error("Failed to get categories", error);
    return {
      success: false,
      error: "Failed to get categories",
    };
  }
}
