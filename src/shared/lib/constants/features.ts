/**
 * Feature flags (for gradual rollout)
 */
export const FEATURE_FLAGS = {
  ENABLE_VNPAY: true,
  ENABLE_REVIEWS: false, // Not implemented yet
  ENABLE_WISHLIST: false, // Not implemented yet
  ENABLE_CHAT: false, // Not implemented yet
} as const;
