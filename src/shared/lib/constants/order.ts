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

// ============================================
// STATUS DISPLAY CONFIGS (for UI)
// ============================================

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

/**
 * Order status display configuration
 * Used by: order-history-page, order-detail-page, vendor-orders-page, admin-orders-page
 */
export const ORDER_STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "default" },
  PROCESSING: { label: "Đang xử lý", variant: "default" },
  SHIPPED: { label: "Đang giao", variant: "default" },
  DELIVERED: { label: "Đã giao", variant: "outline" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "secondary" },
};

/**
 * Vendor status display configuration
 * Used by: admin-vendors-page, admin-vendor-detail
 */
export const VENDOR_STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  APPROVED: { label: "Đã duyệt", variant: "default" },
  REJECTED: { label: "Từ chối", variant: "destructive" },
  SUSPENDED: { label: "Tạm ngưng", variant: "outline" },
};

/**
 * Helper to get status config with fallback
 */
export function getStatusConfig(
  status: string,
  config: Record<string, StatusConfig>
): StatusConfig {
  return config[status] || { label: status, variant: "secondary" };
}
