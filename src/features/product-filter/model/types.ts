/**
 * Product Filter Types
 *
 * Types cho filter sản phẩm nâng cao
 */

export interface ProductFilterParams {
  /** Category slug */
  category?: string;
  /** Search term */
  search?: string;
  /** Min price */
  minPrice?: number;
  /** Max price */
  maxPrice?: number;
  /** Min rating (1-5) */
  minRating?: number;
  /** Vendor ID */
  vendorId?: string;
  /** Sort by */
  sort?: ProductSortOption;
  /** Only in stock */
  inStock?: boolean;
  /** Page number */
  page?: number;
}

export type ProductSortOption =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price-asc", label: "Giá: Thấp → Cao" },
  { value: "price-desc", label: "Giá: Cao → Thấp" },
  { value: "name-asc", label: "Tên: A → Z" },
  { value: "name-desc", label: "Tên: Z → A" },
];

export const RATING_OPTIONS = [
  { value: 4, label: "4 sao trở lên" },
  { value: 3, label: "3 sao trở lên" },
  { value: 2, label: "2 sao trở lên" },
  { value: 1, label: "1 sao trở lên" },
];
