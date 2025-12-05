/**
 * Unit Tests cho User Auth Guards
 *
 * Test authentication và authorization guards
 * Mock Prisma và auth để test các scenarios
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock auth session
vi.mock("@/shared/lib/auth/session", () => ({
  requireSession: vi.fn(),
  getSession: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { prisma } from "@/shared/lib/db";
import { requireSession, getSession } from "@/shared/lib/auth/session";
import { redirect } from "next/navigation";
import { requireAuth, requireRole, requireAdmin, hasRole } from "./guards";

describe("User Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // requireAuth - Yêu cầu đăng nhập
  // ============================================================
  describe("requireAuth", () => {
    it("should return session and user when authenticated", async () => {
      const mockSession = {
        user: { id: "user-1", email: "test@example.com" },
      };
      const mockUser = {
        id: "user-1",
        roles: ["CUSTOMER"],
        name: "Test User",
        email: "test@example.com",
      };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await requireAuth();

      expect(result.session).toBe(mockSession);
      expect(result.user.id).toBe("user-1");
      expect(result.user.roles).toContain("CUSTOMER");
    });

    it("should redirect to login when user not found in DB", async () => {
      const mockSession = { user: { id: "deleted-user" } };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("REDIRECT:/login");
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  // ============================================================
  // requireRole - Yêu cầu role cụ thể
  // ============================================================
  describe("requireRole", () => {
    it("should allow access when user has required role", async () => {
      const mockSession = { user: { id: "vendor-1" } };
      const mockUser = {
        id: "vendor-1",
        roles: ["CUSTOMER", "VENDOR"],
        name: "Vendor User",
        email: "vendor@example.com",
      };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await requireRole("VENDOR");

      expect(result.user.roles).toContain("VENDOR");
    });

    it("should redirect to home when user does not have required role", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["CUSTOMER"],
        name: "Customer",
        email: "customer@example.com",
      };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      await expect(requireRole("ADMIN")).rejects.toThrow("REDIRECT:/");
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  // ============================================================
  // requireAdmin - Shortcut cho admin role
  // ============================================================
  describe("requireAdmin", () => {
    it("should allow access for admin user", async () => {
      const mockSession = { user: { id: "admin-1" } };
      const mockUser = {
        id: "admin-1",
        roles: ["CUSTOMER", "ADMIN"],
        name: "Admin",
        email: "admin@example.com",
      };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await requireAdmin();

      expect(result.user.roles).toContain("ADMIN");
    });

    it("should redirect for non-admin user", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = {
        id: "user-1",
        roles: ["CUSTOMER"],
        name: "Customer",
        email: "customer@example.com",
      };

      vi.mocked(requireSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      await expect(requireAdmin()).rejects.toThrow("REDIRECT:/");
    });
  });

  // ============================================================
  // hasRole - Check role không redirect
  // ============================================================
  describe("hasRole", () => {
    it("should return true when user has role", async () => {
      const mockSession = { user: { id: "vendor-1" } };
      const mockUser = { roles: ["CUSTOMER", "VENDOR"] };

      vi.mocked(getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await hasRole("VENDOR");

      expect(result).toBe(true);
    });

    it("should return false when user does not have role", async () => {
      const mockSession = { user: { id: "user-1" } };
      const mockUser = { roles: ["CUSTOMER"] };

      vi.mocked(getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const result = await hasRole("ADMIN");

      expect(result).toBe(false);
    });

    it("should return false when not logged in", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await hasRole("CUSTOMER");

      expect(result).toBe(false);
    });

    it("should return false when user not found", async () => {
      const mockSession = { user: { id: "deleted-user" } };

      vi.mocked(getSession).mockResolvedValue(mockSession as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await hasRole("CUSTOMER");

      expect(result).toBe(false);
    });
  });
});
