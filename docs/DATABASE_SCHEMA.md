# 🗄️ Database Schema

Giải thích chi tiết về database schema của Vendoor.

---

## 📊 Tổng Quan

| Domain | Models | Mô tả |
|--------|--------|-------|
| Authentication | User, Session, Account, Verification | Quản lý user và auth |
| Vendor | VendorProfile | Thông tin shop của người bán |
| Catalog | Category, Product, ProductVariant, ProductImage | Danh mục và sản phẩm |
| Order | Order, OrderItem, Payment | Đơn hàng và thanh toán |
| Engagement | Review, Wishlist | Đánh giá và yêu thích |

---

## 👤 User & Authentication

### User

Bảng chính lưu thông tin người dùng.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Email đăng nhập, unique |
| name | String? | Tên hiển thị |
| phone | String? | Số điện thoại |
| emailVerified | Boolean | Đã xác thực email chưa |
| image | String? | Avatar URL |
| roles | String[] | Mảng roles: CUSTOMER, VENDOR, ADMIN |

**Đặc điểm:**
- Một user có thể có nhiều roles (vd: vừa CUSTOMER vừa VENDOR)
- User có role VENDOR sẽ có VendorProfile
- User là chủ sở hữu của Product (không phải VendorProfile)

**Relations:**
- 1 User ↔ 1 VendorProfile (optional)
- 1 User → N Products (nếu là vendor)
- 1 User → N Orders (nếu là customer)
- 1 User → N Reviews
- 1 User → N Wishlists

### Session, Account, Verification

Các bảng hỗ trợ cho Better Auth:
- **Session**: Lưu session đăng nhập
- **Account**: Lưu thông tin provider (credential, google, etc.)
- **Verification**: Lưu token xác thực email, reset password

---

## 🏪 Vendor

### VendorProfile

Thông tin shop của người bán. Tách biệt với User để:
- User có thể vừa mua vừa bán
- Thông tin shop không trộn với thông tin cá nhân

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| userId | String | FK → User.id, unique |
| shopName | String | Tên shop |
| slug | String | URL: /shop/[slug], unique |
| description | Text? | Mô tả shop |
| logo | String? | Logo URL (Cloudinary) |
| banner | String? | Banner URL (Cloudinary) |
| businessAddress | String? | Địa chỉ kinh doanh |
| businessPhone | String? | SĐT liên hệ |
| businessEmail | String? | Email kinh doanh |
| commissionRate | Float | % hoa hồng platform (default 10%) |
| status | VendorStatus | PENDING → APPROVED/REJECTED/SUSPENDED |

**⚠️ Quan trọng:**
- `Order.vendorId` reference đến `VendorProfile.id`, KHÔNG phải `User.id`
- `Product.vendorId` reference đến `User.id`, KHÔNG phải `VendorProfile.id`

**Status Flow:**
```
Đăng ký → PENDING → Admin duyệt → APPROVED (có thể bán)
                  → Admin từ chối → REJECTED
                  
APPROVED → Admin đình chỉ → SUSPENDED
```

---

## 📦 Catalog

### Category

Danh mục sản phẩm.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Tên danh mục, unique |
| slug | String | URL: /category/[slug], unique |
| description | Text? | Mô tả |
| image | String? | Ảnh đại diện (Cloudinary) |

### Product

Sản phẩm chính.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| vendorId | String | FK → **User.id** (chủ shop) |
| categoryId | String | FK → Category.id |
| name | String | Tên sản phẩm |
| slug | String | URL: /products/[slug], unique |
| description | Text? | Mô tả chi tiết |
| isActive | Boolean | Soft delete flag (true = hiển thị) |

**⚠️ Quan trọng:**
- `vendorId` link đến `User.id`, không phải `VendorProfile.id`
- Khi cần thông tin shop: include `vendor.vendorProfile`
- Query products: luôn filter `isActive: true`

### ProductVariant

Biến thể sản phẩm (màu sắc, kích thước, etc.)

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| productId | String | FK → Product.id |
| name | String? | Tên variant (vd: "Đỏ - Size M") |
| sku | String? | Mã SKU, unique |
| color | String? | Màu sắc |
| size | String? | Kích thước |
| price | Float | **Giá bán (VND), required** |
| compareAtPrice | Float? | Giá gốc (để hiện % giảm) |
| stock | Int | Số lượng tồn kho (default 0) |
| isDefault | Boolean | Variant mặc định |

**Đặc điểm:**
- Mỗi product phải có ít nhất 1 variant
- Product không có biến thể: tạo 1 variant với `isDefault = true`
- `price` là required, không có default value

### ProductImage

