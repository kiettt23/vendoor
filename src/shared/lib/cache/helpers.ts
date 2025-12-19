/**
 * Cache Helpers
 *
 * Generic functions for creating cached queries.
 */

import { unstable_cache } from "next/cache";
import { cache } from "react";

export type CacheConfig = {
  tags?: string[];
  revalidate?: number;
};

/**
 * Create a cached function with automatic tag management.
 *
 * @example
 * const getCachedProducts = createCachedQuery(
 *   async () => prisma.product.findMany(),
 *   { tags: [CACHE_TAGS.PRODUCTS], revalidate: 3600 }
 * );
 */
export function createCachedQuery<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config: CacheConfig,
  keyParts?: string[]
): (...args: TArgs) => Promise<TResult> {
  return unstable_cache(fn, keyParts, {
    tags: config.tags,
    revalidate: config.revalidate,
  });
}

/**
 * Combine React cache (request dedup) with unstable_cache (cross-request).
 * Best of both worlds: deduplication + persistence.
 *
 * @example
 * const getCategories = createDualCache(
 *   async () => prisma.category.findMany(),
 *   { tags: ["categories"], revalidate: 3600 }
 * );
 */
export function createDualCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config: CacheConfig,
  keyParts?: string[]
): (...args: TArgs) => Promise<TResult> {
  // First wrap with unstable_cache for cross-request caching
  const serverCached = unstable_cache(fn, keyParts, {
    tags: config.tags,
    revalidate: config.revalidate,
  });

  // Then wrap with React cache for request deduplication
  return cache(serverCached);
}

/**
 * Request-level deduplication using React cache.
 * Use for queries that should be deduplicated within a single request
 * but not cached across requests.
 */
export { cache as requestCache };
