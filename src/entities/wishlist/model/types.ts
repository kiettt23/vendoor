/**
 * Wishlist Types
 *
 * Tận dụng Prisma generated types cho base models.
 */

import type { WishlistModel } from "@/generated/prisma";

// ============================================
// Base Types (từ Prisma Generated)
// ============================================

/**
 * Base Wishlist item type từ database
 */
export type WishlistItem = WishlistModel;

// ============================================
// Derived Types (cho specific use cases)
// ============================================

/**
 * Wishlist item với thông tin sản phẩm
 */
export interface WishlistItemWithProduct {
  id: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    isActive: boolean;
    variantId: string;
    vendor: {
      id: string;
      name: string;
    };
  };
}
