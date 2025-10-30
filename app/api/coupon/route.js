import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { couponService } from "@/core/services/couponService";
import { handleError } from "@/errors/errorHandler";

export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);
    const { code } = await request.json();

    const hasPlusPlan = has({ plan: "plus" });
    const coupon = await couponService.validateCoupon(
      code,
      userId,
      hasPlusPlan
    );

    return NextResponse.json({ coupon });
  } catch (error) {
    return handleError(error, "Coupon POST");
  }
}
