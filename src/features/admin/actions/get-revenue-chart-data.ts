"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AdminActions");

export async function getRevenueChartData(months: number = 12) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check admin role
  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - months + 1,
      1
    );

    // Get DELIVERED orders with platformFee grouped by month
    const orders = await prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        platformFee: true,
      },
    });

    // Create a map of month -> revenue
    const monthRevenue = new Map<string, number>();

    // Initialize all months with 0
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      });
      monthRevenue.set(monthKey, 0);
    }

    // Fill in actual revenue
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      });
      monthRevenue.set(
        monthKey,
        (monthRevenue.get(monthKey) || 0) + order.platformFee
      );
    });

    // Convert to array format for chart (oldest to newest)
    const chartData = Array.from(monthRevenue.entries())
      .reverse()
      .map(([month, revenue]) => ({
        month,
        revenue,
      }));

    return {
      success: true,
      data: chartData,
    };
  } catch (error) {
    logger.error("Failed to fetch revenue chart data", error);
    return {
      success: false,
      error: "Không thể tải dữ liệu biểu đồ doanh thu",
    };
  }
}
