/**
 * Unit Tests cho Vendor Registration Actions
 *
 * Test đăng ký làm vendor
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    vendorProfile: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import {
  registerAsVendor,
  getVendorRegistrationStatus,
} from "./actions";
import type { VendorRegistrationInput } from "../model";

const validRegistrationInput: VendorRegistrationInput = {
  shopName: "My Awesome Shop",
  description: "Best products in town",
  businessAddress: "123 Main St",
  businessPhone: "0123456789",
  businessEmail: "shop@example.com",
};

describe("Vendor Registration Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // registerAsVendor - Đăng ký làm vendor
  // ============================================================
  describe("registerAsVendor", () => {
    it("should register new vendor successfully", async () => {
      vi.mocked(prisma.vendorProfile.findUnique)
        .mockResolvedValueOnce(null) // No existing profile for user
        .mockResolvedValueOnce(null); // No existing slug
      vi.mocked(prisma.vendorProfile.create).mockResolvedValueOnce({
        id: "vendor-1",
        shopName: "My Awesome Shop",
        slug: "my-awesome-shop",
        status: "PENDING",
      } as never);

      const result = await registerAsVendor("user-1", validRegistrationInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("vendor-1");
      }
      expect(prisma.vendorProfile.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          shopName: "My Awesome Shop",
          status: "PENDING",
        }),
      });
    });

    it("should reject if user already has PENDING profile", async () => {
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        id: "existing",
        status: "PENDING",
      } as never);

      const result = await registerAsVendor("user-1", validRegistrationInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("đã đăng ký");
      }
    });

    it("should reject if user is already a vendor", async () => {
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        id: "existing",
        status: "APPROVED",
      } as never);

      const result = await registerAsVendor("user-1", validRegistrationInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("đã là người bán");
      }
    });

    it("should reject if user was previously rejected", async () => {
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        id: "existing",
        status: "REJECTED",
      } as never);

      const result = await registerAsVendor("user-1", validRegistrationInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("bị từ chối");
      }
    });

    it("should reject if user is suspended", async () => {
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce({
        id: "existing",
        status: "SUSPENDED",
      } as never);

      const result = await registerAsVendor("user-1", validRegistrationInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("bị đình chỉ");
      }
    });

    it("should generate unique slug when shopName already exists", async () => {
      vi.mocked(prisma.vendorProfile.findUnique)
        .mockResolvedValueOnce(null) // No existing profile for user
        .mockResolvedValueOnce({ id: "other" } as never); // Slug already taken
      vi.mocked(prisma.vendorProfile.create).mockResolvedValueOnce({
        id: "vendor-1",
        slug: "my-awesome-shop-abc123",
      } as never);

      await registerAsVendor("user-1", validRegistrationInput);

      expect(prisma.vendorProfile.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: expect.stringMatching(/^my-awesome-shop-/),
        }),
      });
    });

    it("should revalidate account and admin paths", async () => {
      vi.mocked(prisma.vendorProfile.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      vi.mocked(prisma.vendorProfile.create).mockResolvedValueOnce({
        id: "vendor-1",
      } as never);

      await registerAsVendor("user-1", validRegistrationInput);

      expect(revalidatePath).toHaveBeenCalledWith("/account");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/vendors");
    });
  });

  // ============================================================
  // getVendorRegistrationStatus - Lấy trạng thái đăng ký
  // ============================================================
  describe("getVendorRegistrationStatus", () => {
    it("should return vendor profile when exists", async () => {
      const mockProfile = {
        id: "vendor-1",
        shopName: "My Shop",
        slug: "my-shop",
        status: "PENDING",
        createdAt: new Date(),
      };
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce(
        mockProfile as never
      );

      const result = await getVendorRegistrationStatus("user-1");

      expect(result).toEqual(mockProfile);
    });

    it("should return null when no profile exists", async () => {
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValueOnce(null);

      const result = await getVendorRegistrationStatus("user-1");

      expect(result).toBeNull();
    });
  });
});
