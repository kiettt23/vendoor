# 🧪 Testing

Test coverage cho các tính năng trong Vendoor. Đối chiếu với `FEATURES.md`.

---

## 📊 Tổng quan

| Loại Test   | Files | Tests | Status  |
| ----------- | ----- | ----- | ------- |
| Unit        | 20    | 355+  | ✅ Pass |
| Integration | 2     | 13    | ✅ Pass |
| E2E         | 5     | 25+   | ✅ Pass |

**Total: 375 tests**

**Commands:**

```bash
pnpm test          # Unit + Integration
pnpm test:e2e      # E2E (cần dev server)
pnpm test:coverage # Coverage report
```

---

## 🛒 Customer Features

### Giỏ Hàng & Thanh Toán

| Tính năng                  | Test File                       | Tests | Status |
| -------------------------- | ------------------------------- | ----- | ------ |
| Thêm/xóa/cập nhật giỏ hàng | `cart/model/store.test.ts`      | 11    | ✅     |
| Nhóm sản phẩm theo vendor  | `cart/lib/utils.test.ts`        | 4     | ✅     |
| Tính subtotal mỗi vendor   | `cart/lib/utils.test.ts`        | 2     | ✅     |
| Tính phí ship theo vendor  | `cart/lib/utils.test.ts`        | 2     | ✅     |
| Tính platform fee          | `cart/lib/utils.test.ts`        | 1     | ✅     |
| Checkout form validation   | `checkout/model/schema.test.ts` | 17    | ✅     |
| Checkout flow              | `e2e/customer-journey.spec.ts`  | 2     | ✅     |

### Quản Lý Đơn Hàng

| Tính năng                  | Test File                 | Tests | Status |
| -------------------------- | ------------------------- | ----- | ------ |
| Tính commission            | `order/lib/utils.test.ts` | 3     | ✅     |
| Prepare order data         | `order/lib/utils.test.ts` | 6     | ✅     |
| Validate status transition | `order/lib/utils.test.ts` | 12    | ✅     |

### Đánh Giá Sản Phẩm ⭐

| Tính năng                     | Test File                      | Tests | Status |
| ----------------------------- | ------------------------------ | ----- | ------ |
| createReviewSchema validation | `review/model/schema.test.ts`  | 22    | ✅     |
| vendorReplySchema validation  | `review/model/schema.test.ts`  | 7     | ✅     |
| Image upload validation       | `upload/validation.test.ts`    | 26    | ✅     |
| Image lightbox                | `e2e/product-features.spec.ts` | 2     | ✅     |

### Image Upload Utilities

| Tính năng              | Test File                          | Tests | Status |
| ---------------------- | ---------------------------------- | ----- | ------ |
| validateImageFile      | `upload/validation.test.ts`        | 9     | ✅     |
| validateFileSize       | `upload/validation.test.ts`        | 6     | ✅     |
| validateFileType       | `upload/validation.test.ts`        | 5     | ✅     |
| validateImageFiles     | `upload/validation.test.ts`        | 6     | ✅     |
| buildTransformString   | `upload/cloudinary-loader.test.ts` | 10    | ✅     |
| isCloudinaryUrl        | `upload/cloudinary-loader.test.ts` | 6     | ✅     |
| transformCloudinaryUrl | `upload/cloudinary-loader.test.ts` | 7     | ✅     |
| getBlurPlaceholderUrl  | `upload/cloudinary-loader.test.ts` | 4     | ✅     |

### Upload Constants

| Tính năng          | Test File                  | Tests | Status |
| ------------------ | -------------------------- | ----- | ------ |
| FILE_UPLOAD limits | `constants/upload.test.ts` | 6     | ✅     |
| IMAGE_DIMENSIONS   | `constants/upload.test.ts` | 4     | ✅     |
| CLOUDINARY_PRESETS | `constants/upload.test.ts` | 12    | ✅     |

### Search & Discovery

| Tính năng           | Test File                      | Tests | Status |
| ------------------- | ------------------------------ | ----- | ------ |
| Search suggestions  | `e2e/product-features.spec.ts` | 2     | ✅     |
| Search results page | `e2e/product-features.spec.ts` | 1     | ✅     |

### Wishlist

| Tính năng            | Test File                      | Tests | Status |
| -------------------- | ------------------------------ | ----- | ------ |
| Wishlist page access | `e2e/product-features.spec.ts` | 2     | ✅     |

---

## 🏪 Vendor Features

### Quản Lý Sản Phẩm

| Tính năng            | Test File                   | Tests | Status |
| -------------------- | --------------------------- | ----- | ------ |
| Calculate discount   | `product/lib/utils.test.ts` | 4     | ✅     |
| Has discount check   | `product/lib/utils.test.ts` | 3     | ✅     |
| Validate SKU         | `product/lib/utils.test.ts` | 6     | ✅     |
| Generate unique slug | `product/lib/utils.test.ts` | 4     | ✅     |
| Products page        | `e2e/vendor-flow.spec.ts`   | 1     | ✅     |

