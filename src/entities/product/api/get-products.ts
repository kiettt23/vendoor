"use server";

import { prisma } from "@/shared/lib";
import type { ProductListItem, PaginatedProducts } from "../model/types";

interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedProducts> {
  const { categorySlug, search, page = 1, limit = 12 } = params;

  const where: {
    isActive: boolean;
    category?: { slug: string };
    name?: { contains: string; mode: "insensitive" };
  } = { isActive: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    include: {
      vendor: { select: { id: true, name: true } },
      category: { select: { name: true, slug: true } },
      variants: { where: { isDefault: true }, select: { price: true, compareAtPrice: true } },
      images: { where: { order: 0 }, take: 1, select: { url: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const productsFormatted: ProductListItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.variants[0]?.price || 0,
    compareAtPrice: product.variants[0]?.compareAtPrice || null,
    image: product.images[0]?.url || "",
    vendor: { id: product.vendor.id, name: product.vendor.name || "Unknown" },
    category: { name: product.category.name, slug: product.category.slug },
  }));

  return {
    products: productsFormatted,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

