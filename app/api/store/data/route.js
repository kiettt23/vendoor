import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

// Get store info & store products
export async function GET(request) {
  try {
    // Get store username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username").toLowerCase();

    if (!username) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_USERNAME },
        { status: 400 }
      );
    }

    // Get store info and inStock products with ratings
    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: {
        Product: {
          include: {
            rating: true,
          },
        },
      },
    });
    if (!store) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.STORE_NOT_FOUND },
        { status: 400 }
      );
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error("[Store Data GET] Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
