import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/auth/authAdmin";
import { NextResponse } from "next/server";
import { handleError } from "@/errors/errorHandler";
import { UnauthorizedError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    return handleError(error, "Admin Is Admin");
  }
}
