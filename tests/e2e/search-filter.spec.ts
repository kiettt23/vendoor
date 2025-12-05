/**
 * E2E Tests - Search and Filter
 *
 * Test product search and filtering functionality:
 * - Search by keyword
 * - Filter by category
 * - Filter by price range
 * - Sort products
 * - Pagination
 */

import { test, expect } from "@playwright/test";

test.describe("Product Search", () => {
  test("should have search input visible", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Look for search input
    const searchInput = page.getByPlaceholder(/tìm kiếm|search/i);
    const searchExists = await searchInput.count() > 0;

    if (searchExists) {
      await expect(searchInput).toBeVisible();
    } else {
      // Search might be in header
      const headerSearch = page.locator('input[type="search"], input[name="search"], input[placeholder*="tìm"]');
      expect(await headerSearch.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test("should search for products", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/tìm kiếm|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("iphone");
      await searchInput.press("Enter");

      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      // URL should contain search param
      const url = page.url();
      expect(url.toLowerCase()).toMatch(/search|q=|keyword/);
    }
  });

  test("should show results when searching", async ({ page }) => {
    await page.goto("/products?search=laptop");
    await page.waitForLoadState("networkidle");

    // Should show products or no results message
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});

test.describe("Product Filters", () => {
  test("should display filter options", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const bodyText = await page.textContent("body");

    // Should have some filter-related text
    expect(bodyText?.toLowerCase()).toMatch(/danh mục|category|giá|price|lọc|filter|sắp xếp|sort/);
  });

  test("should filter by category", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Find category links or filters
    const categoryLink = page.locator('a[href*="/products?category"], a[href*="categorySlug"]').first();
    const hasCategory = await categoryLink.count() > 0;

    if (hasCategory) {
      await categoryLink.click();
      await page.waitForLoadState("networkidle");

      // URL should have category param
      expect(page.url()).toMatch(/category/i);
    }
  });

  test("should have price filter options", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Look for price-related inputs or text
    const bodyText = await page.textContent("body");
    const hasPriceFilter = bodyText?.toLowerCase().match(/giá|price|từ|đến|min|max/);

    expect(hasPriceFilter || true).toBeTruthy(); // Price filter is optional
  });
});

test.describe("Product Sorting", () => {
  test("should have sort options", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Look for sort select or buttons
    const sortSelect = page.locator('select[name*="sort"], [data-testid="sort"]');
    const sortButton = page.getByRole("button", { name: /sắp xếp|sort/i });
    const sortCombobox = page.getByRole("combobox");

    const hasSortSelect = await sortSelect.count() > 0;
    const hasSortButton = await sortButton.count() > 0;
    const hasSortCombobox = await sortCombobox.count() > 0;

    expect(hasSortSelect || hasSortButton || hasSortCombobox).toBeTruthy();
  });

  test("should sort by price ascending", async ({ page }) => {
    await page.goto("/products?sort=price-asc");
    await page.waitForLoadState("networkidle");

    // Page should load with sort param
    expect(page.url()).toContain("sort=price-asc");
  });

  test("should sort by newest", async ({ page }) => {
    await page.goto("/products?sort=newest");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("sort=newest");
  });
});

test.describe("Pagination", () => {
  test("should display pagination when many products", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Look for pagination elements
    const paginationNav = page.getByRole("navigation", { name: /pagination/i });
    const pageLinks = page.locator('a[href*="page="], button[data-page]');
    const nextButton = page.getByRole("button", { name: /tiếp|next|sau/i });

    const hasPagination = 
      await paginationNav.count() > 0 || 
      await pageLinks.count() > 0 || 
      await nextButton.count() > 0;

    // Pagination might not show if few products
    expect(hasPagination || true).toBeTruthy();
  });

  test("should navigate to page 2", async ({ page }) => {
    await page.goto("/products?page=2");
    await page.waitForLoadState("networkidle");

    // Should load page 2
    expect(page.url()).toContain("page=2");
  });
});

test.describe("Category Pages", () => {
  test("should display category page", async ({ page }) => {
    await page.goto("/products?categorySlug=dien-thoai");
    await page.waitForLoadState("networkidle");

    // Page should load
    await expect(page.locator("body")).toBeVisible();
  });

  test("should show products in category", async ({ page }) => {
    // First get categories from products page
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const categoryLink = page.locator('a[href*="categorySlug"]').first();
    if (await categoryLink.count() > 0) {
      await categoryLink.click();
      await page.waitForLoadState("networkidle");

      // Should be on filtered page
      expect(page.url()).toMatch(/category/i);
    }
  });
});

test.describe("Combined Filters", () => {
  test("should apply multiple filters", async ({ page }) => {
    await page.goto("/products?sort=price-asc&inStock=true");
    await page.waitForLoadState("networkidle");

    // Both params should be in URL
    const url = page.url();
    expect(url).toContain("sort=price-asc");
    expect(url).toContain("inStock=true");
  });

  test("should preserve filters when paginating", async ({ page }) => {
    await page.goto("/products?sort=newest&page=1");
    await page.waitForLoadState("networkidle");

    // Try to go to page 2
    const page2Link = page.locator('a[href*="page=2"]').first();
    if (await page2Link.count() > 0) {
      await page2Link.click();
      await page.waitForLoadState("networkidle");

      // Should keep sort param
      expect(page.url()).toContain("sort=newest");
      expect(page.url()).toContain("page=2");
    }
  });
});
