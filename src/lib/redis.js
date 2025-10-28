/**
 * Redis Client Configuration
 *
 * Uses Upstash Redis (serverless Redis)
 * - Free tier: 10,000 commands/day, 256MB storage
 * - REST API (perfect for serverless/edge)
 * - Auto-scaling, no maintenance
 */

import { Redis } from "@upstash/redis";

/**
 * Redis client instance
 * Automatically reads from environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export const redis = Redis.fromEnv();

/**
 * Test Redis connection
 * Usage: await testRedisConnection()
 */
export async function testRedisConnection() {
  try {
    await redis.ping();
    console.log("✅ Redis connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    return false;
  }
}
