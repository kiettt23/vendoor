import { cache } from "react";

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
  // Filter params
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

/**
 * Lấy danh sách sản phẩm với pagination và filtering
 *
 * @cached React cache cho request deduplication
 */
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

    // Build where clause - sử dụng Prisma.ProductWhereInput type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    // Price & stock filter on variants
    if (minPrice !== undefined || maxPrice !== undefined || inStock) {
      where.variants = {
        some: {
          isDefault: true,
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
          ...(inStock && { stock: { gt: 0 } }),
        },
      };
    }

    // Rating filter
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Build orderBy
    const orderBy = getProductOrderBy(sort);

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
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Post-filter for price (vì price nằm trong variant)
    // Note: Đã filter trong where.variants.some nhưng cần double check
    let productsFormatted: ProductListItem[] = products.map((product) => ({
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

    // Client-side sort for price (vì Prisma không hỗ trợ sort theo nested relation)
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

/**
 * Helper: Map sort option to Prisma orderBy
 */
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
      // Price sort handled client-side after format
      return { createdAt: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

/**
 * Lấy chi tiết sản phẩm theo slug
 *
 * @cached React cache cho request deduplication
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
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
);

/**
 * Lấy sản phẩm liên quan
 *
 * @cached React cache cho request deduplication
 */
export const getRelatedProducts = cache(
  async (
    categoryId: string,
    currentProductId: string,
    limit = 4
  ): Promise<ProductListItem[]> => {
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
);

// ============================================
// Vendor Product Queries
// ============================================

/**
 * Lấy danh sách sản phẩm của vendor (cho vendor dashboard)
 *
 * @cached React cache cho request deduplication
 */
export const getVendorProducts = cache(async (vendorId: string) => {
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
});

export type VendorProduct = Awaited<
  ReturnType<typeof getVendorProducts>
>[number];

/**
 * Lấy chi tiết sản phẩm của vendor để edit
 *
 * @cached React cache cho request deduplication
 */
export const getVendorProductForEdit = cache(
  async (productId: string, vendorId: string) => {
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
);

export type VendorProductForEdit = Awaited<
  ReturnType<typeof getVendorProductForEdit>
>;

/**
 * Lấy sản phẩm nổi bật cho homepage
 *
 * @cached React cache cho request deduplication
 */
export const getFeaturedProducts = cache(
  async (limit = LIMITS.FEATURED_PRODUCTS) => {
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
);

export type FeaturedProduct = Awaited<
  ReturnType<typeof getFeaturedProducts>
>[number];

// ============================================
// Search Suggestions
// ============================================

/**
 * Tìm kiếm sản phẩm cho search suggestions
 * Trả về kết quả nhẹ (chỉ id, name, slug, image, price)
 *
 * @cached React cache cho request deduplication
 */
export const searchProducts = cache(
  async (query: string, limit = 5): Promise<SearchSuggestion[]> => {
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
);

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number | null;
  category: string | null;
  categorySlug: string | null;
}
