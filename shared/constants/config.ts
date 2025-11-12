/**
 * Application Configuration
 */
export const APP_CONFIG = {
  // App info
  APP_NAME: "Vendoor",
  APP_DESCRIPTION: "Nền tảng thương mại điện tử đa nhà cung cấp",

  // Shipping
  SHIPPING_FEE: 30000, // VND
  FREE_SHIPPING_FOR_PLUS: true,

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,

  // File upload
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],

  // Business rules
  MIN_ORDER_VALUE: 0,
  MAX_DISCOUNT_PERCENT: 100,

  // Contact
  CONTACT_EMAIL: "support@vendoor.com",
  CONTACT_PHONE: "0123 456 789",
  CONTACT_ADDRESS: "123 Đường ABC, Quận 1, TP.HCM",
} as const;
