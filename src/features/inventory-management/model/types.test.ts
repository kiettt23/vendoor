/**
 * Unit Tests cho Inventory Management Types/Model
 */

import { describe, it, expect } from "vitest";
import {
  getStockStatus,
  STOCK_THRESHOLDS,
  STOCK_STATUS_CONFIG,
  updateStockSchema,
  bulkUpdateStockSchema,
} from "./types";

describe("Inventory Management - Model", () => {
  describe("STOCK_THRESHOLDS", () => {
    it("should have correct threshold values", () => {
      expect(STOCK_THRESHOLDS.LOW_STOCK).toBe(10);
      expect(STOCK_THRESHOLDS.OUT_OF_STOCK).toBe(0);
    });
  });

  describe("getStockStatus", () => {
    it("should return out_of_stock when stock is 0", () => {
      expect(getStockStatus(0)).toBe("out_of_stock");
    });

    it("should return out_of_stock when stock is negative", () => {
      expect(getStockStatus(-1)).toBe("out_of_stock");
    });

    it("should return low_stock when 0 < stock <= LOW_STOCK", () => {
      expect(getStockStatus(1)).toBe("low_stock");
      expect(getStockStatus(5)).toBe("low_stock");
      expect(getStockStatus(10)).toBe("low_stock");
    });

    it("should return in_stock when stock > LOW_STOCK", () => {
      expect(getStockStatus(11)).toBe("in_stock");
      expect(getStockStatus(100)).toBe("in_stock");
      expect(getStockStatus(1000)).toBe("in_stock");
    });
  });

  describe("STOCK_STATUS_CONFIG", () => {
    it("should have config for all statuses", () => {
      expect(STOCK_STATUS_CONFIG.in_stock).toBeDefined();
      expect(STOCK_STATUS_CONFIG.low_stock).toBeDefined();
      expect(STOCK_STATUS_CONFIG.out_of_stock).toBeDefined();
    });

    it("should have Vietnamese labels", () => {
      expect(STOCK_STATUS_CONFIG.in_stock.label).toBe("Còn hàng");
      expect(STOCK_STATUS_CONFIG.low_stock.label).toBe("Sắp hết");
      expect(STOCK_STATUS_CONFIG.out_of_stock.label).toBe("Hết hàng");
    });

    it("should have color classes", () => {
      expect(STOCK_STATUS_CONFIG.in_stock.color).toContain("green");
      expect(STOCK_STATUS_CONFIG.low_stock.color).toContain("yellow");
      expect(STOCK_STATUS_CONFIG.out_of_stock.color).toContain("red");
    });
  });

  describe("updateStockSchema", () => {
    it("should validate correct input", () => {
      const result = updateStockSchema.safeParse({
        variantId: "var-123",
        stock: 50,
      });

      expect(result.success).toBe(true);
    });

    it("should reject negative stock", () => {
      const result = updateStockSchema.safeParse({
        variantId: "var-123",
        stock: -1,
      });

      expect(result.success).toBe(false);
    });

    it("should accept stock of 0", () => {
      const result = updateStockSchema.safeParse({
        variantId: "var-123",
        stock: 0,
      });

      expect(result.success).toBe(true);
    });

    it("should reject empty variantId", () => {
      const result = updateStockSchema.safeParse({
        variantId: "",
        stock: 10,
      });

      expect(result.success).toBe(false);
    });

    it("should reject non-integer stock", () => {
      const result = updateStockSchema.safeParse({
        variantId: "var-123",
        stock: 10.5,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("bulkUpdateStockSchema", () => {
    it("should validate correct bulk input", () => {
      const result = bulkUpdateStockSchema.safeParse({
        updates: [
          { variantId: "var-1", stock: 10 },
          { variantId: "var-2", stock: 20 },
        ],
      });

      expect(result.success).toBe(true);
    });

    it("should reject empty updates array", () => {
      const result = bulkUpdateStockSchema.safeParse({
        updates: [],
      });

      expect(result.success).toBe(false);
    });

    it("should reject if any update has negative stock", () => {
      const result = bulkUpdateStockSchema.safeParse({
        updates: [
          { variantId: "var-1", stock: 10 },
          { variantId: "var-2", stock: -5 },
        ],
      });

      expect(result.success).toBe(false);
    });
  });
});
