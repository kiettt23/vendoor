"use server";

import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("OrderActions");

/**
 * Get customer orders with pagination
 *
 * **Features:**
 * - Fetch orders for current user
 * - Pagination support
 * - Filter by status (optional)
 * - Sort by createdAt (newest first)
 *
 * **Returns:**
 * - Array of orders with vendor and item count
 * - Total count for pagination
 */

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: Date;
  vendor: {
    shopName: string;
    slug: string;
  };
}

export interface GetCustomerOrdersResult {
  orders: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface GetCustomerOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export async function getCustomerOrders(
  params: GetCustomerOrdersParams = {}
): Promise<GetCustomerOrdersResult> {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        orders: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false,
      };
    }

    // 2. Parse params
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // 3. Build where clause
    const whereClause = {
      customerId: session.user.id,
      ...(params.status && { status: params.status as OrderStatus }),
    };

    // 4. Fetch orders with count
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          vendor: {
            select: {
              shopName: true,
              slug: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    // 5. Format response
    const formattedOrders: OrderListItem[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      itemCount: order._count.items,
      createdAt: order.createdAt,
      vendor: {
        shopName: order.vendor.shopName,
        slug: order.vendor.slug,
      },
    }));

    return {
      orders: formattedOrders,
      total,
      page,
      pageSize,
      hasMore: skip + orders.length < total,
    };
  } catch (error) {
    logger.error("Action failed", error);
    return {
      orders: [],
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    };
  }
}
