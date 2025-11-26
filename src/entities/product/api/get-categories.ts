"use server";

import { prisma } from "@/shared/lib";
import type { Category, CategoryWithCount } from "../model/types";

export async function getCategories(): Promise<Category[]> {
  return await prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      _count: { select: { products: true } },
    },
  });
  return categories as CategoryWithCount[];
}

