// ============================================
// Wishlist Entity
// ============================================

// Model - Types
export type { WishlistItem, WishlistItemWithProduct } from "./model";

// API - Queries
export {
  getUserWishlist,
  isInWishlist,
  getWishlistCount,
  getWishlistProductIds,
} from "./api";

// API - Actions
export {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from "./api";
