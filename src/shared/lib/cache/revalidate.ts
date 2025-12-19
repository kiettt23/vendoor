/**
 * Cache Revalidation Utilities
 *
 * Centralized functions for invalidating cached data.
 * Used after mutations to ensure fresh data.
 * 
 * Next.js 16+ requires a profile as second argument:
 * - "max": stale-while-revalidate (recommended)
 * - { expire: 0 }: immediate expiration
 */

import { revalidateTag, revalidatePath } from "next/cache";

import { CACHE_TAGS } from "../constants/cache";

// Default profile for revalidation
const REVALIDATE_PROFILE = "max" as const;

/**
 * Revalidate all product-related caches
 * Use after: create/update/delete product
 */
export function revalidateProducts() {
  revalidateTag(CACHE_TAGS.PRODUCTS, REVALIDATE_PROFILE);
}

/**
 * Revalidate specific product cache
 * Use after: update product details
 */
export function revalidateProduct(slug: string) {
  revalidateTag(CACHE_TAGS.PRODUCT(slug), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.PRODUCTS, REVALIDATE_PROFILE);
}

/**
 * Revalidate products by category
 * Use after: move product to different category
 */
export function revalidateProductsByCategory(categorySlug: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_CATEGORY(categorySlug), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.PRODUCTS, REVALIDATE_PROFILE);
}

/**
 * Revalidate products by vendor
 * Use after: vendor updates products
 */
export function revalidateProductsByVendor(vendorId: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.PRODUCTS, REVALIDATE_PROFILE);
}

/**
 * Revalidate all category-related caches
 * Use after: create/update/delete category
 */
export function revalidateCategories() {
  revalidateTag(CACHE_TAGS.CATEGORIES, REVALIDATE_PROFILE);
}

/**
 * Revalidate specific category cache
 */
export function revalidateCategory(slug: string) {
  revalidateTag(CACHE_TAGS.CATEGORY(slug), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.CATEGORIES, REVALIDATE_PROFILE);
}

/**
 * Revalidate vendor-related caches
 * Use after: update vendor profile
 */
export function revalidateVendor(slug: string) {
  revalidateTag(CACHE_TAGS.VENDOR(slug), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.VENDORS, REVALIDATE_PROFILE);
}

/**
 * Revalidate vendor stats cache
 * Use after: new order, order status change
 */
export function revalidateVendorStats(vendorId: string) {
  revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId), REVALIDATE_PROFILE);
}

/**
 * Revalidate all order-related caches
 */
export function revalidateOrders() {
  revalidateTag(CACHE_TAGS.ORDERS, REVALIDATE_PROFILE);
}

/**
 * Revalidate specific order cache
 */
export function revalidateOrder(orderId: string) {
  revalidateTag(CACHE_TAGS.ORDER(orderId), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.ORDERS, REVALIDATE_PROFILE);
}

/**
 * Revalidate orders by user
 * Use after: user creates new order
 */
export function revalidateOrdersByUser(userId: string) {
  revalidateTag(CACHE_TAGS.ORDERS_BY_USER(userId), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.ORDERS, REVALIDATE_PROFILE);
}

/**
 * Revalidate orders by vendor
 * Use after: order assigned to vendor, status change
 */
export function revalidateOrdersByVendor(vendorId: string) {
  revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.ORDERS, REVALIDATE_PROFILE);
}

/**
 * Revalidate product reviews
 * Use after: new review, review approval
 */
export function revalidateReviews(productId: string) {
  revalidateTag(CACHE_TAGS.REVIEWS_BY_PRODUCT(productId), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.REVIEWS, REVALIDATE_PROFILE);
}

/**
 * Revalidate admin stats
 * Use after: any significant data change
 */
export function revalidateAdminStats() {
  revalidateTag(CACHE_TAGS.ADMIN_STATS, REVALIDATE_PROFILE);
}

/**
 * Revalidate admin vendors list
 * Use after: vendor status change, new vendor
 */
export function revalidateAdminVendors() {
  revalidateTag(CACHE_TAGS.ADMIN_VENDORS, REVALIDATE_PROFILE);
}

/**
 * Revalidate user profile
 */
export function revalidateUserProfile(userId: string) {
  revalidateTag(CACHE_TAGS.USER_PROFILE(userId), REVALIDATE_PROFILE);
}

/**
 * Bulk revalidation for complex operations
 */
export const revalidateBulk = {
  /**
   * After order creation
   * Affects: orders, vendor stats, admin stats, stock
   */
  afterOrderCreate: (userId: string, vendorIds: string[]) => {
    revalidateOrdersByUser(userId);
    vendorIds.forEach((vendorId) => {
      revalidateOrdersByVendor(vendorId);
      revalidateVendorStats(vendorId);
    });
    revalidateAdminStats();
    revalidateProducts(); // Stock changed
  },

  /**
   * After order status change
   */
  afterOrderStatusChange: (orderId: string, vendorId: string) => {
    revalidateOrder(orderId);
    revalidateVendorStats(vendorId);
    revalidateAdminStats();
  },

  /**
   * After product update
   */
  afterProductUpdate: (slug: string, vendorId: string, categorySlug?: string) => {
    revalidateProduct(slug);
    revalidateProductsByVendor(vendorId);
    if (categorySlug) {
      revalidateProductsByCategory(categorySlug);
    }
  },

  /**
   * After vendor approval
   */
  afterVendorApproval: (vendorSlug: string) => {
    revalidateVendor(vendorSlug);
    revalidateAdminVendors();
    revalidateAdminStats();
  },
};

/**
 * Path-based revalidation (use sparingly - prefer tags)
 */
export const revalidatePaths = {
  homepage: () => revalidatePath("/"),
  products: () => revalidatePath("/products"),
  product: (slug: string) => revalidatePath(`/products/${slug}`),
  vendor: (slug: string) => revalidatePath(`/vendors/${slug}`),
  adminDashboard: () => revalidatePath("/admin"),
  vendorDashboard: () => revalidatePath("/vendor"),
};
