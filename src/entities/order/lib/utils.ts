import { ORDER } from "@/shared/lib/constants";

/**
 * Cart item shape required for order preparation.
 * Matches CartItem from cart entity but defined here to avoid cross-entity import.
 */
interface OrderableItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
}

/**
 * Calculate platform commission from subtotal
 *
 * @param subtotal - Order subtotal in VND
 * @returns Commission amount rounded to nearest VND
 */
export function calculateCommission(subtotal: number): number {
  return Math.round(subtotal * ORDER.PLATFORM_FEE_RATE);
}

export function prepareOrderData(
  vendorId: string,
  items: OrderableItem[],
  customerId: string,
  shippingInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  }
) {
  const orderItems = items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    variantId: item.variantId,
    variantName: item.variantName,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = ORDER.SHIPPING_FEE_PER_VENDOR;
  const platformFee = calculateCommission(subtotal);
  const vendorEarnings = subtotal - platformFee;
  const total = subtotal + shippingFee;

  return {
    vendorId,
    customerId,
    items: orderItems,
    shippingName: shippingInfo.name,
    shippingPhone: shippingInfo.phone,
    shippingAddress: shippingInfo.address,
    shippingWard: shippingInfo.ward,
    shippingDistrict: shippingInfo.district,
    shippingCity: shippingInfo.city,
    note: shippingInfo.note,
    subtotal,
    shippingFee,
    platformFee,
    platformFeeRate: ORDER.PLATFORM_FEE_RATE,
    vendorEarnings,
    total,
  };
}

export function validateStatusTransition(
  currentStatus: string,
  newStatus: string
) {
  if (currentStatus === "PENDING_PAYMENT") {
    return {
      isValid: false,
      message: "Không thể cập nhật đơn hàng đang chờ thanh toán",
    };
  }

  const validTransitions: Record<string, string[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    return {
      isValid: false,
      message: `Không thể chuyển từ ${currentStatus} sang ${newStatus}`,
    };
  }
  return { isValid: true };
}

export function formatShippingAddress(order: {
  shippingAddress: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingCity?: string | null;
}): string {
  return [
    order.shippingAddress,
    order.shippingWard,
    order.shippingDistrict,
    order.shippingCity,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Format order status in Vietnamese
 *
 * @example
 * formatOrderStatus("PENDING") // "Chờ xác nhận"
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };
  return statusMap[status] || status;
}
