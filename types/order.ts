/**
 * Order Types
 * Đơn hàng
 */
import type { Address } from "./address";
import type { Product } from "./product";
import type { Store } from "./store";
import type { User } from "./user";

/**
 * Order Status Enum
 */
export enum OrderStatus {
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

/**
 * Payment Method Enum
 */
export enum PaymentMethod {
  COD = "COD",
  STRIPE = "STRIPE",
}

/**
 * Order model
 */
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
  coupon: Record<string, any>;
  // Relations
  orderItems?: OrderItem[];
  address?: Address;
  store?: Pick<Store, "id" | "name" | "username">;
  user?: User;
}

/**
 * Order Item - Chi tiết sản phẩm trong đơn hàng
 */
export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  // Relations
  product?: Pick<Product, "id" | "name" | "images" | "price">;
}

/**
 * Order với đầy đủ thông tin
 */
export interface OrderWithDetails extends Order {
  orderItems: (OrderItem & {
    product: Pick<Product, "id" | "name" | "images" | "price">;
  })[];
  address: Address;
  store: Pick<Store, "id" | "name" | "username">;
}

/**
 * Create Order Data
 */
export interface CreateOrderData {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}
