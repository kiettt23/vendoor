/**
 * Unit Tests cho Vendor Analytics Types/Model
 */

import { describe, it, expect } from "vitest";
import { getDateRange, TIME_RANGE_OPTIONS, type TimeRange } from "./types";

describe("Vendor Analytics - Model", () => {
  describe("TIME_RANGE_OPTIONS", () => {
    it("should have all time range options", () => {
      expect(TIME_RANGE_OPTIONS).toHaveLength(4);
    });

    it("should have correct values and Vietnamese labels", () => {
      const options = TIME_RANGE_OPTIONS.map((o) => o.value);
      expect(options).toContain("7d");
      expect(options).toContain("30d");
      expect(options).toContain("90d");
      expect(options).toContain("365d");

      const sevenDay = TIME_RANGE_OPTIONS.find((o) => o.value === "7d");
      expect(sevenDay?.label).toBe("7 ngày");
    });
  });

  describe("getDateRange", () => {
    it("should return correct range for 7d", () => {
      const { start, end } = getDateRange("7d");

      const diffDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(diffDays).toBe(7);
    });

    it("should return correct range for 30d", () => {
      const { start, end } = getDateRange("30d");

      const diffDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(diffDays).toBe(30);
    });

    it("should return correct range for 90d", () => {
      const { start, end } = getDateRange("90d");

      const diffDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(diffDays).toBe(90);
    });

    it("should return correct range for 365d", () => {
      const { start, end } = getDateRange("365d");

      const diffDays = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(diffDays).toBe(365);
    });

    it("should have end date as today", () => {
      const { end } = getDateRange("7d");
      const today = new Date();

      expect(end.getDate()).toBe(today.getDate());
      expect(end.getMonth()).toBe(today.getMonth());
      expect(end.getFullYear()).toBe(today.getFullYear());
    });

    it("should have start date in the past", () => {
      const { start, end } = getDateRange("30d");

      expect(start.getTime()).toBeLessThan(end.getTime());
    });
  });

  describe("Type definitions", () => {
    it("should export TimeRange type", () => {
      const range: TimeRange = "7d";
      expect(["7d", "30d", "90d", "365d"]).toContain(range);
    });
  });
});
