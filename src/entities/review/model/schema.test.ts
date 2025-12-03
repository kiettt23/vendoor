import { describe, it, expect } from "vitest";
import { createReviewSchema, vendorReplySchema } from "./schema";

describe("createReviewSchema", () => {
  describe("productId validation", () => {
    it("accepts valid productId", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty productId", () => {
      const result = createReviewSchema.safeParse({
        productId: "",
        rating: 5,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không hợp lệ");
    });
  });

  describe("rating validation", () => {
    it("accepts rating from 1 to 5", () => {
      for (const rating of [1, 2, 3, 4, 5]) {
        const result = createReviewSchema.safeParse({
          productId: "prod_123",
          rating,
        });

        expect(result.success).toBe(true);
      }
    });

    it("rejects rating below 1", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối thiểu 1 sao");
    });

    it("rejects rating above 5", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 6,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 5 sao");
    });

    it("rejects decimal rating", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 4.5,
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative rating", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: -1,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("title validation", () => {
    it("accepts valid title", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        title: "Sản phẩm tuyệt vời!",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty title (optional)", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
      });

      expect(result.success).toBe(true);
    });

    it("rejects title over 100 characters", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        title: "a".repeat(101),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 100");
    });

    it("accepts title exactly 100 characters", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        title: "a".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("content validation", () => {
    it("accepts valid content", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        content: "Sản phẩm chất lượng, giao hàng nhanh, đóng gói cẩn thận.",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty content (optional)", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
      });

      expect(result.success).toBe(true);
    });

    it("rejects content over 2000 characters", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        content: "a".repeat(2001),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 2000");
    });
  });

  describe("images validation", () => {
    it("accepts valid image URLs", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: [
          "https://res.cloudinary.com/demo/image/upload/review1.jpg",
          "https://res.cloudinary.com/demo/image/upload/review2.jpg",
        ],
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty images array", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: [],
      });

      expect(result.success).toBe(true);
    });

    it("accepts no images (optional)", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
      });

      expect(result.success).toBe(true);
    });

    it("rejects more than 5 images", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: [
          "https://example.com/1.jpg",
          "https://example.com/2.jpg",
          "https://example.com/3.jpg",
          "https://example.com/4.jpg",
          "https://example.com/5.jpg",
          "https://example.com/6.jpg",
        ],
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("Tối đa 5");
    });

    it("accepts exactly 5 images", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: [
          "https://example.com/1.jpg",
          "https://example.com/2.jpg",
          "https://example.com/3.jpg",
          "https://example.com/4.jpg",
          "https://example.com/5.jpg",
        ],
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid URL format", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: ["not-a-valid-url"],
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("URL");
    });

    it("rejects non-URL strings in array", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        images: ["https://valid.com/img.jpg", "invalid-url"],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("complete review validation", () => {
    it("accepts minimal valid review (only required fields)", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 4,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        productId: "prod_123",
        rating: 4,
      });
    });

    it("accepts complete review with all fields", () => {
      const result = createReviewSchema.safeParse({
        productId: "prod_123",
        rating: 5,
        title: "Rất hài lòng!",
        content: "Sản phẩm chất lượng tốt, đúng mô tả, giao hàng nhanh.",
        images: [
          "https://res.cloudinary.com/demo/image/upload/review1.jpg",
          "https://res.cloudinary.com/demo/image/upload/review2.jpg",
        ],
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        productId: "prod_123",
        rating: 5,
        title: "Rất hài lòng!",
        content: "Sản phẩm chất lượng tốt, đúng mô tả, giao hàng nhanh.",
        images: [
          "https://res.cloudinary.com/demo/image/upload/review1.jpg",
          "https://res.cloudinary.com/demo/image/upload/review2.jpg",
        ],
      });
    });
  });
});

describe("vendorReplySchema", () => {
  describe("reviewId validation", () => {
    it("accepts valid reviewId", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "review_123",
        reply: "Cảm ơn bạn đã đánh giá!",
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty reviewId", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "",
        reply: "Cảm ơn bạn!",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không hợp lệ");
    });
  });

  describe("reply validation", () => {
    it("accepts valid reply", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "review_123",
        reply: "Cảm ơn quý khách đã ủng hộ shop!",
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty reply", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "review_123",
        reply: "",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không được để trống");
    });

    it("rejects reply over 1000 characters", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "review_123",
        reply: "a".repeat(1001),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 1000");
    });

    it("accepts reply exactly 1000 characters", () => {
      const result = vendorReplySchema.safeParse({
        reviewId: "review_123",
        reply: "a".repeat(1000),
      });

      expect(result.success).toBe(true);
    });
  });
});
