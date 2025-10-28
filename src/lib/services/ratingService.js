/**
 * Rating Service
 *
 * Handles all rating-related business logic:
 * - Create ratings
 * - Get user ratings
 * - Validate rating permissions
 *
 * Benefits:
 * - Separates business logic from API routes
 * - Easy to test (can mock prisma)
 * - Reusable across multiple routes
 * - Single source of truth for rating operations
 */

import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";

export class RatingService {
  /**
   * Create a new rating for a product
   * @param {string} userId - User ID from auth
   * @param {string} orderId - Order ID
   * @param {string} productId - Product ID
   * @param {number} rating - Rating value (1-5)
   * @param {string} review - Review text
   * @returns {Promise<Object>} Created rating
   * @throws {NotFoundError} If order not found
   * @throws {BadRequestError} If product already rated
   */
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

  /**
   * Get all ratings for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of ratings
   */
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

  /**
   * Get ratings for a specific product
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Ratings with statistics
   */
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

  /**
   * Get ratings by store ID
   * @param {string} storeId - Store ID
   * @returns {Promise<Array>} List of ratings for the store
   */
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
