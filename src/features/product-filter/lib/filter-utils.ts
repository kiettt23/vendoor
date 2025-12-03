/**
 * Filter URL Utilities
 *
 * Helper functions để sync filter với URL search params
 */

import type { ProductFilterParams, ProductSortOption } from "../model/types";

/**
 * Parse search params thành filter params
 */
export function parseFilterParams(
  searchParams: URLSearchParams
): ProductFilterParams {
  const params: ProductFilterParams = {};

  const category = searchParams.get("category");
  if (category) params.category = category;

  const search = searchParams.get("search");
  if (search) params.search = search;

  const minPrice = searchParams.get("minPrice");
  if (minPrice) params.minPrice = parseInt(minPrice, 10) || undefined;

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) params.maxPrice = parseInt(maxPrice, 10) || undefined;

  const minRating = searchParams.get("minRating");
  if (minRating) params.minRating = parseInt(minRating, 10) || undefined;

  const vendorId = searchParams.get("vendor");
  if (vendorId) params.vendorId = vendorId;

  const sort = searchParams.get("sort") as ProductSortOption | null;
  if (sort) params.sort = sort;

  const inStock = searchParams.get("inStock");
  if (inStock === "true") params.inStock = true;

  const page = searchParams.get("page");
  if (page) params.page = parseInt(page, 10) || 1;

  return params;
}

/**
 * Build URL search params từ filter params
 */
export function buildFilterSearchParams(
  params: ProductFilterParams
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
  if (params.minRating)
    searchParams.set("minRating", params.minRating.toString());
  if (params.vendorId) searchParams.set("vendor", params.vendorId);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.inStock) searchParams.set("inStock", "true");
  if (params.page && params.page > 1)
    searchParams.set("page", params.page.toString());

  return searchParams;
}

/**
 * Update một param trong URL (không xóa các params khác)
 */
export function updateFilterParam(
  currentParams: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams.toString());

  // Reset page khi thay đổi filter
  if (key !== "page") {
    newParams.delete("page");
  }

  if (value === undefined || value === "" || value === false) {
    newParams.delete(key);
  } else {
    newParams.set(key, String(value));
  }

  return newParams;
}

/**
 * Clear tất cả filters (giữ lại search nếu có)
 */
export function clearFilters(
  currentParams: URLSearchParams,
  keepSearch = true
): URLSearchParams {
  const newParams = new URLSearchParams();

  if (keepSearch) {
    const search = currentParams.get("search");
    if (search) newParams.set("search", search);
  }

  return newParams;
}

/**
 * Check có filter active không (ngoài search và page)
 */
export function hasActiveFilters(params: ProductFilterParams): boolean {
  return !!(
    params.category ||
    params.minPrice ||
    params.maxPrice ||
    params.minRating ||
    params.vendorId ||
    params.sort ||
    params.inStock
  );
}
