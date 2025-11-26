"use server";

import { prisma } from "@/shared/lib";
import type { CartItem } from "@/entities/cart";

interface ValidationResult {
  isValid: boolean;
  invalidItems: {
    variantId: string;
    productName: string;
    variantName: string | null;
    requestedQuantity: number;
    availableStock: number;
  }[];
}

export async function validateCheckout(items: CartItem[]): Promise<ValidationResult> {
  const invalidItems: ValidationResult["invalidItems"] = [];

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      select: { stock: true, name: true, product: { select: { name: true } } },
    });

    if (!variant || variant.stock < item.quantity) {
      invalidItems.push({
        variantId: item.variantId,
        productName: variant?.product.name || item.productName,
        variantName: variant?.name || item.variantName,
        requestedQuantity: item.quantity,
        availableStock: variant?.stock || 0,
      });
    }
  }

  return { isValid: invalidItems.length === 0, invalidItems };
}

