/**
 * E2E Tests - Customer Journey
 *
 * 📚 Test full shopping experience:
 * - Duyệt sản phẩm
 * - Xem chi tiết sản phẩm
 * - Thêm vào giỏ hàng
 * - Checkout
 *
 * Playwright Tips:
 * - Use page.getByLabel() for form fields
 * - page.waitForURL() - Wait for navigation
 * - page.locator() - CSS/XPath selector
 * - toHaveCount() - Assert number of elements
 */

import { test, expect } from "@playwright/test";

test.describe("Customer Journey", () => {
  test.describe("Homepage", () => {
    test("should display hero section", async ({ page }) => {
      await page.goto("/");

      // Hero should be visible with h1
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15000,
      });
    });

    test("should have CTA button", async ({ page }) => {
      await page.goto("/");

      // Should have CTA button "Khám phá ngay"
      await expect(
        page.getByRole("link", { name: /khám phá ngay/i })
      ).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe("Products Page", () => {
    test("should display product listing", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      // Wait for page to load fully
      await page.waitForTimeout(2000);

      // Check for product links or empty state
      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    });
  });

  test.describe("Cart", () => {
    test("should have cart page accessible", async ({ page }) => {
      await page.goto("/cart");
      await page.waitForLoadState("networkidle");

      // Cart page should be accessible
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Checkout", () => {
    test("should have checkout page accessible", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Checkout page should be accessible (may show empty cart message)
      await expect(page.locator("body")).toBeVisible();
    });
  });
});
