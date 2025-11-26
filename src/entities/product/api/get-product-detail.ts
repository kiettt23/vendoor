"use server";

import { prisma } from "@/shared/lib";
import type { ProductDetail, ProductListItem } from "../model/types";

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          vendorProfile: { select: { shopName: true, slug: true } },
        },
      },
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { isDefault: "desc" } },
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    isActive: product.isActive,
    vendor: {
      id: product.vendor.id,
      name: product.vendor.name || "Unknown",
      shopName: product.vendor.vendorProfile?.shopName || "Unknown Shop",
      slug: product.vendor.vendorProfile?.slug || "",
    },
    category: { id: product.category.id, name: product.category.name, slug: product.category.slug },
    variants: product.variants,
    images: product.images,
  };
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 4
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: currentProductId } },
    include: {
      vendor: { select: { id: true, name: true } },
      category: { select: { name: true, slug: true } },
      variants: { where: { isDefault: true }, select: { price: true, compareAtPrice: true } },
      images: { where: { order: 0 }, take: 1, select: { url: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.variants[0]?.price || 0,
    compareAtPrice: product.variants[0]?.compareAtPrice || null,
    image: product.images[0]?.url || "",
    vendor: { id: product.vendor.id, name: product.vendor.name || "Unknown" },
    category: { name: product.category.name, slug: product.category.slug },
  }));
}

