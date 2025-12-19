import { cache } from "react";

import { prisma, flashSaleProductInclude } from "@/shared/lib/db";
import { CACHE_TAGS, CACHE_DURATION } from "@/shared/lib/constants";
import { cacheQueryWithParams } from "@/shared/lib/cache";
import type { FlashSaleProduct } from "../model/types";

// ============================================================================
// Flash Sale Queries
// ============================================================================

/**
 * Lấy sản phẩm Flash Sale - sắp xếp theo % giảm giá cao nhất
 * Products có compareAtPrice (giá gốc) > price (giá sale)
 */
export const getFlashSaleProducts = cache(
  async (limit = 5): Promise<FlashSaleProduct[]> => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            compareAtPrice: { not: null },
            stock: { gt: 0 },
          },
        },
      },
      include: flashSaleProductInclude,
      take: limit * 3,
    });

    const productsWithDiscount = products
      .map((p) => {
        const variant = p.variants[0];
        const price = variant?.price ?? 0;
        const originalPrice = variant?.compareAtPrice ?? price;
        const discountPercent =
          originalPrice > 0
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;
        const stock = variant?.stock ?? 0;
        const total = stock + Math.floor(Math.random() * 50) + 10;
        const sold = total - stock;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price,
          originalPrice,
          discountPercent,
          image: p.images[0]?.url ?? "/placeholder.jpg",
          sold,
          total,
          store: p.vendor?.vendorProfile?.shopName ?? "Vendoor",
        };
      })
      .filter((p) => p.discountPercent > 0)
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, limit);

    return productsWithDiscount;
  }
);

// ============================================================================
// Cached Version (Cross-Request Cache)
// ============================================================================
//
// Caching Strategy: Dual-layer caching for flash sale products
// - React cache() → Request-level deduplication
// - unstable_cache() → Cross-request persistence
//
// Why cache flash sales?
// - Flash sale products don't change frequently (updated by cron/scheduler)
// - High traffic during flash sale periods → reduce DB load
// - Same flash sale data shown to all users

export const getCachedFlashSaleProducts = (limit?: number) =>
  cacheQueryWithParams(
    async () => getFlashSaleProducts(limit),
    ["flash-sale-products", String(limit)],
    {
      tags: [CACHE_TAGS.PRODUCTS],
      revalidate: CACHE_DURATION.PRODUCTS,
    }
  );