Ảnh sản phẩm.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| productId | String | FK → Product.id |
| url | String | Cloudinary URL |
| altText | String? | Alt text cho SEO |
| order | Int | Thứ tự (0 = ảnh chính) |

---

## 🛒 Order & Payment

### Order

Đơn hàng. **1 đơn = 1 vendor** (multi-vendor checkout tạo nhiều orders).

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| customerId | String | FK → User.id (người mua) |
| vendorId | String | FK → **VendorProfile.id** (shop) |
| orderNumber | String | Mã đơn, unique (ORD-YYYYMMDD-XXX) |
| status | OrderStatus | Trạng thái đơn hàng |

**Pricing:**

| Field | Type | Mô tả |
|-------|------|-------|
| subtotal | Float | Tổng tiền sản phẩm |
| shippingFee | Float | Phí ship (default 0) |
| tax | Float | Thuế (default 0) |
| platformFee | Float | Phí platform = subtotal × rate |
| vendorEarnings | Float | Vendor nhận = subtotal - platformFee |
| platformFeeRate | Float | % commission (lưu để audit) |
| total | Float | Tổng = subtotal + ship + tax |

**Shipping:**

| Field | Type | Mô tả |
|-------|------|-------|
| shippingName | String | Tên người nhận, required |
| shippingPhone | String | SĐT, required |
| shippingAddress | String | Địa chỉ, required |
| shippingCity | String? | Tỉnh/Thành phố |
| shippingDistrict | String? | Quận/Huyện |
| shippingWard | String? | Phường/Xã |
| trackingNumber | String? | Mã vận đơn |

**Notes:**

| Field | Type | Mô tả |
|-------|------|-------|
| customerNote | Text? | Ghi chú từ khách |
| vendorNote | Text? | Ghi chú nội bộ vendor |

**⚠️ Quan trọng:**
- `vendorId` link đến `VendorProfile.id`, KHÔNG phải `User.id`
- Commission fields (`platformFee`, `vendorEarnings`, `platformFeeRate`) là required

**Status Flow:**
```
PENDING_PAYMENT → (thanh toán) → PENDING → (vendor xác nhận) → PROCESSING
                                    ↓
                                CANCELLED

PROCESSING → (giao shipper) → SHIPPED → (giao xong) → DELIVERED
     ↓                                                     ↓
 CANCELLED                                             REFUNDED
```

### OrderItem

Chi tiết sản phẩm trong đơn hàng.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| orderId | String | FK → Order.id |
| variantId | String | FK → ProductVariant.id |
| productName | String | **Snapshot** tên sản phẩm |
| variantName | String? | **Snapshot** tên variant |
| price | Float | **Snapshot** giá tại thời điểm mua |
| quantity | Int | Số lượng |
| subtotal | Float | = price × quantity |

**Đặc điểm:**
- Lưu snapshot data (productName, price) để giữ nguyên thông tin dù product thay đổi
- Không join để lấy tên/giá, sử dụng trực tiếp fields trong OrderItem

### Payment

Thông tin thanh toán.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| paymentNumber | String | Mã thanh toán, unique |
| method | PaymentMethod | COD, STRIPE, VNPAY, etc. |
| status | PaymentStatus | PENDING → COMPLETED/FAILED/REFUNDED |
| amount | Float | Số tiền |
| stripeSessionId | String? | Stripe session ID |
| stripePaymentIntentId | String? | Stripe payment intent ID |
| paidAt | DateTime? | Thời điểm thanh toán |

**Relations:**
- 1 Payment → N Orders (1 thanh toán có thể cho nhiều đơn - multi-vendor checkout)

---

## ⭐ Engagement

### Review

Đánh giá sản phẩm.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| productId | String | FK → Product.id |
| userId | String | FK → User.id |
| orderId | String? | FK → Order.id (optional) |
| rating | Int | **1-5 sao, required** |
| title | String? | Tiêu đề review |
| content | Text? | Nội dung |
| images | String[] | Array Cloudinary URLs |
| isVerifiedPurchase | Boolean | Đã mua hàng chưa |
| vendorReply | Text? | Phản hồi từ vendor |
| vendorReplyAt | DateTime? | Thời điểm phản hồi |
| status | ReviewStatus | PENDING/APPROVED/REJECTED |

**⚠️ Unique Constraint:** `(userId, productId)` - 1 user chỉ review 1 lần/sản phẩm

### Wishlist

Danh sách yêu thích.

| Field | Type | Mô tả |
|-------|------|-------|
| id | String (cuid) | Primary key |
| userId | String | FK → User.id |
| productId | String | FK → Product.id |

**⚠️ Unique Constraint:** `(userId, productId)` - 1 user chỉ wishlist 1 lần/sản phẩm

