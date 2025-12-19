import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================================
// Mock Setup - Sử dụng vi.hoisted() để tránh lỗi hoisting
// ============================================================================

vi.mock("server-only", () => ({}));

// Mock next/navigation
const mockRedirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  })
);
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock auth config
const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock("@/shared/lib/auth/config", () => ({
  auth: {
    api: {
      getSession: () => mockGetSession(),
    },
  },
}));

// Mock prisma
const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
  },
}));
vi.mock("@/shared/lib/db", () => ({
  prisma: mockPrisma,
}));

// Import sau khi mock
import { getSession, requireSession } from "@/shared/lib/auth/session";
import {
  requireAuth,
  requireRole,
  requireAdmin,
  hasRole,
} from "@/entities/user/api/guards";
import { requireVendor } from "@/entities/vendor/api/guards";

// ============================================================================
// Helper functions
// ============================================================================

function expectRedirect(fn: () => Promise<unknown>, expectedUrl: string) {
  return expect(fn()).rejects.toThrow(`REDIRECT:${expectedUrl}`);
}

// ============================================================================
// Tests: Session Primitives
// ============================================================================

describe("Session Primitives - getSession & requireSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSession - Lấy session", () => {
    it("returns session when logged in - đã đăng nhập", async () => {
      const mockSession = {
        user: { id: "user-123", email: "test@example.com" },
      };
      mockGetSession.mockResolvedValue(mockSession);

      const result = await getSession();

      expect(result).toEqual(mockSession);
    });

    it("returns null when not logged in - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await getSession();

      expect(result).toBeNull();
    });
  });

  describe("requireSession - Yêu cầu session", () => {
    it("returns session when valid - session hợp lệ", async () => {
      const mockSession = {
        user: { id: "user-123", email: "test@example.com" },
      };
      mockGetSession.mockResolvedValue(mockSession);

      const result = await requireSession();

      expect(result).toEqual(mockSession);
    });

    it("redirects to login when no session - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      await expectRedirect(() => requireSession(), "/login");
    });

    it("redirects to login when session has no user", async () => {
      mockGetSession.mockResolvedValue({ user: null });

      await expectRedirect(() => requireSession(), "/login");
    });
  });
});

// ============================================================================
// Tests: User Guards
// ============================================================================

