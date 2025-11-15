// ============================================
// ORDER TYPES
// ============================================

import type { OrderStatus, PaymentMethod } from "@prisma/client";

/**
 * Checkout form data
 * - Address information for shipping
 * - Phone for delivery contact
 */
export interface CheckoutFormData {
  // Contact Info
  name: string;
  phone: string;
  email: string;

  // Address
  address: string; // Street address
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Tỉnh/Thành phố

  // Optional
  note?: string; // Ghi chú cho người bán
}

/**
 * Order item for creation
 * - Snapshot data at time of order
 */
export interface CreateOrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string | null;
  price: number; // Price at time of order (snapshot)
  quantity: number;
  subtotal: number; // price * quantity
}

/**
 * Single order creation data (1 order per vendor)
 */
export interface CreateOrderData {
  // Vendor
  vendorId: string;

  // Customer (from session)
  customerId: string;

  // Items
  items: CreateOrderItem[];

  // Shipping address
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingWard: string;
  shippingDistrict: string;
  shippingCity: string;

  // Amounts
  subtotal: number; // Sum of items
  shippingFee: number; // Per vendor shipping
  platformFee: number; // Platform commission
  platformFeeRate: number; // Commission rate (e.g., 0.02 = 2%)
  vendorEarnings: number; // subtotal - platformFee
  total: number; // subtotal + shippingFee + tax

  // Optional
  note?: string;
}

/**
 * Result after creating orders
 */
export interface CreateOrdersResult {
  success: boolean;
  orders: {
    id: string;
    orderNumber: string;
    vendorId: string;
    vendorName: string;
    total: number;
    status: OrderStatus;
  }[];
  paymentId?: string;
  totalAmount: number;
  error?: string;
}

/**
 * Order summary for display
 */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  vendor: {
    id: string;
    shopName: string;
  };
  items: {
    productName: string;
    variantName: string | null;
    quantity: number;
    price: number;
  }[];
}

/**
 * Payment creation data
 */
export interface CreatePaymentData {
  orderIds: string[]; // All order IDs for this checkout
  totalAmount: number;
  method: PaymentMethod;
  customerId: string;
}

/**
 * Payment result
 */
export interface PaymentResult {
  success: boolean;
  paymentId: string;
  paymentUrl?: string; // For redirect to VNPay
  error?: string;
}
