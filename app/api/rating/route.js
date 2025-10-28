import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ratingService } from "@/lib/services/ratingService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";
import { validateData } from "@/lib/validations/validate";
import { createRatingSchema } from "@/lib/validations/schemas";

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

    // Use service to get ratings
    const ratings = await ratingService.getUserRatings(userId);

    return NextResponse.json({ ratings });
  } catch (error) {
    return handleError(error, "Rating GET");
  }
}
