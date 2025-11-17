"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

export async function getVendorDetail(vendorId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check admin role
  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        orders: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            vendorEarnings: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!vendor) {
      return { success: false, error: "Vendor không tồn tại" };
    }

    // Get products for this vendor (via userId)
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
      },
    });

    const productsCount = await prisma.product.count({
      where: { vendorId: vendor.user.id },
    });

    // Calculate total earnings from DELIVERED orders
    const totalEarnings = await prisma.order.aggregate({
      where: {
        vendorId: vendorId,
        status: "DELIVERED",
      },
      _sum: {
        vendorEarnings: true,
      },
    });

    return {
      success: true,
      data: {
        ...vendor,
        products,
        _count: {
          ...vendor._count,
          products: productsCount,
        },
        totalEarnings: totalEarnings._sum?.vendorEarnings || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching vendor detail:", error);
    return {
      success: false,
      error: "Không thể tải thông tin vendor",
    };
  }
}
