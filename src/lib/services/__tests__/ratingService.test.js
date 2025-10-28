/**
 * Tests cho RatingService
 * Test rating creation và validation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { RatingService } from "../ratingService.js";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    order: {
      findUnique: vi.fn(),
    },
    rating: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

describe("RatingService", () => {
  let ratingService;

  beforeEach(() => {
    vi.clearAllMocks();
    ratingService = new RatingService();
  });

  describe("createRating", () => {
    it("should create rating successfully", async () => {
      const ratingData = {
        userId: "user-123",
        orderId: "order-123",
        productId: "prod-123",
        rating: 5,
        review: "Great product!",
      };

      // Mock order exists
      prisma.order.findUnique.mockResolvedValue({
        id: "order-123",
        userId: "user-123",
      });

      // Mock not already rated
      prisma.rating.findFirst.mockResolvedValue(null);

      // Mock rating creation
      const mockCreated = {
        id: "rating-123",
        ...ratingData,
        createdAt: new Date(),
      };
      prisma.rating.create.mockResolvedValue(mockCreated);

      const result = await ratingService.createRating(ratingData);

      expect(result.id).toBe("rating-123");
      expect(result.rating).toBe(5);
      expect(prisma.rating.create).toHaveBeenCalled();
    });

    it("should throw error when order not found", async () => {
      const ratingData = {
        userId: "user-123",
        orderId: "non-existent",
        productId: "prod-123",
        rating: 5,
        review: "Great!",
      };

      // Mock order not found
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(ratingService.createRating(ratingData)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw error when already rated", async () => {
      const ratingData = {
        userId: "user-123",
        orderId: "order-123",
        productId: "prod-123",
        rating: 5,
        review: "Great!",
      };

      // Mock order exists
      prisma.order.findUnique.mockResolvedValue({ id: "order-123" });

      // Mock already rated
      prisma.rating.findFirst.mockResolvedValue({
        id: "rating-old",
        productId: "prod-123",
        orderId: "order-123",
      });

      await expect(ratingService.createRating(ratingData)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("getUserRatings", () => {
    it("should return user ratings", async () => {
      const userId = "user-123";
      const mockRatings = [
        {
          id: "rating-1",
          rating: 5,
          review: "Great!",
          product: { id: "prod-1", name: "Product 1" },
        },
        {
          id: "rating-2",
          rating: 4,
          review: "Good!",
          product: { id: "prod-2", name: "Product 2" },
        },
      ];

      prisma.rating.findMany.mockResolvedValue(mockRatings);

      const result = await ratingService.getUserRatings(userId);

      expect(result).toHaveLength(2);
      expect(result[0].rating).toBe(5);
    });
  });
});
