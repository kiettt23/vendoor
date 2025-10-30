import { redis } from "./redis";

export async function getCache(key) {
  try {
    const data = await redis.get(key);

    if (!data) {
      console.log(`❌ CACHE MISS: ${key}`);
      return null;
    }

    console.log(`✅ CACHE HIT: ${key}`);
    return data;
  } catch (error) {
    console.error(`Cache GET error for key "${key}":`, error.message);
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 300) {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
    console.log(`💾 CACHE SET: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (error) {
    console.error(`Cache SET error for key "${key}":`, error.message);
    return false;
  }
}

export async function deleteCache(key) {
  try {
    await redis.del(key);
    console.log(`🗑️  CACHE DELETE: ${key}`);
    return true;
  } catch (error) {
    console.error(`Cache DELETE error for key "${key}":`, error.message);
    return false;
  }
}

export async function deleteCacheMultiple(keys) {
  try {
    if (keys.length === 0) return true;

    await redis.del(...keys);
    console.log(`🗑️  CACHE DELETE MULTIPLE: ${keys.join(", ")}`);
    return true;
  } catch (error) {
    console.error("Cache DELETE MULTIPLE error:", error.message);
    return false;
  }
}

export async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);

    if (keys.length === 0) {
      console.log(`No keys found for pattern: ${pattern}`);
      return true;
    }

    await redis.del(...keys);
    console.log(`🗑️  CACHE DELETE PATTERN: ${pattern} (${keys.length} keys)`);
    return true;
  } catch (error) {
    console.error(
      `Cache DELETE PATTERN error for "${pattern}":`,
      error.message
    );
    return false;
  }
}

export async function getCacheOrFetch(key, fetchFn, ttlSeconds = 300) {
  try {
    const cached = await getCache(key);
    if (cached !== null) return cached;

    console.log(`🔄 Fetching fresh data for: ${key}`);
    const data = await fetchFn();

    await setCache(key, data, ttlSeconds);
    return data;
  } catch (error) {
    console.error(`getCacheOrFetch error for "${key}":`, error.message);
    throw error;
  }
}

export async function invalidateCaches(keys) {
  return deleteCacheMultiple(keys);
}
