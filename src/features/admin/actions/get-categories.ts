"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getCategories(params: GetCategoriesParams = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { page = 1, pageSize = 20, search = "" } = params;

    const skip = (page - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      data: {
        categories,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Không thể tải danh sách danh mục",
    };
  }
}
