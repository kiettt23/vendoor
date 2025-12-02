"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";
import type { OrderStatus } from "@/generated/prisma/client/enums";

// ============================================
// Order Types (query-specific)
// ============================================

export interface CustomerOrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  vendor: { shopName: string };
  items: { productName: string; quantity: number }[];
  itemCount: number;
}

// ============================================
// Order Queries
// ============================================

/**
 * Lấy danh sách đơn hàng của customer hiện tại
 */
export async function getCustomerOrders(): Promise<CustomerOrderListItem[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      vendor: { select: { shopName: true } },
      items: { select: { productName: true, quantity: true }, take: 2 },
      _count: { select: { items: true } },
    },
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

/**
 * Lấy chi tiết đơn hàng theo ID
 */
export async function getOrderById(orderId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  return prisma.order.findFirst({
    where: { id: orderId, customerId: session.user.id },
    include: {
      vendor: { select: { shopName: true } },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { order: "asc" } } },
              },
            },
          },
        },
      },
      payment: true,
    },
  });
}

/**
 * Lấy danh sách đơn hàng của vendor
 */
export async function getVendorOrders(vendorId: string) {
  return prisma.order.findMany({
    where: { vendorId },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Lấy chi tiết đơn hàng của vendor
 */
export async function getVendorOrderDetail(orderId: string, vendorId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, vendorId },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { order: "asc" } } },
              },
            },
          },
        },
      },
      payment: true,
    },
  });
}

/**
 * Lấy danh sách đơn hàng của vendor với pagination và filter
 */
export async function getVendorOrdersPaginated(
  vendorId: string,
  options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}
) {
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
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export type VendorOrderItem = Awaited<
  ReturnType<typeof getVendorOrders>
>[number];

export type VendorOrdersPaginated = Awaited<
  ReturnType<typeof getVendorOrdersPaginated>
>;

/**
 * Lấy tất cả đơn hàng (Admin)
 */
export async function getAdminOrders(limit = 50) {
  return prisma.order.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      vendor: { select: { shopName: true } },
      items: { select: { productName: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Lấy chi tiết đơn hàng (Admin)
 */
export async function getAdminOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      vendor: { select: { id: true, shopName: true, slug: true } },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { order: "asc" } } },
              },
            },
          },
        },
      },
      payment: true,
    },
  });
}
