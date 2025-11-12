"use server";

import prisma from "@/server/db/prisma";
import type { ActionResponse } from "@/types/action-response";

interface LatestCoupon {
  code: string;
  discount: number;
  description: string;
}

export async function getLatestPublicCoupon(): Promise<
  ActionResponse<LatestCoupon | null>
> {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        isPublic: true,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        code: true,
        discount: true,
        description: true,
      },
    });

    return {
      success: true,
      data: coupon,
    };
  } catch (error) {
    console.error("Error fetching latest coupon:", error);
    return {
      success: false,
      error: "Failed to fetch coupon",
      data: null,
    };
  }
}
