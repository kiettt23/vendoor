# ✨ Tính Năng

Danh sách các tính năng của Vendoor theo từng vai trò người dùng.

---

## 🛒 Customer Features

### Duyệt Sản Phẩm

| Tính năng              | Mô tả                                             |
| ---------------------- | ------------------------------------------------- |
| Trang chủ              | Hero banner, sản phẩm nổi bật, categories         |
| Danh mục sản phẩm      | Lọc theo category, search, pagination             |
| Chi tiết sản phẩm      | Ảnh gallery, variants, thông tin vendor           |
| Sản phẩm liên quan     | Gợi ý sản phẩm cùng category                      |
| **Search Suggestions** | Gợi ý sản phẩm real-time khi gõ (debounced 300ms) |
| **Search toàn văn**    | Tìm trong cả name và description                  |
| **Category Dropdown**  | Chọn nhanh danh mục từ search bar                 |

### Giỏ Hàng & Thanh Toán

| Tính năng         | Mô tả                                     |
| ----------------- | ----------------------------------------- |
| Giỏ hàng          | Thêm/xóa/cập nhật số lượng, persist local |
| Nhóm theo vendor  | Tách đơn theo từng vendor                 |
| Phí vận chuyển    | Tính theo số lượng vendor                 |
| Checkout          | Form địa chỉ, ghi chú, chọn payment       |
| Thanh toán COD    | Thanh toán khi nhận hàng                  |
| Thanh toán Stripe | Thanh toán online qua Stripe              |

### Quản Lý Đơn Hàng

| Tính năng           | Mô tả                                      |
| ------------------- | ------------------------------------------ |
| Lịch sử đơn hàng    | Danh sách đơn đã đặt                       |
| Chi tiết đơn hàng   | Thông tin sản phẩm, trạng thái, vendor     |
| Theo dõi trạng thái | PENDING → PROCESSING → SHIPPED → DELIVERED |

### Wishlist ⭐

| Tính năng           | Mô tả                                |
| ------------------- | ------------------------------------ |
| Thêm vào yêu thích  | Toggle button trên trang sản phẩm    |
| Danh sách yêu thích | Xem tất cả sản phẩm đã lưu           |
| Xóa khỏi yêu thích  | Remove từ wishlist                   |
| Persist theo user   | Lưu vào database, sync across device |

### Đánh Giá Sản Phẩm ⭐

| Tính năng           | Mô tả                                   |
| ------------------- | --------------------------------------- |
| Viết đánh giá       | Rating 1-5 sao, tiêu đề, nội dung       |
| **Upload ảnh** ⭐   | Upload tối đa 5 ảnh cho mỗi review      |
| **Image gallery**   | Xem ảnh review với lightbox full-screen |
| Verified purchase   | Auto-check nếu user đã mua + nhận hàng  |
| Xem đánh giá        | Danh sách reviews với thống kê          |
| Rating distribution | Hiển thị phân bố số sao                 |
| Vendor reply        | Xem phản hồi từ người bán               |

**Chi tiết Review Images:**

```
Upload Flow:
1. Click "Thêm ảnh" hoặc drag & drop vào vùng upload
2. Preview ảnh với option xóa từng ảnh
3. Max 5 ảnh, mỗi ảnh ≤ 5MB, format: JPEG/PNG/WebP
4. Ảnh upload lên Cloudinary với folder `reviews/`

Display Flow:
1. Thumbnail grid hiển thị dưới nội dung review
2. Click ảnh → Lightbox full-screen với navigation ←→
3. Keyboard support: ArrowLeft, ArrowRight, Escape
4. Counter hiển thị "2/5" khi xem ảnh
```

**Files liên quan:**

- `src/features/review/write-review/ui/ReviewImageUpload.tsx`
- `src/shared/ui/image-lightbox.tsx`
- `src/entities/review/ui/ReviewImageGallery.tsx`

### Đăng Ký Bán Hàng ⭐

| Tính năng           | Mô tả                            |
| ------------------- | -------------------------------- |
| Form đăng ký        | Thông tin shop, địa chỉ, liên hệ |
| Theo dõi trạng thái | PENDING → APPROVED/REJECTED      |
| Chờ duyệt           | Admin review và approve          |

