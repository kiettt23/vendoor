/**
 * Product API - Barrel Export
 *
 * ⚠️ IMPORTANT: Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions, types)
 * Server Components: import queries từ "@/entities/product/api/queries"
 */

// Types (safe for client - type-only)
export type {
  VendorProduct,
  VendorProductForEdit,
  FeaturedProduct,
  SearchSuggestion,
  FlashSaleProduct,
} from "./queries";

// Actions (Server Actions - callable from Client Components)
export {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAction,
} from "./actions";
