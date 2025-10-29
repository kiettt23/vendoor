/**
 * Cache Helper Functions
 * Provides caching utilities with automatic error handling and logging.
 */

import { redis } from "./redis";
import { cache as logCache, error as logError } from "./utils/logger";

export async function getCache(key) {
  try {
    const data = await redis.get(key);

    if (!data) {
      logCache(`❌ CACHE MISS: ${key}`);
      return null;
    }

    logCache(`✅ CACHE HIT: ${key}`);
    return data;
  } catch (error) {
    logError(`Cache GET error for key "${key}":`, error.message);
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 300) {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
    logCache(`💾 CACHE SET: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (error) {
    logError(`Cache SET error for key "${key}":`, error.message);
    return false;
  }
}

export async function deleteCache(key) {
  try {
    await redis.del(key);
    logCache(`🗑️  CACHE DELETE: ${key}`);
    return true;
  } catch (error) {
    logError(`Cache DELETE error for key "${key}":`, error.message);
    return false;
  }
}

export async function deleteCacheMultiple(keys) {
  try {
    if (keys.length === 0) return true;

    await redis.del(...keys);
    logCache(`🗑️  CACHE DELETE MULTIPLE: ${keys.join(", ")}`);
    return true;
  } catch (error) {
    logError("Cache DELETE MULTIPLE error:", error.message);
    return false;
  }
}

export async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);

    if (keys.length === 0) {
      logCache(`No keys found for pattern: ${pattern}`);
      return true;
    }

    await redis.del(...keys);
    logCache(`🗑️  CACHE DELETE PATTERN: ${pattern} (${keys.length} keys)`);
    return true;
  } catch (error) {
    logError(`Cache DELETE PATTERN error for "${pattern}":`, error.message);
    return false;
  }
}

export async function getCacheOrFetch(key, fetchFn, ttlSeconds = 300) {
  try {
    const cached = await getCache(key);
    if (cached !== null) return cached;

    logCache(`🔄 Fetching fresh data for: ${key}`);
    const data = await fetchFn();

    await setCache(key, data, ttlSeconds);
    return data;
  } catch (error) {
    logError(`getCacheOrFetch error for "${key}":`, error.message);
    throw error;
  }
}

export async function invalidateCaches(keys) {
  return deleteCacheMultiple(keys);
}
