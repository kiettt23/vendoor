// Queries (Server Components only)
export {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getVendorProducts,
  getVendorProductForEdit,
  getFeaturedProducts,
  searchProducts,
} from "./queries";

// Types
export type {
  VendorProduct,
  VendorProductForEdit,
  FeaturedProduct,
  SearchSuggestion,
} from "./queries";

// Actions (Server Actions - callable from Client Components)
export {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAction,
} from "./actions";
