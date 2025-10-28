/**
 * Tests cho AddressService
 * Simple address save/get service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { addressService } from "../addressService.js";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    address: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

describe("AddressService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveAddress", () => {
    it("should save address successfully", async () => {
      const userId = "user-123";
      const addressData = {
        street: "123 Street",
        city: "Ho Chi Minh",
        state: "Vietnam",
        zipCode: "70000",
        country: "Vietnam",
      };

      const mockSaved = {
        id: "addr-123",
        userId,
        ...addressData,
      };

      prisma.address.upsert.mockResolvedValue(mockSaved);

      const result = await addressService.saveAddress(userId, addressData);

      expect(result.id).toBe("addr-123");
      expect(result.city).toBe("Ho Chi Minh");
    });
  });

  describe("getAddress", () => {
    it("should return user address", async () => {
      const userId = "user-123";
      const mockAddress = {
        id: "addr-1",
        userId,
        street: "123 Street",
        city: "Ho Chi Minh",
      };

      prisma.address.findUnique.mockResolvedValue(mockAddress);

      const result = await addressService.getAddress(userId);

      expect(result.id).toBe("addr-1");
      expect(prisma.address.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it("should return null when address not found", async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      const result = await addressService.getAddress("user-123");

      expect(result).toBeNull();
    });
  });
});
