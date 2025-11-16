"use server";

import { prisma } from "@/shared/lib/prisma";

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
    console.error("[getCategories] Error:", error);
    return {
      success: false,
      error: "Failed to get categories",
    };
  }
}
