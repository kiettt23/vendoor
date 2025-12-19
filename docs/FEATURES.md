# Vendoor - Features

Tài liệu mô tả chi tiết các tính năng của hệ thống theo từng vai trò người dùng.

---

## 👤 Customer (Khách hàng)

### Xem & Tìm kiếm sản phẩm

| Tính năng           | Mô tả                                 | Location                         |
| ------------------- | ------------------------------------- | -------------------------------- |
| **Product Listing** | Xem danh sách sản phẩm với pagination | `/products`                      |
| **Category Filter** | Lọc theo danh mục                     | `/products?category=electronics` |
| **Price Filter**    | Lọc theo khoảng giá                   | Filter panel                     |
| **Sort**            | Sắp xếp theo giá, mới nhất, bán chạy  | Sort dropdown                    |
| **Search**          | Tìm kiếm theo tên sản phẩm            | Header search bar                |
| **Product Detail**  | Xem chi tiết, ảnh, variants, reviews  | `/products/[slug]`               |

**Components:**

- `features/product-filter` - FilterPanel, SortDropdown
- `features/search` - SearchBar, SearchResults
- `entities/product` - ProductCard, ProductDetailClient

---

### Giỏ hàng (Cart)

| Tính năng            | Mô tả                                          |
| -------------------- | ---------------------------------------------- |
| **Add to Cart**      | Thêm sản phẩm (chọn variant, số lượng)         |
| **View Cart**        | Xem giỏ hàng (CartSheet slide-in)              |
| **Update Quantity**  | Tăng/giảm số lượng                             |
| **Remove Item**      | Xóa sản phẩm khỏi giỏ                          |
| **Stock Validation** | Không cho thêm quá số lượng tồn kho            |
| **Persist**          | Giỏ hàng lưu localStorage (persist qua reload) |

**Implementation:**

```typescript
// Zustand store với persist middleware
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => { ... },
      updateQuantity: (variantId, quantity) => { ... },
      removeItem: (variantId) => { ... },
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }  // localStorage key
  )
);
```

**Components:**

- `entities/cart` - Zustand store, CartItem
- `features/cart` - CartSheet, AddToCartButton

---

### Wishlist (Yêu thích)

| Tính năng           | Mô tả                                  |
| ------------------- | -------------------------------------- |
| **Add to Wishlist** | Click heart icon trên product card     |
| **View Wishlist**   | Xem danh sách đã thích tại `/wishlist` |
| **Remove**          | Xóa khỏi wishlist                      |
| **Move to Cart**    | Thêm vào giỏ từ wishlist               |

**Khác với Cart:**

- Wishlist lưu **database** (cần đăng nhập)
- Cart lưu **localStorage** (không cần đăng nhập)

**Components:**

- `entities/wishlist` - WishlistItem
- `features/wishlist` - WishlistButton, WishlistPage

---

### Checkout (Thanh toán)

| Tính năng          | Mô tả                                  |
| ------------------ | -------------------------------------- |
| **Shipping Info**  | Form nhập địa chỉ giao hàng            |
| **Payment Method** | Chọn COD hoặc Stripe                   |
| **Order Review**   | Xem lại đơn hàng trước khi đặt         |
| **Place Order**    | Tạo orders (1 order/vendor)            |
| **Stock Check**    | Validate stock real-time trước khi đặt |

**Flow:**

```
Cart → /checkout → Fill shipping → Select payment
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                          ▼
                  COD                                       Stripe
                    │                                          │
            Orders created                         Stripe Checkout Session
            status: PENDING                                    │
                    │                                   Payment success
                    │                                          │
                    ▼                                          ▼
            /orders/[id]                           Orders status → PENDING
                                                               │
                                                               ▼
                                                      /orders?success=true
```

**Components:**

- `features/checkout` - CheckoutForm, PaymentSelector
- `widgets/checkout` - CheckoutPage

---

### Order Tracking

| Tính năng        | Mô tả                                               |
| ---------------- | --------------------------------------------------- |
| **Order List**   | Xem tất cả đơn hàng tại `/orders`                   |
| **Order Detail** | Chi tiết 1 đơn tại `/orders/[id]`                   |
| **Status Track** | Theo dõi trạng thái (PENDING → SHIPPED → DELIVERED) |
| **Cancel Order** | Hủy đơn (chỉ khi PENDING)                           |

**Order Statuses:**

