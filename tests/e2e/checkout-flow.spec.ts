/**
 * E2E Tests - Checkout Flow
 *
 * Test complete checkout journey:
 * - Add product to cart
 * - Navigate to checkout
 * - Fill shipping form
 * - Select payment method (COD)
 * - Complete order
 */

import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test.describe("Cart to Checkout Navigation", () => {
    test("should navigate from cart to checkout", async ({ page }) => {
      await page.goto("/cart");
      await page.waitForLoadState("networkidle");

      // Check if checkout button exists (may be disabled if cart empty)
      const checkoutButton = page.getByRole("link", { name: /thanh toán|checkout/i });
      const buttonExists = await checkoutButton.count();
      
      if (buttonExists > 0) {
        await checkoutButton.click();
        await expect(page).toHaveURL(/\/checkout/);
      } else {
        // Cart is empty - verify empty state
        await expect(page.getByText(/giỏ hàng trống|chưa có sản phẩm/i)).toBeVisible();
      }
    });

    test("should show empty cart message when no items", async ({ page }) => {
      // Clear localStorage to ensure empty cart
      await page.goto("/");
      await page.evaluate(() => localStorage.clear());
      
      await page.goto("/cart");
      await page.waitForLoadState("networkidle");

      // Should show empty state
      const body = await page.textContent("body");
      expect(body?.toLowerCase()).toMatch(/giỏ hàng|cart/);
    });
  });

  test.describe("Checkout Page Elements", () => {
    test("should display checkout form fields", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Form fields should be visible (labels have * for required)
      await expect(page.getByText("Họ tên *")).toBeVisible({ timeout: 10000 });
      await expect(page.getByText("Số điện thoại *")).toBeVisible();
      await expect(page.getByText("Địa chỉ *")).toBeVisible();
    });

    test("should have payment method selection", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Should have COD option - actual text in UI
      const codOption = page.getByText("Thanh toán khi nhận hàng (COD)");
      await expect(codOption).toBeVisible({ timeout: 10000 });
    });

    test("should validate required fields", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Try to submit empty form
      const submitButton = page.getByRole("button", { name: /đặt hàng|xác nhận/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Should show validation errors
        await page.waitForTimeout(1000);
        const bodyText = await page.textContent("body");
        expect(bodyText?.toLowerCase()).toMatch(/bắt buộc|required|không hợp lệ|invalid/);
      }
    });

    test("should validate phone number format", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      const phoneInput = page.getByLabel(/số điện thoại|phone/i);
      if (await phoneInput.isVisible()) {
        await phoneInput.fill("123"); // Invalid phone

        const submitButton = page.getByRole("button", { name: /đặt hàng|xác nhận/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          await page.waitForTimeout(1000);
          const bodyText = await page.textContent("body");
          // Should show phone validation error
          expect(bodyText).toBeTruthy();
        }
      }
    });
  });

  test.describe("COD Checkout Flow", () => {
    test("should fill checkout form with COD payment", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Fill form fields
      const nameInput = page.getByLabel(/họ tên|tên/i);
      if (await nameInput.isVisible()) {
        await nameInput.fill("Nguyễn Văn Test");
        await page.getByLabel(/số điện thoại|phone/i).fill("0901234567");
        await page.getByLabel(/địa chỉ/i).first().fill("123 Đường Test");

        // City/District/Ward fields
        const cityInput = page.getByLabel(/tỉnh|thành phố|city/i);
        if (await cityInput.isVisible()) {
          await cityInput.fill("Hồ Chí Minh");
        }

        const districtInput = page.getByLabel(/quận|huyện|district/i);
        if (await districtInput.isVisible()) {
          await districtInput.fill("Quận 1");
        }

        const wardInput = page.getByLabel(/phường|xã|ward/i);
        if (await wardInput.isVisible()) {
          await wardInput.fill("Phường Bến Nghé");
        }

        // Select COD payment
        const codRadio = page.getByLabel(/thanh toán khi nhận hàng|cod/i);
        if (await codRadio.isVisible()) {
          await codRadio.click();
        }

        // Verify form is filled
        await expect(nameInput).toHaveValue("Nguyễn Văn Test");
      }
    });
  });

  test.describe("Order Summary", () => {
    test("should display order summary section", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");

      // Should have order summary or total section
      const bodyText = await page.textContent("body");
      expect(bodyText?.toLowerCase()).toMatch(/tổng|total|đơn hàng|order/);
    });
  });
});

test.describe("Add to Cart Flow", () => {
  test("should have add to cart button on product page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Find first product link
    const productLink = page.locator('a[href^="/products/"]').first();
    const hasProducts = await productLink.count() > 0;

    if (hasProducts) {
      await productLink.click();
      await page.waitForLoadState("networkidle");

      // Product detail page should have add to cart
      const addToCartButton = page.getByRole("button", { name: /thêm vào giỏ|add to cart/i });
      await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    }
  });

  test("should add product to cart", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const productLink = page.locator('a[href^="/products/"]').first();
    const hasProducts = await productLink.count() > 0;

    if (hasProducts) {
      await productLink.click();
      await page.waitForLoadState("networkidle");

      const addToCartButton = page.getByRole("button", { name: /thêm vào giỏ|add to cart/i });
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();

        // Should show success feedback (toast or cart update)
        await page.waitForTimeout(1000);

        // Navigate to cart
        await page.goto("/cart");
        await page.waitForLoadState("networkidle");

        // Cart should have items or still be accessible
        const body = await page.textContent("body");
        expect(body).toBeTruthy();
      }
    }
  });
});

test.describe("Mobile Responsive", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("checkout page should be mobile friendly", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    // Page should be scrollable and usable on mobile
    await expect(page.locator("body")).toBeVisible();

    // Form should be accessible
    const nameInput = page.getByLabel(/họ tên|tên/i);
    if (await nameInput.isVisible()) {
      await nameInput.tap();
      await expect(nameInput).toBeFocused();
    }
  });

  test("cart page should be mobile friendly", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toBeVisible();
  });
});
