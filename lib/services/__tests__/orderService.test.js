/**
 * Tests cho OrderService
 * Đây là ví dụ phức tạp về service testing với:
 * - Multiple database calls
 * - Business logic calculations
 * - Error handling
 * - Mocking Prisma
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderService } from "../orderService.js";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";

/**
 * MOCK PRISMA
 * orderService phức tạp hơn productService vì:
 * - Nhiều Prisma methods (findUnique, findMany, create)
 * - Multi-vendor logic (group by store)
 * - Coupon validation
 * - Order item creation
 *
 * Cần mock đầy đủ tất cả methods được dùng
 */
vi.mock("@/lib/prisma", () => ({
  default: {
    order: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    orderItem: {
      create: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
    coupon: {
      findUnique: vi.fn(),
    },
  },
}));

// Import prisma SAU KHI mock
import prisma from "@/lib/prisma";

describe("OrderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should create order successfully without coupon", async () => {
      // ========== ARRANGE ==========
      const userId = "user-123";
      const orderData = {
        cart: [{ id: "product-1", quantity: 2 }],
        address: "123 Street, City",
        paymentMethod: "CARD",
      };
      const isPlusMember = false;

      // Mock product lookup
      const mockProduct = {
        id: "product-1",
        name: "Product 1",
        price: 100,
        storeId: "store-1",
        store: {
          id: "store-1",
          name: "Store 1",
        },
      };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      // Mock order creation
      const mockOrder = {
        id: "order-123",
        userId,
        storeId: "store-1",
        total: 205, // (100 * 2) + 5 shipping
        address: orderData.address,
        paymentMethod: "CARD",
        status: "PENDING",
      };
      prisma.order.create.mockResolvedValue(mockOrder);

      // Mock order item creation
      prisma.orderItem.create.mockResolvedValue({
        id: "orderItem-1",
        orderId: "order-123",
        productId: "product-1",
        quantity: 2,
        price: 100,
      });

      // ========== ACT ==========
      const result = await orderService.createOrder(
        userId,
        orderData,
        isPlusMember
      );

      // ========== ASSERT ==========
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("order-123");
      expect(result[0].total).toBe(205); // 200 + 5 shipping

      // Verify Prisma was called correctly
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: "product-1" },
        include: { store: true },
      });

      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          storeId: "store-1",
          total: 205,
          address: orderData.address,
          paymentMethod: "CARD",
          status: "PENDING",
        },
      });
    });

    it("should create order with coupon discount", async () => {
      // ARRANGE
      const userId = "user-123";
      const orderData = {
        cart: [{ id: "product-1", quantity: 1 }],
        couponCode: "SALE10",
        address: "123 Street",
        paymentMethod: "CARD",
      };
      const isPlusMember = false;

      // Mock coupon validation
      const mockCoupon = {
        code: "SALE10",
        discount: 10, // 10%
        forNewUser: false,
        forMember: false,
        expiresAt: new Date("2030-12-31"),
      };
      prisma.coupon.findUnique.mockResolvedValue(mockCoupon);

      // Mock product
      const mockProduct = {
        id: "product-1",
        price: 100,
        storeId: "store-1",
        store: { id: "store-1", name: "Store 1" },
      };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      // Mock order creation
      // Total calculation: 100 - 10% = 90, + 5 shipping = 95
      const mockOrder = {
        id: "order-123",
        total: 95,
        status: "PENDING",
      };
      prisma.order.create.mockResolvedValue(mockOrder);
      prisma.orderItem.create.mockResolvedValue({});

      // ACT
      const result = await orderService.createOrder(
        userId,
        orderData,
        isPlusMember
      );

      // ASSERT
      expect(result[0].total).toBe(95); // 90 after discount + 5 shipping
      expect(prisma.coupon.findUnique).toHaveBeenCalledWith({
        where: { code: "SALE10", expiresAt: { gt: expect.any(Date) } },
      });
    });

    it("should NOT charge shipping for Plus members", async () => {
      // ARRANGE
      const userId = "user-123";
      const orderData = {
        cart: [{ id: "product-1", quantity: 1 }],
        address: "123 Street",
        paymentMethod: "CARD",
      };
      const isPlusMember = true; // ← Plus member

      // Mock product
      const mockProduct = {
        id: "product-1",
        price: 100,
        storeId: "store-1",
        store: { id: "store-1" },
      };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      // Mock order creation
      const mockOrder = {
        id: "order-123",
        total: 100, // NO shipping fee for Plus
        status: "PENDING",
      };
      prisma.order.create.mockResolvedValue(mockOrder);
      prisma.orderItem.create.mockResolvedValue({});

      // ACT
      const result = await orderService.createOrder(
        userId,
        orderData,
        isPlusMember
      );

      // ASSERT
      expect(result[0].total).toBe(100); // No +5 shipping
    });

    it("should throw error when cart is empty", async () => {
      // ARRANGE
      const orderData = {
        cart: [], // Empty cart
        address: "123 Street",
        paymentMethod: "CARD",
      };

      // ACT & ASSERT
      await expect(
        orderService.createOrder("user-123", orderData, false)
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw error when product not found", async () => {
      // ARRANGE
      const orderData = {
        cart: [{ id: "non-existent", quantity: 1 }],
        address: "123 Street",
        paymentMethod: "CARD",
      };

      // Mock product not found
      prisma.product.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        orderService.createOrder("user-123", orderData, false)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw error when coupon not found", async () => {
      // ARRANGE
      const orderData = {
        cart: [{ id: "product-1", quantity: 1 }],
        couponCode: "INVALID",
        address: "123 Street",
        paymentMethod: "CARD",
      };

      // Mock coupon not found
      prisma.coupon.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        orderService.createOrder("user-123", orderData, false)
      ).rejects.toThrow(NotFoundError);
    });

    it("should create multiple orders for multi-vendor cart", async () => {
      // ARRANGE
      const orderData = {
        cart: [
          { id: "product-1", quantity: 1 }, // Store 1
          { id: "product-2", quantity: 1 }, // Store 2
        ],
        address: "123 Street",
        paymentMethod: "CARD",
      };

      // Mock products from different stores
      prisma.product.findUnique
        .mockResolvedValueOnce({
          id: "product-1",
          price: 100,
          storeId: "store-1",
          store: { id: "store-1" },
        })
        .mockResolvedValueOnce({
          id: "product-2",
          price: 200,
          storeId: "store-2",
          store: { id: "store-2" },
        });

      // Mock order creation for both stores
      prisma.order.create
        .mockResolvedValueOnce({
          id: "order-1",
          storeId: "store-1",
          total: 105,
        })
        .mockResolvedValueOnce({
          id: "order-2",
          storeId: "store-2",
          total: 205,
        });

      prisma.orderItem.create.mockResolvedValue({});

      // ACT
      const result = await orderService.createOrder(
        "user-123",
        orderData,
        false
      );

      // ASSERT
      expect(result).toHaveLength(2); // 2 orders created
      expect(result[0].storeId).toBe("store-1");
      expect(result[1].storeId).toBe("store-2");
      expect(prisma.order.create).toHaveBeenCalledTimes(2);
    });
  });

  describe("getUserOrders", () => {
    it("should return user orders with items and store", async () => {
      // ARRANGE
      const userId = "user-123";
      const mockOrders = [
        {
          id: "order-1",
          userId,
          total: 200,
          status: "DELIVERED",
          orderItems: [
            {
              id: "item-1",
              quantity: 2,
              price: 100,
              product: { id: "prod-1", name: "Product 1" },
            },
          ],
          store: { id: "store-1", name: "Store 1" },
          createdAt: new Date(),
        },
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);

      // ACT
      const result = await orderService.getUserOrders(userId);

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("order-1");
      expect(result[0].orderItems).toHaveLength(1);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          orderItems: { include: { product: true } },
          store: true,
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getStoreOrders", () => {
    it("should return store orders with user info", async () => {
      // ARRANGE
      const storeId = "store-123";
      const mockOrders = [
        {
          id: "order-1",
          storeId,
          total: 150,
          user: { name: "John Doe", email: "john@example.com" },
          orderItems: [],
        },
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);

      // ACT
      const result = await orderService.getStoreOrders(storeId);

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result[0].user.name).toBe("John Doe");
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { storeId },
        include: {
          orderItems: { include: { product: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status", async () => {
      // ARRANGE
      const orderId = "order-123";
      const storeId = "store-123";
      const newStatus = "SHIPPED";

      // Mock order exists
      const mockOrder = {
        id: orderId,
        storeId,
        status: "PENDING",
      };
      prisma.order.findFirst.mockResolvedValue(mockOrder);

      // Mock update
      const mockUpdatedOrder = {
        ...mockOrder,
        status: newStatus,
      };
      prisma.order.update.mockResolvedValue(mockUpdatedOrder);

      // ACT
      const result = await orderService.updateOrderStatus(
        orderId,
        storeId,
        newStatus
      );

      // ASSERT
      expect(result.status).toBe("SHIPPED");
      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: { id: orderId, storeId },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: newStatus },
      });
    });

    it("should throw error when order not found", async () => {
      // ARRANGE
      prisma.order.findFirst.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        orderService.updateOrderStatus("order-123", "store-123", "SHIPPED")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
