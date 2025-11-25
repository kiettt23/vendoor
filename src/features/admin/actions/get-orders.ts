"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AdminActions");

interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | "ALL";
  vendorId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function getOrders(params: GetOrdersParams = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const {
      page = 1,
      pageSize = 20,
      status = "ALL",
      vendorId,
      search = "",
      startDate,
      endDate,
    } = params;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: {
      status?: OrderStatus;
      vendorId?: string;
      orderNumber?: { contains: string; mode: "insensitive" };
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    if (status !== "ALL") {
      where.status = status;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.orderNumber = { contains: search, mode: "insensitive" };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          vendor: {
            select: {
              shopName: true,
            },
          },
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      data: {
        orders,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
        },
      },
    };
  } catch (error) {
    logger.error("Failed to fetch orders", error);
    return {
      success: false,
      error: "Không thể tải danh sách đơn hàng",
    };
  }
}
