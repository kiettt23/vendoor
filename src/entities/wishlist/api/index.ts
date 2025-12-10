/**
 * Wishlist API - Barrel Export
 *
 * ⚠️ Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions only)
 * Server Components: import queries từ "@/entities/wishlist/api/queries"
 */
export {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from "./actions";
