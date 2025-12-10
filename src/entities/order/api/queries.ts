import { cache } from "react";

import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";
import type { OrderStatus } from "@/generated/prisma";

// Order Types (query-specific)

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

// Order Queries

/**
 * Lấy danh sách đơn hàng của customer hiện tại
 *
 * @cached React cache cho request deduplication
 */
export const getCustomerOrders = cache(
  async (): Promise<CustomerOrderListItem[]> => {
    const session = await getSession();
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
);

/**
 * Lấy chi tiết đơn hàng theo ID
 *
 * @cached React cache cho request deduplication
 */
export const getOrderById = cache(async (orderId: string) => {
  const session = await getSession();
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
});

/**
 * Lấy danh sách đơn hàng của vendor
 *
 * @cached React cache cho request deduplication
 */
export const getVendorOrders = cache(async (vendorId: string) => {
  return prisma.order.findMany({
    where: { vendorId },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

/**
 * Lấy chi tiết đơn hàng của vendor
 *
 * @cached React cache cho request deduplication
 */
export const getVendorOrderDetail = cache(
  async (orderId: string, vendorId: string) => {
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
);

/**
 * Lấy danh sách đơn hàng của vendor với pagination và filter
 *
 * @cached React cache cho request deduplication
 */
export const getVendorOrdersPaginated = cache(
  async (
    vendorId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
);

export type VendorOrderItem = Awaited<
  ReturnType<typeof getVendorOrders>
>[number];

export type VendorOrdersPaginated = Awaited<
  ReturnType<typeof getVendorOrdersPaginated>
>;

/**
 * Lấy tất cả đơn hàng (Admin)
 *
 * @cached React cache cho request deduplication
 */
export const getAdminOrders = cache(async (limit = 50) => {
  return prisma.order.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      vendor: { select: { shopName: true } },
      items: { select: { productName: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
});

/**
 * Lấy chi tiết đơn hàng (Admin)
 *
 * @cached React cache cho request deduplication
 */
export const getAdminOrderById = cache(async (orderId: string) => {
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
});
