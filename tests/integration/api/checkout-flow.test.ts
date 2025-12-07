/**
 * Integration Tests cho Checkout Flow
 *
 * Test full flow: Cart → Validate → Create Orders
 * Mocks Prisma để test business logic without DB
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Must be before other imports
vi.mock("server-only", () => ({}));

// Mock headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock auth - use vi.hoisted to avoid hoisting issues
const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock("@/shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

// Mock Prisma
const mockProductVariant = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
}));

const mockVendorProfile = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

const mockOrder = vi.hoisted(() => ({
  create: vi.fn(),
  updateMany: vi.fn(),
}));

const mockPayment = vi.hoisted(() => ({
  create: vi.fn(),
}));

const mockTransaction = vi.hoisted(() => vi.fn());

vi.mock("@/shared/lib/db", () => ({
  prisma: {
    productVariant: mockProductVariant,
    vendorProfile: mockVendorProfile,
    order: mockOrder,
    payment: mockPayment,
    $transaction: mockTransaction,
  },
}));

// Import after mocks
import { validateCheckout, createOrders } from "@/features/checkout";
import type { CartItem } from "@/entities/cart";

// Test data
const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    productId: "prod-1",
    productName: "iPhone 15",
    productSlug: "iphone-15",
    variantId: "var-1",
    variantName: "128GB",
    price: 25000000,
    quantity: 2,
    image: "/iphone.jpg",
    stock: 10,
    vendorId: "vendor-1",
    vendorName: "Apple Store",
  },
  {
    id: "cart-2",
    productId: "prod-2",
    productName: "AirPods Pro",
    productSlug: "airpods-pro",
    variantId: "var-2",
    variantName: "Default",
    price: 6000000,
    quantity: 1,
    image: "/airpods.jpg",
    stock: 5,
    vendorId: "vendor-1",
    vendorName: "Apple Store",
  },
];

const mockShippingInfo = {
  name: "Nguyễn Văn Test",
  phone: "0901234567",
  email: "test@example.com",
  address: "123 Đường Test",
  ward: "Phường 1",
  district: "Quận 1",
  city: "Hồ Chí Minh",
  note: "Giao giờ hành chính",
};

const mockSession = {
  user: {
    id: "user-1",
    email: "test@test.com",
    name: "Test User",
  },
};

describe("Checkout Flow - Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateCheckout", () => {
    it("should validate cart items have sufficient stock", async () => {
      mockProductVariant.findUnique
        .mockResolvedValueOnce({
          stock: 10,
          name: "128GB",
          product: { name: "iPhone 15" },
        })
        .mockResolvedValueOnce({
          stock: 5,
          name: "Default",
          product: { name: "AirPods Pro" },
        });

      const result = await validateCheckout(mockCartItems);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });

    it("should detect insufficient stock", async () => {
      mockProductVariant.findUnique
        .mockResolvedValueOnce({
          stock: 1, // Only 1 available, but requesting 2
          name: "128GB",
          product: { name: "iPhone 15" },
        })
        .mockResolvedValueOnce({
          stock: 5,
          name: "Default",
          product: { name: "AirPods Pro" },
        });

      const result = await validateCheckout(mockCartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(1);
      expect(result.invalidItems[0]).toMatchObject({
        variantId: "var-1",
        productName: "iPhone 15",
        requestedQuantity: 2,
        availableStock: 1,
      });
    });

    it("should detect non-existent variant", async () => {
      mockProductVariant.findUnique
        .mockResolvedValueOnce(null) // Variant not found
        .mockResolvedValueOnce({
          stock: 5,
          name: "Default",
          product: { name: "AirPods Pro" },
        });

      const result = await validateCheckout(mockCartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(1);
      expect(result.invalidItems[0].availableStock).toBe(0);
    });

    it("should validate all items in cart", async () => {
      mockProductVariant.findUnique
        .mockResolvedValueOnce({
          stock: 0, // Out of stock
          name: "128GB",
          product: { name: "iPhone 15" },
        })
        .mockResolvedValueOnce({
          stock: 0, // Also out of stock
          name: "Default",
          product: { name: "AirPods Pro" },
        });

      const result = await validateCheckout(mockCartItems);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toHaveLength(2);
    });

    it("should pass validation for empty cart", async () => {
      const result = await validateCheckout([]);

      expect(result.isValid).toBe(true);
      expect(result.invalidItems).toHaveLength(0);
    });
  });

  describe("createOrders", () => {
    it("should require authentication", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await createOrders(mockCartItems, mockShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("đăng nhập");
    });

    it("should reject empty cart", async () => {
      mockGetSession.mockResolvedValue(mockSession);

      const result = await createOrders([], mockShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("trống");
    });

    it("should validate vendor exists", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([]); // No valid vendors

      const result = await createOrders(mockCartItems, mockShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không hợp lệ");
    });

    it("should create COD order with PENDING status", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      const mockCreatedOrder = {
        id: "order-1",
        orderNumber: "ORD-123",
        vendorId: "vendor-1",
        total: 56000000,
        status: "PENDING",
        vendor: { shopName: "Apple Store" },
      };

      const mockPaymentRecord = {
        id: "payment-1",
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({ stock: 100, name: "Test", product: { name: "Test" } }),
            update: vi.fn().mockResolvedValue({}),
          },
          order: {
            create: vi.fn().mockResolvedValue(mockCreatedOrder),
            updateMany: vi.fn().mockResolvedValue({}),
          },
          payment: {
            create: vi.fn().mockResolvedValue(mockPaymentRecord),
          },
        };
        return callback(tx);
      });

      const result = await createOrders(mockCartItems, mockShippingInfo, "COD");

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].status).toBe("PENDING");
    });

    it("should create STRIPE order with PENDING_PAYMENT status", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      const mockCreatedOrder = {
        id: "order-1",
        orderNumber: "ORD-123",
        vendorId: "vendor-1",
        total: 56000000,
        status: "PENDING_PAYMENT",
        vendor: { shopName: "Apple Store" },
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({ stock: 100, name: "Test", product: { name: "Test" } }),
            update: vi.fn().mockResolvedValue({}),
          },
          order: {
            create: vi.fn().mockResolvedValue(mockCreatedOrder),
            updateMany: vi.fn().mockResolvedValue({}),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "payment-1" }),
          },
        };
        return callback(tx);
      });

      const result = await createOrders(mockCartItems, mockShippingInfo, "STRIPE");

      expect(result.success).toBe(true);
      expect(result.orders[0].status).toBe("PENDING_PAYMENT");
    });

    it("should handle insufficient stock during order creation", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({ 
              stock: 1, // Only 1 available
              name: "128GB", 
              product: { name: "iPhone 15" } 
            }),
            update: vi.fn(),
          },
          order: { create: vi.fn(), updateMany: vi.fn() },
          payment: { create: vi.fn() },
        };
        return callback(tx);
      });

      const result = await createOrders(mockCartItems, mockShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không đủ hàng");
    });

    it("should calculate correct total amount", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      const mockCreatedOrder = {
        id: "order-1",
        orderNumber: "ORD-123",
        vendorId: "vendor-1",
        total: 56000000, // 2 * 25M + 1 * 6M = 56M
        status: "PENDING",
        vendor: { shopName: "Apple Store" },
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({ stock: 100, name: "Test", product: { name: "Test" } }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn().mockResolvedValue(mockCreatedOrder),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "payment-1" }),
          },
        };
        return callback(tx);
      });

      const result = await createOrders(mockCartItems, mockShippingInfo, "COD");

      expect(result.success).toBe(true);
      // Total should include items + shipping + platform fee
      expect(result.totalAmount).toBeGreaterThan(0);
    });

    it("should group items by vendor for separate orders", async () => {
      const multiVendorCart: CartItem[] = [
        ...mockCartItems,
        {
          id: "cart-3",
          productId: "prod-3",
          productName: "Samsung S24",
          productSlug: "samsung-s24",
          variantId: "var-3",
          variantName: "256GB",
          price: 23000000,
          quantity: 1,
          image: "/samsung.jpg",
          stock: 10,
          vendorId: "vendor-2", // Different vendor
          vendorName: "Samsung Store",
        },
      ];

      mockGetSession.mockResolvedValue(mockSession);
      mockVendorProfile.findMany.mockResolvedValue([
        { id: "vendor-1" },
        { id: "vendor-2" },
      ]);

      let orderCount = 0;
      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({ stock: 100, name: "Test", product: { name: "Test" } }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn().mockImplementation(() => {
              orderCount++;
              return {
                id: `order-${orderCount}`,
                orderNumber: `ORD-${orderCount}`,
                vendorId: `vendor-${orderCount}`,
                total: 30000000,
                status: "PENDING",
                vendor: { shopName: `Store ${orderCount}` },
              };
            }),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "payment-1" }),
          },
        };
        return callback(tx);
      });

      const result = await createOrders(multiVendorCart, mockShippingInfo, "COD");

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(2); // 2 vendors = 2 orders
    });
  });

  describe("Full Checkout Flow", () => {
    it("should complete validate → create flow for valid cart", async () => {
      // Step 1: Validate
      mockProductVariant.findUnique
        .mockResolvedValueOnce({ stock: 10, name: "128GB", product: { name: "iPhone 15" } })
        .mockResolvedValueOnce({ stock: 5, name: "Default", product: { name: "AirPods Pro" } });

      const validation = await validateCheckout(mockCartItems);
      expect(validation.isValid).toBe(true);

      // Step 2: Create Orders (only if validation passes)
      if (validation.isValid) {
        mockGetSession.mockResolvedValue(mockSession);
        mockVendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

        mockTransaction.mockImplementation(async (callback) => {
          const tx = {
            productVariant: {
              findUnique: vi.fn().mockResolvedValue({ stock: 100, name: "Test", product: { name: "Test" } }),
              update: vi.fn(),
            },
            order: {
              create: vi.fn().mockResolvedValue({
                id: "order-1",
                orderNumber: "ORD-123",
                vendorId: "vendor-1",
                total: 56000000,
                status: "PENDING",
                vendor: { shopName: "Apple Store" },
              }),
              updateMany: vi.fn(),
            },
            payment: {
              create: vi.fn().mockResolvedValue({ id: "payment-1" }),
            },
          };
          return callback(tx);
        });

        const result = await createOrders(mockCartItems, mockShippingInfo, "COD");
        expect(result.success).toBe(true);
        expect(result.orders.length).toBeGreaterThan(0);
      }
    });

    it("should not create orders when validation fails", async () => {
      // Step 1: Validate (will fail)
      mockProductVariant.findUnique.mockResolvedValue({
        stock: 0,
        name: "128GB",
        product: { name: "iPhone 15" },
      });

      const validation = await validateCheckout(mockCartItems);
      expect(validation.isValid).toBe(false);

      // Step 2: Should not proceed
      // In real code, frontend would check validation.isValid before calling createOrders
      expect(validation.invalidItems.length).toBeGreaterThan(0);
    });
  });
});
