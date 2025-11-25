"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { VendorStatus } from "@prisma/client";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AdminActions");

interface GetVendorsParams {
  page?: number;
  pageSize?: number;
  status?: VendorStatus | "ALL";
  search?: string;
}

export async function getVendors(params: GetVendorsParams = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check admin role
  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { page = 1, pageSize = 20, status = "ALL", search = "" } = params;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: {
      status?: VendorStatus;
      OR?: Array<{
        shopName?: { contains: string; mode: "insensitive" };
        user?: {
          name?: { contains: string; mode: "insensitive" };
          email?: { contains: string; mode: "insensitive" };
        };
      }>;
    } = {};

    // Filter by status
    if (status !== "ALL") {
      where.status = status;
    }

    // Search by shop name or owner email/name
    if (search) {
      where.OR = [
        { shopName: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Fetch vendors with pagination
    const [vendorProfiles, totalCount] = await Promise.all([
      prisma.vendorProfile.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.vendorProfile.count({ where }),
    ]);

    // Get product counts for each vendor
    const vendors = await Promise.all(
      vendorProfiles.map(async (profile) => {
        const productsCount = await prisma.product.count({
          where: { vendorId: profile.user.id },
        });
        return {
          ...profile,
          _count: {
            products: productsCount,
            orders: profile._count.orders,
          },
        };
      })
    );

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      data: {
        vendors,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
        },
      },
    };
  } catch (error) {
    logger.error("Failed to fetch vendors", error);
    return {
      success: false,
      error: "Không thể tải danh sách vendors",
    };
  }
}
