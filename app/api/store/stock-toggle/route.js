import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { productService } from "@/lib/services/productService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = await request.json();

    if (!productId) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_PRODUCT_ID);
    }

    const storeId = await authSeller(userId);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await productService.toggleStock(productId, storeId);

    return NextResponse.json({ message: "Product stock updated successfully" });
  } catch (error) {
    return handleError(error, "Store Stock Toggle");
  }
}
