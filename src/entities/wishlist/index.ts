export type { WishlistItem, WishlistItemWithProduct } from "./model";

/**
 * ⚠️ Wishlist API Exports
 *
 * - Actions: Available here (callable from Client Components)
 * - Queries (getUserWishlist, isInWishlist, etc.): Import directly from
 *   "@/entities/wishlist/api/queries" in Server Components only
 */
export {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from "./api";
