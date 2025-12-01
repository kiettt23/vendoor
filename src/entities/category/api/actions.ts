"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { slugify } from "@/shared/lib/utils";

// ============================================
// Category Actions (Admin only)
// ============================================

/**
 * Tạo danh mục mới
 */
export async function createCategory(name: string) {
  const slug = slugify(name);

  try {
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể tạo danh mục" };
  }
}

/**
 * Cập nhật danh mục
 */
export async function updateCategory(id: string, name: string) {
  const slug = slugify(name);

  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể cập nhật danh mục" };
  }
}

/**
 * Xóa danh mục
 */
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể xóa danh mục" };
  }
}
