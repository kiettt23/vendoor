/**
 * Order API - Barrel Export
 *
 * ⚠️ Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions, types)
 * Server Components: import queries từ "@/entities/order/api/queries"
 */

// Types (safe for client - type-only)
export type {
  VendorOrderItem,
  VendorOrdersPaginated,
  CustomerOrderListItem,
} from "./queries";

// Actions (Server Actions - callable from Client Components)
export { updateOrderStatus, updateOrderStatusAction } from "./actions";
