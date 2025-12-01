/**
 * Order Constants
 */
export const ORDER = {
  PLATFORM_FEE_RATE: 0.02, // 2% platform commission
  SHIPPING_FEE_PER_VENDOR: 30_000, // 30k VND per vendor
  MIN_ORDER_AMOUNT: 10000, // 10,000 VND
  MAX_ITEMS_PER_ORDER: 100,
} as const;

/**
 * Vendor Business Constants
 */
export const VENDOR = {
  DEFAULT_COMMISSION_RATE: 0.1, // 10% vendor commission
  MIN_SHOP_NAME_LENGTH: 3,
  MAX_SHOP_NAME_LENGTH: 100,
} as const;

/**
 * Status values
 */
export const STATUS = {
  ORDER: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },
  VENDOR: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },
  PRODUCT: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
  },
} as const;
