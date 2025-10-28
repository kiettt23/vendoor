import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ratingService } from "@/lib/services/ratingService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";
import { validateData } from "@/lib/validations/validate";
import { createRatingSchema } from "@/lib/validations/schemas";
import { getCacheOrFetch, invalidateCaches } from "@/lib/cache";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();

    // ✨ Validate với Zod - check rating từ 1-5, productId và orderId bắt buộc
    const validatedData = validateData(createRatingSchema, body);

    // Use service to create rating
    const newRating = await ratingService.createRating({
      userId,
      ...validatedData,
    });

    // Invalidate caches after rating creation
    await invalidateCaches([
      `user:ratings:${userId}`, // User's rating list
      `store:${newRating.product.storeId}:dashboard`, // Store dashboard
    ]);

    return NextResponse.json({
      message: "Rating added successfully",
      rating: newRating,
    });
  } catch (error) {
    return handleError(error, "Rating POST");
  }
}

// Get all ratings for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Cache key per user
    // TTL: 5 minutes (ratings don't change frequently)
    const cacheKey = `user:ratings:${userId}`;
    const ratings = await getCacheOrFetch(
      cacheKey,
      () => ratingService.getUserRatings(userId),
      300 // 5 minutes
    );

    return NextResponse.json({ ratings });
  } catch (error) {
    return handleError(error, "Rating GET");
  }
}
