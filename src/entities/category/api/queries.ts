import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import { cacheCategories } from "@/shared/lib/cache";
import type { Category, CategoryWithCount } from "../model";

const fetchCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const fetchCategoriesWithCount = async (): Promise<CategoryWithCount[]> => {
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
};

export const getCategories = cacheCategories(fetchCategories);
export const getCategoriesWithCount = cacheCategories(fetchCategoriesWithCount);
export const getCategoriesAdmin = cache(getCategoriesWithCount);
