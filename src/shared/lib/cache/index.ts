// Generic helpers
export {
  createCachedQuery,
  createDualCache,
  requestCache,
  type CacheConfig,
} from "./helpers";

// Entity-specific wrappers
export {
  cacheQueryWithParams,
  cacheProducts,
  cacheProductDetail,
  cacheCategories,
  cacheVendorProducts,
  cacheVendorStats,
  cacheAdminStats,
} from "./wrappers";

// Revalidation functions
export {
  revalidateProducts,
  revalidateProduct,
  revalidateProductsByCategory,
  revalidateProductsByVendor,
  revalidateCategories,
  revalidateCategory,
  revalidateVendor,
  revalidateVendorStats,
  revalidateOrders,
  revalidateOrder,
  revalidateOrdersByUser,
  revalidateOrdersByVendor,
  revalidateReviews,
  revalidateAdminStats,
  revalidateAdminVendors,
  revalidateUserProfile,
  revalidateBulk,
  revalidatePaths,
} from "./revalidate";
