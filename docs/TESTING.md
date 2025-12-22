# Vendoor - Testing Guide

Tài liệu hướng dẫn testing strategy, cách chạy tests, và coverage của dự án.

---

## 📋 Mục lục

1. [Overview](#1-overview)
2. [Test Commands](#2-test-commands)
3. [Unit Tests](#3-unit-tests)
4. [Integration Tests](#4-integration-tests)
5. [E2E Tests](#5-e2e-tests)
6. [Test Patterns](#6-test-patterns)
7. [Writing New Tests](#7-writing-new-tests)

---

## 1. Overview

### Test Distribution

| Type        | Files  | Tests    | Purpose                          |
| ----------- | ------ | -------- | -------------------------------- |
| Unit        | 7      | 215      | Pure functions, schemas, utils   |
| Integration | 4      | 78       | Multi-module flows với mocked DB |
| E2E         | 3      | ~35      | Full user journeys               |
| **Total**   | **14** | **293+** |                                  |

### Tools

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| **Vitest**          | Unit & Integration testing |
| **Playwright**      | E2E browser testing        |
| **Testing Library** | DOM assertions             |

### File Structure

```
vendoor/
├── src/
│   ├── shared/lib/utils/__tests__/     # Shared utils tests
│   ├── entities/
│   │   ├── cart/__tests__/             # Cart entity tests
│   │   ├── order/__tests__/            # Order entity tests
│   │   └── product/__tests__/          # Product entity tests
│   └── features/
│       ├── auth/__tests__/             # Auth feature tests
│       └── checkout/__tests__/         # Checkout feature tests
├── tests/
│   ├── setup.ts                        # Global test setup
│   ├── helpers/
│   │   ├── mocks.ts                    # Mock factories
│   │   └── fixtures.ts                 # Test data factories
│   ├── integration/
│   │   ├── auth/                       # Auth integration tests
│   │   ├── checkout/                   # Checkout integration tests
│   │   └── inventory/                  # Inventory integration tests
│   └── e2e/
│       ├── auth.spec.ts                # Auth E2E tests
│       ├── checkout-flow.spec.ts       # Checkout E2E tests
│       └── vendor-flow.spec.ts         # Vendor E2E tests
├── vitest.config.ts
└── playwright.config.ts
```

---

## 2. Test Commands

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test -- --watch

# Run specific file
pnpm test -- src/entities/cart/__tests__/utils.test.ts

# Run with pattern
pnpm test -- cart

# Coverage report
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# UI mode (interactive)
pnpm test:e2e:ui

# Run specific file
pnpm test:e2e -- tests/e2e/auth.spec.ts

# Run with headed browser
pnpm test:e2e -- --headed

# Debug mode
pnpm test:e2e -- --debug
```

---

## 3. Unit Tests

### Coverage

| File                      | Tests | Coverage                                                               |
| ------------------------- | ----- | ---------------------------------------------------------------------- |
| `format.test.ts`          | 57    | `formatPrice`, `formatDate`, `formatPercent`, `formatNumber`           |
| `id.test.ts`              | 12    | `generateOrderNumber`, `generateRandomString`, `generateSlug`          |
| `order/utils.test.ts`     | 36    | `calculateCommission`, `calculateSubtotal`, `validateStatusTransition` |
| `cart/utils.test.ts`      | 17    | `calculateCartTotals`, `groupItemsByVendor`                            |
| `product/utils.test.ts`   | 35    | `calculateDiscount`, `validateSKU`, `calculateAverageRating`           |
| `checkout/schema.test.ts` | 34    | Checkout form validation                                               |
| `auth/schema.test.ts`     | 24    | Login/register validation                                              |

### Example: Format Utils

```typescript
// src/shared/lib/utils/__tests__/format.test.ts
describe("formatPrice - Format giá tiền VND", () => {
  it("formats standard price - hiển thị giá chuẩn", () => {
    expect(formatPrice(100000)).toBe("100.000\u00A0₫");
  });

  it("formats zero - hiển thị 0", () => {
    expect(formatPrice(0)).toBe("0\u00A0₫");
  });

  it("formats millions - hiển thị triệu", () => {
    expect(formatPrice(1500000)).toBe("1.500.000\u00A0₫");
  });
});
```

### Example: Schema Validation

```typescript
// src/features/checkout/__tests__/schema.test.ts
describe("Phone validation - Validate SĐT", () => {
  it("accepts valid Vietnam phone - SĐT hợp lệ", () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      phone: "0901234567",
    });
    expect(result.success).toBe(true);
  });

  it("rejects phone not starting with 0 - không bắt đầu bằng 0", () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      phone: "1901234567",
    });
    expect(result.success).toBe(false);
  });
});
```

---

## 4. Integration Tests

### Coverage

| File                        | Tests | Coverage                                                 |
| --------------------------- | ----- | -------------------------------------------------------- |
| `validate-checkout.test.ts` | 8     | Stock validation before checkout                         |
| `create-orders.test.ts`     | 12    | Order creation with mocked DB                            |
| `guards.test.ts`            | 28    | `requireAuth`, `requireRole`, `requireVendor`, `hasRole` |
| `stock-management.test.ts`  | 30    | `updateStock`, `bulkUpdateStock`                         |

### Mock Pattern (vi.hoisted)

```typescript
// tests/integration/auth/guards.test.ts
vi.mock("server-only", () => ({}));

const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock("@/shared/lib/auth/config", () => ({
  auth: {
    api: {
      getSession: () => mockGetSession(),
    },
  },
}));

const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
}));
vi.mock("@/shared/lib/db", () => ({
  prisma: mockPrisma,
}));

