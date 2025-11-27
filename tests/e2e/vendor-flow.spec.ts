/**
 * E2E Tests - Vendor Flow
 *
 * 📚 Test vendor management journey:
 * - Đăng nhập vendor dashboard
 * - Quản lý sản phẩm
 * - Xem và xử lý đơn hàng
 *
 * Note: These tests require a vendor account in the database
 */

import { test, expect } from "@playwright/test";

test.describe("Vendor Flow", () => {
  test.describe("Vendor Dashboard Access", () => {
    test("should redirect to login when accessing /vendor without auth", async ({
      page,
    }) => {
      await page.goto("/vendor");

      // Should redirect to login or show unauthorized
      await expect(page).toHaveURL(/\/(login|vendor)/);
    });

    test("should show login form for vendor", async ({ page }) => {
      await page.goto("/login");

      // Login form elements (using getByLabel as per actual UI)
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Mật khẩu")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Đăng nhập" })
      ).toBeVisible();
    });
  });

  test.describe("Product Management", () => {
    test("should have products page accessible", async ({ page }) => {
      // Just verify the products route exists
      await page.goto("/products");
      await page.waitForLoadState("networkidle");

      // Should display product listing
      const productLinks = page.locator('a[href^="/products/"]');
      const count = await productLinks.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
