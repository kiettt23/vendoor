export {
  getOrders,
  getUserOrders,
  applyCoupon,
  placeOrder,
} from "./actions/user-order.action";

export {
  getOrders as getSellerOrders,
  updateOrderStatus,
} from "./actions/seller-order.action";

export type {
  Order,
  OrderItem,
  OrderWithDetails,
  CouponActionResponse,
} from "./types/order.types";

export {
  orderSchema,
  orderItemSchema,
  couponCodeSchema,
  type OrderFormData,
  type OrderItemFormData,
  type CouponCodeFormData,
} from "./schemas/order.schema";
