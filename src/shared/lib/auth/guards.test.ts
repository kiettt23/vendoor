/**
 * Tests for Auth Guards
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("./config", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/shared/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    vendorProfile: {
      findUnique: vi.fn(),
    },
  },
}));

import { redirect } from "next/navigation";
import { auth } from "./config";
import { prisma } from "@/shared/lib/db";
import { requireAuth, requireRole, requireVendor, hasRole } from "./guards";

describe("Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireAuth", () => {
    it("should redirect to login if no session", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("REDIRECT:/login");
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should redirect to login if user not found in database", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-1" },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("REDIRECT:/login");
    });

    it("should return session and user when authenticated", async () => {
      const mockSession = { user: { id: "user-1", name: "Test" } };
      const mockUser = {
        id: "user-1",
        roles: ["CUSTOMER"],
        name: "Test",
        email: "test@test.com",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await requireAuth();

      expect(result.session).toEqual(mockSession);
      expect(result.user).toEqual(mockUser);
    });
  });

  describe("requireRole", () => {
    it("should redirect to home if user does not have required role", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["CUSTOMER"],
        name: "Test",
        email: "test@test.com",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      await expect(requireRole("ADMIN")).rejects.toThrow("REDIRECT:/");
    });

    it("should return session and user when user has required role", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["VENDOR"],
        name: "Test",
        email: "test@test.com",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await requireRole("VENDOR");

      expect(result.user.roles).toContain("VENDOR");
    });
  });

  describe("requireVendor", () => {
    it("should redirect if user has no vendor profile", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["VENDOR"],
        name: "Test",
        email: "test@test.com",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValue(null);

      await expect(requireVendor()).rejects.toThrow("REDIRECT:/");
    });

    it("should return vendor profile when valid", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["VENDOR"],
        name: "Test",
        email: "test@test.com",
      };
      const mockVendorProfile = {
        id: "vendor-1",
        shopName: "Test Shop",
        status: "APPROVED",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.vendorProfile.findUnique).mockResolvedValue(
        mockVendorProfile as never
      );

      const result = await requireVendor();

      expect(result.vendorProfile).toEqual(mockVendorProfile);
    });
  });

  describe("hasRole", () => {
    it("should return false if no session", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await hasRole("ADMIN");

      expect(result).toBe(false);
    });

    it("should return false if user does not have role", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-1" },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        roles: ["CUSTOMER"],
      } as never);

      const result = await hasRole("ADMIN");

      expect(result).toBe(false);
    });

    it("should return true if user has role", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: "user-1" },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        roles: ["ADMIN", "CUSTOMER"],
      } as never);

      const result = await hasRole("ADMIN");

      expect(result).toBe(true);
    });
  });
});
