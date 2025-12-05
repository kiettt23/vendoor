/**
 * Unit Tests cho Vendor Actions
 *
 * Test vendor approval/rejection operations
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    vendorProfile: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
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
import { approveVendor, rejectVendor, updateVendorStatus } from "./actions";

describe("Vendor Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // approveVendor - Duyệt vendor
  // ============================================================
  describe("approveVendor", () => {
    it("should approve vendor and add VENDOR role", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "APPROVED",
      } as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        userId: "user-1",
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        roles: ["CUSTOMER"],
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValueOnce({
        id: "user-1",
        roles: ["CUSTOMER", "VENDOR"],
      } as never);

      await approveVendor("vendor-1");

      expect(prisma.vendorProfile.update).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: { status: "APPROVED" },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { roles: ["CUSTOMER", "VENDOR"] },
      });
    });

    it("should not duplicate VENDOR role if already exists", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "APPROVED",
      } as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        userId: "user-1",
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        roles: ["CUSTOMER", "VENDOR"], // Already has VENDOR role
      } as never);

      await approveVendor("vendor-1");

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("should revalidate admin vendors paths", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
      } as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        userId: "user-1",
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        roles: ["CUSTOMER"],
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never);

      await approveVendor("vendor-1");

      expect(revalidatePath).toHaveBeenCalledWith("/admin/vendors");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/vendors/vendor-1");
    });
  });

  // ============================================================
  // rejectVendor - Từ chối vendor
  // ============================================================
  describe("rejectVendor", () => {
    it("should reject vendor", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "REJECTED",
      } as never);

      await rejectVendor("vendor-1");

      expect(prisma.vendorProfile.update).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: { status: "REJECTED" },
      });
    });

    it("should revalidate admin vendors paths", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
      } as never);

      await rejectVendor("vendor-1");

      expect(revalidatePath).toHaveBeenCalledWith("/admin/vendors");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/vendors/vendor-1");
    });
  });

  // ============================================================
  // updateVendorStatus - Cập nhật status tổng quát
  // ============================================================
  describe("updateVendorStatus", () => {
    it("should update to PENDING status", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "PENDING",
      } as never);

      await updateVendorStatus("vendor-1", "PENDING");

      expect(prisma.vendorProfile.update).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: { status: "PENDING" },
      });
    });

    it("should add VENDOR role when approving", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "APPROVED",
      } as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        userId: "user-1",
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        roles: ["CUSTOMER"],
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValueOnce({} as never);

      await updateVendorStatus("vendor-1", "APPROVED");

      expect(prisma.user.update).toHaveBeenCalled();
    });

    it("should handle SUSPENDED status", async () => {
      vi.mocked(prisma.vendorProfile.update).mockResolvedValueOnce({
        id: "vendor-1",
        status: "SUSPENDED",
      } as never);

      await updateVendorStatus("vendor-1", "SUSPENDED");

      expect(prisma.vendorProfile.update).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: { status: "SUSPENDED" },
      });
    });
  });
});
