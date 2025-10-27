import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export const POST = async (request) => {
  try {
    const { userId, has } = getAuth(request);
    const { code } = await request.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.COUPON_NOT_FOUND },
        { status: 404 }
      );
    }

    if (coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COUPON_FOR_NEW_USERS },
          { status: 400 }
        );
      }
    }
    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COUPON_FOR_MEMBERS },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("[Coupon GET] Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
};
