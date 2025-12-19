import { cache } from "react";
import { prisma } from "@/shared/lib/db";
import type { SearchSuggestion } from "../model/types";

// ============================================================================
// Search Queries
// ============================================================================

/**
 * Tìm kiếm sản phẩm cho search suggestions
 * Trả về kết quả nhẹ (chỉ id, name, slug, image, price)
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
