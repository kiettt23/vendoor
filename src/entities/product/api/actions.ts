"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import {
  generateTimestampSlug,
  tryCatch,
  type AsyncResult,
  type AsyncVoidResult,
} from "@/shared/lib/utils";
import { ROUTES, CACHE_TAGS } from "@/shared/lib/constants";
import type {
  ProductFormInput,
  ProductEditInput,
  SearchSuggestion,
} from "../model";

// ============================================================================
// Helpers
// ============================================================================

function revalidateProductCache(slug?: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS, "max");
  if (slug) {
    revalidateTag(CACHE_TAGS.PRODUCT(slug), "max");
  }
  revalidatePath(ROUTES.VENDOR_PRODUCTS);
}

// ============================================================================
// Actions
// ============================================================================

export async function searchProductsAction(
  query: string,
  limit = 5
): Promise<SearchSuggestion[]> {
  // Guard: query too short
  if (!query.trim() || query.length < 2) return [];

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
      images: { where: { order: 0 }, take: 1, select: { url: true } },
      variants: {
        where: { isDefault: true },
        take: 1,
        select: { price: true },
      },
      category: { select: { name: true, slug: true } },
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

export async function createProduct(
  vendorId: string,
  data: ProductFormInput
): AsyncResult<string> {
  const slug = generateTimestampSlug(data.name);

  return tryCatch(async () => {
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
        ...(data.imageUrl && {
          images: { create: { url: data.imageUrl, order: 0 } },
        }),
      },
    });

    revalidateProductCache();
    return product.id;
  }, "Không thể tạo sản phẩm");
}

export async function updateProduct(
  productId: string,
  data: ProductEditInput
): AsyncVoidResult {
  return tryCatch(async () => {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
      select: { slug: true },
    });

    revalidateProductCache(product.slug);
  }, "Không thể cập nhật sản phẩm");
}

export async function deleteProduct(productId: string): AsyncVoidResult {
  return tryCatch(async () => {
    const product = await prisma.product.delete({
      where: { id: productId },
      select: { slug: true },
    });

    revalidateProductCache(product.slug);
  }, "Không thể xóa sản phẩm");
}
