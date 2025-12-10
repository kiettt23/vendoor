import { cache } from "react";
import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";

export interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  completedEarnings: number;
  totalOrders: number;
  totalPlatformFee: number;
}

export interface EarningsTransaction {
  id: string;
  orderNumber: string;
  subtotal: number;
  platformFee: number;
  vendorEarnings: number;
  status: string;
  createdAt: Date;
  customerName: string;
}

export interface MonthlyEarnings {
  month: string;
  earnings: number;
  orders: number;
}

/**
 * Lấy tổng quan doanh thu của vendor
 */
export const getVendorEarningsSummary = cache(
  async (vendorId: string): Promise<EarningsSummary> => {
    const [completedOrders, pendingOrders] = await Promise.all([
      prisma.order.aggregate({
        where: {
          vendorId,
          status: { in: ["DELIVERED"] },
        },
        _sum: {
          vendorEarnings: true,
          platformFee: true,
          subtotal: true,
        },
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          vendorId,
          status: { in: ["PENDING", "PROCESSING", "SHIPPED"] },
        },
        _sum: {
          vendorEarnings: true,
        },
        _count: true,
      }),
    ]);

    const completedEarnings = completedOrders._sum.vendorEarnings || 0;
    const pendingEarnings = pendingOrders._sum.vendorEarnings || 0;

    return {
      totalEarnings: completedEarnings + pendingEarnings,
      completedEarnings,
      pendingEarnings,
      totalOrders: completedOrders._count + pendingOrders._count,
      totalPlatformFee: completedOrders._sum.platformFee || 0,
    };
  }
);

/**
 * Lấy danh sách transactions của vendor
 */
export const getVendorTransactions = cache(
  async (
    vendorId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ transactions: EarningsTransaction[]; total: number }> => {
    const { page = 1, limit = LIMITS.VENDOR_TRANSACTIONS_PER_PAGE } = options;

    const [transactions, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          vendorId,
          status: { notIn: ["PENDING_PAYMENT", "CANCELLED", "REFUNDED"] },
        },
        select: {
          id: true,
          orderNumber: true,
          subtotal: true,
          platformFee: true,
          vendorEarnings: true,
          status: true,
          createdAt: true,
          customer: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({
        where: {
          vendorId,
          status: { notIn: ["PENDING_PAYMENT", "CANCELLED", "REFUNDED"] },
        },
      }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        orderNumber: t.orderNumber,
        subtotal: t.subtotal,
        platformFee: t.platformFee,
        vendorEarnings: t.vendorEarnings,
        status: t.status,
        createdAt: t.createdAt,
        customerName: t.customer.name || "Khách hàng",
      })),
      total,
    };
  }
);

/**
 * Lấy doanh thu theo tháng (6 tháng gần nhất)
 */
export const getMonthlyEarnings = cache(
  async (vendorId: string): Promise<MonthlyEarnings[]> => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        vendorId,
        status: { in: ["DELIVERED", "PENDING", "PROCESSING", "SHIPPED"] },
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        vendorEarnings: true,
        createdAt: true,
      },
    });

    const monthlyMap = new Map<string, { earnings: number; orders: number }>();

    // Initialize 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, { earnings: 0, orders: 0 });
    }

    // Aggregate orders
    for (const order of orders) {
      const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
      const current = monthlyMap.get(key);
      if (current) {
        current.earnings += order.vendorEarnings;
        current.orders += 1;
      }
    }

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      earnings: data.earnings,
      orders: data.orders,
    }));
  }
);
