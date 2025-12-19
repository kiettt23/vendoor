/**
 * Product API - Barrel Export
 *
 * ⚠️ IMPORTANT: Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions, types)
 * Server Components: import queries từ các file cụ thể:
 *   - "@/entities/product/api/product-list.queries"
 *   - "@/entities/product/api/product-detail.queries"
 *   - "@/entities/product/api/vendor-product.queries"
 *   - "@/entities/product/api/search.queries"
 *   - "@/entities/product/api/flash-sale.queries"
 */

// Types (safe for client - type-only)
export type { VendorProduct, VendorProductForEdit } from "./vendor-product.queries";
export type { FeaturedProduct, GetProductsParams } from "./product-list.queries";

// Actions (Server Actions - callable from Client Components)
export {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAction,
} from "./actions";
