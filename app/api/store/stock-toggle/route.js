import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

// toggle stock of a product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_PRODUCT_ID },
        { status: 400 }
      );
    }
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // check if product exists
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });

    if (!product) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.PRODUCT_NOT_FOUND },
        { status: 404 }
      );
    }

    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });

    return NextResponse.json({ message: "Product stock updated successfully" });
  } catch (error) {
    console.error("[Store Stock Toggle] Error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
