import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

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
