import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

// Use vi.hoisted for variables used in mock factories
const mockRedirect = vi.hoisted(() => vi.fn());
const mockRequireSession = vi.hoisted(() => vi.fn());
const mockUser = vi.hoisted(() => ({ findUnique: vi.fn() }));
const mockVendorProfile = vi.hoisted(() => ({ findUnique: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

vi.mock("@/shared/lib/auth", () => ({
  requireSession: () => mockRequireSession(),
}));

vi.mock("@/shared/lib/db", () => ({
  prisma: {
    user: mockUser,
    vendorProfile: mockVendorProfile,
  },
}));

// Import after mocks
import { requireVendor } from "./guards";

describe("Vendor Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedirect.mockClear();
  });

  describe("requireVendor", () => {
    const mockSession = {
      user: { id: "user-1", name: "Test User", email: "test@test.com" },
      session: { id: "session-1" },
    };

    const mockVendorUserData = {
      id: "user-1",
      name: "Test Vendor",
      email: "vendor@test.com",
      roles: ["USER", "VENDOR"],
    };

    const mockVendorProfileData = {
      id: "vp-1",
      shopName: "Test Shop",
      status: "APPROVED",
    };

    it("should return vendor auth result for approved vendor", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue(mockVendorUserData);
      mockVendorProfile.findUnique.mockResolvedValue(mockVendorProfileData);

      const result = await requireVendor();

      expect(result.session).toEqual(mockSession);
      expect(result.user).toEqual(mockVendorUserData);
      expect(result.vendorProfile).toEqual(mockVendorProfileData);
    });

    it("should redirect to home if user not found", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue(null);

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should redirect to home if user is not vendor", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue({
        ...mockVendorUserData,
        roles: ["USER"], // No VENDOR role
      });

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should redirect to home if vendor profile not found", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue(mockVendorUserData);
      mockVendorProfile.findUnique.mockResolvedValue(null);

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should redirect to home if vendor not approved", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue(mockVendorUserData);
      mockVendorProfile.findUnique.mockResolvedValue({
        ...mockVendorProfileData,
        status: "PENDING",
      });

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should redirect to home if vendor rejected", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue(mockVendorUserData);
      mockVendorProfile.findUnique.mockResolvedValue({
        ...mockVendorProfileData,
        status: "REJECTED",
      });

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should check user roles includes VENDOR", async () => {
      mockRequireSession.mockResolvedValue(mockSession);
      mockUser.findUnique.mockResolvedValue({
        ...mockVendorUserData,
        roles: ["ADMIN"], // Has role but not VENDOR
      });

      await expect(requireVendor()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });
  });
});
