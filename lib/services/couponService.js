import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

class CouponService {
  async validateCoupon(code, userId, hasPlusPlan) {
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!coupon) {
      throw new NotFoundError(ERROR_MESSAGES.COUPON_NOT_FOUND);
    }

    // Check if coupon is for new users only
    if (coupon.forNewUser) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
      });

      if (userOrders.length > 0) {
        throw new BadRequestError(ERROR_MESSAGES.COUPON_FOR_NEW_USERS);
      }
    }

    // Check if coupon is for members only
    if (coupon.forMember && !hasPlusPlan) {
      throw new BadRequestError(ERROR_MESSAGES.COUPON_FOR_MEMBERS);
    }

    return coupon;
  }

  async createCoupon(couponData) {
    const coupon = await prisma.coupon.create({
      data: {
        code: couponData.code.toUpperCase(),
        discount: couponData.discount,
        expiresAt: new Date(couponData.expiresAt),
        forNewUser: couponData.forNewUser || false,
        forMember: couponData.forMember || false,
      },
    });

    return coupon;
  }

  async deleteCoupon(code) {
    await prisma.coupon.delete({
      where: { code },
    });
  }

  async getAllCoupons() {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return coupons;
  }
}

export const couponService = new CouponService();
