import { cache } from "react";

import { getSession } from "@/shared/lib/auth/session";
import { prisma } from "@/shared/lib/db";
import { LIMITS } from "@/shared/lib/constants";

// ============================================================================
// Helper Functions (DRY)
// ============================================================================

/**
 * Generate consistent rating từ vendor id (hash-based)
 * Đảm bảo mỗi vendor luôn có cùng rating qua các requests
 */
function getConsistentRating(vendorId: string): number {
  let hash = 0;
  for (let i = 0; i < vendorId.length; i++) {
    hash = (hash << 5) - hash + vendorId.charCodeAt(i);
    hash |= 0;
  }
  // Range 4.5 - 4.9, rounded to 1 decimal
  return Math.round((4.5 + (Math.abs(hash) % 5) * 0.1) * 10) / 10;
}

/**
 * Format follower count từ product count
 * TODO: Replace với real follower data khi có follower system
 */
function formatFollowerCount(productCount: number): string {
  const followers = Math.floor(productCount * 1.5);
  if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  }
  return followers.toString();
}

/**
 * Determine vendor badge based on metrics
 */
function getVendorBadge(productCount: number): string | null {
  if (productCount >= 10) return "Top Seller";
  if (productCount >= 5) return "Verified";
  return null;
}

/**
 * Get product counts for multiple vendors (DRY helper)
 * @returns Map<userId, productCount>
 */
async function getProductCountsForVendors(
  userIds: string[]
): Promise<Map<string, number>> {
  if (userIds.length === 0) return new Map();

  const productCounts = await prisma.product.groupBy({
    by: ["vendorId"],
    where: {
      isActive: true,
      vendorId: { in: userIds },
    },
    _count: true,
  });

  return new Map(productCounts.map((p) => [p.vendorId, p._count]));
}

// ============================================================================
// Vendor Queries
// ============================================================================

/**
 * Lấy danh sách vendors (cho admin)
 *
 * @cached React cache cho request deduplication
 */
export const getVendors = cache(async (status?: string) => {
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
});

/**
 * Lấy chi tiết vendor theo ID
 *
 * @cached React cache cho request deduplication
 */
export const getVendorById = cache(async (vendorId: string) => {
  return prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      user: {
        select: { name: true, email: true, phone: true, createdAt: true },
      },
      _count: { select: { orders: true } },
    },
  });
});

/**
 * Lấy thông tin vendor profile của user hiện tại
 *
 * @cached React cache cho request deduplication
 */
export const getCurrentVendorProfile = cache(async () => {
  const session = await getSession();
  if (!session?.user) return null;

  return prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, shopName: true, status: true },
  });
});

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

  const countMap = await getProductCountsForVendors(vendors.map((v) => v.userId));

  return vendors.map((vendor) => ({
    id: vendor.id,
    userId: vendor.userId,
    shopName: vendor.shopName,
    description: vendor.description,
    logo: vendor.logo,
    productCount: countMap.get(vendor.userId) || 0,
  }));
});

// Featured Vendors for Homepage

export interface FeaturedVendor {
  id: string;
  slug: string | null;
  name: string;
  logo: string | null;
  cover: string | null;
  rating: number;
  followers: string;
  products: number;
  location: string;
  verified: boolean;
  badge: string | null;
}

/**
 * Lấy vendors nổi bật cho homepage - sắp xếp theo thời gian tạo (lâu nhất trước)
 */
export const getFeaturedVendors = cache(
  async (limit = 6): Promise<FeaturedVendor[]> => {
    const vendors = await prisma.vendorProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        slug: true,
        shopName: true,
        logo: true,
        banner: true,
        userId: true,
        createdAt: true,
      },
      // Sắp xếp theo createdAt ASC (lâu nhất trước)
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const countMap = await getProductCountsForVendors(
      vendors.map((v) => v.userId)
    );

    return vendors.map((vendor) => {
      const productCount = countMap.get(vendor.userId) || 0;

      return {
        id: vendor.id,
        slug: vendor.slug,
        name: vendor.shopName,
        logo: vendor.logo,
        cover: vendor.banner,
        rating: getConsistentRating(vendor.id),
        followers: formatFollowerCount(productCount),
        products: productCount,
        location: "Việt Nam",
        verified: true,
        badge: getVendorBadge(productCount),
      };
    });
  }
);

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
 *
 * @cached React cache cho request deduplication
 */
export const getVendorDashboardStats = cache(async (vendorId: string) => {
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
});

/**
 * Lấy đơn hàng gần đây của vendor (cho dashboard)
 *
 * @cached React cache cho request deduplication
 */
export const getVendorRecentOrders = cache(
  async (vendorId: string, limit = LIMITS.RECENT_ORDERS) => {
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
);

/**
 * Lấy đầy đủ dữ liệu cho vendor dashboard
 *
 * @cached React cache cho request deduplication
 */
export const getVendorDashboardData = cache(async (userId: string) => {
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
});

// Admin Queries

/**
 * Lấy thống kê tổng quan cho admin dashboard
 *
 * @cached React cache cho request deduplication
 */
export const getAdminDashboardStats = cache(async () => {
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
});

/**
 * Đếm số vendor đang chờ duyệt
 *
 * @cached React cache cho request deduplication
 */
export const getPendingVendorsCount = cache(async () => {
  return prisma.vendorProfile.count({ where: { status: "PENDING" } });
});

/**
 * Lấy đơn hàng gần đây cho admin dashboard
 *
 * @cached React cache cho request deduplication
 */
export const getAdminRecentOrders = cache(
  async (limit = LIMITS.RECENT_ORDERS) => {
    return prisma.order.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        vendor: { select: { shopName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
);

/**
 * Lấy chi tiết vendor cho admin (bao gồm stats)
 *
 * @cached React cache cho request deduplication
 */
export const getVendorDetailForAdmin = cache(async (vendorId: string) => {
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
});

// Type exports - re-export from model
export type {
  AdminDashboardStats,
  AdminRecentOrder,
  VendorDetailForAdmin,
} from "../model/types";
