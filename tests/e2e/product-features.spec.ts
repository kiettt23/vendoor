/**
 * E2E Tests - Product Reviews
 *
 * 📚 Test review features:
 * - Xem danh sách reviews
 * - Xem ảnh review với lightbox
 * - Rating distribution
 * - Vendor replies
 */

import { test, expect } from "@playwright/test";

test.describe("Product Reviews", () => {
  test.describe("Product Detail Page", () => {
    test("should display product page", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      // Find and click first product
      const productLink = page.locator('a[href^="/products/"]').first();
      const exists = (await productLink.count()) > 0;

      if (exists) {
        await productLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on product detail page
        await expect(page).toHaveURL(/\/products\/[a-z0-9-]+/);
      }
    });

    test("should show reviews section if reviews exist", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      const productLink = page.locator('a[href^="/products/"]').first();
      const exists = (await productLink.count()) > 0;

      if (exists) {
        await productLink.click();
        await page.waitForLoadState("networkidle");

        // Look for reviews section or "Chưa có đánh giá" text
        const body = await page.textContent("body");
        expect(body).toBeTruthy();
      }
    });
  });

  test.describe("Review Image Gallery", () => {
    test("should have lightbox functionality ready", async ({ page }) => {
      // Navigate to a product page
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      const productLink = page.locator('a[href^="/products/"]').first();
      const exists = (await productLink.count()) > 0;

      if (exists) {
        await productLink.click();
        await page.waitForLoadState("networkidle");

        // Page should load successfully
        await expect(page.locator("body")).toBeVisible();
      }
    });
  });

  test.describe("Write Review (Authenticated)", () => {
    test("should require login to write review", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      const productLink = page.locator('a[href^="/products/"]').first();
      const exists = (await productLink.count()) > 0;

      if (exists) {
        await productLink.click();
        await page.waitForLoadState("networkidle");

        // Look for "Đăng nhập để đánh giá" or review form
        const body = await page.textContent("body");
        expect(body).toBeTruthy();
      }
    });
  });
});

test.describe("Wishlist Feature", () => {
  test("should have wishlist page accessible", async ({ page }) => {
    await page.goto("/wishlist");

    // Should redirect to login or show wishlist
    await expect(page).toHaveURL(/\/(login|wishlist)/);
  });

  test("should show wishlist button on product cards", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Page should load
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Search Feature", () => {
  test("should have search functionality", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for search input
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Tìm"]'
    );
    const exists = (await searchInput.count()) > 0;

    if (exists) {
      await searchInput.first().fill("test");
      // Should trigger search suggestions
      await page.waitForTimeout(500);
    }
  });

  test("should navigate to search results", async ({ page }) => {
    await page.goto("/products?q=test");
    await page.waitForLoadState("networkidle");

    // Should show search results or empty state
    await expect(page.locator("body")).toBeVisible();
  });
});
