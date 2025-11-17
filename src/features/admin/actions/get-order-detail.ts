"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

export async function getOrderDetail(orderId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        vendor: {
          select: {
            id: true,
            shopName: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Đơn hàng không tồn tại" };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return {
      success: false,
      error: "Không thể tải thông tin đơn hàng",
    };
  }
}
