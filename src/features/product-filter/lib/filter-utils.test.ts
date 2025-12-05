/**
 * Unit Tests cho Product Filter Utilities
 *
 * Test URL parsing và building cho product filters
 */

import { describe, it, expect } from "vitest";
import {
  normalizeSearchText,
  parseFilterParams,
  buildFilterSearchParams,
  updateFilterParam,
  clearFilters,
  buildCategoryUrl,
} from "./filter-utils";

describe("Product Filter Utilities", () => {
  // ============================================================
  // normalizeSearchText - Chuẩn hóa search text
  // ============================================================
  describe("normalizeSearchText", () => {
    it("should trim whitespace", () => {
      expect(normalizeSearchText("  laptop  ")).toBe("laptop");
    });

    it("should normalize multiple spaces to single space", () => {
      expect(normalizeSearchText("iphone  15   pro")).toBe("iphone 15 pro");
    });

    it("should handle empty string", () => {
      expect(normalizeSearchText("")).toBe("");
    });

    it("should preserve Vietnamese characters", () => {
      expect(normalizeSearchText("  điện thoại  ")).toBe("điện thoại");
    });
  });

  // ============================================================
  // parseFilterParams - Parse URL search params
  // ============================================================
  describe("parseFilterParams", () => {
    it("should parse empty params", () => {
      const params = new URLSearchParams();
      const result = parseFilterParams(params);

      expect(result).toEqual({});
    });

    it("should parse category", () => {
      const params = new URLSearchParams("category=dien-tu");
      const result = parseFilterParams(params);

      expect(result.category).toBe("dien-tu");
    });

    it("should parse search", () => {
      const params = new URLSearchParams("search=iphone");
      const result = parseFilterParams(params);

      expect(result.search).toBe("iphone");
    });

    it("should parse price range", () => {
      const params = new URLSearchParams("minPrice=100000&maxPrice=500000");
      const result = parseFilterParams(params);

      expect(result.minPrice).toBe(100000);
      expect(result.maxPrice).toBe(500000);
    });

    it("should parse rating filter", () => {
      const params = new URLSearchParams("minRating=4");
      const result = parseFilterParams(params);

      expect(result.minRating).toBe(4);
    });

    it("should parse vendor filter", () => {
      const params = new URLSearchParams("vendor=vendor-123");
      const result = parseFilterParams(params);

      expect(result.vendorId).toBe("vendor-123");
    });

    it("should parse sort option", () => {
      const params = new URLSearchParams("sort=price-asc");
      const result = parseFilterParams(params);

      expect(result.sort).toBe("price-asc");
    });

    it("should parse inStock filter", () => {
      const params = new URLSearchParams("inStock=true");
      const result = parseFilterParams(params);

      expect(result.inStock).toBe(true);
    });

    it("should parse page number", () => {
      const params = new URLSearchParams("page=3");
      const result = parseFilterParams(params);

      expect(result.page).toBe(3);
    });

    it("should handle invalid number values gracefully", () => {
      const params = new URLSearchParams("minPrice=invalid&page=abc");
      const result = parseFilterParams(params);

      expect(result.minPrice).toBeUndefined();
      expect(result.page).toBe(1); // Defaults to 1 for invalid page
    });

    it("should parse multiple params together", () => {
      const params = new URLSearchParams(
        "category=dien-tu&search=iphone&minPrice=10000000&sort=newest&page=2"
      );
      const result = parseFilterParams(params);

      expect(result.category).toBe("dien-tu");
      expect(result.search).toBe("iphone");
      expect(result.minPrice).toBe(10000000);
      expect(result.sort).toBe("newest");
      expect(result.page).toBe(2);
    });
  });

  // ============================================================
  // buildFilterSearchParams - Build URL từ filter params
  // ============================================================
  describe("buildFilterSearchParams", () => {
    it("should build empty params", () => {
      const result = buildFilterSearchParams({});

      expect(result.toString()).toBe("");
    });

    it("should build category param", () => {
      const result = buildFilterSearchParams({ category: "dien-tu" });

      expect(result.get("category")).toBe("dien-tu");
    });

    it("should build search param", () => {
      const result = buildFilterSearchParams({ search: "iphone" });

      expect(result.get("search")).toBe("iphone");
    });

    it("should build price range params", () => {
      const result = buildFilterSearchParams({
        minPrice: 100000,
        maxPrice: 500000,
      });

      expect(result.get("minPrice")).toBe("100000");
      expect(result.get("maxPrice")).toBe("500000");
    });

    it("should build sort param", () => {
      const result = buildFilterSearchParams({ sort: "price-desc" });

      expect(result.get("sort")).toBe("price-desc");
    });

    it("should build inStock param", () => {
      const result = buildFilterSearchParams({ inStock: true });

      expect(result.get("inStock")).toBe("true");
    });

    it("should skip page=1 (default)", () => {
      const result = buildFilterSearchParams({ page: 1 });

      expect(result.has("page")).toBe(false);
    });

    it("should include page > 1", () => {
      const result = buildFilterSearchParams({ page: 3 });

      expect(result.get("page")).toBe("3");
    });

    it("should build multiple params", () => {
      const result = buildFilterSearchParams({
        category: "dien-tu",
        search: "laptop",
        minPrice: 10000000,
        sort: "newest",
        page: 2,
      });

      expect(result.get("category")).toBe("dien-tu");
      expect(result.get("search")).toBe("laptop");
      expect(result.get("minPrice")).toBe("10000000");
      expect(result.get("sort")).toBe("newest");
      expect(result.get("page")).toBe("2");
    });
  });

  // ============================================================
  // updateFilterParam - Update một param
  // ============================================================
  describe("updateFilterParam", () => {
    it("should add new param", () => {
      const current = new URLSearchParams("category=dien-tu");
      const result = updateFilterParam(current, "search", "iphone");

      expect(result.get("category")).toBe("dien-tu");
      expect(result.get("search")).toBe("iphone");
    });

    it("should update existing param", () => {
      const current = new URLSearchParams("sort=newest");
      const result = updateFilterParam(current, "sort", "price-asc");

      expect(result.get("sort")).toBe("price-asc");
    });

    it("should remove param when value is undefined", () => {
      const current = new URLSearchParams("category=dien-tu&search=iphone");
      const result = updateFilterParam(current, "search", undefined);

      expect(result.get("category")).toBe("dien-tu");
      expect(result.has("search")).toBe(false);
    });

    it("should remove param when value is empty string", () => {
      const current = new URLSearchParams("search=iphone");
      const result = updateFilterParam(current, "search", "");

      expect(result.has("search")).toBe(false);
    });

    it("should remove param when value is false", () => {
      const current = new URLSearchParams("inStock=true");
      const result = updateFilterParam(current, "inStock", false);

      expect(result.has("inStock")).toBe(false);
    });

    it("should reset page when changing other filters", () => {
      const current = new URLSearchParams("category=dien-tu&page=3");
      const result = updateFilterParam(current, "search", "laptop");

      expect(result.get("search")).toBe("laptop");
      expect(result.has("page")).toBe(false);
    });

    it("should not reset page when changing page itself", () => {
      const current = new URLSearchParams("category=dien-tu&page=2");
      const result = updateFilterParam(current, "page", "3");

      expect(result.get("page")).toBe("3");
    });
  });

  // ============================================================
  // clearFilters - Xóa tất cả filters
  // ============================================================
  describe("clearFilters", () => {
    it("should clear all filters but keep search by default", () => {
      const current = new URLSearchParams(
        "category=dien-tu&search=iphone&minPrice=100000&sort=newest&page=2"
      );
      const result = clearFilters(current);

      expect(result.get("search")).toBe("iphone");
      expect(result.get("category")).toBe("dien-tu");
      expect(result.has("minPrice")).toBe(false);
      expect(result.has("sort")).toBe(false);
      expect(result.has("page")).toBe(false);
    });

    it("should clear everything when keepSearch is false", () => {
      const current = new URLSearchParams("category=dien-tu&search=iphone");
      const result = clearFilters(current, false);

      expect(result.toString()).toBe("");
    });
  });

  // ============================================================
  // buildCategoryUrl - Build URL cho category navigation
  // ============================================================
  describe("buildCategoryUrl", () => {
    it("should build category URL", () => {
      const current = new URLSearchParams();
      const result = buildCategoryUrl(current, "dien-tu");

      expect(result).toBe("/products?category=dien-tu");
    });

    it("should preserve search when changing category", () => {
      const current = new URLSearchParams("search=iphone");
      const result = buildCategoryUrl(current, "dien-tu");

      expect(result).toBe("/products?search=iphone&category=dien-tu");
    });

    it("should build all products URL when category is null", () => {
      const current = new URLSearchParams("search=laptop");
      const result = buildCategoryUrl(current, null);

      expect(result).toBe("/products?search=laptop");
    });

    it("should return base URL when no params", () => {
      const current = new URLSearchParams();
      const result = buildCategoryUrl(current, null);

      expect(result).toBe("/products");
    });
  });
});