---

## 🏪 Vendor Features

### Dashboard

| Tính năng        | Mô tả                         |
| ---------------- | ----------------------------- |
| Tổng quan        | Doanh thu, đơn hàng, thống kê |
| Đơn hàng gần đây | Quick view các đơn mới nhất   |

### Quản Lý Sản Phẩm

| Tính năng           | Mô tả                                     |
| ------------------- | ----------------------------------------- |
| Danh sách sản phẩm  | Tất cả sản phẩm của vendor                |
| Thêm sản phẩm       | Form với variants, ảnh, category          |
| Sửa sản phẩm        | Cập nhật thông tin, giá, stock            |
| Xóa sản phẩm        | Soft delete sản phẩm                      |
| Upload ảnh          | Multi-image upload qua Cloudinary         |
| **AI Auto-fill** ⭐ | Upload ảnh → AI generate tên, mô tả, tags |

### Quản Lý Đơn Hàng

| Tính năng           | Mô tả                                  |
| ------------------- | -------------------------------------- |
| Danh sách đơn hàng  | Đơn của vendor với filter theo status  |
| Chi tiết đơn hàng   | Thông tin customer, sản phẩm, shipping |
| Cập nhật trạng thái | Chuyển đổi status theo workflow        |
| Tính commission     | Hiển thị phần vendor nhận được         |

### Phản Hồi Đánh Giá ⭐

| Tính năng      | Mô tả                                |
| -------------- | ------------------------------------ |
| Xem reviews    | Danh sách đánh giá tất cả sản phẩm   |
| Reply đánh giá | Vendor phản hồi customer reviews     |
| Sửa/Xóa reply  | Edit hoặc xóa phản hồi đã gửi        |
| Verified badge | Hiển thị "Đã mua hàng" cho customers |
| Link sản phẩm  | Quick navigate đến trang sản phẩm    |

### Quản Lý Tồn Kho ⭐ (NEW)

| Tính năng          | Mô tả                               |
| ------------------ | ----------------------------------- |
| Danh sách tồn kho  | Xem tất cả variants với stock       |
| Inline editing     | Chỉnh stock trực tiếp trong bảng    |
| Filter theo status | Lọc: Tất cả, Còn hàng, Sắp hết, Hết |
| Low stock alert    | Cảnh báo sản phẩm cần nhập thêm     |
| Stock status badge | Badge màu cho từng trạng thái stock |
| Tìm kiếm           | Search theo tên sản phẩm            |

**Chi tiết Inventory Management:**

```
Stock Status Thresholds (từ STOCK_LIMITS):
- OUT_OF_STOCK: stock = 0 → Badge đỏ "Hết hàng"
- LOW_STOCK: stock ≤ 5 → Badge vàng "Sắp hết" + Alert
- IN_STOCK: stock > 5 → Badge xanh "Còn hàng"

Inline Edit Flow:
1. Click vào ô "Tồn kho" trong bảng
2. Input number xuất hiện với giá trị hiện tại
3. Nhập số mới (≥ 0) → Click ✓ hoặc Enter để lưu
4. Click ✗ hoặc Escape để hủy
5. Server validation + toast notification

Filter Options:
- "Tất cả": Hiển thị tất cả variants
- "Còn hàng": stock > LOW_STOCK_THRESHOLD
- "Sắp hết": 0 < stock ≤ LOW_STOCK_THRESHOLD
- "Hết hàng": stock = 0

Low Stock Alert:
- Summary box hiển thị số sản phẩm sắp hết + hết hàng
- Link "Xem chi tiết" → auto filter "Sắp hết"
- Xuất hiện cả trên trang chi tiết sản phẩm (customer view)
```

**Routes:**

- `/vendor/inventory` - Trang quản lý tồn kho

**Files liên quan:**

- `src/features/inventory-management/api/queries.ts` - getVendorInventory, getInventoryStats
- `src/features/inventory-management/api/actions.ts` - updateStock, bulkUpdateStock
- `src/features/inventory-management/ui/StockTable.tsx` - Table với inline edit
- `src/features/inventory-management/ui/StockStatusBadge.tsx` - Badge component
- `src/features/inventory-management/ui/LowStockAlert.tsx` - Alert summary
- `src/features/inventory-management/ui/InventoryFilterBar.tsx` - Search + filter

