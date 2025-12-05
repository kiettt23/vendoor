import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";

// ============================================
// Vendor Queries
// ============================================

/**
 * Lấy danh sách vendors (cho admin)
 */
export async function getVendors(status?: string) {
  const where = status
    ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" }
    : {};

  return prisma.vendorProfile.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Lấy chi tiết vendor theo ID
 */
export async function getVendorById(vendorId: string) {
  return prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      user: {
        select: { name: true, email: true, phone: true, createdAt: true },
      },
      _count: { select: { orders: true } },
    },
  });
}

/**
 * Lấy thông tin vendor profile của user hiện tại
 */
export async function getCurrentVendorProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  return prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, shopName: true, status: true },
  });
}

/**
 * Lấy danh sách vendors đã approved (public - cho filter)
 *
 * @cached React cache cho request deduplication
 */
export const getApprovedVendors = cache(async () => {
  return prisma.vendorProfile.findMany({
    where: { status: "APPROVED" },
    // Return userId (User.id) vì Product.vendorId references User.id
    select: { id: true, userId: true, shopName: true },
    orderBy: { shopName: "asc" },
  });
});

/**
 * Lấy danh sách vendors public với thông tin chi tiết (cho Stores page)
 *
 * @cached React cache cho request deduplication
 */
export const getPublicVendors = cache(async () => {
  const vendors = await prisma.vendorProfile.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      userId: true,
      shopName: true,
      description: true,
      logo: true,
    },
    orderBy: { shopName: "asc" },
  });

  // Get product counts for each vendor
  const productCounts = await prisma.product.groupBy({
    by: ["vendorId"],
    where: {
      isActive: true,
      vendorId: { in: vendors.map((v) => v.userId) },
    },
    _count: true,
  });

  const countMap = new Map(productCounts.map((p) => [p.vendorId, p._count]));

  return vendors.map((vendor) => ({
    id: vendor.id,
    userId: vendor.userId,
    shopName: vendor.shopName,
    description: vendor.description,
    logo: vendor.logo,
    productCount: countMap.get(vendor.userId) || 0,
  }));
});

/**
 * Lấy chi tiết vendor theo ID (public)
 *
 * @cached React cache cho request deduplication
 */
export const getPublicVendorById = cache(async (vendorId: string) => {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId, status: "APPROVED" },
    select: {
      id: true,
      userId: true,
      shopName: true,
      description: true,
      logo: true,
      createdAt: true,
    },
  });

  if (!vendor) return null;

  const productCount = await prisma.product.count({
    where: { vendorId: vendor.userId, isActive: true },
  });

  return {
    ...vendor,
    productCount,
  };
});

/**
 * Lấy thống kê dashboard của vendor
 */
export async function getVendorDashboardStats(vendorId: string) {
  const [totalProducts, totalOrders, totalRevenue, pendingOrders] =
    await Promise.all([
      prisma.product.count({ where: { vendorId } }),
      prisma.order.count({ where: { vendorId } }),
      prisma.order.aggregate({
        where: {
          vendorId,
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
        },
        _sum: { vendorEarnings: true },
      }),
      prisma.order.count({ where: { vendorId, status: "PENDING" } }),
    ]);

  return {
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.vendorEarnings || 0,
    pendingOrders,
  };
}

/**
 * Lấy đơn hàng gần đây của vendor (cho dashboard)
 */
export async function getVendorRecentOrders(
  vendorId: string,
  limit = LIMITS.RECENT_ORDERS
) {
  return prisma.order.findMany({
    where: { vendorId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Lấy đầy đủ dữ liệu cho vendor dashboard
 */
export async function getVendorDashboardData(userId: string) {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId },
    select: { id: true, shopName: true },
  });

  if (!vendorProfile) return null;

  const [stats, recentOrders, productCount] = await Promise.all([
    getVendorDashboardStats(vendorProfile.id),
    getVendorRecentOrders(vendorProfile.id),
    prisma.product.count({
      where: { vendorId: userId, isActive: true },
    }),
  ]);

  return {
    vendorProfile,
    stats: {
      ...stats,
      totalProducts: productCount,
    },
    recentOrders,
  };
}

// ============================================
// Admin Queries
// ============================================

/**
 * Lấy thống kê tổng quan cho admin dashboard
 */
export async function getAdminDashboardStats() {
  const [totalUsers, totalVendors, totalProducts, totalOrders, revenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.vendorProfile.count({ where: { status: "APPROVED" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: {
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING"] },
        },
        _sum: { platformFee: true },
      }),
    ]);

  return {
    totalUsers,
    totalVendors,
    totalProducts,
    totalOrders,
    platformRevenue: revenue._sum.platformFee || 0,
  };
}

/**
 * Đếm số vendor đang chờ duyệt
 */
export async function getPendingVendorsCount() {
  return prisma.vendorProfile.count({ where: { status: "PENDING" } });
}

/**
 * Lấy đơn hàng gần đây cho admin dashboard
 */
export async function getAdminRecentOrders(limit = LIMITS.RECENT_ORDERS) {
  return prisma.order.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      vendor: { select: { shopName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Lấy chi tiết vendor cho admin (bao gồm stats)
 */
export async function getVendorDetailForAdmin(vendorId: string) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      user: {
        select: { name: true, email: true, phone: true, createdAt: true },
      },
      _count: { select: { orders: true } },
    },
  });

  if (!vendor) return null;

  const [totalProducts, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { vendorId: vendor.userId } }),
    prisma.order.aggregate({
      where: {
        vendorId: vendor.id,
        status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
      },
      _sum: { vendorEarnings: true },
    }),
  ]);

  return {
    ...vendor,
    stats: {
      totalProducts,
      totalRevenue: totalRevenue._sum.vendorEarnings || 0,
    },
  };
}

// Type exports - re-export from model
export type {
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
} from "../model/types";