// Import sau khi mock
import { requireAuth } from "@/entities/user/api/guards";

describe("requireAuth", () => {
  it("returns user when authenticated", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "user-123" } });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Test",
      roles: ["CUSTOMER"],
    });

    const result = await requireAuth();
    expect(result.user.id).toBe("user-123");
  });
});
```

### Fixtures Pattern

```typescript
// tests/helpers/fixtures.ts
export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "cart-item-1",
    variantId: "variant-1",
    productId: "product-1",
    vendorId: "vendor-1",
    vendorName: "Test Shop",
    name: "Test Product",
    price: 150000,
    quantity: 2,
    stock: 10,
    image: "/test.jpg",
    ...overrides,
  };
}

export function createMultiVendorCart(): CartItem[] {
  return [
    createCartItem({ vendorId: "vendor-1" }),
    createCartItem({ id: "cart-item-2", vendorId: "vendor-2" }),
  ];
}
```

---

## 5. E2E Tests

### Test Accounts

| Role     | Email                  | Password      |
| -------- | ---------------------- | ------------- |
| Customer | `customer@vendoor.com` | `Test@123456` |
| Vendor   | `vendor@vendoor.com`   | `Test@123456` |
| Admin    | `admin@vendoor.com`    | `Test@123456` |

### Coverage

| File                    | Scenarios                                 |
| ----------------------- | ----------------------------------------- |
| `auth.spec.ts`          | Login, logout, register, protected routes |
| `checkout-flow.spec.ts` | Browse products, cart, checkout COD       |
| `vendor-flow.spec.ts`   | Dashboard, products, orders, inventory    |

### Example: Auth E2E

```typescript
// tests/e2e/auth.spec.ts
test("customer can login successfully", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/email/i).fill("customer@vendoor.com");
  await page.getByLabel(/mật khẩu|password/i).fill("Test@123456");
  await page.getByRole("button", { name: /đăng nhập|login/i }).click();

  await expect(page).toHaveURL(/\/$|\/dashboard/);
});
```

### Example: Checkout E2E

```typescript
// tests/e2e/checkout-flow.spec.ts
test("can complete COD order", async ({ page }) => {
  await loginAsCustomer(page);

  // Add item to cart
  await page.goto("/products");
  await page.locator("[data-testid='product-card']").first().click();
  await page.getByRole("button", { name: /thêm vào giỏ/i }).click();

  // Checkout
  await page.goto("/checkout");
  await page.getByLabel(/tên/i).fill("Test User");
  await page.getByLabel(/điện thoại/i).fill("0901234567");
  // ...fill other fields

  await page.getByText(/COD/i).click();
  await page.getByRole("button", { name: /đặt hàng/i }).click();

  await expect(page.getByText(/thành công/i)).toBeVisible();
});
```

---

## 6. Test Patterns

### Naming Convention

```typescript
// Pattern: "action - expected result - context (Vietnamese)"
describe("formatPrice - Format giá tiền VND", () => {
  it("formats standard price - hiển thị giá chuẩn", () => {});
  it("handles zero - xử lý số 0", () => {});
  it("handles negative - xử lý số âm", () => {});
});
```

### AAA Pattern

```typescript
it("calculates commission correctly", () => {
  // Arrange
  const subtotal = 100000;

  // Act
  const result = calculateCommission(subtotal);

  // Assert
  expect(result).toBe(2000); // 2%
});
```

### Testing Errors

```typescript
it("returns error when stock is insufficient", async () => {
  mockPrisma.productVariant.findUnique.mockResolvedValue({ stock: 2 });

  const result = await validateCheckout([createCartItem({ quantity: 5 })]);

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain("không đủ hàng");
});
```

---

## 7. Writing New Tests

### Unit Test Template

```typescript
// src/entities/[entity]/__tests__/utils.test.ts
import { describe, it, expect } from "vitest";
import { myFunction } from "../lib/utils";

describe("myFunction - Mô tả chức năng", () => {
  describe("happy path - trường hợp thành công", () => {
    it("does X when given Y - làm X khi có Y", () => {
      const result = myFunction(input);
      expect(result).toBe(expected);
    });
  });

  describe("edge cases - trường hợp biên", () => {
    it("handles empty input - xử lý input rỗng", () => {});
    it("handles null - xử lý null", () => {});
  });

  describe("error cases - trường hợp lỗi", () => {
    it("throws when invalid - throw khi không hợp lệ", () => {});
  });
});
```

### Integration Test Template

```typescript
// tests/integration/[feature]/action.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockPrisma = vi.hoisted(() => ({
  model: { findUnique: vi.fn(), create: vi.fn() },
}));
vi.mock("@/shared/lib/db", () => ({ prisma: mockPrisma }));

import { myAction } from "@/features/[feature]/api/actions";

describe("myAction - Mô tả action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("succeeds when valid - thành công khi hợp lệ", async () => {
    mockPrisma.model.findUnique.mockResolvedValue({ id: "1" });

    const result = await myAction(validInput);

    expect(result.success).toBe(true);
  });
});
```

---

## 🔗 Related Documentation

- [MANUAL_TESTING.md](./MANUAL_TESTING.md) - Checklist test thủ công
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Hướng dẫn đóng góp
