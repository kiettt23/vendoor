import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(request);

    if (!storeId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const storeInfo = await storeService.getStoreByUserId(userId);

    return NextResponse.json({ isSeller: true, storeInfo });
  } catch (error) {
    return handleError(error, "Store Is Seller");
  }
}
