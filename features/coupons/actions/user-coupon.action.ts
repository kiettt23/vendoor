"use server";

import prisma from "@/shared/configs/prisma";

/**
 * Get latest public coupon for banner
 * No authentication required - public action
 */
export async function getLatestPublicCoupon() {
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

    return { success: true, coupon };
  } catch (error) {
    console.error("Error fetching latest coupon:", error);
    return { success: false, coupon: null };
  }
}
