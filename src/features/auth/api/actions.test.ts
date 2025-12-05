import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

// Use vi.hoisted for variables used in mock factories
const mockRedirect = vi.hoisted(() => vi.fn());
const mockSignOut = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("@/shared/lib/auth/config", () => ({
  auth: {
    api: {
      signOut: mockSignOut,
    },
  },
}));

// Import after mocks
import { logout } from "./actions";

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedirect.mockClear();
    mockSignOut.mockClear();
  });

  describe("logout", () => {
    it("should call signOut and redirect to login", async () => {
      mockSignOut.mockResolvedValue(undefined);

      await expect(logout()).rejects.toThrow("NEXT_REDIRECT:/login");

      expect(mockSignOut).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      });
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });

    it("should handle signOut errors gracefully", async () => {
      mockSignOut.mockRejectedValue(new Error("Sign out failed"));

      await expect(logout()).rejects.toThrow("Sign out failed");
    });
  });
});
