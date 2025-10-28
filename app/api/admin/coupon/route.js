import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/lib/auth/authAdmin";
import { inngest } from "@/inngest/client";
import { couponService } from "@/lib/services/couponService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { coupon } = await request.json();
    coupon.code = coupon.code.toUpperCase();

    const newCoupon = await couponService.createCoupon(coupon);

    // Schedule Inngest function to delete coupon on expire
    await inngest.send({
      name: "app/coupon.expired",
      data: { code: newCoupon.code, expires_at: newCoupon.expiresAt },
    });

    return NextResponse.json({ message: "Coupon added successfully" });
  } catch (error) {
    return handleError(error, "Admin Coupon POST");
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");

    await couponService.deleteCoupon(code);

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return handleError(error, "Admin Coupon DELETE");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const coupons = await couponService.getAllCoupons();

    return NextResponse.json({ coupons });
  } catch (error) {
    return handleError(error, "Admin Coupon GET");
  }
}