### Quản Lý Tồn Kho ⭐ (NEW)

| Tính năng                        | Test File                                  | Tests | Status |
| -------------------------------- | ------------------------------------------ | ----- | ------ |
| Stock status thresholds          | `inventory-management/model/types.test.ts` | 2     | ✅     |
| getStockStatus function          | `inventory-management/model/types.test.ts` | 4     | ✅     |
| Stock status config (UI)         | `inventory-management/model/types.test.ts` | 3     | ✅     |
| updateStockSchema validation     | `inventory-management/model/types.test.ts` | 5     | ✅     |
| bulkUpdateStockSchema validation | `inventory-management/model/types.test.ts` | 3     | ✅     |
| updateStock action               | `integration/api/inventory.test.ts`        | 3     | ✅     |
| bulkUpdateStock action           | `integration/api/inventory.test.ts`        | 2     | ✅     |
| getInventoryStats query          | `integration/api/inventory.test.ts`        | 1     | ✅     |
| Inventory page access            | `e2e/vendor-flow.spec.ts`                  | 2     | ✅     |

### Phân Tích Doanh Thu ⭐ (NEW)

| Tính năng                | Test File                              | Tests | Status |
| ------------------------ | -------------------------------------- | ----- | ------ |
| Time range options       | `vendor-analytics/model/types.test.ts` | 2     | ✅     |
| getDateRange function    | `vendor-analytics/model/types.test.ts` | 5     | ✅     |
| Type definitions         | `vendor-analytics/model/types.test.ts` | 1     | ✅     |
| getVendorAnalytics query | `integration/api/analytics.test.ts`    | 5     | ✅     |
| Handle empty orders      | `integration/api/analytics.test.ts`    | 1     | ✅     |
| Period comparison        | `integration/api/analytics.test.ts`    | 1     | ✅     |
| Analytics page access    | `e2e/vendor-flow.spec.ts`              | 2     | ✅     |

### Phản Hồi Đánh Giá

| Tính năng           | Test File                 | Tests | Status |
| ------------------- | ------------------------- | ----- | ------ |
| Reviews page access | `e2e/vendor-flow.spec.ts` | 1     | ✅     |

### Quản Lý Đơn Hàng

| Tính năng          | Test File                 | Tests | Status |
| ------------------ | ------------------------- | ----- | ------ |
| Orders page access | `e2e/vendor-flow.spec.ts` | 1     | ✅     |

---

## 👨‍💼 Admin Features

| Tính năng           | Test File                      | Tests | Status |
| ------------------- | ------------------------------ | ----- | ------ |
| Login page          | `e2e/admin-flow.spec.ts`       | 1     | ✅     |
| Public pages access | `e2e/admin-flow.spec.ts`       | 1     | ✅     |
| Category CRUD       | `category/api/actions.test.ts` | 6     | ✅     |

---

## 🔐 Authentication

| Tính năng                  | Test File                   | Tests | Status |
| -------------------------- | --------------------------- | ----- | ------ |
| Login form display         | `e2e/auth.spec.ts`          | 1     | ✅     |
| Login validation errors    | `e2e/auth.spec.ts`          | 1     | ✅     |
| Register form display      | `e2e/auth.spec.ts`          | 1     | ✅     |
| Password validation        | `e2e/auth.spec.ts`          | 1     | ✅     |
| Password match validation  | `e2e/auth.spec.ts`          | 1     | ✅     |
| Protected routes redirect  | `e2e/auth.spec.ts`          | 2     | ✅     |
| Login schema validation    | `auth/model/schema.test.ts` | 5     | ✅     |
| Register schema validation | `auth/model/schema.test.ts` | 5     | ✅     |

---

## 🛠️ Shared Utilities

### Format Utils

| Function          | Test File              | Tests | Status |
| ----------------- | ---------------------- | ----- | ------ |
| formatPrice       | `utils/format.test.ts` | 4     | ✅     |
| formatPriceNumber | `utils/format.test.ts` | 2     | ✅     |
| parsePrice        | `utils/format.test.ts` | 4     | ✅     |
| formatDate        | `utils/format.test.ts` | 3     | ✅     |
| formatPhone       | `utils/format.test.ts` | 4     | ✅     |
| formatFileSize    | `utils/format.test.ts` | 5     | ✅     |

### ID Generation

| Function             | Test File          | Tests | Status |
| -------------------- | ------------------ | ----- | ------ |
| generateOrderNumber  | `utils/id.test.ts` | 4     | ✅     |
| generateId           | `utils/id.test.ts` | 3     | ✅     |
| generateRandomString | `utils/id.test.ts` | 2     | ✅     |

### Result Pattern

| Function     | Test File              | Tests | Status |
| ------------ | ---------------------- | ----- | ------ |
| ok           | `utils/result.test.ts` | 3     | ✅     |
| okVoid       | `utils/result.test.ts` | 1     | ✅     |
| err          | `utils/result.test.ts` | 2     | ✅     |
| tryCatch     | `utils/result.test.ts` | 3     | ✅     |
| isOk / isErr | `utils/result.test.ts` | 6     | ✅     |

