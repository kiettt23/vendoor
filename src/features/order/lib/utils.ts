import type { CartItem } from "@/features/cart/types";
import type { CreateOrderData, CreateOrderItem } from "../types";
import {
  SHIPPING_FEE_PER_VENDOR,
  PLATFORM_FEE_RATE,
} from "@/features/cart/lib/utils";

// ============================================
// ORDER CALCULATIONS
// ============================================

/**
 * Generate unique order number
 *
 * Format: ORD-YYYYMMDD-RANDOM6
 * Example: ORD-20251115-A3F2X1
 *
 * **Why this format:**
 * - ORD prefix: Easy to identify
 * - Date: Sortable, easy to find orders by date
 * - Random: Avoid sequential guessing (security)
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Generate 6 random alphanumeric characters
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Format price to Vietnamese currency
 *
 * @param price - Price in VND
 * @returns Formatted price string (VD: "1.000.000₫")
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("vi-VN")}₫`;
}

/**
 * Calculate commission for an order
 *
 * **Commission structure:**
 * - Platform fee: 2% of subtotal
 * - Vendor revenue: totalAmount - platformFee
 *
 * **Why subtotal not totalAmount:**
 * - Commission on product value only
 * - Shipping fee goes to vendor (delivery cost)
 * - Fair for vendors
 *
 * @param subtotal - Sum of all items (price * quantity)
 * @returns Platform fee amount
 */
export function calculateCommission(subtotal: number): number {
  return Math.round(subtotal * PLATFORM_FEE_RATE);
}

/**
 * Convert cart items to order items
 *
 * **Why snapshot data:**
 * - Price may change after order
 * - Order record should be immutable
 * - Customer pays what they saw at checkout
 *
 * @param cartItems - Items from cart
 * @returns Order items with snapshot data
 */
export function cartItemsToOrderItems(
  cartItems: CartItem[]
): CreateOrderItem[] {
  return cartItems.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    variantId: item.variantId,
    variantName: item.variantName,
    price: item.price, // Snapshot price
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));
}

/**
 * Prepare order data for vendor group
 *
 * **1 Order = 1 Vendor rule:**
 * - Each vendor gets separate order
 * - Separate order number
 * - Separate commission calculation
 * - Separate payment tracking
 *
 * @param vendorId - Vendor ID
 * @param items - Cart items for this vendor
 * @param customerId - Customer ID from session
 * @param shippingInfo - Shipping address
 * @returns Order creation data
 */
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
): CreateOrderData {
  // Convert cart items to order items
  const orderItems = cartItemsToOrderItems(items);

  // Calculate amounts
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = SHIPPING_FEE_PER_VENDOR;
  const platformFee = calculateCommission(subtotal);
  const platformFeeRate = PLATFORM_FEE_RATE;
  const vendorEarnings = subtotal - platformFee;
  const total = subtotal + shippingFee; // MVP: no tax

  return {
    vendorId,
    customerId,
    items: orderItems,

    // Shipping info
    shippingName: shippingInfo.name,
    shippingPhone: shippingInfo.phone,
    shippingAddress: shippingInfo.address,
    shippingWard: shippingInfo.ward,
    shippingDistrict: shippingInfo.district,
    shippingCity: shippingInfo.city,
    note: shippingInfo.note,

    // Amounts
    subtotal,
    shippingFee,
    platformFee,
    platformFeeRate,
    vendorEarnings,
    total,
  };
}

/**
 * Validate order status transition
 *
 * **Status flow:**
 * ```
 * PENDING_PAYMENT (payment not done, can't update)
 *       ↓
 * PENDING (paid, vendor can process)
 *       ↓
 * PROCESSING (vendor preparing)
 *       ↓
 * SHIPPED (in delivery)
 *       ↓
 * DELIVERED (completed)
 *
 * CANCELLED (from PENDING/PROCESSING only)
 * REFUNDED (from DELIVERED only)
 * ```
 *
 * @param currentStatus - Current order status
 * @param newStatus - Desired new status
 * @returns Validation result with message
 */
export function validateStatusTransition(
  currentStatus: string,
  newStatus: string
): { isValid: boolean; message?: string } {
  // Can't update if waiting for payment
  if (currentStatus === "PENDING_PAYMENT") {
    return {
      isValid: false,
      message: "Không thể cập nhật đơn hàng đang chờ thanh toán",
    };
  }

  // Valid transitions
  const validTransitions: Record<string, string[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: [], // Final state
    REFUNDED: [], // Final state
  };

  const allowedStatuses = validTransitions[currentStatus] || [];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      isValid: false,
      message: `Không thể chuyển từ ${currentStatus} sang ${newStatus}`,
    };
  }

  return { isValid: true };
}

/**
 * Format full shipping address
 *
 * @returns Formatted address string
 */
export function formatShippingAddress(order: {
  shippingAddress: string;
  shippingWard: string;
  shippingDistrict: string;
  shippingCity: string;
}): string {
  return `${order.shippingAddress}, ${order.shippingWard}, ${order.shippingDistrict}, ${order.shippingCity}`;
}
