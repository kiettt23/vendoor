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
  SearchSuggestion,
  FlashSaleProduct,
  AddToCartData,
} from "./model";

export {
  productSchema,
  productEditSchema,
  productVariantSchema,
  type ProductFormData,
  type ProductEditFormData,
  type ProductVariantFormData,
} from "./model";

// ⚠️ Queries: import từ "@/entities/product/api/queries"

export {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductsAction,
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
} from "./ui";

export {
  calculateDiscount,
  hasDiscount,
  validateSKU,
  calculateAverageRating,
} from "./lib";
