"use server";

import { prisma } from "@/shared/lib/db";
import type { StockInfo } from "../model/types";

// ============================================================================
// Actions
// ============================================================================

export async function getCartItemsStock(
  variantIds: string[]
): Promise<StockInfo[]> {
  if (variantIds.length === 0) return [];

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: {
      id: true,
      stock: true,
      product: { select: { isActive: true } },
    },
  });

  return variantIds.map((variantId) => {
    const variant = variants.find((v) => v.id === variantId);
    return {
      variantId,
      currentStock: variant?.stock ?? 0,
      isAvailable:
        (variant?.stock ?? 0) > 0 && (variant?.product.isActive ?? false),
    };
  });
}
