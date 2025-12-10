import { cache } from "react";

import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";

/**
 * Lấy thông tin profile của user hiện tại
 *
 * @cached React cache cho request deduplication
 */
export const getCurrentUserProfile = cache(async () => {
  const session = await getSession();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      roles: true,
    },
  });

  return user;
});

/**
 * Lấy thống kê orders của user hiện tại
 */
export const getUserOrderStats = cache(async () => {
  const session = await getSession();
  if (!session?.user) return null;

  const [totalOrders, pendingOrders, completedOrders, totalSpent] =
    await Promise.all([
      prisma.order.count({ where: { customerId: session.user.id } }),
      prisma.order.count({
        where: { customerId: session.user.id, status: "PENDING" },
      }),
      prisma.order.count({
        where: { customerId: session.user.id, status: "DELIVERED" },
      }),
      prisma.order.aggregate({
        where: { customerId: session.user.id, status: "DELIVERED" },
        _sum: { total: true },
      }),
    ]);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent: totalSpent._sum.total || 0,
  };
});

/**
 * Lấy recent orders của user hiện tại
 */
export const getUserRecentOrders = cache(async (limit = 5) => {
  const session = await getSession();
  if (!session?.user) return [];

  return prisma.order.findMany({
    where: { customerId: session.user.id },
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      items: {
        take: 3,
        select: { productName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
});