```
PENDING_PAYMENT → PENDING → PROCESSING → SHIPPED → DELIVERED
                     │           │
                     └─────┬─────┘
                           ▼
                      CANCELLED
```

**Components:**

- `entities/order` - OrderStatusBadge
- `widgets/orders` - OrderList, OrderDetail

---

### Reviews (Đánh giá)

| Tính năng          | Mô tả                                    |
| ------------------ | ---------------------------------------- |
| **View Reviews**   | Xem reviews trên product detail page     |
| **Write Review**   | Viết review (1-5 stars, comment, images) |
| **Verified Badge** | Badge "Đã mua hàng" nếu có order         |
| **Vendor Reply**   | Xem phản hồi từ vendor                   |

**Constraint:** 1 user chỉ review 1 lần/product

**Components:**

- `entities/review` - ReviewCard, StarRating
- `features/review` - ReviewForm

---

## 🏪 Vendor (Người bán)

### Dashboard Analytics

| Metric                  | Mô tả                            |
| ----------------------- | -------------------------------- |
| **Total Revenue**       | Tổng doanh thu                   |
| **Total Orders**        | Số đơn hàng                      |
| **Average Order Value** | Giá trị đơn trung bình           |
| **Revenue Chart**       | Biểu đồ doanh thu theo thời gian |
| **Top Products**        | Sản phẩm bán chạy                |
| **Recent Orders**       | Đơn hàng gần đây                 |

**Components:**

- `features/vendor-analytics` - RevenueChart, OrderStats, TopProducts
- `widgets/vendor` - VendorDashboard

---

### Product Management

| Tính năng              | Mô tả                                        | Route                        |
| ---------------------- | -------------------------------------------- | ---------------------------- |
| **List Products**      | Xem tất cả sản phẩm                          | `/vendor/products`           |
| **Create Product**     | Thêm sản phẩm mới                            | `/vendor/products/new`       |
| **Edit Product**       | Chỉnh sửa sản phẩm                           | `/vendor/products/[id]/edit` |
| **Delete Product**     | Xóa sản phẩm (soft delete)                   | Action                       |
| **Image Upload**       | Upload nhiều ảnh (Cloudinary)                | ProductForm                  |
| **Variant Management** | Tạo/sửa variants (color, size, price, stock) | VariantForm                  |

**Product Form Fields:**

- Basic: name, description, category
- Pricing: price, compareAtPrice (giá gốc)
- Variants: color, size, SKU, stock
- Images: multiple, drag-drop, reorder

**Components:**

- `features/product-form` - ProductForm, ImageUploader
- `features/product-variants` - VariantForm, VariantTable
- `entities/product` - createProduct, updateProduct

---

### Order Management

| Tính năng            | Mô tả                                          |
| -------------------- | ---------------------------------------------- |
| **Order List**       | Xem đơn hàng của shop                          |
| **Filter by Status** | Lọc theo trạng thái                            |
| **Update Status**    | Chuyển status (PENDING → PROCESSING → SHIPPED) |
| **Add Tracking**     | Thêm mã vận đơn khi SHIPPED                    |
| **Vendor Note**      | Ghi chú nội bộ                                 |

**Status Flow (Vendor):**

```
PENDING ──────► PROCESSING ──────► SHIPPED
   │                                  │
   │                                  └── Cần nhập tracking number
   │
   └── Cancel (if needed)
```

**Components:**

- `widgets/vendor` - VendorOrderList, VendorOrderDetail
- `entities/order` - updateOrderStatus

---

### Inventory Management

| Tính năng           | Mô tả                       |
| ------------------- | --------------------------- |
| **Stock Overview**  | Xem tồn kho tất cả variants |
| **Low Stock Alert** | Cảnh báo sắp hết hàng       |
| **Bulk Update**     | Cập nhật stock hàng loạt    |
| **Stock History**   | Lịch sử thay đổi stock      |

**Components:**

- `features/inventory-management` - StockEditor, LowStockAlert, StockTable

---

### Earnings Tracking

| Tính năng            | Mô tả                                               |
| -------------------- | --------------------------------------------------- |
| **Earnings Summary** | Tổng thu nhập (sau commission)                      |
| **Commission Rate**  | Xem % phí platform                                  |
| **Order Breakdown**  | Chi tiết từng đơn (subtotal, platformFee, earnings) |

**Calculation:**

```
vendorEarnings = subtotal × (1 - commissionRate)
               = 1,000,000 × (1 - 0.1)
               = 900,000 VND
```

