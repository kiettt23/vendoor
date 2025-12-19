# Vendoor - API Reference

Tài liệu API endpoints và Server Actions trong dự án.

---

## 📋 Overview

Vendoor sử dụng **Server Actions** cho hầu hết mutations thay vì REST API. Tuy nhiên có một số API Routes cho webhook và auth.

---

## 🔐 Authentication API

### Better Auth Endpoints

| Method | Endpoint                                   | Description          |
| ------ | ------------------------------------------ | -------------------- |
| POST   | `/api/auth/sign-up/email`                  | Đăng ký bằng email   |
| POST   | `/api/auth/sign-in/email`                  | Đăng nhập bằng email |
| POST   | `/api/auth/sign-out`                       | Đăng xuất            |
| GET    | `/api/auth/session`                        | Lấy session hiện tại |
| GET    | `/api/auth/sign-in/social?provider=google` | OAuth Google         |

**Example - Sign Up:**

```typescript
// Client-side
import { signUp } from "@/shared/lib/auth";

await signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
});
```

**Example - Sign In:**

```typescript
import { signIn } from "@/shared/lib/auth";

await signIn.email({
  email: "user@example.com",
  password: "password123",
});
```

---

## 💳 Webhook Endpoints

### Stripe Webhook

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | `/api/webhooks/stripe` | Stripe payment webhook |

**Events Handled:**

- `checkout.session.completed` - Payment thành công

**Implementation:**

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed":
      // Update order status to PENDING
      // Update payment status to COMPLETED
      break;
  }

  return Response.json({ received: true });
}
```

---

## ⚡ Server Actions

### Product Actions

| Action                 | Location                          | Description                |
| ---------------------- | --------------------------------- | -------------------------- |
| `createProduct`        | `entities/product/api/actions.ts` | Tạo sản phẩm mới           |
| `updateProduct`        | `entities/product/api/actions.ts` | Cập nhật sản phẩm          |
| `deleteProduct`        | `entities/product/api/actions.ts` | Xóa sản phẩm (soft delete) |
| `searchProductsAction` | `entities/product/api/actions.ts` | Tìm kiếm sản phẩm          |

**Example - Create Product:**

```typescript
import { createProduct } from "@/entities/product";

const result = await createProduct({
  name: "iPhone 15",
  description: "Latest iPhone",
  categoryId: "cat_123",
  variants: [{ price: 25000000, stock: 10, color: "Black", size: null }],
  images: [{ url: "https://cloudinary.com/...", order: 0 }],
});

if (result.success) {
  console.log(result.product);
}
```

---

### Checkout Actions

| Action             | Location                           | Description                   |
| ------------------ | ---------------------------------- | ----------------------------- |
| `validateCheckout` | `features/checkout/api/actions.ts` | Validate stock trước checkout |
| `createOrders`     | `features/checkout/api/actions.ts` | Tạo orders từ cart            |

**Example - Create Orders:**

```typescript
import { createOrders } from "@/features/checkout";

const result = await createOrders(
  cartItems, // CartItem[]
  {
    // ShippingInfo
    name: "Nguyen Van A",
    phone: "0901234567",
    address: "123 ABC Street",
    city: "Ho Chi Minh",
    district: "District 1",
    ward: "Ward 1",
    note: "Call before delivery",
  },
  "COD" // PaymentMethod: "COD" | "STRIPE"
);

if (result.success) {
  // result.orders - Array of created orders
  // result.totalAmount - Total amount
  // result.paymentId - Payment ID
}
```

---

### Order Actions

| Action              | Location                        | Description                  |
| ------------------- | ------------------------------- | ---------------------------- |
| `updateOrderStatus` | `entities/order/api/actions.ts` | Cập nhật trạng thái đơn hàng |
| `cancelOrder`       | `entities/order/api/actions.ts` | Hủy đơn hàng                 |

**Example - Update Status:**

```typescript
import { updateOrderStatus } from "@/entities/order";

