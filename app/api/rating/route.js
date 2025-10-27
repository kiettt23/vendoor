import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ratingService } from "@/lib/services/ratingService";
import { handleError } from "@/lib/errors/errorHandler";
import { UnauthorizedError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId, productId, rating, review } = await request.json();

    // Use service to create rating
    const newRating = await ratingService.createRating({
      userId,
      orderId,
      productId,
      rating,
      review,
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
