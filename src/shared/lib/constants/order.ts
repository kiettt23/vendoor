export const ORDER = {
  PLATFORM_FEE_RATE: 0.02, // 2% platform commission
  SHIPPING_FEE_PER_VENDOR: 30_000, // 30k VND per vendor
  MIN_ORDER_AMOUNT: 10000, // 10,000 VND
  MAX_ITEMS_PER_ORDER: 100,
} as const;

export const VENDOR = {
  DEFAULT_COMMISSION_RATE: 0.1, // 10% vendor commission
  MIN_SHOP_NAME_LENGTH: 3,
  MAX_SHOP_NAME_LENGTH: 100,
} as const;

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

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

export const ORDER_STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  PENDING: {
    label: "Chờ xử lý",
    variant: "secondary",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  PROCESSING: {
    label: "Đang xử lý",
    variant: "secondary",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  SHIPPED: {
    label: "Đang giao",
    variant: "secondary",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  DELIVERED: {
    label: "Đã giao",
    variant: "secondary",
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    variant: "secondary",
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    variant: "secondary",
    className: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  },
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

// Helper to get status config with fallback
export function getStatusConfig(
  status: string,
  config: Record<string, StatusConfig>
): StatusConfig {
  return config[status] || { label: status, variant: "secondary" };
}
