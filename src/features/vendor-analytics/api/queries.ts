import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";

import {
  type TimeRange,
  type VendorAnalytics,
  type RevenueDataPoint,
  type ProductPerformance,
  type VendorAnalyticsSummary,
  getDateRange,
} from "../model/types";

/**
 * Get vendor analytics data
 *
 * @cached React cache cho request deduplication
 */
export const getVendorAnalytics = cache(
  async (
    vendorProfileId: string,
    timeRange: TimeRange = "30d"
  ): Promise<VendorAnalytics> => {
  const { start, end } = getDateRange(timeRange);

  // Get previous period for comparison
  const prevStart = new Date(start);
  prevStart.setDate(
    prevStart.getDate() -
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [
    currentPeriodOrders,
    previousPeriodOrders,
    topProductsData,
    dailyRevenueData,
  ] = await Promise.all([
    // Current period orders
    prisma.order.findMany({
      where: {
        vendorId: vendorProfileId,
        createdAt: { gte: start, lte: end },
        status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] },
      },
      select: {
        vendorEarnings: true,
      },
    }),

    // Previous period orders (for comparison)
    prisma.order.findMany({
      where: {
        vendorId: vendorProfileId,
        createdAt: { gte: prevStart, lt: start },
        status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] },
      },
      select: {
        vendorEarnings: true,
      },
    }),

    // Top products
    prisma.orderItem.groupBy({
      by: ["variantId"],
      where: {
        order: {
          vendorId: vendorProfileId,
          createdAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          subtotal: "desc",
        },
      },
      take: LIMITS.TOP_PRODUCTS,
    }),

    // Daily revenue (raw orders, group in JS for flexibility)
    prisma.order.findMany({
      where: {
        vendorId: vendorProfileId,
        createdAt: { gte: start, lte: end },
        status: { notIn: ["CANCELLED", "REFUNDED", "PENDING_PAYMENT"] },
      },
      select: {
        createdAt: true,
        vendorEarnings: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Calculate summary
  const currentRevenue = currentPeriodOrders.reduce(
    (sum, o) => sum + o.vendorEarnings,
    0
  );
  const currentOrderCount = currentPeriodOrders.length;
  const previousRevenue = previousPeriodOrders.reduce(
    (sum, o) => sum + o.vendorEarnings,
    0
  );
  const previousOrderCount = previousPeriodOrders.length;

  const summary: VendorAnalyticsSummary = {
    totalRevenue: currentRevenue,
    totalOrders: currentOrderCount,
    averageOrderValue:
      currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0,
    revenueChange:
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0,
    ordersChange:
      previousOrderCount > 0
        ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100
        : currentOrderCount > 0
        ? 100
        : 0,
  };

  // Group daily revenue
  const revenueChart = groupRevenueByDay(dailyRevenueData, start, end);

  // Get product details for top products
  const topProducts = await getTopProductsDetails(topProductsData);

  return {
    summary,
    revenueChart,
    topProducts,
  };
});

/**
 * Group orders by day for chart
 */
function groupRevenueByDay(
  orders: { createdAt: Date; vendorEarnings: number }[],
  start: Date,
  end: Date
): RevenueDataPoint[] {
  const dayMap = new Map<string, { revenue: number; orderCount: number }>();

  // Initialize all days in range
  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    dayMap.set(dateStr, { revenue: 0, orderCount: 0 });
    current.setDate(current.getDate() + 1);
  }

  // Populate with actual data
  for (const order of orders) {
    const dateStr = order.createdAt.toISOString().split("T")[0];
    const existing = dayMap.get(dateStr) || { revenue: 0, orderCount: 0 };
    dayMap.set(dateStr, {
      revenue: existing.revenue + order.vendorEarnings,
      orderCount: existing.orderCount + 1,
    });
  }

  // Convert to array
  return Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orderCount: data.orderCount,
  }));
}

/**
 * Get product details for top selling items
 */
async function getTopProductsDetails(
  topProductsData: {
    variantId: string;
    _sum: { quantity: number | null; subtotal: number | null };
  }[]
): Promise<ProductPerformance[]> {
  if (topProductsData.length === 0) return [];

  const variantIds = topProductsData.map((p) => p.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  return topProductsData
    .map((data) => {
      const variant = variantMap.get(data.variantId);
      if (!variant) return null;
      return {
        productId: variant.product.id,
        productName: variant.product.name,
        productSlug: variant.product.slug,
        image: variant.product.images[0]?.url || null,
        totalSold: data._sum.quantity || 0,
        totalRevenue: data._sum.subtotal || 0,
      };
    })
    .filter((p): p is ProductPerformance => p !== null);
}