**Components:**

- `features/vendor-earnings` - EarningsTable, EarningsSummary

---

### Review Management

| Tính năng        | Mô tả                                       |
| ---------------- | ------------------------------------------- |
| **View Reviews** | Xem tất cả reviews của shop                 |
| **Reply**        | Phản hồi review                             |
| **Rating Stats** | Thống kê rating (5 sao: 80%, 4 sao: 15%...) |

**Components:**

- `widgets/vendor` - VendorReviews
- `entities/review` - vendorReply action

---

### Shop Settings

| Tính năng         | Mô tả                               |
| ----------------- | ----------------------------------- |
| **Shop Profile**  | Tên shop, description, logo, banner |
| **Business Info** | Địa chỉ, SĐT, email                 |

**Components:**

- `widgets/vendor` - VendorSettingsForm

---

## 🔐 Admin (Quản trị viên)

### Dashboard Overview

| Metric                | Mô tả                          |
| --------------------- | ------------------------------ |
| **Total Users**       | Tổng số users                  |
| **Total Vendors**     | Số vendors (approved)          |
| **Total Revenue**     | Tổng doanh thu platform        |
| **Platform Earnings** | Thu nhập platform (commission) |
| **Recent Activities** | Hoạt động gần đây              |

**Components:**

- `widgets/admin` - AdminDashboard, AdminStats

---

### Vendor Approval

| Tính năng              | Mô tả                          |
| ---------------------- | ------------------------------ |
| **Pending List**       | Danh sách vendor chờ duyệt     |
| **Review Application** | Xem thông tin đăng ký          |
| **Approve**            | Chấp nhận vendor               |
| **Reject**             | Từ chối kèm lý do              |
| **Suspend**            | Đình chỉ vendor đang hoạt động |

**Vendor Status Flow:**

```
          Approve
PENDING ──────────► APPROVED ◄─────► SUSPENDED
    │                                    │
    │ Reject                             │
    ▼                                    ▼
REJECTED                          Can be re-approved
```

**Components:**

- `widgets/admin` - VendorApprovalList, VendorApprovalDetail

---

### Category Management

| Tính năng           | Mô tả                       |
| ------------------- | --------------------------- |
| **List Categories** | Xem tất cả categories       |
| **Create Category** | Thêm category mới           |
| **Edit Category**   | Sửa name, slug, image       |
| **Delete Category** | Xóa (nếu không có products) |

**Components:**

- `widgets/admin` - CategoryManagement
- `entities/category` - CategoryForm

---

### Order Oversight

| Tính năng       | Mô tả                               |
| --------------- | ----------------------------------- |
| **All Orders**  | Xem tất cả orders trong hệ thống    |
| **Filter**      | Lọc theo status, vendor, date range |
| **Order Stats** | Thống kê orders by status           |

**Components:**

- `widgets/admin` - AdminOrderList

---

## 🔧 Shared Features

### Authentication

| Tính năng           | Route                |
| ------------------- | -------------------- |
| **Login**           | `/login`             |
| **Register**        | `/register`          |
| **Vendor Register** | `/vendor-register`   |
| **Logout**          | Action               |
| **Google OAuth**    | Button on login page |

**Components:**

- `features/auth` - LoginForm, RegisterForm, VendorRegisterForm

---

### Profile Management

| Tính năng        | Mô tả                                |
| ---------------- | ------------------------------------ |
| **View Profile** | Xem thông tin cá nhân tại `/profile` |
| **Edit Profile** | Cập nhật name, phone, avatar         |

**Components:**

- `features/profile` - ProfileForm

---

## 🎨 AI Features

### AI Product Generator

| Tính năng                | Mô tả                        |
| ------------------------ | ---------------------------- |
| **Generate Description** | AI tạo mô tả sản phẩm từ tên |
| **Suggest Tags**         | Gợi ý tags/keywords          |
| **Improve Content**      | Cải thiện content đã có      |

**Integration:** OpenAI API

**Components:**

- `features/ai-product-generator` - AIProductForm

---

## 📱 Responsive Design

Tất cả pages đều responsive:

| Breakpoint | Width      | Notes                     |
| ---------- | ---------- | ------------------------- |
| Mobile     | < 640px    | Single column, bottom nav |
| Tablet     | 640-1024px | 2 columns                 |
| Desktop    | > 1024px   | Full layout với sidebar   |
