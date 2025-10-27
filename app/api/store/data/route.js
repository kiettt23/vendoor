import { NextResponse } from "next/server";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_USERNAME);
    }

    const store = await storeService.getStoreByUsername(username);

    return NextResponse.json({ store });
  } catch (error) {
    return handleError(error, "Store Data GET");
  }
}
