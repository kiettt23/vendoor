/**
 * Integration Tests cho Vendor Analytics
 *
 * Test analytics queries với mocked Prisma
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
    },
    orderItem: {
      groupBy: vi.fn(),
    },
    productVariant: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/shared/lib/db";
import { getVendorAnalytics } from "@/features/vendor-analytics";

describe("Vendor Analytics - Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getVendorAnalytics", () => {
    const mockOrders = [
      { vendorEarnings: 500000, createdAt: new Date() },
      { vendorEarnings: 300000, createdAt: new Date() },
      { vendorEarnings: 200000, createdAt: new Date() },
    ];

    const mockPrevOrders = [{ vendorEarnings: 400000, createdAt: new Date() }];

    beforeEach(() => {
      // Current period orders
      vi.mocked(prisma.order.findMany)
        .mockResolvedValueOnce(mockOrders as any) // Current period
        .mockResolvedValueOnce(mockPrevOrders as any) // Previous period
        .mockResolvedValueOnce(mockOrders as any); // Daily revenue

      // Top products
      vi.mocked(prisma.orderItem.groupBy).mockResolvedValue([
        { variantId: "var-1", _sum: { quantity: 10, subtotal: 500000 } },
      ] as any);

      // Product details
      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        {
          id: "var-1",
          product: {
            id: "prod-1",
            name: "Test Product",
            slug: "test-product",
            images: [{ url: "https://example.com/image.jpg" }],
          },
        },
      ] as any);
    });

    it("should calculate summary correctly", async () => {
      const result = await getVendorAnalytics("vendor-1", "7d");

      // Total revenue: 500000 + 300000 + 200000 = 1000000
      expect(result.summary.totalRevenue).toBe(1000000);
      expect(result.summary.totalOrders).toBe(3);
    });

    it("should calculate average order value", async () => {
      const result = await getVendorAnalytics("vendor-1", "7d");

      // AOV: 1000000 / 3 = 333333.33...
      expect(result.summary.averageOrderValue).toBeCloseTo(333333.33, 0);
    });

    it("should calculate revenue change percentage", async () => {
      const result = await getVendorAnalytics("vendor-1", "7d");

      // Current: 1000000, Previous: 400000
      // Change: ((1000000 - 400000) / 400000) * 100 = 150%
      expect(result.summary.revenueChange).toBeCloseTo(150, 0);
    });

    it("should return top products", async () => {
      const result = await getVendorAnalytics("vendor-1", "7d");

      expect(result.topProducts).toHaveLength(1);
      expect(result.topProducts[0].productName).toBe("Test Product");
    });

    it("should return revenue chart data", async () => {
      const result = await getVendorAnalytics("vendor-1", "7d");

      expect(result.revenueChart).toBeDefined();
      expect(Array.isArray(result.revenueChart)).toBe(true);
    });

    it("should handle empty orders", async () => {
      // Reset all mocks and set up for empty case
      vi.mocked(prisma.order.findMany).mockReset();
      vi.mocked(prisma.orderItem.groupBy).mockReset();
      vi.mocked(prisma.productVariant.findMany).mockReset();

      vi.mocked(prisma.order.findMany)
        .mockResolvedValueOnce([]) // Current period
        .mockResolvedValueOnce([]) // Previous period
        .mockResolvedValueOnce([]); // Daily revenue

      vi.mocked(prisma.orderItem.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([]);

      const result = await getVendorAnalytics("vendor-1", "7d");

      expect(result.summary.totalRevenue).toBe(0);
      expect(result.summary.totalOrders).toBe(0);
      expect(result.summary.averageOrderValue).toBe(0);
    });

    it("should handle 100% increase when no previous orders", async () => {
      // Reset all mocks
      vi.mocked(prisma.order.findMany).mockReset();
      vi.mocked(prisma.orderItem.groupBy).mockReset();
      vi.mocked(prisma.productVariant.findMany).mockReset();

      vi.mocked(prisma.order.findMany)
        .mockResolvedValueOnce(mockOrders as any) // Current period has orders
        .mockResolvedValueOnce([]) // Previous period has no orders
        .mockResolvedValueOnce(mockOrders as any); // Daily revenue

      vi.mocked(prisma.orderItem.groupBy).mockResolvedValue([
        { variantId: "var-1", _sum: { quantity: 10, subtotal: 500000 } },
      ] as any);

      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        {
          id: "var-1",
          product: {
            id: "prod-1",
            name: "Test Product",
            slug: "test-product",
            images: [{ url: "https://example.com/image.jpg" }],
          },
        },
      ] as any);

      const result = await getVendorAnalytics("vendor-1", "7d");

      expect(result.summary.revenueChange).toBe(100);
    });
  });
});
