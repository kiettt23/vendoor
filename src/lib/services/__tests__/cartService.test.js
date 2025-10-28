/**
 * Tests cho CartService
 * Service đơn giản - cart CRUD operations
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { cartService } from "../cartService.js";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    cart: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

describe("CartService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveCart", () => {
    it("should save cart items for user", async () => {
      const userId = "user-123";
      const cart = [
        { id: "prod-1", quantity: 2, price: 100 },
        { id: "prod-2", quantity: 1, price: 200 },
      ];

      prisma.cart.upsert.mockResolvedValue({
        userId,
        items: cart,
      });

      const result = await cartService.saveCart(userId, cart);

      expect(result.success).toBe(true);
      expect(prisma.cart.upsert).toHaveBeenCalledWith({
        where: { userId },
        update: { items: cart },
        create: { userId, items: cart },
      });
    });

    it("should update existing cart", async () => {
      const userId = "user-123";
      const updatedCart = [
        { id: "prod-1", quantity: 5 }, // Updated quantity
      ];

      prisma.cart.upsert.mockResolvedValue({
        userId,
        items: updatedCart,
      });

      await cartService.saveCart(userId, updatedCart);

      // Upsert should handle both create and update
      expect(prisma.cart.upsert).toHaveBeenCalledWith({
        where: { userId },
        update: { items: updatedCart },
        create: { userId, items: updatedCart },
      });
    });
  });

  describe("getCart", () => {
    it("should return cart items for user", async () => {
      const userId = "user-123";
      const mockCart = {
        userId,
        items: [
          { id: "prod-1", quantity: 2 },
          { id: "prod-2", quantity: 1 },
        ],
      };

      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const result = await cartService.getCart(userId);

      expect(result).toEqual(mockCart.items);
      expect(result).toHaveLength(2);
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it("should return empty array when cart not exists", async () => {
      const userId = "user-123";

      // No cart found
      prisma.cart.findUnique.mockResolvedValue(null);

      const result = await cartService.getCart(userId);

      expect(result).toEqual([]);
    });

    it("should return empty array when cart items is null", async () => {
      prisma.cart.findUnique.mockResolvedValue({
        userId: "user-123",
        items: null, // Edge case
      });

      const result = await cartService.getCart("user-123");

      expect(result).toEqual([]);
    });
  });

  describe("clearCart", () => {
    it("should delete cart for user", async () => {
      const userId = "user-123";

      prisma.cart.delete.mockResolvedValue({
        userId,
        items: [],
      });

      const result = await cartService.clearCart(userId);

      expect(result.success).toBe(true);
      expect(prisma.cart.delete).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
