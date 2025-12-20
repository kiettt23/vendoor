import { cache } from "react";

import {
  prisma,
  productDetailInclude,
  productListInclude,
} from "@/shared/lib/db";
import { CACHE_TAGS, CACHE_DURATION } from "@/shared/lib/constants";
import { cacheQueryWithParams } from "@/shared/lib/cache";
import { transformToProductListItemsSafe } from "../lib";
import type { ProductDetail, ProductListItem } from "../model/types";

// ============================================================================
// Queries
// ============================================================================

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: productDetailInclude,
    });

    // Don't show product if vendor is not APPROVED
    if (!product || !product.vendor.vendorProfile) return null;
    if (product.vendor.vendorProfile.status !== "APPROVED") return null;

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
);

export const getRelatedProducts = cache(
  async (
    categoryId: string,
    currentProductId: string,
    limit = 4
  ): Promise<ProductListItem[]> => {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: currentProductId },
        vendor: {
          vendorProfile: {
            status: "APPROVED",
          },
        },
      },
      include: productListInclude,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return transformToProductListItemsSafe(products);
  }
);

// ============================================================================
// Cached Versions (Cross-Request Cache)
// ============================================================================
//
// Caching Strategy: Dual-layer caching for PUBLIC data
// - React cache() → Request-level deduplication
// - unstable_cache() → Cross-request persistence (ISR-like behavior)
//
// Why cache product details and related products?
// - Product detail pages are the most visited pages
// - Data changes infrequently (only when vendor updates product)
// - Same product shown to all users → perfect for cross-request cache

export const getCachedProductBySlug = (slug: string) =>
  cacheQueryWithParams(async () => getProductBySlug(slug), ["product", slug], {
    tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.PRODUCT(slug)],
    revalidate: CACHE_DURATION.PRODUCT_DETAIL,
  });

export const getCachedRelatedProducts = (
  categoryId: string,
  currentProductId: string,
  limit?: number
) =>
  cacheQueryWithParams(
    async () => getRelatedProducts(categoryId, currentProductId, limit),
    ["related-products", categoryId, currentProductId, String(limit)],
    {
      tags: [
        CACHE_TAGS.PRODUCTS,
        CACHE_TAGS.RELATED_PRODUCTS(currentProductId),
      ],
      revalidate: CACHE_DURATION.RELATED_PRODUCTS,
    }
  );
