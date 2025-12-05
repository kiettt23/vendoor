/**
 * Unit Tests cho Order Actions
 *
 * Test order status updates
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    order: {
      update: vi.fn(),
    },
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "./actions";

describe("Order Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // updateOrderStatus - Cập nhật trạng thái đơn hàng
  // ============================================================
  describe("updateOrderStatus", () => {
    it("should update order status successfully", async () => {
      vi.mocked(prisma.order.update).mockResolvedValueOnce({
        id: "order-1",
        status: "PROCESSING",
      } as never);

      const result = await updateOrderStatus("order-1", "PROCESSING");

      expect(result.success).toBe(true);
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: "order-1" },
        data: { status: "PROCESSING" },
      });
    });

    it("should revalidate vendor order paths", async () => {
      vi.mocked(prisma.order.update).mockResolvedValueOnce({
        id: "order-1",
        status: "SHIPPED",
      } as never);

      await updateOrderStatus("order-1", "SHIPPED");

      expect(revalidatePath).toHaveBeenCalledWith("/vendor/orders/order-1");
      expect(revalidatePath).toHaveBeenCalledWith("/vendor/orders");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.order.update).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const result = await updateOrderStatus("order-1", "PROCESSING");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Không thể cập nhật trạng thái đơn hàng");
      }
    });

    it("should handle different status transitions", async () => {
      const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

      for (const status of statuses) {
        vi.mocked(prisma.order.update).mockResolvedValueOnce({
          id: "order-1",
          status,
        } as never);

        const result = await updateOrderStatus("order-1", status);
        expect(result.success).toBe(true);
      }
    });
  });
});
