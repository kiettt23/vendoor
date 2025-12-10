import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";

import {
  type InventoryItem,
  type InventoryStats,
  type StockStatus,
  getStockStatus,
  STOCK_THRESHOLDS,
} from "../model/types";

export type InventoryFilter = "all" | StockStatus;

interface GetInventoryParams {
  vendorId: string;
  filter?: InventoryFilter;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get inventory items for a vendor
 *
 * @cached React cache cho request deduplication
 */
export const getVendorInventory = cache(
  async ({
    vendorId,
    filter = "all",
    search,
    page = 1,
    limit = LIMITS.VENDOR_INVENTORY_PER_PAGE,
  }: GetInventoryParams): Promise<{
    items: InventoryItem[];
    total: number;
    stats: InventoryStats;
  }> => {
    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      product: {
        vendorId,
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
      },
    };

    // Apply stock filter
    if (filter === "out_of_stock") {
      where.stock = { lte: STOCK_THRESHOLDS.OUT_OF_STOCK };
    } else if (filter === "low_stock") {
      where.stock = {
        gt: STOCK_THRESHOLDS.OUT_OF_STOCK,
        lte: STOCK_THRESHOLDS.LOW_STOCK,
      };
    } else if (filter === "in_stock") {
      where.stock = { gt: STOCK_THRESHOLDS.LOW_STOCK };
    }

    // Get variants with product info
    const variantsQuery = prisma.productVariant.findMany({
      where,
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: [{ stock: "asc" }, { product: { name: "asc" } }],
      skip,
      take: limit,
    });

    const [variants, total, stats] = await Promise.all([
      variantsQuery,
      prisma.productVariant.count({ where }),
      getInventoryStats(vendorId),
    ]);

    const items: InventoryItem[] = variants.map((v) => ({
      variantId: v.id,
      productId: v.product.id,
      productName: v.product.name,
      productSlug: v.product.slug,
      variantName: v.name,
      sku: v.sku,
      stock: v.stock,
      status: getStockStatus(v.stock),
      price: v.price,
      image: v.product.images[0]?.url || null,
    }));

    return { items, total, stats };
  }
);

/**
 * Get inventory statistics for a vendor
 *
 * @cached React cache cho request deduplication
 */
export const getInventoryStats = cache(
  async (vendorId: string): Promise<InventoryStats> => {
    const [totalProducts, counts] = await Promise.all([
      prisma.product.count({ where: { vendorId } }),
      prisma.productVariant.groupBy({
        by: ["stock"],
        where: { product: { vendorId } },
        _count: true,
      }),
    ]);

    let totalVariants = 0;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    for (const group of counts) {
      const count = group._count;
      totalVariants += count;

      if (group.stock <= STOCK_THRESHOLDS.OUT_OF_STOCK) {
        outOfStock += count;
      } else if (group.stock <= STOCK_THRESHOLDS.LOW_STOCK) {
        lowStock += count;
      } else {
        inStock += count;
      }
    }

    return {
      totalProducts,
      totalVariants,
      inStock,
      lowStock,
      outOfStock,
    };
  }
);
