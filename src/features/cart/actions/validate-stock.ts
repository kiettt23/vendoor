"use server";

import { prisma } from "@/shared/lib/prisma";
import type { StockValidationResult } from "../types";

// ============================================
// SERVER ACTION: Validate Cart Stock
// ============================================

/**
 * Validate cart items against current DB stock
 *
 * Called by React Query in CartItems component
 * - Checks each variant's current stock in DB
 * - Returns validation result with warnings
 *
 * @param cartItems - Array of { variantId, quantity }
 * @returns Validation result with stock status
 */
export async function validateCartStock(
  cartItems: Array<{ variantId: string; quantity: number }>
): Promise<StockValidationResult> {
  try {
    // Fetch current stock from DB
    const variantIds = cartItems.map((item) => item.variantId);

    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    // Create lookup map
    const stockMap = new Map(variants.map((v) => [v.id, v.stock]));

    // Validate each item
    const validationItems = cartItems.map((item) => {
      const availableStock = stockMap.get(item.variantId) ?? 0;
      const isAvailable = item.quantity <= availableStock;

      return {
        variantId: item.variantId,
        requestedQuantity: item.quantity,
        availableStock,
        isAvailable,
        message: !isAvailable
          ? `Chỉ còn ${availableStock} sản phẩm`
          : undefined,
      };
    });

    const isValid = validationItems.every((item) => item.isAvailable);
    const hasWarnings = validationItems.some((item) => !item.isAvailable);

    return {
      isValid,
      items: validationItems,
      hasWarnings,
    };
  } catch (error) {
    console.error("Stock validation error:", error);

    // Return pessimistic result on error
    return {
      isValid: false,
      items: cartItems.map((item) => ({
        variantId: item.variantId,
        requestedQuantity: item.quantity,
        availableStock: 0,
        isAvailable: false,
        message: "Không thể xác minh tồn kho",
      })),
      hasWarnings: true,
    };
  }
}
