/**
 * Tests cho CouponService
 * Test coupon validation và usage
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { couponService } from "../couponService.js";
import { NotFoundError, BadRequestError } from "@/lib/errors/AppError";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    coupon: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

describe("CouponService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateCoupon", () => {
    it("should validate active coupon successfully", async () => {
      const mockCoupon = {
        code: "SALE10",
        discount: 10,
        expiresAt: new Date("2030-12-31"),
        forNewUser: false,
        forMember: false,
      };

      prisma.coupon.findUnique.mockResolvedValue(mockCoupon);

      const result = await couponService.validateCoupon(
        "SALE10",
        "user-123",
        false
      );

      expect(result.code).toBe("SALE10");
      expect(result.discount).toBe(10);
    });

    it("should throw error when coupon not found", async () => {
      prisma.coupon.findUnique.mockResolvedValue(null);

      await expect(
        couponService.validateCoupon("INVALID", "user-123", false)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw error for member-only coupon when not member", async () => {
      const mockCoupon = {
        code: "MEMBER20",
        discount: 20,
        expiresAt: new Date("2030-12-31"),
        forNewUser: false,
        forMember: true, // Member only
      };

      prisma.coupon.findUnique.mockResolvedValue(mockCoupon);

      await expect(
        couponService.validateCoupon("MEMBER20", "user-123", false) // Not a member
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("createCoupon", () => {
    it("should create coupon successfully", async () => {
      const couponData = {
        code: "NEWUSER10",
        discount: 10,
        expiresAt: new Date("2030-12-31"),
        forNewUser: true,
        forMember: false,
      };

      const mockCreated = {
        id: "coupon-123",
        ...couponData,
      };

      prisma.coupon.create.mockResolvedValue(mockCreated);

      const result = await couponService.createCoupon(couponData);

      expect(result.id).toBe("coupon-123");
      expect(result.code).toBe("NEWUSER10");
      expect(prisma.coupon.create).toHaveBeenCalledWith({
        data: couponData,
      });
    });
  });

  describe("getAllCoupons", () => {
    it("should return all coupons", async () => {
      const mockCoupons = [
        { code: "SALE10", discount: 10 },
        { code: "SALE20", discount: 20 },
      ];

      prisma.coupon.findMany.mockResolvedValue(mockCoupons);

      const result = await couponService.getAllCoupons();

      expect(result).toHaveLength(2);
    });
  });

  describe("deleteCoupon", () => {
    it("should delete coupon successfully", async () => {
      const couponCode = "SALE10";

      prisma.coupon.delete.mockResolvedValue({ code: couponCode });

      // deleteCoupon doesn't return anything
      await couponService.deleteCoupon(couponCode);

      expect(prisma.coupon.delete).toHaveBeenCalledWith({
        where: { code: couponCode },
      });
    });
  });
});
