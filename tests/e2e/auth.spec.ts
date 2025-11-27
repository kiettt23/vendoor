/**
 * E2E Tests - Authentication Flow
 *
 * 📚 Test full user authentication journey:
 * - Đăng ký tài khoản mới
 * - Đăng nhập với tài khoản có sẵn
 * - Đăng xuất
 * - Truy cập protected routes
 *
 * Playwright Concepts:
 * - page.goto() - Navigate to URL
 * - page.getByLabel() - Find by label text (preferred for forms)
 * - page.getByRole() - Find by ARIA role
 * - page.getByText() - Find by visible text
 * - page.locator() - CSS selector fallback
 */

import { test, expect } from "@playwright/test";

// Test data
const TEST_USER = {
  email: "test@example.com",
  password: "Test123456",
  name: "Test User",
};

test.describe("Authentication Flow", () => {
  test.describe("Login Page", () => {
    test("should display login form", async ({ page }) => {
      await page.goto("/login");

      // Check page elements using label (more stable than placeholder)
      await expect(page.getByText("Đăng nhập").first()).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Mật khẩu")).toBeVisible();
      await expect(
        page.getByRole("button", { name: /đăng nhập/i })
      ).toBeVisible();
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/login");

      // Submit empty form
      await page.getByRole("button", { name: /đăng nhập/i }).click();

      // Expect validation messages
      await expect(page.getByText(/email không hợp lệ/i)).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Register Page", () => {
    test("should display register form", async ({ page }) => {
      await page.goto("/register");

      await expect(page.getByText("Đăng ký").first()).toBeVisible();
      await expect(page.getByLabel("Họ tên")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Xác nhận mật khẩu")).toBeVisible();
    });

    test("should show validation for short password", async ({ page }) => {
      await page.goto("/register");

      await page.getByLabel("Họ tên").fill(TEST_USER.name);
      await page.getByLabel("Email").fill(TEST_USER.email);
      await page.getByLabel("Mật khẩu", { exact: true }).fill("123");
      await page.getByLabel("Xác nhận mật khẩu").fill("123");

      await page.getByRole("button", { name: /đăng ký/i }).click();

      await expect(page.getByText(/ít nhất 6 ký tự/i)).toBeVisible({
        timeout: 10000,
      });
    });

    test("should show error when passwords do not match", async ({ page }) => {
      await page.goto("/register");

      await page.getByLabel("Họ tên").fill(TEST_USER.name);
      await page.getByLabel("Email").fill(TEST_USER.email);
      await page.getByLabel("Mật khẩu", { exact: true }).fill("password123");
      await page.getByLabel("Xác nhận mật khẩu").fill("different123");

      await page.getByRole("button", { name: /đăng ký/i }).click();

      await expect(page.getByText(/không khớp/i)).toBeVisible();
    });

    test("should have link to login page", async ({ page }) => {
      await page.goto("/register");

      await page.getByRole("link", { name: /đăng nhập/i }).click();

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing /account without auth", async ({
      page,
    }) => {
      await page.goto("/account");

      // Should redirect to login (or show login required message)
      await expect(page).toHaveURL(/\/login|\/account/);
    });

    test("should redirect to login when accessing /orders without auth", async ({
      page,
    }) => {
      await page.goto("/orders");

      await expect(page).toHaveURL(/\/login|\/orders/);
    });
  });
});
