"use server";

import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import type { OrderStatus } from "@prisma/client";

/**
 * Get vendor orders with pagination and filtering
 *
 * **Features:**
 * - Fetch orders for current vendor only (WHERE vendorId = session.vendorId)
 * - Pagination support
 * - Filter by status (optional)
 * - Sort by createdAt (newest first)
 *
 * **Security:**
 * - Only returns orders belonging to current vendor
 * - Checks vendorProfile existence to verify user is a vendor
 *
 * **Returns:**
 * - Array of orders with customer and item count
 * - Total count for pagination
 */

export interface VendorOrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: Date;
  customer: {
    name: string;
    email: string;
  };
  shippingInfo: {
    name: string;
    phone: string;
    city: string | null;
  };
}

export interface GetVendorOrdersResult {
  orders: VendorOrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface GetVendorOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export async function getVendorOrders(
  params: GetVendorOrdersParams = {}
): Promise<GetVendorOrdersResult> {
  try {
    // ============================================
    // 1. AUTH CHECK
    // ============================================
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        orders: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false,
      };
    }

    // ============================================
    // 2. CHECK VENDOR PROFILE (determines if user is a vendor)
    // ============================================
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!vendorProfile) {
      // User is not a vendor
      return {
        orders: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false,
      };
    }

    // ============================================
    // 3. PARSE PARAMS
    // ============================================
    const { page = 1, pageSize = 10, status } = params;
    const skip = (page - 1) * pageSize;

    // ============================================
    // 4. BUILD WHERE CLAUSE
    // ============================================
    const whereClause: {
      vendorId: string;
      status?: OrderStatus;
    } = {
      vendorId: vendorProfile.id, // ✅ Security: Only vendor's orders
    };

    // Filter by status if provided
    if (status && status !== "ALL") {
      whereClause.status = status as OrderStatus;
    }

    // ============================================
    // 5. FETCH ORDERS + COUNT
    // ============================================
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          customer: {
            select: {
              name: true,
              email: true,
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

    // ============================================
    // 6. FORMAT RESPONSE
    // ============================================
    const formattedOrders: VendorOrderListItem[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      itemCount: order._count.items,
      createdAt: order.createdAt,
      customer: {
        name: order.customer.name || "Unknown",
        email: order.customer.email || "",
      },
      shippingInfo: {
        name: order.shippingName,
        phone: order.shippingPhone,
        city: order.shippingCity,
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
    console.error("Error fetching vendor orders:", error);
    return {
      orders: [],
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    };
  }
}
