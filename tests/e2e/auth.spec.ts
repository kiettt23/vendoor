import { test, expect } from "@playwright/test";

// ============================================================================
// Test Accounts (from CLAUDE.md)
// ============================================================================

const TEST_ACCOUNTS = {
  customer: {
    email: "customer@vendoor.com",
    password: "Kiet1461!",
  },
  vendor: {
    email: "vendor@vendoor.com",
    password: "Kiet1461!",
  },
  admin: {
    email: "admin@vendoor.com",
    password: "Kiet1461!",
  },
};

// ============================================================================
// Login Tests - Đăng nhập
// ============================================================================

test.describe("Login Flow - Đăng nhập", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows login form correctly - hiển thị form đăng nhập", async ({
    page,
  }) => {
    // Check form elements exist
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mật khẩu|password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /đăng nhập|login/i })).toBeVisible();
  });

  test("shows error with invalid credentials - sai thông tin", async ({
    page,
  }) => {
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/mật khẩu|password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Expect error message
    await expect(
      page.getByText(/sai|không đúng|invalid|incorrect/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows validation error for empty fields - thiếu thông tin", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Expect validation errors
    await expect(page.getByText(/bắt buộc|required/i)).toBeVisible();
  });

  test("customer can login successfully - đăng nhập thành công", async ({
    page,
  }) => {
    const { email, password } = TEST_ACCOUNTS.customer;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Should redirect to home or dashboard
    await expect(page).toHaveURL(/\/$|\/dashboard/);

    // User menu should appear
    await expect(
      page.getByRole("button", { name: /tài khoản|account|menu/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("vendor can login and access vendor dashboard - vendor đăng nhập", async ({
    page,
  }) => {
    const { email, password } = TEST_ACCOUNTS.vendor;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Navigate to vendor dashboard
    await page.goto("/vendor");

    // Should see vendor dashboard
    await expect(page).toHaveURL(/\/vendor/);
  });

  test("admin can login and access admin dashboard - admin đăng nhập", async ({
    page,
  }) => {
    const { email, password } = TEST_ACCOUNTS.admin;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Navigate to admin dashboard
    await page.goto("/admin");

    // Should see admin dashboard
    await expect(page).toHaveURL(/\/admin/);
  });

  test("has link to register page - có link đăng ký", async ({ page }) => {
    const registerLink = page.getByRole("link", { name: /đăng ký|register/i });
    await expect(registerLink).toBeVisible();

    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });
});

// ============================================================================
// Logout Tests - Đăng xuất
// ============================================================================

test.describe("Logout Flow - Đăng xuất", () => {
  test("user can logout - đăng xuất thành công", async ({ page }) => {
    // Login first
    await page.goto("/login");
    const { email, password } = TEST_ACCOUNTS.customer;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Wait for redirect
    await expect(page).toHaveURL(/\/$|\/dashboard/, { timeout: 10000 });

    // Click user menu
    await page.getByRole("button", { name: /tài khoản|account|menu/i }).click();

    // Click logout
    await page.getByRole("menuitem", { name: /đăng xuất|logout/i }).click();

    // Should redirect to home or login
    await expect(page).toHaveURL(/\/$|\/login/);
  });
});

// ============================================================================
// Register Tests - Đăng ký
// ============================================================================

test.describe("Register Flow - Đăng ký", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("shows register form correctly - hiển thị form đăng ký", async ({
    page,
  }) => {
    await expect(page.getByLabel(/tên|name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mật khẩu|password/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /đăng ký|register|tạo tài khoản/i })
    ).toBeVisible();
  });

  test("shows validation errors for invalid input - validate input", async ({
    page,
  }) => {
    // Fill with invalid data
    await page.getByLabel(/tên|name/i).fill("A"); // Too short
    await page.getByLabel(/email/i).fill("invalid-email");

    // Try to submit
    await page
      .getByRole("button", { name: /đăng ký|register|tạo tài khoản/i })
      .click();

    // Expect validation errors
    await expect(page.getByText(/hợp lệ|invalid|ký tự/i)).toBeVisible();
  });

  test("shows error for existing email - email đã tồn tại", async ({
    page,
  }) => {
    // Use existing email
    await page.getByLabel(/tên|name/i).fill("Test User");
    await page.getByLabel(/email/i).fill(TEST_ACCOUNTS.customer.email);

    // Fill password fields
    const passwordFields = page.getByLabel(/mật khẩu|password/i);
    await passwordFields.first().fill("ValidPass123!");
    if ((await passwordFields.count()) > 1) {
      await passwordFields.nth(1).fill("ValidPass123!");
    }

    await page
      .getByRole("button", { name: /đăng ký|register|tạo tài khoản/i })
      .click();

    // Expect error about existing email
    await expect(page.getByText(/đã tồn tại|already exists|đã được sử dụng/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("has link to login page - có link đăng nhập", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: /đăng nhập|login/i });
    await expect(loginLink).toBeVisible();

    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

// ============================================================================
// Protected Routes Tests - Route được bảo vệ
// ============================================================================

test.describe("Protected Routes - Route được bảo vệ", () => {
  test("redirects to login when accessing protected route - redirect khi chưa login", async ({
    page,
  }) => {
    // Try to access order history without login
    await page.goto("/orders");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects non-vendor from vendor dashboard - chặn non-vendor", async ({
    page,
  }) => {
    // Login as customer
    await page.goto("/login");
    const { email, password } = TEST_ACCOUNTS.customer;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Wait for login
    await expect(page).toHaveURL(/\/$|\/dashboard/, { timeout: 10000 });

    // Try to access vendor dashboard
    await page.goto("/vendor");

    // Should redirect away (to home or error page)
    await expect(page).not.toHaveURL(/\/vendor\/dashboard/);
  });

  test("redirects non-admin from admin dashboard - chặn non-admin", async ({
    page,
  }) => {
    // Login as customer
    await page.goto("/login");
    const { email, password } = TEST_ACCOUNTS.customer;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/mật khẩu|password/i).fill(password);
    await page.getByRole("button", { name: /đăng nhập|login/i }).click();

    // Wait for login
    await expect(page).toHaveURL(/\/$|\/dashboard/, { timeout: 10000 });

    // Try to access admin dashboard
    await page.goto("/admin");

    // Should redirect away
    await expect(page).not.toHaveURL(/\/admin\/dashboard/);
  });
});
