"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteCategory(categoryId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Danh mục không tồn tại" };
    }

    // Check if category has products
    if (category._count.products > 0) {
      return {
        success: false,
        error: `Không thể xóa danh mục đang có ${category._count.products} sản phẩm`,
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Xóa danh mục thành công",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Không thể xóa danh mục" };
  }
}
