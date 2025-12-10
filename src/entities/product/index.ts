export type {
  Product,
  ProductListItem,
  ProductVariant,
  ProductImage,
  ProductDetail,
  PaginationMeta,
  PaginatedProducts,
  ProductFormInput,
  ProductEditInput,
} from "./model";

export {
  productSchema,
  productEditSchema,
  productVariantSchema,
  type ProductFormData,
  type ProductEditFormData,
  type ProductVariantFormData,
} from "./model";

export {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAction,
  type SearchSuggestion,
} from "./api";

export type {
  VendorProduct,
  VendorProductForEdit,
  FeaturedProduct,
  FlashSaleProduct,
} from "./api";

// ⚠️ Queries KHÔNG được export từ barrel file vì chứa server-only code (prisma)
// Server Components: import trực tiếp từ "@/entities/product/api/queries"

export {
  ProductCard,
  ProductStatusBadge,
  ProductStockBadge,
  ProductActions,
  ProductDetailClient,
  type ProductCardProps,
  type AddToCartData,
} from "./ui";
export { calculateDiscount, hasDiscount, validateSKU, calculateAverageRating } from "./lib";
