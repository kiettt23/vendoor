export type {
  Order,
  OrderItem,
  OrderListItem,
  CreatedOrder,
  CreateOrdersResult,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "./model";

export {
  calculateCommission,
  prepareOrderData,
  validateStatusTransition,
  formatShippingAddress,
  formatOrderStatus,
} from "./lib";

export { OrderSummary, OrderStatusBadge } from "./ui";

/**
 * ⚠️ Order API Exports
 *
 * - Actions (updateOrderStatus): Available here
 * - Queries (getCustomerOrders, etc.): Import directly from
 *   "@/entities/order/api/queries" in Server Components only
 */
export { updateOrderStatus, updateOrderStatusAction } from "./api";

export type {
  VendorOrderItem,
  VendorOrdersPaginated,
  CustomerOrderListItem,
} from "./api";
