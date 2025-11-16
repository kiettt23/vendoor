"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

export async function getAdminDashboardStats() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check admin role
  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get current date for "this month" calculations
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Parallel queries for better performance
    const [
      totalVendors,
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      totalProducts,
      totalOrders,
      platformRevenue,
      revenueThisMonth,
    ] = await Promise.all([
      // Total vendors
      prisma.vendorProfile.count(),

      // Pending vendors
      prisma.vendorProfile.count({
        where: { status: "PENDING" },
      }),

      // Approved vendors
      prisma.vendorProfile.count({
        where: { status: "APPROVED" },
      }),

      // Rejected vendors
      prisma.vendorProfile.count({
        where: { status: "REJECTED" },
      }),

      // Total active products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Total orders (all time)
      prisma.order.count(),

      // Platform revenue (sum of platformFee from DELIVERED orders)
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { platformFee: true },
      }),

      // Revenue this month
      prisma.order.aggregate({
        where: {
          status: "DELIVERED",
          createdAt: { gte: firstDayOfMonth },
        },
        _sum: { platformFee: true },
      }),
    ]);

    return {
      success: true,
      data: {
        vendors: {
          total: totalVendors,
          pending: pendingVendors,
          approved: approvedVendors,
          rejected: rejectedVendors,
        },
        products: {
          total: totalProducts,
        },
        orders: {
          total: totalOrders,
        },
        revenue: {
          total: platformRevenue._sum?.platformFee || 0,
          thisMonth: revenueThisMonth._sum?.platformFee || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      success: false,
      error: "Không thể tải thống kê dashboard",
    };
  }
}
