/**
 * Unit Tests cho Wishlist Actions
 *
 * Test add/remove/toggle wishlist operations
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    wishlist: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from "./actions";

describe("Wishlist Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // addToWishlist - Thêm vào wishlist
  // ============================================================
  describe("addToWishlist", () => {
    it("should add product to wishlist", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce({
        id: "prod-1",
      } as never);
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.wishlist.create).mockResolvedValueOnce({
        id: "wish-1",
      } as never);

      const result = await addToWishlist("user-1", "prod-1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("wish-1");
      }
    });

    it("should reject if product does not exist", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(null);

      const result = await addToWishlist("user-1", "nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("không tồn tại");
      }
    });

    it("should reject if already in wishlist", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce({
        id: "prod-1",
      } as never);
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce({
        id: "existing",
      } as never);

      const result = await addToWishlist("user-1", "prod-1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("đã có trong");
      }
    });

    it("should revalidate wishlist path", async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce({
        id: "prod-1",
      } as never);
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.wishlist.create).mockResolvedValueOnce({
        id: "wish-1",
      } as never);

      await addToWishlist("user-1", "prod-1");

      expect(revalidatePath).toHaveBeenCalledWith("/wishlist");
    });
  });

  // ============================================================
  // removeFromWishlist - Xóa khỏi wishlist
  // ============================================================
  describe("removeFromWishlist", () => {
    it("should remove product from wishlist", async () => {
      vi.mocked(prisma.wishlist.delete).mockResolvedValueOnce({
        id: "wish-1",
      } as never);

      const result = await removeFromWishlist("user-1", "prod-1");

      expect(result.success).toBe(true);
      expect(prisma.wishlist.delete).toHaveBeenCalledWith({
        where: {
          userId_productId: { userId: "user-1", productId: "prod-1" },
        },
      });
    });

    it("should handle error when item not found", async () => {
      vi.mocked(prisma.wishlist.delete).mockRejectedValueOnce(
        new Error("Not found")
      );

      const result = await removeFromWishlist("user-1", "prod-1");

      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // toggleWishlist - Toggle add/remove
  // ============================================================
  describe("toggleWishlist", () => {
    it("should add to wishlist if not exists", async () => {
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce({
        id: "prod-1",
      } as never);
      vi.mocked(prisma.wishlist.create).mockResolvedValueOnce({
        id: "wish-1",
      } as never);

      const result = await toggleWishlist("user-1", "prod-1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.added).toBe(true);
      }
    });

    it("should remove from wishlist if exists", async () => {
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce({
        id: "existing",
      } as never);
      vi.mocked(prisma.wishlist.delete).mockResolvedValueOnce({
        id: "existing",
      } as never);

      const result = await toggleWishlist("user-1", "prod-1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.added).toBe(false);
      }
    });

    it("should reject if product not found when adding", async () => {
      vi.mocked(prisma.wishlist.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.product.findUnique).mockResolvedValueOnce(null);

      const result = await toggleWishlist("user-1", "nonexistent");

      expect(result.success).toBe(false);
    });
  });

  // ============================================================
  // clearWishlist - Xóa toàn bộ wishlist
  // ============================================================
  describe("clearWishlist", () => {
    it("should clear all wishlist items for user", async () => {
      vi.mocked(prisma.wishlist.deleteMany).mockResolvedValueOnce({
        count: 5,
      } as never);

      const result = await clearWishlist("user-1");

      expect(result.success).toBe(true);
      expect(prisma.wishlist.deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });

    it("should handle error", async () => {
      vi.mocked(prisma.wishlist.deleteMany).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const result = await clearWishlist("user-1");

      expect(result.success).toBe(false);
    });
  });
});
