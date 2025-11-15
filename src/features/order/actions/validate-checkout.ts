"use server";

import { prisma } from "@/shared/lib/prisma";
import { groupItemsByVendor } from "@/features/cart/lib/utils";
import type { CartItem } from "@/features/cart/types";

// ============================================
// VALIDATION RESULT TYPES
// ============================================

export interface CheckoutValidationResult {
  isValid: boolean;
  invalidItems: InvalidItem[];
  message?: string;
}

export interface InvalidItem {
  cartItemId: string;
  productName: string;
  variantName: string;
  requestedQuantity: number;
  availableStock: number;
  vendorName: string;
}

// ============================================
// SERVER ACTION: Validate Checkout
// ============================================

/**
 * Validate cart items before checkout
 *
 * **Why separate action:**
 * - Run just before showing checkout form
 * - Catch stock issues early
 * - Better UX than failing at order creation
 *
 * **What we validate:**
 * - Product exists
 * - Variant exists
 * - Variant has enough stock
 * - Vendor still active
 *
 * **Pattern:**
 * Similar to cart's validate-stock.ts
 * But more strict (must be exact match)
 *
 * @param cartItems - Items to validate
 * @returns Validation result with invalid items
 */
export async function validateCheckout(
  cartItems: CartItem[]
): Promise<CheckoutValidationResult> {
  try {
    // ============================================
    // 1. VALIDATE INPUT
    // ============================================
    if (!cartItems || cartItems.length === 0) {
      return {
        isValid: false,
        invalidItems: [],
        message: "Giỏ hàng trống",
      };
    }

    // ============================================
    // 2. GROUP BY VENDOR
    // ============================================
    const vendorGroups = groupItemsByVendor(cartItems);

    const invalidItems: InvalidItem[] = [];

    // ============================================
    // 3. VALIDATE EACH VENDOR GROUP
    // ============================================
    for (const group of vendorGroups) {
      // Check vendor exists and active via VendorProfile
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: group.vendorId },
        select: {
          id: true,
          shopName: true,
          userId: true,
          status: true,
        },
      });

      if (!vendorProfile || vendorProfile.status !== "APPROVED") {
        // Vendor not found or not active - all items invalid
        group.items.forEach((item) => {
          invalidItems.push({
            cartItemId: item.id,
            productName: item.productName,
            variantName: item.variantName ?? "",
            requestedQuantity: item.quantity,
            availableStock: 0,
            vendorName: vendorProfile?.shopName ?? "Cửa hàng không tồn tại",
          });
        });
        continue;
      }

      // ============================================
      // 4. VALIDATE EACH ITEM IN GROUP
      // ============================================
      for (const item of group.items) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: {
            id: true,
            stock: true,
            product: {
              select: {
                name: true,
                isActive: true,
              },
            },
          },
        });

        // Check variant exists
        if (!variant) {
          invalidItems.push({
            cartItemId: item.id,
            productName: item.productName,
            variantName: item.variantName ?? "",
            requestedQuantity: item.quantity,
            availableStock: 0,
            vendorName: vendorProfile.shopName,
          });
          continue;
        }

        // Check product is active
        if (!variant.product.isActive) {
          invalidItems.push({
            cartItemId: item.id,
            productName: item.productName,
            variantName: item.variantName ?? "",
            requestedQuantity: item.quantity,
            availableStock: 0,
            vendorName: vendorProfile.shopName,
          });
          continue;
        }

        // **CRITICAL: Stock validation**
        if (variant.stock < item.quantity) {
          invalidItems.push({
            cartItemId: item.id,
            productName: item.productName,
            variantName: item.variantName ?? "",
            requestedQuantity: item.quantity,
            availableStock: variant.stock,
            vendorName: vendorProfile.shopName,
          });
        }
      }
    }

    // ============================================
    // 5. RETURN RESULT
    // ============================================
    if (invalidItems.length > 0) {
      return {
        isValid: false,
        invalidItems,
        message: `${invalidItems.length} sản phẩm không đủ hàng hoặc không còn bán`,
      };
    }

    return {
      isValid: true,
      invalidItems: [],
    };
  } catch (error) {
    console.error("Validate checkout error:", error);

    return {
      isValid: false,
      invalidItems: [],
      message: "Có lỗi xảy ra khi kiểm tra giỏ hàng. Vui lòng thử lại.",
    };
  }
}
