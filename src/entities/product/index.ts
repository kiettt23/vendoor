export type {
  Product,
  ProductListItem,
  ProductVariant,
  ProductImage,
  ProductDetail,
  Category,
  CategoryWithCount,
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
  getCategories,
  getCategoriesWithCount,
  getVendorProducts,
  getVendorProductForEdit,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
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
} from "./ui";
export {
  calculateDiscount,
  hasDiscount,
  validateSKU,
  generateUniqueSlug,
} from "./lib";