describe("User Guards - requireAuth, requireRole, hasRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireAuth - Yêu cầu đăng nhập", () => {
    it("returns user when authenticated - đã xác thực", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        roles: ["CUSTOMER"],
      });

      const result = await requireAuth();

      expect(result.user).toEqual({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        roles: ["CUSTOMER"],
      });
    });

    it("redirects when no session - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      await expectRedirect(() => requireAuth(), "/login");
    });

    it("redirects when user not found in DB - user không tồn tại", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "deleted-user", email: "deleted@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expectRedirect(() => requireAuth(), "/login");
    });
  });

  describe("requireRole - Yêu cầu role cụ thể", () => {
    it("returns user when has required role - có role cần thiết", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "admin@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Admin User",
        email: "admin@example.com",
        roles: ["CUSTOMER", "ADMIN"],
      });

      const result = await requireRole("ADMIN");

      expect(result.user.roles).toContain("ADMIN");
    });

    it("redirects when missing role - thiếu role", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "customer@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Customer",
        email: "customer@example.com",
        roles: ["CUSTOMER"],
      });

      await expectRedirect(() => requireRole("ADMIN"), "/");
    });

    it("redirects to home (not login) when has wrong role", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Vendor",
        email: "vendor@example.com",
        roles: ["VENDOR"],
      });

      // Should redirect to home, not login
      await expectRedirect(() => requireRole("ADMIN"), "/");
    });
  });

  describe("requireAdmin - Yêu cầu ADMIN", () => {
    it("returns user when is admin - là admin", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "admin-1", email: "admin@vendoor.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "admin-1",
        name: "Admin",
        email: "admin@vendoor.com",
        roles: ["ADMIN"],
      });

      const result = await requireAdmin();

      expect(result.user.roles).toContain("ADMIN");
    });

    it("redirects when not admin - không phải admin", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "customer@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Customer",
        email: "customer@example.com",
        roles: ["CUSTOMER"],
      });

      await expectRedirect(() => requireAdmin(), "/");
    });
  });

  describe("hasRole - Kiểm tra role (không redirect)", () => {
    it("returns true when has role - có role", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        roles: ["CUSTOMER", "VENDOR"],
      });

      const result = await hasRole("VENDOR");

      expect(result).toBe(true);
    });

    it("returns false when missing role - thiếu role", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "customer@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        roles: ["CUSTOMER"],
      });

      const result = await hasRole("ADMIN");

      expect(result).toBe(false);
    });

    it("returns false when not logged in - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await hasRole("CUSTOMER");

      expect(result).toBe(false);
    });

    it("returns false when user not in DB - user không tồn tại", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "deleted-user", email: "deleted@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await hasRole("CUSTOMER");

      expect(result).toBe(false);
    });

    it("does NOT redirect (unlike requireRole)", async () => {
      mockGetSession.mockResolvedValue(null);

      // hasRole should return false, not throw redirect
      const result = await hasRole("ADMIN");

      expect(result).toBe(false);
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Tests: Vendor Guards
// ============================================================================

describe("Vendor Guards - requireVendor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireVendor - Yêu cầu vendor đã duyệt", () => {
    it("returns vendor when approved - vendor đã duyệt", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "vendor-1", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "vendor-1",
        name: "Vendor Shop",
        email: "vendor@example.com",
        roles: ["VENDOR"],
        vendorProfile: {
          id: "profile-1",
          shopName: "My Shop",
          status: "APPROVED",
        },
      });

      const result = await requireVendor();

      expect(result.user.id).toBe("vendor-1");
      expect(result.vendorProfile).toEqual({
        id: "profile-1",
        shopName: "My Shop",
        status: "APPROVED",
      });
    });

    it("redirects when no session - chưa đăng nhập", async () => {
      mockGetSession.mockResolvedValue(null);

      await expectRedirect(() => requireVendor(), "/login");
    });

    it("redirects when not vendor role - không có role VENDOR", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "customer@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Customer",
        email: "customer@example.com",
        roles: ["CUSTOMER"],
        vendorProfile: null,
      });

      await expectRedirect(() => requireVendor(), "/");
    });

    it("redirects when vendor status is PENDING - đang chờ duyệt", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "vendor-1", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "vendor-1",
        name: "Vendor",
        email: "vendor@example.com",
        roles: ["VENDOR"],
        vendorProfile: {
          id: "profile-1",
          shopName: "My Shop",
          status: "PENDING",
        },
      });

      await expectRedirect(() => requireVendor(), "/");
    });

    it("redirects when vendor status is REJECTED - bị từ chối", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "vendor-1", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "vendor-1",
        name: "Vendor",
        email: "vendor@example.com",
        roles: ["VENDOR"],
        vendorProfile: {
          id: "profile-1",
          shopName: "My Shop",
          status: "REJECTED",
        },
      });

      await expectRedirect(() => requireVendor(), "/");
    });

    it("redirects when vendor status is SUSPENDED - bị đình chỉ", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "vendor-1", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "vendor-1",
        name: "Vendor",
        email: "vendor@example.com",
        roles: ["VENDOR"],
        vendorProfile: {
          id: "profile-1",
          shopName: "My Shop",
          status: "SUSPENDED",
        },
      });

      await expectRedirect(() => requireVendor(), "/");
    });

    it("redirects when has VENDOR role but no profile - có role nhưng chưa tạo profile", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "vendor-1", email: "vendor@example.com" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "vendor-1",
        name: "Vendor",
        email: "vendor@example.com",
        roles: ["VENDOR"],
        vendorProfile: null,
      });

      await expectRedirect(() => requireVendor(), "/");
    });
  });
});

// ============================================================================
// Tests: Multi-role scenarios
// ============================================================================

describe("Multi-role Scenarios - User có nhiều role", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows admin who is also vendor - admin kiêm vendor", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-vendor", email: "admin@vendoor.com" },
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "admin-vendor",
      name: "Admin Vendor",
      email: "admin@vendoor.com",
      roles: ["CUSTOMER", "VENDOR", "ADMIN"],
    });

    const adminResult = await requireAdmin();
    expect(adminResult.user.roles).toContain("ADMIN");

    // Reset mock for requireRole
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "admin-vendor",
      name: "Admin Vendor",
      email: "admin@vendoor.com",
      roles: ["CUSTOMER", "VENDOR", "ADMIN"],
    });

    const vendorRoleResult = await requireRole("VENDOR");
    expect(vendorRoleResult.user.roles).toContain("VENDOR");
  });

  it("customer can upgrade to vendor - customer nâng cấp thành vendor", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-123", email: "user@example.com" },
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "User",
      email: "user@example.com",
      roles: ["CUSTOMER", "VENDOR"], // Has both roles
    });

    const hasCustomer = await hasRole("CUSTOMER");
    const hasVendor = await hasRole("VENDOR");

    // Reset mocks for second call
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "User",
      email: "user@example.com",
      roles: ["CUSTOMER", "VENDOR"],
    });

    expect(hasCustomer).toBe(true);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      roles: ["CUSTOMER", "VENDOR"],
    });
    const hasVendorAgain = await hasRole("VENDOR");
    expect(hasVendorAgain).toBe(true);
  });

  it("checks multiple roles correctly", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-123", email: "customer@example.com" },
    });

    // First call - check CUSTOMER
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      roles: ["CUSTOMER"],
    });
    expect(await hasRole("CUSTOMER")).toBe(true);

    // Second call - check VENDOR
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      roles: ["CUSTOMER"],
    });
    expect(await hasRole("VENDOR")).toBe(false);

    // Third call - check ADMIN
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      roles: ["CUSTOMER"],
    });
    expect(await hasRole("ADMIN")).toBe(false);
  });
});