### Phân Tích Doanh Thu ⭐ (NEW)

| Tính năng         | Mô tả                                |
| ----------------- | ------------------------------------ |
| Summary cards     | Tổng doanh thu, đơn hàng, giá trị TB |
| Revenue chart     | Biểu đồ doanh thu theo thời gian     |
| Top products      | 5 sản phẩm bán chạy nhất             |
| Time range filter | Lọc: 7 ngày, 30 ngày, 3 tháng, 1 năm |
| Period comparison | So sánh % tăng/giảm với kỳ trước     |

**Chi tiết Vendor Analytics:**

```
Summary Cards (4 metrics):
1. Tổng doanh thu: Sum of completed order amounts
2. Số đơn hàng: Count of orders
3. Giá trị trung bình: Avg order value
4. Sản phẩm đã bán: Total quantity sold

Mỗi card hiển thị:
- Giá trị hiện tại (formatted VND)
- % thay đổi so với kỳ trước (xanh +, đỏ -)
- Icon tương ứng

Revenue Chart:
- AreaChart (Recharts) với gradient fill
- X-axis: Ngày (format dd/MM)
- Y-axis: Doanh thu (format VND)
- Tooltip hiển thị chi tiết khi hover
- Data aggregated theo ngày

Top Products Table:
- 5 sản phẩm bán chạy nhất trong kỳ
- Columns: Sản phẩm, Số lượng bán, Doanh thu
- Sort by revenue desc

Time Range Options:
- 7 ngày (default)
- 30 ngày
- 3 tháng
- 1 năm

Period Comparison Logic:
- Current: selectedRange
- Previous: same duration trước đó
- Example: 7d current vs 7d previous
- Change % = ((current - previous) / previous) * 100
```

**Routes:**

- `/vendor/analytics` - Trang phân tích doanh thu

**Files liên quan:**

- `src/features/vendor-analytics/api/queries.ts` - getVendorAnalytics (với period comparison)
- `src/features/vendor-analytics/ui/AnalyticsSummaryCards.tsx` - 4 metric cards
- `src/features/vendor-analytics/ui/RevenueChart.tsx` - AreaChart component
- `src/features/vendor-analytics/ui/TopProductsTable.tsx` - Top 5 products
- `src/features/vendor-analytics/ui/TimeRangeFilter.tsx` - Dropdown filter

---

## 👨‍💼 Admin Features

### Dashboard

| Tính năng          | Mô tả                             |
| ------------------ | --------------------------------- |
| Tổng quan platform | Doanh thu tổng, số đơn, số vendor |
| Thống kê           | Charts và metrics                 |

### Quản Lý Vendor

| Tính năng        | Mô tả                               |
| ---------------- | ----------------------------------- |
| Danh sách vendor | Tất cả vendor đã đăng ký            |
| Duyệt vendor     | Approve/Reject đơn đăng ký          |
| Chi tiết vendor  | Thông tin shop, sản phẩm, doanh thu |

### Quản Lý Danh Mục

| Tính năng           | Mô tả                          |
| ------------------- | ------------------------------ |
| CRUD categories     | Thêm/sửa/xóa danh mục sản phẩm |
| Upload ảnh category | Ảnh đại diện cho category      |

### Quản Lý Đơn Hàng

| Tính năng           | Mô tả                          |
| ------------------- | ------------------------------ |
| Tất cả đơn hàng     | View toàn bộ đơn trên platform |
| Chi tiết đơn        | Thông tin đầy đủ về đơn hàng   |
| Platform commission | Phí platform thu từ mỗi đơn    |

---

## 🔐 Authentication

| Tính năng         | Mô tả                          |
| ----------------- | ------------------------------ |
| Đăng ký           | Email/password với validation  |
| Đăng nhập         | Session-based với Better Auth  |
| Role-based access | CUSTOMER, VENDOR, ADMIN        |
| Protected routes  | Middleware + Guards            |
| Đăng ký vendor    | Form thông tin shop, chờ duyệt |

---

## 💳 Payment

