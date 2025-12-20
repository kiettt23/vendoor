import { cache } from "react";

import { prisma, productListInclude } from "@/shared/lib/db";
import { LIMITS, CACHE_TAGS, CACHE_DURATION } from "@/shared/lib/constants";
import { cacheQueryWithParams } from "@/shared/lib/cache";
import { transformToProductListItem } from "../lib";
import type { ProductListItem, PaginatedProducts } from "../model/types";

// ============================================================================
// Parameters & Helpers
// ============================================================================

export interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  vendorId?: string;
  inStock?: boolean;
  sort?:
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc";
}

function getProductOrderBy(
  sort: GetProductsParams["sort"]
): { createdAt: "desc" | "asc" } | { name: "asc" | "desc" } {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "name-asc":
      return { name: "asc" };
    case "name-desc":
      return { name: "desc" };
    case "price-asc":
    case "price-desc":
      return { createdAt: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

// ============================================================================
// Queries
// ============================================================================

export const getProducts = cache(
  async (params: GetProductsParams = {}): Promise<PaginatedProducts> => {
    const {
      categorySlug,
      search,
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
      minRating,
      vendorId,
      inStock,
      sort = "newest",
    } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      vendor: {
        vendorProfile: {
          status: "APPROVED",
        },
      },
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      const normalizedSearch = search.replace(/\s+/g, "");
      const searchWithSpaces = search.trim();

      where.OR = [
        { name: { contains: searchWithSpaces, mode: "insensitive" } },
        { description: { contains: searchWithSpaces, mode: "insensitive" } },
        { name: { contains: normalizedSearch, mode: "insensitive" } },
        { description: { contains: normalizedSearch, mode: "insensitive" } },
      ];
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (minPrice !== undefined || maxPrice !== undefined || inStock) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (minPrice !== undefined) priceFilter.gte = minPrice;
      if (maxPrice !== undefined) priceFilter.lte = maxPrice;

      where.variants = {
        some: {
          isDefault: true,
          ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
          ...(inStock && { stock: { gt: 0 } }),
        },
      };
    }

    if (minRating !== undefined) {
      where.reviews = {
        some: {
          rating: { gte: minRating },
        },
      };
    }

    const orderBy = getProductOrderBy(sort);

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    let productsFormatted: ProductListItem[] = products.map(
      transformToProductListItem
    );

    if (sort === "price-asc") {
      productsFormatted = productsFormatted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      productsFormatted = productsFormatted.sort((a, b) => b.price - a.price);
    }

    return {
      products: productsFormatted,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
);

export const getFeaturedProducts = cache(
  async (limit = LIMITS.FEATURED_PRODUCTS) => {
    return prisma.product.findMany({
      where: {
        isActive: true,
        vendor: {
          vendorProfile: {
            status: "APPROVED",
          },
        },
      },
      include: productListInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
);

export type FeaturedProduct = Awaited<
  ReturnType<typeof getFeaturedProducts>
>[number];

// ============================================================================
// Cached Versions (Cross-Request Cache)
// ============================================================================
//
// Caching Strategy: Dual-layer caching for PUBLIC data
// - React cache() → Request-level deduplication (5 calls → 1 DB query)
// - unstable_cache() → Cross-request persistence (revalidate every N seconds)
//
// Why cache featured products and category products?
// - PUBLIC data that doesn't change frequently
// - High read volume, low write volume
// - Same data served to all users

export const getCachedFeaturedProducts = (
  limit: number = LIMITS.FEATURED_PRODUCTS
) =>
  cacheQueryWithParams(
    async () => getFeaturedProducts(limit as typeof LIMITS.FEATURED_PRODUCTS),
    ["featured-products", String(limit)],
    {
      tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.FEATURED_PRODUCTS],
      revalidate: CACHE_DURATION.PRODUCTS,
    }
  );

export const getCachedProductsByCategory = (
  categorySlug: string,
  page: number = 1,
  limit: number = 12
) =>
  cacheQueryWithParams(
    async () => getProducts({ categorySlug, page, limit }),
    ["products-by-category", categorySlug, String(page), String(limit)],
    {
      tags: [
        CACHE_TAGS.PRODUCTS,
        CACHE_TAGS.PRODUCTS_BY_CATEGORY(categorySlug),
      ],
      revalidate: CACHE_DURATION.PRODUCTS,
    }
  );
