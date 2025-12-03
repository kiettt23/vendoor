"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { slugify, ok, err, type Result } from "@/shared/lib/utils";

// ============================================
// Category Actions (Admin only)
// ============================================

/**
 * Tạo danh mục mới
 */
export async function createCategory(name: string): Promise<Result<void>> {
  const slug = slugify(name);

  try {
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    return ok(undefined);
  } catch {
    return err("Không thể tạo danh mục");
  }
}

/**
 * Cập nhật danh mục
 */
export async function updateCategory(
  id: string,
  name: string
): Promise<Result<void>> {
  const slug = slugify(name);

  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidatePath("/admin/categories");
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật danh mục");
  }
}

/**
 * Xóa danh mục
 */
export async function deleteCategory(id: string): Promise<Result<void>> {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return ok(undefined);
  } catch {
    return err("Không thể xóa danh mục");
  }
}
