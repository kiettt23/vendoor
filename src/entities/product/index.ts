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
} from "./model";

export {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getCategories,
  getCategoriesWithCount,
} from "./api";
export {
  ProductCard,
  ProductStatusBadge,
  ProductStockBadge,
  ProductActions,
} from "./ui";
export {
  calculateDiscount,
  hasDiscount,
  validateSKU,
  generateUniqueSlug,
} from "./lib";
