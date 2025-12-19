import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CartItem } from "@/entities/cart/model/types";
import { createCartItem, createMultiVendorCart } from "../../helpers/fixtures";

// ============================================================================
// Mock Setup - Sử dụng vi.hoisted() để tránh lỗi hoisting
// ============================================================================

vi.mock("server-only", () => ({}));

// Tạo mocks với vi.hoisted()
const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock("@/shared/lib/auth/session", () => ({
  getSession: () => mockGetSession(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

const mockPrisma = vi.hoisted(() => ({
  vendorProfile: {
    findMany: vi.fn(),
  },
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
  $transaction: vi.fn(),
}));
vi.mock("@/shared/lib/db", () => ({
  prisma: mockPrisma,
}));

// Import sau khi mock
import { createOrders } from "@/features/checkout/api/actions";

// ============================================================================
// Tests
// ============================================================================

describe("createOrders - Tạo đơn hàng", () => {
  const validShippingInfo = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "test@example.com",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP.HCM",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: user is logged in
    mockGetSession.mockResolvedValue({
      user: { id: "user-123", email: "test@example.com" },
    });
  });

  describe("Authentication - Xác thực", () => {
    it("returns error when not logged in - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await createOrders(
        [createCartItem()],
        validShippingInfo,
        "COD"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("đăng nhập");
    });

    it("returns error when session has no user", async () => {
      mockGetSession.mockResolvedValue({ user: null });

      const result = await createOrders(
        [createCartItem()],
        validShippingInfo,
        "COD"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("đăng nhập");
    });
  });

  describe("Cart validation - Validate giỏ hàng", () => {
    it("returns error when cart is empty - giỏ hàng rỗng", async () => {
      const result = await createOrders([], validShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Giỏ hàng trống");
    });

    it("returns error when cart is null", async () => {
      const result = await createOrders(
        null as unknown as CartItem[],
        validShippingInfo,
        "COD"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Giỏ hàng trống");
    });
  });

  describe("Vendor validation - Validate vendor", () => {
    it("returns error when vendor does not exist - vendor không tồn tại", async () => {
      const cartItems = [createCartItem({ vendorId: "invalid-vendor" })];

      // Vendor không tồn tại
      mockPrisma.vendorProfile.findMany.mockResolvedValue([]);

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không hợp lệ");
    });

    it("validates all vendor IDs exist - kiểm tra tất cả vendor", async () => {
      const cartItems = createMultiVendorCart(); // vendor-1, vendor-2

      // Chỉ vendor-1 tồn tại
      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không hợp lệ");
    });
  });

  describe("Successful order creation - Tạo đơn thành công", () => {
    it("creates orders successfully with COD - tạo đơn COD", async () => {
      const cartItems = [createCartItem({ vendorId: "vendor-1" })];

      // Setup mocks
      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      // Mock transaction
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({
              stock: 10,
              name: "Đỏ - M",
              product: { name: "Áo thun" },
            }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn().mockResolvedValue({
              id: "order-1",
              orderNumber: "ORD-20241219-ABC123",
              vendorId: "vendor-1",
              total: 180000,
              status: "PENDING",
              vendor: { shopName: "Shop ABC" },
            }),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "payment-1" }),
          },
        };

        return callback(txMock);
      });

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(1);
    });

    it("creates separate orders per vendor - tách đơn theo vendor", async () => {
      const cartItems = createMultiVendorCart();

      mockPrisma.vendorProfile.findMany.mockResolvedValue([
        { id: "vendor-1" },
        { id: "vendor-2" },
      ]);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({
              stock: 100,
              name: "Variant",
              product: { name: "Product" },
            }),
            update: vi.fn(),
          },
          order: {
            create: vi
              .fn()
              .mockResolvedValueOnce({
                id: "order-1",
                orderNumber: "ORD-1",
                vendorId: "vendor-1",
                total: 280000,
                status: "PENDING",
                vendor: { shopName: "Shop A" },
              })
              .mockResolvedValueOnce({
                id: "order-2",
                orderNumber: "ORD-2",
                vendorId: "vendor-2",
                total: 230000,
                status: "PENDING",
                vendor: { shopName: "Shop B" },
              }),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "payment-1" }),
          },
        };

        return callback(txMock);
      });

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(2);
    });
  });

  describe("Payment method - Phương thức thanh toán", () => {
    it("sets PENDING status for COD", async () => {
      const cartItems = [createCartItem({ vendorId: "vendor-1" })];

      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      let capturedStatus: string | undefined;
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({
              stock: 10,
              name: "V",
              product: { name: "P" },
            }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn().mockImplementation((args) => {
              capturedStatus = args.data.status;
              return {
                id: "order-1",
                orderNumber: "ORD-1",
                vendorId: "vendor-1",
                total: 100000,
                status: args.data.status,
                vendor: { shopName: "Shop" },
              };
            }),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "p1" }),
          },
        };
        return callback(txMock);
      });

      await createOrders(cartItems, validShippingInfo, "COD");

      expect(capturedStatus).toBe("PENDING");
    });

    it("sets PENDING_PAYMENT status for STRIPE", async () => {
      const cartItems = [createCartItem({ vendorId: "vendor-1" })];

      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      let capturedStatus: string | undefined;
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({
              stock: 10,
              name: "V",
              product: { name: "P" },
            }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn().mockImplementation((args) => {
              capturedStatus = args.data.status;
              return {
                id: "order-1",
                orderNumber: "ORD-1",
                vendorId: "vendor-1",
                total: 100000,
                status: args.data.status,
                vendor: { shopName: "Shop" },
              };
            }),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn().mockResolvedValue({ id: "p1" }),
          },
        };
        return callback(txMock);
      });

      await createOrders(cartItems, validShippingInfo, "STRIPE");

      expect(capturedStatus).toBe("PENDING_PAYMENT");
    });
  });

  describe("Error handling - Xử lý lỗi", () => {
    it("handles stock validation error in transaction", async () => {
      const cartItems = [createCartItem({ vendorId: "vendor-1", quantity: 10 })];

      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue({
              stock: 2, // Chỉ còn 2, yêu cầu 10
              name: "Đỏ - M",
              product: { name: "Áo thun" },
            }),
            update: vi.fn(),
          },
          order: {
            create: vi.fn(),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn(),
          },
        };
        return callback(txMock);
      });

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không đủ hàng");
    });

    it("handles deleted product error", async () => {
      const cartItems = [createCartItem({ vendorId: "vendor-1" })];

      mockPrisma.vendorProfile.findMany.mockResolvedValue([{ id: "vendor-1" }]);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const txMock = {
          productVariant: {
            findUnique: vi.fn().mockResolvedValue(null), // Đã bị xóa
            update: vi.fn(),
          },
          order: {
            create: vi.fn(),
            updateMany: vi.fn(),
          },
          payment: {
            create: vi.fn(),
          },
        };
        return callback(txMock);
      });

      const result = await createOrders(cartItems, validShippingInfo, "COD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("không tồn tại");
    });
  });
});
