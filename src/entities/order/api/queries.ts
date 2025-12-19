import { cache } from "react";

import { getSession } from "@/shared/lib/auth/session";
import {
  prisma,
  orderListInclude,
  orderDetailInclude,
  vendorOrderListInclude,
  vendorOrderDetailInclude,
  adminOrderListInclude,
  adminOrderDetailInclude,
} from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";
import type { OrderStatus, CustomerOrderListItem } from "../model/types";

// ============================================================================
// Types
// ============================================================================

export type VendorOrderItem = Awaited<
  ReturnType<typeof getVendorOrders>
>[number];
export type VendorOrdersPaginated = Awaited<
  ReturnType<typeof getVendorOrdersPaginated>
>;

// ============================================================================
// Customer Queries
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - NO cross-request cache (unstable_cache) for order data
//
// Why NO cross-request cache?
// - User-specific data (customerId filter) - different per user
// - Orders change frequently (new orders, status updates)
// - Fresh data critical for order tracking
// - Using only cache() for request deduplication is sufficient

export const getCustomerOrders = cache(
  async (): Promise<CustomerOrderListItem[]> => {
    const session = await getSession();
    if (!session?.user) return [];

    const orders = await prisma.order.findMany({
      where: { customerId: session.user.id },
      include: orderListInclude,
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      vendor: order.vendor,
      items: order.items,
      itemCount: order._count.items,
    }));
  }
);

export const getOrderById = cache(async (orderId: string) => {
  const session = await getSession();
  if (!session?.user) return null;

  return prisma.order.findFirst({
    where: { id: orderId, customerId: session.user.id },
    include: orderDetailInclude,
  });
});

// ============================================================================
// Vendor Queries
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - NO cross-request cache for vendor orders (same reason as customer orders)
//
// Why NO cross-request cache?
// - Vendor-specific data (vendorId filter) - different per vendor
// - Order status changes frequently - vendors need real-time updates
// - Critical for vendor operations (fulfillment, tracking)

export const getVendorOrders = cache(async (vendorId: string) => {
  return prisma.order.findMany({
    where: { vendorId },
    include: vendorOrderListInclude,
    orderBy: { createdAt: "desc" },
  });
});

export const getVendorOrderDetail = cache(
  async (orderId: string, vendorId: string) => {
    return prisma.order.findFirst({
      where: { id: orderId, vendorId },
      include: vendorOrderDetailInclude,
    });
  }
);

export const getVendorOrdersPaginated = cache(
  async (
    vendorId: string,
    options: { page?: number; limit?: number; status?: string } = {}
  ) => {
    const { page = 1, limit = LIMITS.ORDERS_PER_PAGE, status } = options;

    const where = {
      vendorId,
      ...(status ? { status: status as OrderStatus } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { name: true, email: true } },
          items: { select: { productName: true, quantity: true }, take: 2 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
);

// ============================================================================
// Admin Queries
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - NO cross-request cache for admin order queries
//
// Why NO cross-request cache?
// - Admin needs real-time order data across ALL vendors/customers
// - Orders constantly being created and updated system-wide
// - Admin dashboard must show latest state for management decisions

export const getAdminOrders = cache(async (limit = 50) => {
  return prisma.order.findMany({
    include: adminOrderListInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
});

export const getAdminOrderById = cache(async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: adminOrderDetailInclude,
  });
});
