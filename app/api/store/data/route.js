import { NextResponse } from "next/server";
import { storeService } from "@/lib/services/storeService";
import { handleError } from "@/lib/errors/errorHandler";
import { BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { getCacheOrFetch } from "@/lib/cache";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_USERNAME);
    }

    // Cache key per store username
    // TTL: 30 minutes (public store data changes rarely)
    const cacheKey = `store:username:${username}`;
    const store = await getCacheOrFetch(
      cacheKey,
      () => storeService.getStoreByUsername(username),
      1800 // 30 minutes
    );

    return NextResponse.json({ store });
  } catch (error) {
    return handleError(error, "Store Data GET");
  }
}
