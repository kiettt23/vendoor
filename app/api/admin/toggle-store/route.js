import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { storeId } = await request.json();

    if (!storeId) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_STORE_ID);
    }

    await storeService.toggleStoreStatus(storeId);

    return NextResponse.json({ message: "Store updated successfully" });
  } catch (error) {
    return handleError(error, "Admin Toggle Store");
  }
}
