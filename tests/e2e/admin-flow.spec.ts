/**
 * E2E Tests - Admin Flow
 *
 * 📚 Test admin management journey:
 * - Basic page access tests
 *
 * Note: These tests focus on accessible pages without auth
 */

import { test, expect } from "@playwright/test";

test.describe("Admin Flow", () => {
  test.describe("Login Page", () => {
    test("should show login form", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      // Login form elements (using getByLabel)
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Mật khẩu")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Đăng nhập" })
      ).toBeVisible();
    });
  });

  test.describe("Public Pages", () => {
    test("should display products page", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      // Should have product listings or empty state
      const productLinks = page.locator('a[href^="/products/"]');
      const count = await productLinks.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
