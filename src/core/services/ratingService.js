import prisma from "@/infra/prisma";
import { NotFoundError, BadRequestError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export class RatingService {
 
  async createRating({ userId, orderId, productId, rating, review }) {
    // Validate order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundError(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Check if product already rated in this order
    const isAlreadyRated = await prisma.rating.findFirst({
      where: {
        productId,
        orderId,
      },
    });

    if (isAlreadyRated) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT_ALREADY_RATED);
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        userId,
        productId,
        rating,
        review,
        orderId,
      },
    });

    return newRating;
  }

  async getUserRatings(userId) {
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ratings;
  }

  async getProductRatings(productId) {
    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return {
      ratings,
      stats: {
        average: Math.round(avgRating * 10) / 10,
        total: ratings.length,
      },
    };
  }

  async getRatingsByStoreId(storeId) {
    const products = await prisma.product.findMany({
      where: { storeId },
      select: { id: true },
    });

    const productIds = products.map((p) => p.id);

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: productIds } },
      include: { user: true, product: true },
    });

    return ratings;
  }
}

// Export singleton instance
export const ratingService = new RatingService();
