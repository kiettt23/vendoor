import type {
  OrderModel,
  OrderItemModel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/generated/prisma";

export type Order = OrderModel;
export type OrderItem = OrderItemModel;
export type { OrderStatus, PaymentStatus, PaymentMethod };

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

export interface CustomerOrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  vendor: { shopName: string };
  items: { productName: string; quantity: number }[];
  itemCount: number;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  total: number;
  status: OrderStatus;
}

/** Discriminated union cho type-safe error handling */
export type CreateOrdersResult =
  | {
      success: true;
      orders: CreatedOrder[];
      paymentId: string;
      totalAmount: number;
    }
  | {
      success: false;
      orders: [];
      totalAmount: 0;
      error: string;
    };

