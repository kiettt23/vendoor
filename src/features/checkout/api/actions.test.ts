/**
 * Unit Tests cho Checkout Actions
 *
 * Test validation và create orders - critical business logic!
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock server-only (phải đặt trước các import khác)
vi.mock("server-only", () => ({}));

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    productVariant: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    vendorProfile: {
      findMany: vi.fn(),
    },
    order: {
      create: vi.fn(),
      updateMany: vi.fn(),
    },
    payment: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback: (tx: unknown) => Promise<unknown>) => callback({
      productVariant: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      order: {
        create: vi.fn(),
        updateMany: vi.fn(),
      },
      payment: {
        create: vi.fn(),
      },
    })),
  },
}));

// Mock auth
vi.mock("@/shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Map())),
}));

import { prisma } from "@/shared/lib/db";
import { validateCheckout } from "./actions";
import type { CartItem } from "@/entities/cart";

// Helper to create mock cart item
function createMockCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "item-1",
    productId: "prod-1",
    productName: "Test Product",
    productSlug: "test-product",
    variantId: "var-1",
    variantName: "Default",
    price: 100000,
    quantity: 2,
    stock: 10,
    image: "/test.jpg",
    vendorId: "vendor-1",
    vendorName: "Test Vendor",
    ...overrides,
  };
}

describe("Checkout Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // validateCheckout - Validate stock trước checkout
  // ============================================================
  describe("validateCheckout", () => {
    it("should return valid when all items have sufficient stock", async () => {
      const items: CartItem[] = [
        createMockCartItem({ variantId: "var-1", quantity: 2 }),
        createMockCartItem({ variantId: "var-2", quantity: 3 }),
      ];

      vi.mocked(prisma.productVariant.findUnique)
        .mockResolvedValueOnce({
          stock: 10,
          name: "Default",
          product: { name: "Product 1" },
        } as never)
        .mockResolvedValueOnce({
          stock: 5,
          name: "Large",
          product: { name: "Product 2" },
        } as never);

      const result = await validateCheckout(items);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });

    it("should return invalid when item has insufficient stock", async () => {
      const items: CartItem[] = [
        createMockCartItem({ variantId: "var-1", quantity: 5 }),
      ];

      vi.mocked(prisma.productVariant.findUnique).mockResolvedValueOnce({
        stock: 2, // Less than requested quantity
        name: "Default",
        product: { name: "Test Product" },
      } as never);

      const result = await validateCheckout(items);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(1);
      expect(result.invalidItems[0].variantId).toBe("var-1");
      expect(result.invalidItems[0].requestedQuantity).toBe(5);
      expect(result.invalidItems[0].availableStock).toBe(2);
    });

    it("should return invalid when variant not found", async () => {
      const items: CartItem[] = [
        createMockCartItem({ variantId: "nonexistent", productName: "Ghost Product" }),
      ];

      vi.mocked(prisma.productVariant.findUnique).mockResolvedValueOnce(null);

      const result = await validateCheckout(items);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(1);
      expect(result.invalidItems[0].availableStock).toBe(0);
    });

    it("should check all items and return all invalid ones", async () => {
      const items: CartItem[] = [
        createMockCartItem({ variantId: "var-1", quantity: 10 }),
        createMockCartItem({ variantId: "var-2", quantity: 5 }),
        createMockCartItem({ variantId: "var-3", quantity: 3 }),
      ];

      vi.mocked(prisma.productVariant.findUnique)
        .mockResolvedValueOnce({
          stock: 5, // Not enough
          name: "Variant 1",
          product: { name: "Product 1" },
        } as never)
        .mockResolvedValueOnce({
          stock: 5, // Exactly enough
          name: "Variant 2",
          product: { name: "Product 2" },
        } as never)
        .mockResolvedValueOnce({
          stock: 1, // Not enough
          name: "Variant 3",
          product: { name: "Product 3" },
        } as never);

      const result = await validateCheckout(items);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(2);
      expect(result.invalidItems.map((i) => i.variantId)).toContain("var-1");
      expect(result.invalidItems.map((i) => i.variantId)).toContain("var-3");
    });

    it("should handle empty cart", async () => {
      const result = await validateCheckout([]);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });
  });
});
