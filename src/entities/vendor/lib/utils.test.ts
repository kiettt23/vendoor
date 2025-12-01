import { describe, it, expect } from "vitest";
import { formatVendorStatus } from "./utils";

describe("Vendor Utils", () => {
  describe("formatVendorStatus", () => {
    it("should format PENDING status", () => {
      expect(formatVendorStatus("PENDING")).toBe("Chờ duyệt");
    });

    it("should format APPROVED status", () => {
      expect(formatVendorStatus("APPROVED")).toBe("Đã duyệt");
    });

    it("should format REJECTED status", () => {
      expect(formatVendorStatus("REJECTED")).toBe("Từ chối");
    });

    it("should return original status for unknown status", () => {
      expect(formatVendorStatus("UNKNOWN")).toBe("UNKNOWN");
    });
  });
});
