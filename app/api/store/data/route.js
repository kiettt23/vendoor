import { NextResponse } from "next/server";
import { storeService } from "@/core/Store/storeService";
import { handleError } from "@/errors/errorHandler";
import { BadRequestError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/AppError";
import { getCacheOrFetch } from "@/infra/cache";

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
