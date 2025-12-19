export type { WishlistItem, WishlistItemWithProduct } from "./model";

// ⚠️ Queries: import từ "@/entities/wishlist/api/queries"

export {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from "./api";
