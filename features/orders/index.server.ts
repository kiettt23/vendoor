// Service
export { orderService, OrderService } from "./lib/order.service";

// User Actions
export {
  getOrders,
  getUserOrders,
  applyCoupon,
  createOrder,
  cancelOrder,
} from "./actions/user-order.action";

// Seller Actions
export {
  getOrders as getSellerOrders,
  updateOrderStatus,
} from "./actions/seller-order.action";

// Schemas
export {
  orderSchema,
  orderItemSchema,
  couponCodeSchema,
} from "./schemas/order.schema";

// Types
export type * from "./types/order.types";
export type {
  OrderFormData,
  OrderItemFormData,
  CouponCodeFormData,
} from "./schemas/order.schema";
