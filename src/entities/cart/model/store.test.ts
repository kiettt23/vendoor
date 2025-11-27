/**
 * Unit Tests cho Cart Store (Zustand)
 *
 * 📚 Test state management cho giỏ hàng
 *
 * Lưu ý: Zustand store cần reset state giữa các tests
 * để tránh side effects.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "@testing-library/react";
import { useCartStore } from "./store";
import type { CartItem } from "./types";

// Mock sonner toast để không show notifications trong tests
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Helper: Tạo mock cart item
function createMockItem(overrides?: Partial<CartItem>): CartItem {
  return {
    id: "variant-1",
    productId: "product-1",
    productName: "Test Product",
    productSlug: "test-product",
    variantId: "variant-1",
    variantName: "Default",
    price: 100000,
    quantity: 1,
    image: "/test.jpg",
    stock: 10,
    vendorId: "vendor-1",
    vendorName: "Test Vendor",
    ...overrides,
  };
}

describe("useCartStore", () => {
  // Reset store state trước mỗi test
  beforeEach(() => {
    act(() => {
      useCartStore.setState({ items: [] });
    });
  });

  // ============================================================
  // addItem - Thêm sản phẩm vào giỏ
  // ============================================================
  describe("addItem", () => {
    it("should add new item to empty cart", () => {
      const item = createMockItem();

      act(() => {
        useCartStore.getState().addItem(item);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].productName).toBe("Test Product");
    });

    it("should increase quantity when adding existing item", () => {
      const item = createMockItem();

      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().addItem(item);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("should not exceed stock when adding items", () => {
      const item = createMockItem({ stock: 2 });

      act(() => {
        useCartStore.getState().addItem({ ...item, quantity: 1 });
        useCartStore.getState().addItem({ ...item, quantity: 1 });
        useCartStore.getState().addItem({ ...item, quantity: 1 }); // Should fail
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(2); // Max stock
    });

    it("should handle items with different variants", () => {
      const item1 = createMockItem({ id: "variant-1", variantId: "variant-1" });
      const item2 = createMockItem({ id: "variant-2", variantId: "variant-2" });

      act(() => {
        useCartStore.getState().addItem(item1);
        useCartStore.getState().addItem(item2);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  // ============================================================
  // updateQuantity - Cập nhật số lượng
  // ============================================================
  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const item = createMockItem();

      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().updateQuantity("variant-1", 5);
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it("should not update to quantity exceeding stock", () => {
      const item = createMockItem({ stock: 5 });

      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().updateQuantity("variant-1", 10);
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(1); // Stays at original
    });

    it("should not update to zero or negative quantity", () => {
      const item = createMockItem();

      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().updateQuantity("variant-1", 0);
      });

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(1); // Unchanged
    });

    it("should do nothing for non-existent item", () => {
      act(() => {
        useCartStore.getState().updateQuantity("non-existent", 5);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  // ============================================================
  // removeItem - Xóa sản phẩm
  // ============================================================
  describe("removeItem", () => {
    it("should remove item from cart", () => {
      const item = createMockItem();

      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().removeItem("variant-1");
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it("should only remove specific item", () => {
      const item1 = createMockItem({ id: "variant-1", variantId: "variant-1" });
      const item2 = createMockItem({ id: "variant-2", variantId: "variant-2" });

      act(() => {
        useCartStore.getState().addItem(item1);
        useCartStore.getState().addItem(item2);
        useCartStore.getState().removeItem("variant-1");
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("variant-2");
    });
  });

  // ============================================================
  // clearCart - Xóa toàn bộ giỏ hàng
  // ============================================================
  describe("clearCart", () => {
    it("should remove all items", () => {
      const item1 = createMockItem({ id: "variant-1" });
      const item2 = createMockItem({ id: "variant-2" });

      act(() => {
        useCartStore.getState().addItem(item1);
        useCartStore.getState().addItem(item2);
        useCartStore.getState().clearCart();
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });
});
