/**
 * Order Types
 */

import type { Address } from "@/features/address/types/address.types";

export enum OrderStatus {
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  STRIPE = "STRIPE",
}

export interface OrderStore {
  id: string;
  name: string;
  username: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  images: string[];
  price: number;
}

export interface OrderCoupon {
  code?: string;
  discount?: number;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  storeId: string;
  addressId: string;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  createdAt: Date | string;
  updatedAt: Date | string;
  isCouponUsed: boolean;
  coupon: OrderCoupon;
  orderItems?: OrderItem[];
  address?: Address;
  store?: OrderStore;
}

export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: OrderProduct;
}

export interface OrderWithDetails extends Order {
  orderItems: (OrderItem & {
    product: OrderProduct;
  })[];
  address: Address;
  store: OrderStore;
}

export interface CreateOrderData {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface CouponActionResponse {
  success: boolean;
  error?: string;
  coupon?: OrderCoupon;
}
