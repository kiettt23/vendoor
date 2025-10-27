import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

// Auth Seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(request);

    if (!storeId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const storeInfo = await prisma.store.findUnique({
      where: { userId },
    });

    return NextResponse.json({ isSeller: true, storeInfo });
  } catch (error) {
    console.error("[Store Is Seller] Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
