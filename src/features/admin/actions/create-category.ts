"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { createCategorySchema } from "../schema/category.schema";
import { revalidatePath } from "next/cache";

export async function createCategory(data: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = createCategorySchema.parse(data);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { success: false, error: "Slug đã tồn tại" };
    }

    // Check if name already exists
    const existingName = await prisma.category.findUnique({
      where: { name: validated.name },
    });

    if (existingName) {
      return { success: false, error: "Tên danh mục đã tồn tại" };
    }

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        image: validated.image || null,
      },
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Không thể tạo danh mục" };
  }
}
