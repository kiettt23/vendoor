// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

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
    vendor: {
      id: string;
      name: string;
    };
  };
}