### Form Validation

| Function         | Test File                 | Tests | Status |
| ---------------- | ------------------------- | ----- | ------ |
| formatZodErrors  | `validation/form.test.ts` | 3     | ✅     |
| getFirstError    | `validation/form.test.ts` | 2     | ✅     |
| hasErrors        | `validation/form.test.ts` | 2     | ✅     |
| validatePhone    | `validation/form.test.ts` | 6     | ✅     |
| validateEmail    | `validation/form.test.ts` | 6     | ✅     |
| validatePassword | `validation/form.test.ts` | 5     | ✅     |
| validateSlug     | `validation/form.test.ts` | 4     | ✅     |

---

## ⏳ TODO - Chưa có tests

| Feature              | Priority | Reason               |
| -------------------- | -------- | -------------------- |
| Stripe payment flow  | High     | Cần Stripe test mode |
| AI product auto-fill | Low      | External API         |

---

## 🏪 Vendor Features (NEW)

### Product Schema Validation

| Tính năng                       | Test File                      | Tests | Status |
| ------------------------------- | ------------------------------ | ----- | ------ |
| productSchema validation        | `product/model/schema.test.ts` | 24    | ✅     |
| productVariantSchema validation | `product/model/schema.test.ts` | 9     | ✅     |

### Vendor Registration

| Tính năng                  | Test File                                  | Tests | Status |
| -------------------------- | ------------------------------------------ | ----- | ------ |
| vendorRegistrationSchema   | `vendor-registration/model/schema.test.ts` | 32    | ✅     |
| shopName validation        | `vendor-registration/model/schema.test.ts` | 6     | ✅     |
| businessPhone validation   | `vendor-registration/model/schema.test.ts` | 8     | ✅     |
| businessEmail validation   | `vendor-registration/model/schema.test.ts` | 6     | ✅     |
| businessAddress validation | `vendor-registration/model/schema.test.ts` | 5     | ✅     |

---

## 📁 Test Files Location

```
src/
├── entities/
│   ├── cart/lib/utils.test.ts
│   ├── cart/model/store.test.ts
│   ├── category/api/actions.test.ts
│   ├── order/lib/utils.test.ts
│   ├── product/lib/utils.test.ts
│   ├── product/model/schema.test.ts
│   ├── review/model/schema.test.ts
│   └── vendor/lib/utils.test.ts
├── features/
│   ├── auth/model/schema.test.ts
│   ├── checkout/model/schema.test.ts
│   ├── inventory-management/model/types.test.ts
│   ├── vendor-analytics/model/types.test.ts
│   └── vendor-registration/model/schema.test.ts
└── shared/lib/
    ├── constants/upload.test.ts
    ├── upload/validation.test.ts
    ├── upload/cloudinary-loader.test.ts
    ├── utils/format.test.ts
    ├── utils/id.test.ts
    ├── utils/result.test.ts
    └── validation/form.test.ts

tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── customer-journey.spec.ts
│   ├── vendor-flow.spec.ts
│   ├── admin-flow.spec.ts
│   └── product-features.spec.ts
└── integration/api/
    ├── inventory.test.ts
    └── analytics.test.ts
```

---

_Last updated: December 3, 2025_

---

## 🎯 Đề Xuất Bổ Sung Để 100% Bug-Free

### 🔴 High Priority

| Feature                  | Why                 | Approach                                 |
| ------------------------ | ------------------- | ---------------------------------------- |
| **Stripe Payment**       | Core business logic | Sử dụng Stripe test mode + mock webhooks |
| **Stock Reservation**    | Race condition      | Test concurrent requests                 |
| **Order Status Machine** | Critical flow       | Test all state transitions               |

### 🟡 Medium Priority

| Feature                 | Why           | Approach                             |
| ----------------------- | ------------- | ------------------------------------ |
| **Rate Limiting**       | Security      | Test API throttling                  |
| **Session Management**  | Auth security | Test token expiry/refresh            |
| **Image Upload Stress** | Reliability   | Test large files, concurrent uploads |

### 🟢 Nice to Have

| Feature               | Why             | Approach                         |
| --------------------- | --------------- | -------------------------------- |
| **Performance Tests** | User experience | Load testing với k6/Artillery    |
| **Visual Regression** | UI consistency  | Playwright screenshot comparison |
| **Accessibility**     | Compliance      | axe-core integration             |

### 🛡️ Security Tests Cần Thêm

```typescript
// tests/security/
├── xss.test.ts          // Input sanitization
├── csrf.test.ts         // Token validation
├── sql-injection.test.ts // Prisma already safe, nhưng test edge cases
└── auth-bypass.test.ts  // Protected route testing
```

### 📊 Coverage Goals

| Metric          | Current | Target |
| --------------- | ------- | ------ |
| Line Coverage   | ~60%    | 80%+   |
| Branch Coverage | ~50%    | 75%+   |
| Critical Paths  | 95%     | 100%   |
