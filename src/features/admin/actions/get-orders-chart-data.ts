"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AdminActions");

export async function getOrdersChartData(months: number = 12) {
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

    // Get all orders in date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
    });

    // Create a map of month -> count
    const monthCounts = new Map<string, number>();

    // Initialize all months with 0
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      });
      monthCounts.set(monthKey, 0);
    }

    // Fill in actual counts
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      });
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });

    // Convert to array format for chart (oldest to newest)
    const chartData = Array.from(monthCounts.entries())
      .reverse()
      .map(([month, count]) => ({
        month,
        orders: count,
      }));

    return {
      success: true,
      data: chartData,
    };
  } catch (error) {
    logger.error("Failed to fetch orders chart data", error);
    return {
      success: false,
      error: "Không thể tải dữ liệu biểu đồ đơn hàng",
    };
  }
}
