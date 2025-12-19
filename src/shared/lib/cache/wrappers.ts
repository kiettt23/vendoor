/**
 * Entity-specific Cache Wrappers
 *
 * Pre-configured cache functions for each entity type.
 * These handle tags and revalidation settings automatically.
 */

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_DURATION, CACHE_TAGS } from "../constants/cache";

// ============================================================================
// Generic Helpers
// ============================================================================

/**
 * Generic cache wrapper for functions with dynamic parameters.
 * Combines React cache() for request dedup with unstable_cache() for cross-request caching.
 *
 * @example
 * export const getCachedProducts = (limit: number) =>
 *   cacheQueryWithParams(
 *     () => getProducts(limit),
 *     ["products", String(limit)],
 *     { tags: [CACHE_TAGS.PRODUCTS], revalidate: 3600 }
 *   );
 */
export function cacheQueryWithParams<TResult>(
  fn: () => Promise<TResult>,
  keyParts: string[],
  config: { tags: string[]; revalidate: number }
): Promise<TResult> {
  const cached = unstable_cache(fn, keyParts, {
    tags: config.tags,
    revalidate: config.revalidate,
  });

  // Wrap with React cache for request-level deduplication
  return cache(cached)();
}

// ============================================================================
// Products
// ============================================================================

/**
 * Cache for product list queries.
 * Tags: products, products:category:{slug}
 */
export function cacheProducts<TResult>(
  fn: () => Promise<TResult>,
  categorySlug?: string
): () => Promise<TResult> {
  const tags: string[] = [CACHE_TAGS.PRODUCTS];
  if (categorySlug) {
    tags.push(CACHE_TAGS.PRODUCTS_BY_CATEGORY(categorySlug));
  }

  return unstable_cache(fn, ["products", categorySlug || "all"], {
    tags,
    revalidate: CACHE_DURATION.PRODUCTS,
  });
}

/**
 * Cache for product detail queries.
 * Tags: products, product:{slug}
 */
export function cacheProductDetail<TResult>(
  fn: () => Promise<TResult>,
  slug: string
): () => Promise<TResult> {
  return unstable_cache(fn, ["product", slug], {
    tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.PRODUCT(slug)],
    revalidate: CACHE_DURATION.PRODUCT_DETAIL,
  });
}

// ============================================================================
// Categories
// ============================================================================

/**
 * Cache for category queries.
 * Tags: categories
 */
export function cacheCategories<TResult>(
  fn: () => Promise<TResult>
): () => Promise<TResult> {
  return unstable_cache(fn, ["categories"], {
    tags: [CACHE_TAGS.CATEGORIES],
    revalidate: CACHE_DURATION.CATEGORIES,
  });
}

// ============================================================================
// Vendors
// ============================================================================

/**
 * Cache for vendor products queries.
 * Tags: products, products:vendor:{vendorId}
 */
export function cacheVendorProducts<TResult>(
  fn: () => Promise<TResult>,
  vendorId: string
): () => Promise<TResult> {
  return unstable_cache(fn, ["vendor-products", vendorId], {
    tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId)],
    revalidate: CACHE_DURATION.VENDOR_PRODUCTS,
  });
}

/**
 * Cache for vendor stats queries.
 * Tags: vendor:stats:{vendorId}
 */
export function cacheVendorStats<TResult>(
  fn: () => Promise<TResult>,
  vendorId: string
): () => Promise<TResult> {
  return unstable_cache(fn, ["vendor-stats", vendorId], {
    tags: [CACHE_TAGS.VENDOR_STATS(vendorId)],
    revalidate: CACHE_DURATION.VENDOR_STATS,
  });
}

// ============================================================================
// Admin
// ============================================================================

/**
 * Cache for admin stats queries.
 * Tags: admin:stats
 */
export function cacheAdminStats<TResult>(
  fn: () => Promise<TResult>
): () => Promise<TResult> {
  return unstable_cache(fn, ["admin-stats"], {
    tags: [CACHE_TAGS.ADMIN_STATS],
    revalidate: CACHE_DURATION.ADMIN_STATS,
  });
}
