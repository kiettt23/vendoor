/**
 * Order Types
 *
 * Tận dụng Prisma generated types cho base models.
 */

import type {
  OrderModel,
  OrderItemModel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/generated/prisma";

// ============================================
// Base Types (từ Prisma Generated)
// ============================================

/**
 * Base Order type từ database
 */
export type Order = OrderModel;

/**
 * Base OrderItem type từ database
 */
export type OrderItem = OrderItemModel;

// Re-export enums for convenience
export type { OrderStatus, PaymentStatus, PaymentMethod };

// ============================================
// Derived Types (cho specific use cases)
// ============================================

/**
 * Order item cho danh sách customer (optimized)
 */
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
