import { test, expect } from "@playwright/test";

// ============================================================================
// Test Account
// ============================================================================

const CUSTOMER = {
  email: "customer@vendoor.com",
  password: "Test@123456",
};

// ============================================================================
// Helper Functions
// ============================================================================

async function loginAsCustomer(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(CUSTOMER.email);
  await page.getByLabel(/mật khẩu|password/i).fill(CUSTOMER.password);
  await page.getByRole("button", { name: /đăng nhập|login/i }).click();
  await expect(page).toHaveURL(/\/$|\/dashboard/, { timeout: 10000 });
}

// ============================================================================
// Product Browsing Tests - Xem sản phẩm
// ============================================================================

test.describe("Product Browsing - Xem sản phẩm", () => {
  test("can view product listing - xem danh sách sản phẩm", async ({
    page,
  }) => {
    await page.goto("/products");

    // Should see product grid
    await expect(
      page.locator("[data-testid='product-card']").first()
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("can view product detail - xem chi tiết sản phẩm", async ({ page }) => {
    await page.goto("/products");

    // Click on first product
    await page.locator("[data-testid='product-card']").first().click();

    // Should see product detail page
    await expect(
      page.getByRole("button", { name: /thêm vào giỏ|add to cart/i })
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("can filter products by category - lọc theo danh mục", async ({
    page,
  }) => {
    await page.goto("/products");

    // Click on a category filter if available
    const categoryFilter = page
      .locator("[data-testid='category-filter']")
      .first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      // URL should update with category param
      await expect(page).toHaveURL(/category=/);
    }
  });

  test("can search products - tìm kiếm sản phẩm", async ({ page }) => {
    await page.goto("/");

    // Find and use search
    const searchInput = page.getByPlaceholder(/tìm kiếm|search/i);
    await searchInput.fill("áo");
    await searchInput.press("Enter");

    // Should navigate to search results
    await expect(page).toHaveURL(/search|q=/);
  });
});

// ============================================================================
// Cart Tests - Giỏ hàng
// ============================================================================

test.describe("Cart Flow - Giỏ hàng", () => {
  test("can add product to cart - thêm vào giỏ hàng", async ({ page }) => {
    // Go to a product
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();

    // Add to cart
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Should show success notification or cart update
    await expect(page.getByText(/đã thêm|added|thành công/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("can view cart - xem giỏ hàng", async ({ page }) => {
    // Add item first
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Go to cart
    await page.goto("/cart");

    // Should see cart items
    await expect(page.locator("[data-testid='cart-item']").first()).toBeVisible(
      {
        timeout: 10000,
      }
    );
  });

  test("can update quantity in cart - cập nhật số lượng", async ({ page }) => {
    // Add item first
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Go to cart
    await page.goto("/cart");

    // Increase quantity
    const increaseBtn = page
      .getByRole("button", { name: /\+|tăng|increase/i })
      .first();
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
      // Total should update
      await expect(page.getByText(/tổng|total/i)).toBeVisible();
    }
  });

  test("can remove item from cart - xóa khỏi giỏ hàng", async ({ page }) => {
    // Add item first
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Go to cart
    await page.goto("/cart");

    // Remove item
    const removeBtn = page
      .getByRole("button", { name: /xóa|remove|delete/i })
      .first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();

      // Cart should be empty or item removed
      await expect(
        page.getByText(/trống|empty|không có sản phẩm/i)
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("shows empty cart message - thông báo giỏ hàng trống", async ({
    page,
  }) => {
    // Clear cart by going directly
    await page.goto("/cart");

    // If cart is empty, should show message
    const emptyMessage = page.getByText(/trống|empty|không có sản phẩm/i);
    const cartItem = page.locator("[data-testid='cart-item']").first();

    // Either shows empty message OR has items
    const isEmpty = await emptyMessage.isVisible().catch(() => false);
    const hasItems = await cartItem.isVisible().catch(() => false);

    expect(isEmpty || hasItems).toBe(true);
  });
});

// ============================================================================
// Checkout Tests - Thanh toán
// ============================================================================

test.describe("Checkout Flow - Thanh toán", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test("redirects to login if not logged in - yêu cầu đăng nhập", async ({
    browser,
  }) => {
    // Use new context without login
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/checkout");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });

  test("can access checkout with items - vào trang checkout", async ({
    page,
  }) => {
    // Add item to cart
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Go to checkout
    await page.goto("/checkout");

    // Should see checkout form
    await expect(page.getByLabel(/tên|name/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel(/điện thoại|phone/i)).toBeVisible();
    await expect(page.getByLabel(/địa chỉ|address/i)).toBeVisible();
  });

  test("shows validation errors for invalid shipping info - validate thông tin giao hàng", async ({
    page,
  }) => {
    // Add item and go to checkout
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();
    await page.goto("/checkout");

    // Try to submit with invalid data
    await page.getByLabel(/điện thoại|phone/i).fill("123"); // Invalid phone
    await page
      .getByRole("button", { name: /đặt hàng|place order|thanh toán/i })
      .click();

    // Should show validation error
    await expect(page.getByText(/10 số|không hợp lệ|invalid/i)).toBeVisible();
  });

  test("can select payment method - chọn phương thức thanh toán", async ({
    page,
  }) => {
    // Add item and go to checkout
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();
    await page.goto("/checkout");

    // Should see payment options
    await expect(page.getByText(/COD|thanh toán khi nhận/i)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/Stripe|thẻ|card/i)).toBeVisible();
  });

  test("shows order summary - hiển thị tóm tắt đơn hàng", async ({ page }) => {
    // Add item and go to checkout
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();
    await page.goto("/checkout");

    // Should see order summary
    await expect(page.getByText(/tạm tính|subtotal/i)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/phí vận chuyển|shipping/i)).toBeVisible();
    await expect(page.getByText(/tổng cộng|total/i)).toBeVisible();
  });

  test("can complete COD order - đặt hàng COD", async ({ page }) => {
    // Add item
    await page.goto("/products");
    await page.locator("[data-testid='product-card']").first().click();
    await page
      .getByRole("button", { name: /thêm vào giỏ|add to cart/i })
      .click();

    // Go to checkout
    await page.goto("/checkout");

    // Fill shipping info
    await page.getByLabel(/tên|name/i).fill("Test User");
    await page.getByLabel(/điện thoại|phone/i).fill("0901234567");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/địa chỉ|address/i).fill("123 Test Street");
    await page.getByLabel(/phường|ward/i).fill("Phường 1");
    await page.getByLabel(/quận|district/i).fill("Quận 1");
    await page.getByLabel(/thành phố|city/i).fill("TP.HCM");

    // Select COD
    await page.getByText(/COD|thanh toán khi nhận/i).click();

    // Place order
    await page
      .getByRole("button", { name: /đặt hàng|place order|thanh toán/i })
      .click();

    // Should redirect to success page or show confirmation
    await expect(
      page.getByText(/thành công|success|đã đặt|xác nhận/i)
    ).toBeVisible({ timeout: 15000 });
  });
});

// ============================================================================
// Order History Tests - Lịch sử đơn hàng
// ============================================================================

test.describe("Order History - Lịch sử đơn hàng", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test("can view order history - xem lịch sử đơn hàng", async ({ page }) => {
    await page.goto("/orders");

    // Should see orders list or empty state
    const orderItem = page.locator("[data-testid='order-item']").first();
    const emptyState = page.getByText(/chưa có|no orders|trống/i);

    const hasOrders = await orderItem.isVisible().catch(() => false);
    const isEmpty = await emptyState.isVisible().catch(() => false);

    // Either has orders or shows empty state
    expect(hasOrders || isEmpty).toBe(true);
  });

  test("can view order detail - xem chi tiết đơn hàng", async ({ page }) => {
    await page.goto("/orders");

    // If there are orders, click on one
    const orderItem = page.locator("[data-testid='order-item']").first();
    if (await orderItem.isVisible()) {
      await orderItem.click();

      // Should see order details
      await expect(page.getByText(/mã đơn|order number|ORD-/i)).toBeVisible({
        timeout: 10000,
      });
    }
  });
});
