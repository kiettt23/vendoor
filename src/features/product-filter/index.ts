// Feature: Product Filter
// Cho phép lọc sản phẩm theo nhiều tiêu chí: giá, đánh giá, tình trạng kho, cửa hàng

export { ProductFilterBar, ActiveFilterTags, CategoryTabs, Pagination } from "./ui";
export type { ProductFilterParams, ProductSortOption } from "./model";
export { SORT_OPTIONS, RATING_OPTIONS } from "./model";
export {
  parseFilterParams,
  buildFilterSearchParams,
  updateFilterParam,
  clearFilters,
  hasActiveFilters,
  buildCategoryUrl,
  buildPaginationUrl,
  normalizeSearchText,
} from "./lib";