---

## 🔢 Enums

### Role

| Value | Mô tả |
|-------|-------|
| CUSTOMER | Khách hàng (mặc định) |
| VENDOR | Người bán |
| ADMIN | Quản trị viên |

### VendorStatus

| Value | Mô tả |
|-------|-------|
| PENDING | Chờ admin duyệt |
| APPROVED | Đã được duyệt, có thể bán |
| REJECTED | Bị từ chối |
| SUSPENDED | Bị đình chỉ |

### OrderStatus

| Value | Mô tả |
|-------|-------|
| PENDING_PAYMENT | Chờ thanh toán |
| PENDING | Đã thanh toán, chờ vendor xử lý |
| PROCESSING | Vendor đang chuẩn bị |
| SHIPPED | Đã giao shipper |
| DELIVERED | Giao thành công |
| CANCELLED | Đã hủy |
| REFUNDED | Đã hoàn tiền |

### PaymentStatus

| Value | Mô tả |
|-------|-------|
| PENDING | Chờ thanh toán |
| COMPLETED | Thành công |
| FAILED | Thất bại |
| REFUNDED | Đã hoàn |

### PaymentMethod

| Value | Mô tả |
|-------|-------|
| COD | Thanh toán khi nhận hàng |
| STRIPE | Stripe Checkout |
| VNPAY | VNPay (planned) |
| MOMO | MoMo (planned) |
| ZALOPAY | ZaloPay (planned) |

### ReviewStatus

| Value | Mô tả |
|-------|-------|
| PENDING | Chờ duyệt |
| APPROVED | Đã duyệt (default) |
| REJECTED | Bị từ chối |

---

## 🔗 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER & AUTH                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐    1:N    ┌───────────┐                                   │
│  │   User   │──────────▶│  Session  │                                   │
│  │          │           └───────────┘                                   │
│  │          │    1:N    ┌───────────┐                                   │
│  │          │──────────▶│  Account  │                                   │
│  └────┬─────┘           └───────────┘                                   │
│       │                                                                  │
│       │ 1:1                                                              │
│       ▼                                                                  │
│  ┌─────────────┐                                                        │
│  │VendorProfile│                                                        │
│  └─────────────┘                                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              CATALOG                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐    1:N    ┌───────────┐                                   │
│  │ Category │──────────▶│  Product  │◀──────────┐                       │
│  └──────────┘           │           │           │ N:1                   │
│                         │           │           │                       │
│                         └─────┬─────┘      ┌────┴────┐                  │
│                               │            │  User   │                  │
│                   ┌───────────┼───────────┐│(vendor) │                  │
│                   │           │           │└─────────┘                  │
│                   ▼           ▼           ▼                             │
│            ┌───────────┐ ┌─────────┐ ┌──────────┐                       │
│            │  Variant  │ │  Image  │ │  Review  │                       │
│            └───────────┘ └─────────┘ │          │◀── User               │
│                                      └──────────┘                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              ORDER                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User ──────┐                                                           │
│  (customer)  │                                                           │
│              │ N:1                                                       │
│              ▼                                                           │
│         ┌─────────┐    N:1    ┌───────────────┐                         │
│         │  Order  │──────────▶│ VendorProfile │                         │
│         │         │           └───────────────┘                         │
│         └────┬────┘                                                      │
│              │                                                           │
│    ┌─────────┴─────────┐                                                │
│    │ 1:N               │ N:1                                            │
│    ▼                   ▼                                                │
│ ┌───────────┐    ┌───────────┐                                          │
│ │ OrderItem │    │  Payment  │                                          │
│ │           │    └───────────┘                                          │
│ └─────┬─────┘                                                           │
│       │ N:1                                                              │
│       ▼                                                                  │
│ ┌───────────────┐                                                       │
│ │ProductVariant │                                                       │
│ └───────────────┘                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Reference

### Foreign Keys Summary

| From | Field | To | Notes |
|------|-------|-----|-------|
| Product | vendorId | **User.id** | Owner là User, không phải VendorProfile |
| Order | vendorId | **VendorProfile.id** | Shop nhận order |
| Order | customerId | User.id | Người mua |
| OrderItem | variantId | ProductVariant.id | |
| Review | userId + productId | Unique constraint | 1 review/user/product |
| Wishlist | userId + productId | Unique constraint | 1 wishlist/user/product |

### Soft Delete

Chỉ `Product.isActive` dùng soft delete. Các model khác dùng hard delete với cascade.

### Timestamps

Tất cả models có:
- `createdAt` (auto)
- `updatedAt` (auto, trừ một số models)

---

_Tham khảo source: `prisma/schema.prisma`_
