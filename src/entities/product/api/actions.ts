"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { slugify, ok, err, type Result } from "@/shared/lib/utils";

import type { ProductFormInput } from "../model";

// Re-export SearchSuggestion type for Client Components
export type SearchSuggestion = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number | null;
  category: string | null;
  categorySlug: string | null;
};

// ============================================
// Search Action (cho Client Components)
// ============================================

/**
 * Server action để search products từ Client Component
 * Wrap query function để có thể gọi từ client
 */
export async function searchProductsAction(
  query: string,
  limit = 5
): Promise<SearchSuggestion[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      images: {
        where: { order: 0 },
        take: 1,
        select: { url: true },
      },
      variants: {
        where: { isDefault: true },
        take: 1,
        select: { price: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { name: "asc" },
    take: limit,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0]?.url ?? null,
    price: p.variants[0]?.price ?? null,
    category: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));
}

// ============================================
// Actions
// ============================================

export async function createProduct(
  vendorId: string,
  data: ProductFormInput
): Promise<Result<string>> {
  // Thêm timestamp để đảm bảo slug unique
  const slug = `${slugify(data.name)}-${Date.now().toString(36)}`;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        categoryId: data.categoryId,
        vendorId,
        isActive: data.isActive,
        variants: {
          create: {
            name: null,
            price: data.price,
            compareAtPrice: data.compareAtPrice || null,
            sku: data.sku,
            stock: data.stock,
            isDefault: true,
          },
        },
        // Create image if provided
        ...(data.imageUrl && {
          images: {
            create: {
              url: data.imageUrl,
              order: 0,
            },
          },
        }),
      },
    });
    revalidatePath("/vendor/products");
    return ok(product.id);
  } catch {
    return err("Không thể tạo sản phẩm");
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormInput
): Promise<Result<void>> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        variants: {
          updateMany: {
            where: { isDefault: true },
            data: {
              price: data.price,
              compareAtPrice: data.compareAtPrice || null,
              sku: data.sku,
              stock: data.stock,
            },
          },
        },
      },
    });
    revalidatePath("/vendor/products");
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật sản phẩm");
  }
}

export async function deleteProduct(productId: string): Promise<Result<void>> {
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/vendor/products");
    return ok(undefined);
  } catch {
    return err("Không thể xóa sản phẩm");
  }
}
