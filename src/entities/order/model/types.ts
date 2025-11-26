import type { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  platformFee: number;
  platformFeeRate: number;
  vendorEarnings: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string | null;
  shippingDistrict: string | null;
  shippingWard: string | null;
  trackingNumber: string | null;
  customerNote: string | null;
  vendorNote: string | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantName: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  vendor: { shopName: string };
  items: { productName: string; quantity: number }[];
  _count: { items: number };
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  total: number;
  status: OrderStatus;
}

export interface CreateOrdersResult {
  success: boolean;
  orders: CreatedOrder[];
  paymentId?: string;
  totalAmount: number;
  error?: string;
}

export type { OrderStatus, PaymentStatus, PaymentMethod };

