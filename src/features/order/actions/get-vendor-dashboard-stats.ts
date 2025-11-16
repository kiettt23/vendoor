"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";

// ============================================
// GET VENDOR DASHBOARD STATS
// ============================================

/**
 * Get vendor dashboard statistics
 *
 * **Features:**
 * - Total orders count (all time)
 * - Total revenue (vendor earnings)
 * - Pending orders count (need action)
 * - Revenue this month
 * - Recent 5 orders
 *
 * **Security:**
 * - Only vendor can access their own stats
 */

export interface VendorDashboardStats {
  totalOrders: number;
  totalRevenue: number; // All-time vendor earnings
  pendingOrders: number; // PENDING + PROCESSING status
  revenueThisMonth: number; // Current month vendor earnings
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    vendorEarnings: number;
    customerName: string;
    createdAt: Date;
  }>;
}

export async function getVendorDashboardStats(): Promise<
  | { success: true; data: VendorDashboardStats }
  | { success: false; error: string }
> {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Check VENDOR role
    if (!session.user.roles?.includes("VENDOR")) {
      return {
        success: false,
        error: "Chỉ vendor mới có thể xem dashboard",
      };
    }

    // Get vendor profile
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!vendorProfile) {
      return {
        success: false,
        error: "Vendor profile không tồn tại",
      };
    }

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Fetch stats in parallel
    const [
      totalOrders,
      totalRevenueResult,
      pendingOrders,
      revenueThisMonthResult,
      recentOrders,
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({
        where: { vendorId: vendorProfile.id },
      }),

      // Total revenue (sum of vendorEarnings for all completed orders)
      prisma.order.aggregate({
        where: {
          vendorId: vendorProfile.id,
          status: {
            in: ["DELIVERED"], // Only count delivered orders
          },
        },
        _sum: {
          vendorEarnings: true,
        },
      }),

      // Pending orders (need vendor action)
      prisma.order.count({
        where: {
          vendorId: vendorProfile.id,
          status: {
            in: ["PENDING", "PROCESSING"],
          },
        },
      }),

      // Revenue this month
      prisma.order.aggregate({
        where: {
          vendorId: vendorProfile.id,
          status: "DELIVERED",
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          vendorEarnings: true,
        },
      }),

      // Recent 5 orders
      prisma.order.findMany({
        where: { vendorId: vendorProfile.id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          vendorEarnings: true,
          createdAt: true,
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const stats: VendorDashboardStats = {
      totalOrders,
      totalRevenue: totalRevenueResult._sum.vendorEarnings || 0,
      pendingOrders,
      revenueThisMonth: revenueThisMonthResult._sum.vendorEarnings || 0,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        vendorEarnings: order.vendorEarnings,
        customerName: order.customer.name || order.customer.email,
        createdAt: order.createdAt,
      })),
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Failed to get vendor dashboard stats:", error);
    return {
      success: false,
      error: "Không thể tải thông tin dashboard",
    };
  }
}
