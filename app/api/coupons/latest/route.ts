import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the latest public, non-expired coupon
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

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error fetching latest coupon:", error);
    return NextResponse.json({ coupon: null });
  }
}
