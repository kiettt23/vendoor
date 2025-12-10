import type { badgeVariants } from "@/shared/ui/badge";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
}

export const ORDER_STATUS_BADGE: Record<string, BadgeConfig> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "warning-soft" },
  PENDING: { label: "Chờ xử lý", variant: "warning-soft" },
  PROCESSING: { label: "Đang xử lý", variant: "info-soft" },
  SHIPPED: { label: "Đang giao", variant: "info-soft" },
  DELIVERED: { label: "Đã giao", variant: "success-soft" },
  CANCELLED: { label: "Đã hủy", variant: "error-soft" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "secondary" },
};

export const VENDOR_STATUS_BADGE: Record<string, BadgeConfig> = {
  PENDING: { label: "Chờ duyệt", variant: "warning-soft" },
  APPROVED: { label: "Đã duyệt", variant: "success-soft" },
  REJECTED: { label: "Từ chối", variant: "error-soft" },
  SUSPENDED: { label: "Tạm ngưng", variant: "error-soft" },
};

export const PRODUCT_STATUS_BADGE: Record<string, BadgeConfig> = {
  ACTIVE: { label: "Đang bán", variant: "success-soft" },
  INACTIVE: { label: "Ngừng bán", variant: "secondary" },
};

/** Helper để lấy product status badge */
export function getProductStatusBadge(isActive: boolean): BadgeConfig {
  return isActive ? PRODUCT_STATUS_BADGE.ACTIVE : PRODUCT_STATUS_BADGE.INACTIVE;
}

export const STOCK_STATUS_BADGE = {
  IN_STOCK: { label: "Còn hàng", variant: "success-soft" } as BadgeConfig,
  LOW_STOCK: { label: "Sắp hết", variant: "warning-soft" } as BadgeConfig,
  OUT_OF_STOCK: { label: "Hết hàng", variant: "error-soft" } as BadgeConfig,
};

/** Helper để lấy stock status badge */
export function getStockStatusBadge(stock: number, lowThreshold = 10): BadgeConfig {
  if (stock === 0) return STOCK_STATUS_BADGE.OUT_OF_STOCK;
  if (stock <= lowThreshold) return STOCK_STATUS_BADGE.LOW_STOCK;
  return STOCK_STATUS_BADGE.IN_STOCK;
}

export const DISCOUNT_BADGE: BadgeConfig = {
  label: "", // Label được set động (VD: "-20%")
  variant: "destructive",
};

/** Helper để format discount badge */
export function getDiscountBadge(percent: number): BadgeConfig {
  return { label: `-${percent}%`, variant: "destructive" };
}

/** Generic helper để lấy badge config với fallback */
export function getBadgeConfig(
  status: string,
  config: Record<string, BadgeConfig>,
  fallback: BadgeConfig = { label: status, variant: "secondary" }
): BadgeConfig {
  return config[status] || fallback;
}
