import type { CartItem } from "@/entities/cart";
import { SHIPPING_FEE_PER_VENDOR, PLATFORM_FEE_RATE } from "@/entities/cart";

export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

export function calculateCommission(subtotal: number): number {
  return Math.round(subtotal * PLATFORM_FEE_RATE);
}

export function prepareOrderData(
  vendorId: string,
  items: CartItem[],
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
  const shippingFee = SHIPPING_FEE_PER_VENDOR;
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
    platformFeeRate: PLATFORM_FEE_RATE,
    vendorEarnings,
    total,
  };
}

export function validateStatusTransition(currentStatus: string, newStatus: string) {
  if (currentStatus === "PENDING_PAYMENT") {
    return { isValid: false, message: "Không thể cập nhật đơn hàng đang chờ thanh toán" };
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
    return { isValid: false, message: `Không thể chuyển từ ${currentStatus} sang ${newStatus}` };
  }
  return { isValid: true };
}

export function formatShippingAddress(order: {
  shippingAddress: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingCity?: string | null;
}): string {
  return [order.shippingAddress, order.shippingWard, order.shippingDistrict, order.shippingCity]
    .filter(Boolean)
    .join(", ");
}

