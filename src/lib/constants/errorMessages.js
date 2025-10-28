/**
 * Centralized error messages for the application
 * Benefits:
 * - Consistency across all API routes
 * - Easy to maintain and update
 * - i18n ready for future multi-language support
 * - Prevents typos in error messages
 */

export const ERROR_MESSAGES = {
  // Authentication & Authorization
  UNAUTHORIZED: "Not authorized",
  INVALID_CREDENTIALS: "Invalid credentials",
  ACCESS_DENIED: "Access denied",

  // Order Errors
  MISSING_ORDER_DETAILS: "Missing order details",
  ORDER_NOT_FOUND: "Order not found",
  ORDER_CREATION_FAILED: "Failed to create order",

  // Coupon Errors
  COUPON_NOT_FOUND: "Coupon not found",
  COUPON_FOR_NEW_USERS: "This coupon is only valid for new users",
  COUPON_FOR_MEMBERS: "This coupon is only valid for members",
  COUPON_EXPIRED: "Coupon has expired",
  COUPON_ALREADY_USED: "Coupon has already been used",

  // Product Errors
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_OUT_OF_STOCK: "Product is out of stock",
  MISSING_PRODUCT_DETAILS: "Missing product details",
  PRODUCT_ALREADY_RATED: "Product already rated",
  MISSING_PRODUCT_ID: "Missing details: productId",

  // Store Errors
  STORE_NOT_FOUND: "Store not found",
  MISSING_STORE_INFO: "Missing store info",
  USERNAME_ALREADY_TAKEN: "Username already taken",
  MISSING_USERNAME: "Missing username",
  MISSING_STORE_ID: "Missing storeId",

  // Payment Errors
  PAYMENT_FAILED: "Payment processing failed",
  INVALID_PAYMENT_METHOD: "Invalid payment method",

  // General Errors
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  INVALID_REQUEST: "Invalid request",
  MISSING_REQUIRED_FIELDS: "Missing required fields",
};

/**
 * Error codes for programmatic error handling
 * Use these on frontend to handle specific errors
 */
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  MISSING_FIELDS: "MISSING_FIELDS",
  COUPON_NOT_FOUND: "COUPON_NOT_FOUND",
  COUPON_INVALID: "COUPON_INVALID",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};
