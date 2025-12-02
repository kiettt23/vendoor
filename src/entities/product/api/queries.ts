"use server";

import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";
import type {
  ProductDetail,
  ProductListItem,
  PaginatedProducts,
} from "../model/types";

// ============================================
// Product Queries
// ============================================

interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedProducts> {
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
      variants: {
        where: { isDefault: true },
        select: { id: true, price: true, compareAtPrice: true, stock: true },
      },
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
    stock: product.variants[0]?.stock ?? 0,
    variantId: product.variants[0]?.id || "",
    image: product.images[0]?.url || "",
    vendor: { id: product.vendor.id, name: product.vendor.name || "Unknown" },
    category: { name: product.category.name, slug: product.category.slug },
  }));

  return {
    products: productsFormatted,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          vendorProfile: { select: { id: true, shopName: true, slug: true } },
        },
      },
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { isDefault: "desc" } },
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product || !product.vendor.vendorProfile) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    isActive: product.isActive,
    vendor: {
      id: product.vendor.id,
      vendorProfileId: product.vendor.vendorProfile.id,
      name: product.vendor.name || "Unknown",
      shopName: product.vendor.vendorProfile.shopName,
      slug: product.vendor.vendorProfile.slug,
    },
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
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
      variants: {
        where: { isDefault: true },
        select: { id: true, price: true, compareAtPrice: true, stock: true },
      },
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
    stock: product.variants[0]?.stock ?? 0,
    variantId: product.variants[0]?.id || "",
    image: product.images[0]?.url || "",
    vendor: { id: product.vendor.id, name: product.vendor.name || "Unknown" },
    category: { name: product.category.name, slug: product.category.slug },
  }));
}

// ============================================
// Vendor Product Queries
// ============================================

/**
 * Lấy danh sách sản phẩm của vendor (cho vendor dashboard)
 */
export async function getVendorProducts(vendorId: string) {
  return prisma.product.findMany({
    where: { vendorId },
    include: {
      category: { select: { name: true } },
      variants: {
        where: { isDefault: true },
        select: { price: true, stock: true },
      },
      images: { take: LIMITS.FIRST_IMAGE, orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type VendorProduct = Awaited<
  ReturnType<typeof getVendorProducts>
>[number];

/**
 * Lấy chi tiết sản phẩm của vendor để edit
 */
export async function getVendorProductForEdit(
  productId: string,
  vendorId: string
) {
  return prisma.product.findFirst({
    where: { id: productId, vendorId },
    include: {
      images: { select: { id: true, url: true }, orderBy: { order: "asc" } },
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          compareAtPrice: true,
          sku: true,
          stock: true,
          isDefault: true,
        },
      },
    },
  });
}

export type VendorProductForEdit = Awaited<
  ReturnType<typeof getVendorProductForEdit>
>;

/**
 * Lấy sản phẩm nổi bật cho homepage
 */
export async function getFeaturedProducts(limit = LIMITS.FEATURED_PRODUCTS) {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      vendor: { select: { id: true, name: true } },
      category: { select: { name: true, slug: true } },
      variants: {
        where: { isDefault: true },
        select: { id: true, price: true, compareAtPrice: true, stock: true },
      },
      images: {
        where: { order: 0 },
        take: LIMITS.FIRST_IMAGE,
        select: { url: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type FeaturedProduct = Awaited<
  ReturnType<typeof getFeaturedProducts>
>[number];
