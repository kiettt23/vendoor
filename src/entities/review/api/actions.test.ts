/**
 * Unit Tests cho Review Actions
 *
 * Test CRUD operations cho reviews
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    review: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    orderItem: {
      findFirst: vi.fn(),
    },
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { createReview, updateReview, deleteReview, replyToReview } from "./actions";
import type { CreateReviewInput, VendorReplyInput } from "../model";

describe("Review Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // createReview - Tạo review
  // ============================================================
  describe("createReview", () => {
    const validInput: CreateReviewInput = {
      productId: "prod-1",
      rating: 5,
      title: "Great product!",
      content: "I love this product",
    };

    it("should create review for verified purchase", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.orderItem.findFirst).mockResolvedValueOnce({
        id: "item-1",
        orderId: "order-1",
      } as never);
      vi.mocked(prisma.review.create).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      const result = await createReview("user-1", validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("review-1");
      }
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isVerifiedPurchase: true,
          orderId: "order-1",
        }),
      });
    });

    it("should create review for non-verified purchase", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.orderItem.findFirst).mockResolvedValueOnce(null);
      vi.mocked(prisma.review.create).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      const result = await createReview("user-1", validInput);

      expect(result.success).toBe(true);
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isVerifiedPurchase: false,
          orderId: null,
        }),
      });
    });

    it("should reject duplicate review", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        id: "existing-review",
      } as never);

      const result = await createReview("user-1", validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("đã đánh giá");
      }
    });

    it("should revalidate products path", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.orderItem.findFirst).mockResolvedValueOnce(null);
      vi.mocked(prisma.review.create).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      await createReview("user-1", validInput);

      expect(revalidatePath).toHaveBeenCalledWith("/products");
    });
  });

  // ============================================================
  // updateReview - Cập nhật review
  // ============================================================
  describe("updateReview", () => {
    it("should update review when user owns it", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        userId: "user-1",
        productId: "prod-1",
      } as never);
      vi.mocked(prisma.review.update).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      const result = await updateReview("user-1", "review-1", {
        rating: 4,
        title: "Updated title",
        content: "Updated content",
      });

      expect(result.success).toBe(true);
    });

    it("should reject update when user does not own review", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        userId: "other-user",
        productId: "prod-1",
      } as never);

      const result = await updateReview("user-1", "review-1", {
        rating: 4,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Không tìm thấy");
      }
    });
  });

  // ============================================================
  // deleteReview - Xóa review
  // ============================================================
  describe("deleteReview", () => {
    it("should delete review when user owns it", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        userId: "user-1",
      } as never);
      vi.mocked(prisma.review.delete).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      const result = await deleteReview("user-1", "review-1");

      expect(result.success).toBe(true);
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: "review-1" },
      });
    });

    it("should reject delete when user does not own review", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        userId: "other-user",
      } as never);

      const result = await deleteReview("user-1", "review-1");

      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // replyToReview - Vendor phản hồi
  // ============================================================
  describe("replyToReview", () => {
    const validReply: VendorReplyInput = {
      reviewId: "review-1",
      reply: "Thank you for your feedback!",
    };

    it("should add vendor reply when vendor owns the product", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        id: "review-1",
        product: { vendorId: "vendor-1" },
      } as never);
      vi.mocked(prisma.review.update).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      const result = await replyToReview("vendor-1", validReply);

      expect(result.success).toBe(true);
      expect(prisma.review.update).toHaveBeenCalledWith({
        where: { id: "review-1" },
        data: expect.objectContaining({
          vendorReply: "Thank you for your feedback!",
        }),
      });
    });

    it("should reject reply when vendor does not own the product", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        id: "review-1",
        product: { vendorId: "other-vendor" },
      } as never);

      const result = await replyToReview("vendor-1", validReply);

      expect(result.success).toBe(false);
    });

    it("should revalidate vendor reviews path", async () => {
      vi.mocked(prisma.review.findUnique).mockResolvedValueOnce({
        id: "review-1",
        product: { vendorId: "vendor-1" },
      } as never);
      vi.mocked(prisma.review.update).mockResolvedValueOnce({
        id: "review-1",
      } as never);

      await replyToReview("vendor-1", validReply);

      expect(revalidatePath).toHaveBeenCalledWith("/vendor/reviews");
    });
  });
});