// Vendor cập nhật status
await updateOrderStatus(orderId, "PROCESSING");
await updateOrderStatus(orderId, "SHIPPED", { trackingNumber: "VN123456" });
```

---

### Review Actions

| Action         | Location                         | Description         |
| -------------- | -------------------------------- | ------------------- |
| `createReview` | `entities/review/api/actions.ts` | Tạo review mới      |
| `replyReview`  | `entities/review/api/actions.ts` | Vendor reply review |

**Example - Create Review:**

```typescript
import { createReview } from "@/entities/review";

await createReview({
  productId: "prod_123",
  rating: 5,
  title: "Great product!",
  content: "Very satisfied with this purchase.",
  images: ["https://..."],
});
```

---

### Wishlist Actions

| Action               | Location                           | Description       |
| -------------------- | ---------------------------------- | ----------------- |
| `addToWishlist`      | `features/wishlist/api/actions.ts` | Thêm vào wishlist |
| `removeFromWishlist` | `features/wishlist/api/actions.ts` | Xóa khỏi wishlist |

---

### Vendor Actions

| Action                | Location                                      | Description             |
| --------------------- | --------------------------------------------- | ----------------------- |
| `registerVendor`      | `features/vendor-registration/api/actions.ts` | Đăng ký vendor          |
| `updateVendorProfile` | `entities/vendor/api/actions.ts`              | Cập nhật thông tin shop |

---

### Admin Actions

| Action           | Location                           | Description       |
| ---------------- | ---------------------------------- | ----------------- |
| `approveVendor`  | `widgets/admin/api/actions.ts`     | Approve vendor    |
| `rejectVendor`   | `widgets/admin/api/actions.ts`     | Reject vendor     |
| `createCategory` | `entities/category/api/actions.ts` | Tạo category mới  |
| `updateCategory` | `entities/category/api/actions.ts` | Cập nhật category |
| `deleteCategory` | `entities/category/api/actions.ts` | Xóa category      |

---

### Upload Actions

| Action        | Location                       | Description               |
| ------------- | ------------------------------ | ------------------------- |
| `uploadImage` | `shared/lib/upload/actions.ts` | Upload ảnh lên Cloudinary |
| `deleteImage` | `shared/lib/upload/actions.ts` | Xóa ảnh từ Cloudinary     |

**Example - Upload Image:**

```typescript
import { uploadImage } from "@/shared/lib/upload";

const formData = new FormData();
formData.append("file", file);

const result = await uploadImage(formData);
// result.url - Cloudinary URL
```

---

## 📊 Data Queries (Server-Only)

Các queries chỉ dùng trong Server Components:

| Query               | Location                                   | Description       |
| ------------------- | ------------------------------------------ | ----------------- |
| `getProducts`       | `entities/product/api/queries.ts`          | List products     |
| `getProductBySlug`  | `entities/product/api/queries.ts`          | Chi tiết product  |
| `getCategories`     | `entities/category/api/queries.ts`         | List categories   |
| `getOrdersByUser`   | `entities/order/api/queries.ts`            | Orders của user   |
| `getOrdersByVendor` | `entities/order/api/queries.ts`            | Orders của vendor |
| `getVendorStats`    | `features/vendor-analytics/api/queries.ts` | Thống kê vendor   |
| `getAdminStats`     | `widgets/admin/api/queries.ts`             | Thống kê admin    |

**Example - Get Products:**

```typescript
// Server Component only!
import { getProducts } from "@/entities/product/api/queries";

const { products, pagination } = await getProducts({
  categorySlug: "electronics",
  minPrice: 1000000,
  maxPrice: 50000000,
  sort: "price_asc",
  page: 1,
  limit: 12,
});
```

---

## 🔗 Related Documentation

- [DATA_FLOW.md](./DATA_FLOW.md) - Luồng data chi tiết
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Tại sao Server Actions
