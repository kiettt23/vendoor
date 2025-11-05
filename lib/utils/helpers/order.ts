// Order status utilities

import { vi } from "@/lib/i18n";

export type OrderStatus =
  | "ORDER_PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// Map order status to Vietnamese text
export function getOrderStatusText(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    ORDER_PLACED: vi.order.orderPlaced,
    PROCESSING: vi.order.processing,
    SHIPPED: vi.order.shipped,
    DELIVERED: vi.order.delivered,
    CANCELLED: vi.order.cancelled,
  };
  return statusMap[status] || status;
}

// Get status color for UI
export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    ORDER_PLACED: "text-blue-600 bg-blue-50",
    PROCESSING: "text-yellow-600 bg-yellow-50",
    SHIPPED: "text-purple-600 bg-purple-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
  };
  return colorMap[status] || "text-gray-600 bg-gray-50";
}

// Check if order can be cancelled
export function canCancelOrder(status: OrderStatus): boolean {
  return status === "ORDER_PLACED" || status === "PROCESSING";
}

// Get next possible statuses
export function getNextOrderStatuses(
  currentStatus: OrderStatus
): OrderStatus[] {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    ORDER_PLACED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };
  return transitions[currentStatus] || [];
}
