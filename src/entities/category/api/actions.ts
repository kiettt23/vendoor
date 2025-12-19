"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { slugify, tryCatch, type AsyncVoidResult } from "@/shared/lib/utils";
import { REVALIDATION_PATHS, CACHE_TAGS } from "@/shared/lib/constants";

/** Invalidate tất cả cache liên quan đến categories */
function revalidateCategoryCache() {
  revalidateTag(CACHE_TAGS.CATEGORIES, "max");
  REVALIDATION_PATHS.CATEGORIES.forEach((p) => revalidatePath(p));
}

export async function createCategory(name: string): AsyncVoidResult {
  const slug = slugify(name);

  const result = await tryCatch(async () => {
    await prisma.category.create({ data: { name, slug } });
    revalidateCategoryCache();
  }, "Không thể tạo danh mục");

  return result;
}

export async function updateCategory(
  id: string,
  name: string
): AsyncVoidResult {
  const slug = slugify(name);

  const result = await tryCatch(async () => {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidateCategoryCache();
  }, "Không thể cập nhật danh mục");

  return result;
}

export async function deleteCategory(id: string): AsyncVoidResult {
  const result = await tryCatch(async () => {
    await prisma.category.delete({ where: { id } });
    revalidateCategoryCache();
  }, "Không thể xóa danh mục");

  return result;
}
