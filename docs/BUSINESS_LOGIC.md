# Vendoor - Business Logic

Tài liệu mô tả chi tiết các quy tắc nghiệp vụ, công thức tính toán và ràng buộc trong hệ thống.

---

## 📋 Mục lục

1. [Pricing & Fees](#1-pricing--fees)
2. [Order Management](#2-order-management)
3. [Inventory Rules](#3-inventory-rules)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Vendor Lifecycle](#5-vendor-lifecycle)
6. [Review System](#6-review-system)
7. [Validation Rules](#7-validation-rules)

---

## 1. Pricing & Fees

### 1.1 Platform Fee (Phí sàn)

```typescript
// src/shared/lib/constants/order.ts
PLATFORM_FEE_RATE = 0.02  // 2%
```

**Công thức:**
```
platformFee = subtotal × 0.02
vendorEarnings = subtotal - platformFee
```

**Ví dụ:**
| Subtotal | Platform Fee (2%) | Vendor Earnings |
|----------|-------------------|-----------------|
| 100,000₫ | 2,000₫           | 98,000₫         |
| 500,000₫ | 10,000₫          | 490,000₫        |
| 1,000,000₫| 20,000₫         | 980,000₫        |

### 1.2 Shipping Fee (Phí vận chuyển)

```typescript
SHIPPING_FEE_PER_VENDOR = 30_000  // 30,000 VND
```

**Quy tắc:**
- Mỗi vendor trong đơn hàng = 1 × phí ship
- Giỏ hàng có sản phẩm từ 3 vendor → phí ship = 90,000₫

**Công thức:**
```
shippingFee = uniqueVendorCount × 30,000
totalAmount = subtotal + shippingFee
```

### 1.3 Vendor Commission (Hoa hồng vendor)

```typescript
DEFAULT_COMMISSION_RATE = 0.1  // 10% mặc định
```

- Có thể điều chỉnh riêng cho từng vendor trong `VendorProfile.commissionRate`
- Admin có quyền thay đổi commission rate

### 1.4 Price Limits

```typescript
PRICE_LIMITS = {
  MIN: 1000,       // 1,000₫ minimum
  MAX: 999999999,  // ~1 tỷ VND maximum
}
```

### 1.5 Order Amount Limits

```typescript
MIN_ORDER_AMOUNT = 10_000   // 10,000₫
MAX_ORDER_AMOUNT = 100_000_000  // 100 triệu VND
```

---

## 2. Order Management

### 2.1 Order Status Flow

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
PENDING_PAYMENT ──► PENDING ──► PROCESSING ──► SHIPPED ──► DELIVERED
        │              │             │
        │              │             │
        └──────────────┴─────────────┘
                       │
                       ▼
                  CANCELLED
```

**Allowed Transitions:**

| From | To | Trigger |
|------|-----|---------|
| `PENDING_PAYMENT` | `PENDING` | Payment confirmed (Stripe webhook) |
| `PENDING_PAYMENT` | `CANCELLED` | Payment failed / timeout |
| `PENDING` | `PROCESSING` | Vendor confirms order |
| `PENDING` | `CANCELLED` | Customer/Vendor cancels |
| `PROCESSING` | `SHIPPED` | Vendor ships (requires tracking number) |
| `PROCESSING` | `CANCELLED` | Exceptional cases only |
| `SHIPPED` | `DELIVERED` | Customer confirms / auto after X days |

**Invalid Transitions (sẽ bị reject):**
- `DELIVERED` → bất kỳ status nào
- `CANCELLED` → bất kỳ status nào
- `SHIPPED` → `PENDING` hoặc `PROCESSING`

### 2.2 Multi-Vendor Order Split

Khi checkout với sản phẩm từ nhiều vendor:

```
Cart: [Vendor A: 2 items, Vendor B: 1 item, Vendor C: 3 items]
                           │
                           ▼
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          Order #1     Order #2     Order #3
         (Vendor A)   (Vendor B)   (Vendor C)
```

**Quy tắc:**
- 1 Order = 1 Vendor
- Mỗi order có `orderNumber` riêng (format: `ORD-YYYYMMDD-XXXXXX`)
- Payment chung cho tất cả orders

### 2.3 Stock Deduction

```typescript
// Transaction flow
await prisma.$transaction(async (tx) => {
  // 1. Check stock availability
  for (item of items) {
    const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
    if (variant.stock < item.quantity) {
      throw new Error(`${item.name} không đủ hàng`);
    }
  }

  // 2. Decrement stock atomically
  for (item of items) {
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // 3. Create orders
  // ...
});
```

**Important:**
- Stock check và decrement trong cùng 1 transaction
- Nếu bất kỳ item nào không đủ stock → rollback toàn bộ
- Không có "reserve stock" mechanism (first-come-first-served)

---

## 3. Inventory Rules

### 3.1 Stock Status Thresholds

```typescript
STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,   // stock = 0
  LOW_STOCK: 10,     // stock <= 10
}
```

**Status mapping:**

| Stock | Status | UI Display |
|-------|--------|------------|
| 0 | `out_of_stock` | "Hết hàng" (đỏ) |
| 1-10 | `low_stock` | "Sắp hết" (vàng) |
| > 10 | `in_stock` | "Còn hàng" (xanh) |

### 3.2 Stock Limits

```typescript
STOCK_LIMITS = {
  MIN: 0,
  MAX: 999999,
}
```

### 3.3 Add to Cart Validation

```typescript
// Không cho thêm quá số lượng tồn kho
if (requestedQuantity > variant.stock) {
  return { isValid: false, message: "Số lượng vượt quá tồn kho" };
}

// Không cho thêm sản phẩm hết hàng
if (variant.stock === 0) {
  return { isValid: false, message: "Sản phẩm đã hết hàng" };
}
```

---

## 4. User Roles & Permissions

### 4.1 Role Hierarchy

```typescript
type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN"
```

**User có thể có nhiều roles:**
```typescript
user.roles = ["CUSTOMER", "VENDOR"]  // Vendor cũng là customer
user.roles = ["CUSTOMER", "VENDOR", "ADMIN"]  // Super user
```

### 4.2 Permission Matrix

| Action | Customer | Vendor | Admin |
|--------|----------|--------|-------|
| Browse products | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ✅ |
| View own orders | ✅ | ✅ | ✅ |
| Write review | ✅ | ✅ | ✅ |
| Create product | ❌ | ✅ | ❌ |
| Manage own products | ❌ | ✅ | ❌ |
| View vendor dashboard | ❌ | ✅ | ❌ |
| Update order status | ❌ | ✅ (own orders) | ✅ |
| Approve vendors | ❌ | ❌ | ✅ |
| Manage categories | ❌ | ❌ | ✅ |
| View all orders | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |

### 4.3 Route Protection

```typescript
// Public routes
/products, /products/[slug], /login, /register

// Customer routes (requires login)
/orders, /wishlist, /profile, /checkout

// Vendor routes (requires VENDOR role + APPROVED status)
/vendor/*, /vendor/products, /vendor/orders

// Admin routes (requires ADMIN role)
/admin/*, /admin/vendors, /admin/categories
```

---

## 5. Vendor Lifecycle

### 5.1 Vendor Status Flow

```
          Approve                    Suspend
PENDING ──────────► APPROVED ◄───────────► SUSPENDED
    │                   │                      │
    │ Reject            │ (Re-approve)         │
    ▼                   └──────────────────────┘
REJECTED
```

### 5.2 Status Meanings

| Status | Meaning | Can Sell? | Can Login? |
|--------|---------|-----------|------------|
| `PENDING` | Chờ admin duyệt | ❌ | ✅ |
| `APPROVED` | Đã được duyệt | ✅ | ✅ |
| `REJECTED` | Bị từ chối | ❌ | ✅ |
| `SUSPENDED` | Bị đình chỉ | ❌ | ✅ |

### 5.3 Vendor Registration Requirements

```typescript
// Required fields
shopName: string (3-100 chars)
description: string
businessAddress: string
businessPhone: string (10 digits, starts with 0)
businessEmail: string (valid email)

// Optional
logo: string (Cloudinary URL)
banner: string (Cloudinary URL)
```

---

## 6. Review System

### 6.1 Review Constraints

```typescript
// 1 user = 1 review per product
const existingReview = await prisma.review.findUnique({
  where: {
    userId_productId: { userId, productId }
  }
});
if (existingReview) {
  return error("Bạn đã đánh giá sản phẩm này");
}
```

### 6.2 Rating Calculation

```typescript
// Average rating với 1 decimal
averageRating = totalStars / totalReviews
displayRating = Math.round(averageRating * 10) / 10  // e.g., 4.5
```

### 6.3 Verified Purchase Badge

```typescript
// Hiển thị "Đã mua hàng" nếu user có order DELIVERED cho product này
const hasVerifiedPurchase = await prisma.orderItem.findFirst({
  where: {
    order: { customerId: userId, status: "DELIVERED" },
    productId: productId,
  },
});
```

### 6.4 Vendor Reply

- Mỗi review chỉ có 1 vendor reply
- Chỉ vendor sở hữu sản phẩm mới được reply

---

## 7. Validation Rules

### 7.1 Phone Number (Vietnam)

```typescript
// Regex: 10 số, bắt đầu bằng 0
const phoneRegex = /^0\d{9}$/;

// Valid: 0901234567, 0381234567
// Invalid: 1234567890, 090123456, 09012345678
```

### 7.2 Email

```typescript
// Standard email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### 7.3 Password

```typescript
// Minimum 8 characters
// At least 1 uppercase, 1 lowercase, 1 number
const passwordSchema = z.string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
  .regex(/[0-9]/, "Cần ít nhất 1 số");
```

### 7.4 Product SKU

```typescript
// Alphanumeric + hyphens, 3-50 chars
const skuRegex = /^[A-Za-z0-9-]{3,50}$/;

// Valid: ABC-123, PHONE-IP15-128
// Invalid: abc@123, a
```

### 7.5 Slug Generation

```typescript
// Input: "iPhone 15 Pro Max 256GB"
// Output: "iphone-15-pro-max-256gb"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-")      // Replace non-alphanumeric
    .replace(/^-|-$/g, "");           // Trim hyphens
}
```

---

## 🔗 Related Documentation

- [DATA_FLOW.md](./DATA_FLOW.md) - Luồng xử lý chi tiết
- [DATABASE.md](./DATABASE.md) - Schema và relations
- [API_REFERENCE.md](./API_REFERENCE.md) - Server Actions
