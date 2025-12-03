export type {
  Product,
  ProductListItem,
  ProductVariant,
  ProductImage,
  ProductDetail,
  PaginationMeta,
  PaginatedProducts,
  ProductFormInput,
} from "./model";

// Schemas
export {
  productSchema,
  productVariantSchema,
  type ProductFormData,
  type ProductVariantFormData,
} from "./model";

export {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getVendorProducts,
  getVendorProductForEdit,
  getFeaturedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type SearchSuggestion,
} from "./api";

export type {
  VendorProduct,
  VendorProductForEdit,
  FeaturedProduct,
} from "./api";
export {
  ProductCard,
  ProductStatusBadge,
  ProductStockBadge,
  ProductActions,
  ProductDetailClient,
  type ProductCardProps,
  type AddToCartData,
} from "./ui";
export {
  calculateDiscount,
  hasDiscount,
  validateSKU,
  generateUniqueSlug,
} from "./lib";
