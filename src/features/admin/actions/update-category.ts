"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { updateCategorySchema } from "../schema/category.schema";
import { revalidatePath } from "next/cache";

export async function updateCategory(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = updateCategorySchema.parse(data);

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: validated.id },
    });

    if (!existing) {
      return { success: false, error: "Danh mục không tồn tại" };
    }

    // Check if slug is taken by another category
    if (validated.slug && validated.slug !== existing.slug) {
      const slugTaken = await prisma.category.findUnique({
        where: { slug: validated.slug },
      });

      if (slugTaken) {
        return { success: false, error: "Slug đã tồn tại" };
      }
    }

    // Check if name is taken by another category
    if (validated.name && validated.name !== existing.name) {
      const nameTaken = await prisma.category.findUnique({
        where: { name: validated.name },
      });

      if (nameTaken) {
        return { success: false, error: "Tên danh mục đã tồn tại" };
      }
    }

    const category = await prisma.category.update({
      where: { id: validated.id },
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        image: validated.image || null,
      },
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Cập nhật danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Không thể cập nhật danh mục" };
  }
}