| Tính năng          | Mô tả                               |
| ------------------ | ----------------------------------- |
| COD                | Thanh toán khi nhận hàng            |
| Stripe Checkout    | Redirect đến Stripe payment page    |
| Webhook handling   | Xử lý payment success/failure       |
| Multi-vendor split | Tách đơn theo vendor khi thanh toán |

---

## 🔍 Search & Discovery

| Tính năng                 | Mô tả                                     |
| ------------------------- | ----------------------------------------- |
| Search suggestions        | Real-time gợi ý với ảnh, giá, category    |
| Debounced input           | 300ms delay để tránh spam requests        |
| Search name + description | Tìm trong cả tên và mô tả sản phẩm        |
| Category filter           | Dropdown chọn danh mục trong search bar   |
| Keyboard navigation       | ↑↓ Enter Escape để điều hướng suggestions |
| Mobile search             | Full-screen panel với suggestions         |

---

## 🎨 UI/UX

| Tính năng           | Mô tả                        |
| ------------------- | ---------------------------- |
| Responsive design   | Mobile-first với Tailwind    |
| Dark mode ready     | CSS variables cho theming    |
| Loading states      | Skeleton loading cho UX mượt |
| Error boundaries    | Graceful error handling      |
| Toast notifications | Feedback cho user actions    |

---

## 🔮 Planned Features

| Tính năng              | Priority | Status  |
| ---------------------- | -------- | ------- |
| Wishlist               | Medium   | ✅ Done |
| Reviews & Ratings      | High     | ✅ Done |
| Review Images          | Medium   | ✅ Done |
| Vendor Registration    | High     | ✅ Done |
| Search Suggestions     | High     | ✅ Done |
| Inventory Management   | High     | ✅ Done |
| Vendor Analytics       | Medium   | ✅ Done |
| Account/Profile        | High     | ✅ Done |
| OAuth Google           | High     | ✅ Done |
| Forgot Password        | High     | ✅ Done |
| AI Product Auto-fill   | Medium   | ✅ Done |
| Cloudinary Integration | High     | ✅ Done |
| Refund Flow            | High     | Planned |
| Payment History        | Medium   | Planned |
| Email Notifications    | High     | Planned |
| Coupons/Vouchers       | Medium   | Planned |
| Flash Sales            | Medium   | Planned |
| Order Tracking         | Medium   | Planned |
| Review Moderation      | Medium   | Planned |
| Chat vendor-customer   | Low      | Backlog |
| Push notifications     | Low      | Backlog |
| Multi-language (i18n)  | Low      | Backlog |

---

## 📂 FSD Structure Reference

```
src/
├── app/                          # App layer - routes, layouts
│   ├── (customer)/              # Customer routes
│   ├── (vendor)/                # Vendor routes
│   └── (admin)/                 # Admin routes
├── widgets/                      # Widget layer - page compositions
│   ├── vendor/ui/
│   │   ├── VendorInventoryPage.tsx
│   │   └── VendorAnalyticsPage.tsx
├── features/                     # Feature layer - user interactions
│   ├── inventory-management/    # ⭐ NEW
│   │   ├── api/actions.ts       # updateStock, bulkUpdateStock
│   │   ├── api/queries.ts       # getVendorInventory, getInventoryStats
│   │   ├── model/types.ts       # StockStatus, InventoryItem
│   │   └── ui/                  # StockTable, StockStatusBadge, etc.
│   ├── vendor-analytics/        # ⭐ NEW
│   │   ├── api/queries.ts       # getVendorAnalytics
│   │   ├── model/types.ts       # TimeRange, RevenueDataPoint
│   │   └── ui/                  # Charts, Cards, Filters
│   └── review/
│       └── write-review/ui/
│           └── ReviewImageUpload.tsx  # ⭐ NEW
├── entities/                     # Entity layer - business objects
│   ├── review/ui/
│   │   └── ReviewImageGallery.tsx  # ⭐ NEW
│   └── ...
└── shared/                       # Shared layer - utilities
    ├── lib/constants/
    │   └── product.ts           # STOCK_LIMITS
    └── ui/
        └── image-lightbox.tsx   # ⭐ NEW
```

---

_Last updated: December 3, 2025_
