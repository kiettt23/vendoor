import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCartItem } from "../../helpers/fixtures";

// ============================================================================
// Mock Setup - Sử dụng vi.hoisted() để tránh lỗi hoisting
// ============================================================================

// Mock server-only để tránh lỗi
vi.mock("server-only", () => ({}));

// Tạo mock trước với vi.hoisted()
const mockPrisma = vi.hoisted(() => ({
  productVariant: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/shared/lib/db", () => ({
  prisma: mockPrisma,
}));

// Import sau khi mock
import { validateCheckout } from "@/features/checkout/api/actions";

// ============================================================================
// Tests
// ============================================================================

describe("validateCheckout - Kiểm tra tồn kho trước checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Valid cart - Giỏ hàng hợp lệ", () => {
    it("returns valid when all items have sufficient stock - đủ hàng", async () => {
      const cartItems = [
        createCartItem({ variantId: "v1", quantity: 2 }),
        createCartItem({ id: "cart-2", variantId: "v2", quantity: 1 }),
      ];

      mockPrisma.productVariant.findUnique
        .mockResolvedValueOnce({
          id: "v1",
          stock: 10,
          name: "Đỏ - M",
          product: { name: "Áo thun nam" },
        })
        .mockResolvedValueOnce({
          id: "v2",
          stock: 5,
          name: "Xanh - L",
          product: { name: "Quần jean" },
        });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });

    it("returns valid when stock equals requested quantity - vừa đủ", async () => {
      const cartItems = [createCartItem({ variantId: "v1", quantity: 5 })];

      mockPrisma.productVariant.findUnique.mockResolvedValueOnce({
        id: "v1",
        stock: 5, // Vừa đúng 5
        name: "Đỏ - M",
        product: { name: "Áo thun nam" },
      });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(true);
    });
  });

  describe("Insufficient stock - Không đủ hàng", () => {
    it("returns invalid when stock is insufficient - thiếu hàng", async () => {
      const cartItems = [createCartItem({ variantId: "v1", quantity: 5 })];

      mockPrisma.productVariant.findUnique.mockResolvedValueOnce({
        id: "v1",
        stock: 2, // Chỉ còn 2, đặt 5
        name: "Đỏ - M",
        product: { name: "Áo thun nam" },
      });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(1);
      expect(result.invalidItems[0]).toMatchObject({
        variantId: "v1",
        requestedQuantity: 5,
        availableStock: 2,
        productName: "Áo thun nam",
      });
    });

    it("handles out of stock items - hết hàng hoàn toàn", async () => {
      const cartItems = [createCartItem({ variantId: "v1", quantity: 1 })];

      mockPrisma.productVariant.findUnique.mockResolvedValueOnce({
        id: "v1",
        stock: 0, // Hết hàng
        name: "Đỏ - M",
        product: { name: "Áo thun nam" },
      });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems[0].availableStock).toBe(0);
    });

    it("handles deleted variant - variant đã bị xóa", async () => {
      const cartItems = [
        createCartItem({
          variantId: "v-deleted",
          productName: "Sản phẩm cũ",
          variantName: "Variant cũ",
          quantity: 1,
        }),
      ];

      mockPrisma.productVariant.findUnique.mockResolvedValueOnce(null);

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems[0]).toMatchObject({
        variantId: "v-deleted",
        availableStock: 0,
        // Fallback to cart item names
        productName: "Sản phẩm cũ",
        variantName: "Variant cũ",
      });
    });
  });

  describe("Mixed cart - Giỏ hàng hỗn hợp", () => {
    it("returns all invalid items - liệt kê tất cả item lỗi", async () => {
      const cartItems = [
        createCartItem({ id: "c1", variantId: "v1", quantity: 10 }),
        createCartItem({ id: "c2", variantId: "v2", quantity: 5 }),
        createCartItem({ id: "c3", variantId: "v3", quantity: 1 }),
      ];

      mockPrisma.productVariant.findUnique
        .mockResolvedValueOnce({
          id: "v1",
          stock: 3, // Thiếu (10 > 3)
          name: "V1",
          product: { name: "Product 1" },
        })
        .mockResolvedValueOnce({
          id: "v2",
          stock: 10, // OK (5 <= 10)
          name: "V2",
          product: { name: "Product 2" },
        })
        .mockResolvedValueOnce({
          id: "v3",
          stock: 0, // Hết hàng
          name: "V3",
          product: { name: "Product 3" },
        });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(2); // v1 và v3
      expect(result.invalidItems.map((i) => i.variantId)).toEqual(["v1", "v3"]);
    });
  });

  describe("Edge cases - Trường hợp biên", () => {
    it("handles empty cart - giỏ hàng rỗng", async () => {
      const result = await validateCheckout([]);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });

    it("handles large cart - giỏ hàng nhiều items", async () => {
      const cartItems = Array.from({ length: 50 }, (_, i) =>
        createCartItem({ id: `c${i}`, variantId: `v${i}`, quantity: 1 })
      );

      // Mock tất cả đều đủ hàng
      cartItems.forEach(() => {
        mockPrisma.productVariant.findUnique.mockResolvedValueOnce({
          id: "variant",
          stock: 100,
          name: "Variant",
          product: { name: "Product" },
        });
      });

      const result = await validateCheckout(cartItems);

      expect(result.isValid).toBe(true);
      expect(mockPrisma.productVariant.findUnique).toHaveBeenCalledTimes(50);
    });
  });
});
