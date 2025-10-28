import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/lib/auth/authAdmin";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { storeId, status } = await request.json();

    await storeService.approveStore(storeId, status);

    return NextResponse.json({ message: status + " successfully" });
  } catch (error) {
    return handleError(error, "Admin Approve Store POST");
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const stores = await storeService.getPendingStores();

    return NextResponse.json({ stores });
  } catch (error) {
    return handleError(error, "Admin Approve Store GET");
  }
}
