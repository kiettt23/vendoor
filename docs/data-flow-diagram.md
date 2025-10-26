# Sơ Đồ Luồng Dữ Liệu - Vendoor E-Commerce Platform

## 1. Luồng Đăng Ký & Đăng Nhập Người Dùng

```mermaid
flowchart LR
    A[Người Dùng] --> B{Chọn Hành Động}
    B -->|Đăng Ký| C[Clerk Auth - Sign Up]
    B -->|Đăng Nhập| D[Clerk Auth - Sign In]

    C --> E[Tạo User trong Clerk]
    D --> F[Xác Thực với Clerk]

    E --> G[Webhook: user.created]
    F --> H[Lấy Session Token]

    G --> I[API: /api/webhooks/user]
    I --> J[Tạo User Record trong MongoDB]
    J --> K[Trả về User Profile]

    H --> L[Redirect đến Dashboard]
    K --> L
```

## 2. Luồng Tạo & Duyệt Cửa Hàng

```mermaid
flowchart LR
    A[Người Bán] --> B[Điền Form Đăng Ký Cửa Hàng]
    B --> C[POST /api/stores]

    C --> D{Kiểm Tra}
    D -->|Username đã tồn tại| E[Trả về lỗi 400]
    D -->|Đã có cửa hàng| F[Trả về lỗi 400]
    D -->|Hợp lệ| G[Tạo Store trong MongoDB]

    G --> H[Store Status: PENDING]
    H --> I[Thông báo cho Admin]

    I --> J{Admin Review}
    J -->|Approved| K[PATCH /api/stores/:id]
    J -->|Rejected| L[PATCH /api/stores/:id]

    K --> M[Status: APPROVED]
    L --> N[Status: REJECTED]

    M --> O[Email thông báo cho Seller]
    N --> P[Email từ chối + lý do]

    O --> Q[Seller có thể đăng sản phẩm]
```

## 3. Luồng Quản Lý Sản Phẩm

```mermaid
flowchart TD
    A[Người Bán] --> B{Chọn Hành Động}

    B -->|Thêm Sản Phẩm| C[POST /api/products]
    B -->|Sửa Sản Phẩm| D[PATCH /api/products/:id]
    B -->|Xóa Sản Phẩm| E[DELETE /api/products/:id]

    C --> F{Kiểm Tra Store}
    F -->|Store không APPROVED| G[Trả về lỗi 403]
    F -->|Hợp lệ| H[Upload Images lên Cloud]

    H --> I[Tạo Product trong MongoDB]
    I --> J[Liên kết với storeId]
    J --> K[Trả về Product Data]

    D --> L[Kiểm Tra Quyền Sở Hữu]
    L -->|Không phải chủ| M[Lỗi 403]
    L -->|Hợp lệ| N[Cập nhật Product]

    E --> O[Kiểm Tra Quyền Sở Hữu]
    O -->|Không phải chủ| P[Lỗi 403]
    O -->|Hợp lệ| Q[Xóa Product]
    Q --> R[Xóa hình ảnh từ Cloud]
```

## 4. Luồng Mua Hàng & Thanh Toán

```mermaid
flowchart TD
    A[Khách Hàng] --> B[Duyệt Sản Phẩm]
    B --> C[GET /api/products]
    C --> D[Hiển thị danh sách sản phẩm]

    D --> E[Chọn sản phẩm]
    E --> F[Thêm vào giỏ hàng - Client State]

    F --> G{Tiếp tục mua?}
    G -->|Có| E
    G -->|Không| H[Xem Giỏ Hàng]

    H --> I{Áp dụng mã giảm giá?}
    I -->|Có| J[POST /api/coupons/validate]
    I -->|Không| K[Chọn địa chỉ giao hàng]

    J --> L{Mã hợp lệ?}
    L -->|Có| M[Tính giảm giá]
    L -->|Không| N[Thông báo lỗi]

    M --> K
    N --> K

    K --> O{Có địa chỉ sẵn?}
    O -->|Không| P[POST /api/addresses]
    O -->|Có| Q[Chọn địa chỉ có sẵn]

    P --> R[Lưu địa chỉ mới]
    R --> S[Chọn phương thức thanh toán]
    Q --> S

    S --> T{Phương thức?}
    T -->|COD| U[POST /api/orders]
    T -->|Card| V[POST /api/payment/create-intent]

    V --> W[Stripe Payment]
    W --> X{Thanh toán thành công?}
    X -->|Có| U
    X -->|Không| Y[Thông báo lỗi]

    U --> Z[Tạo Order trong MongoDB]
    Z --> AA[Tạo OrderItems]
    AA --> AB[Cập nhật Stock]
    AB --> AC{Có dùng coupon?}
    AC -->|Có| AD[Đánh dấu coupon đã dùng]
    AC -->|Không| AE[Email xác nhận đơn hàng]
    AD --> AE

    AE --> AF[Thông báo cho Seller]
    AF --> AG[Redirect đến trang Order Success]
```

## 5. Luồng Xử Lý Đơn Hàng (Seller)

```mermaid
flowchart TD
    A[Seller] --> B[Nhận thông báo đơn hàng mới]
    B --> C[GET /api/orders?storeId=xxx]

    C --> D[Xem chi tiết đơn hàng]
    D --> E{Quyết định}

    E -->|Xác nhận| F[PATCH /api/orders/:id]
    E -->|Từ chối| G[PATCH /api/orders/:id]

    F --> H[Status: PROCESSING]
    G --> I[Status: CANCELLED]

    H --> J[Chuẩn bị hàng]
    J --> K[PATCH /api/orders/:id]
    K --> L[Status: SHIPPED]

    L --> M[Email tracking cho khách]
    M --> N[Khách nhận hàng]

    N --> O[PATCH /api/orders/:id]
    O --> P[Status: DELIVERED]

    P --> Q[Khách có thể đánh giá]

    I --> R[Hoàn tiền nếu đã thanh toán]
    R --> S[Email thông báo hủy đơn]
```

## 6. Luồng Đánh Giá Sản Phẩm

```mermaid
flowchart TD
    A[Khách Hàng] --> B[Xem đơn hàng đã giao]
    B --> C[GET /api/orders?userId=xxx&status=DELIVERED]

    C --> D[Chọn sản phẩm để đánh giá]
    D --> E[POST /api/ratings]

    E --> F{Kiểm tra}
    F -->|Chưa mua sản phẩm| G[Lỗi 403]
    F -->|Đã đánh giá rồi| H[Lỗi 400]
    F -->|Hợp lệ| I[Tạo Rating trong MongoDB]

    I --> J[Liên kết với productId, orderId]
    J --> K[Tính trung bình rating của sản phẩm]
    K --> L[Cập nhật Product stats]

    L --> M[Hiển thị đánh giá trên trang sản phẩm]
    M --> N[Thông báo cho Seller]
```

## 7. Luồng Tìm Kiếm & Lọc Sản Phẩm

```mermaid
flowchart TD
    A[Người Dùng] --> B[Nhập từ khóa tìm kiếm]
    B --> C[GET /api/products?search=xxx]

    C --> D[Query MongoDB]
    D --> E{Có filter thêm?}

    E -->|Category| F[Filter theo category]
    E -->|Price Range| G[Filter theo khoảng giá]
    E -->|Store| H[Filter theo cửa hàng]
    E -->|Rating| I[Filter theo đánh giá]
    E -->|In Stock| J[Filter còn hàng]

    F --> K[Aggregate results]
    G --> K
    H --> K
    I --> K
    J --> K

    K --> L[Sort kết quả]
    L --> M[Pagination]
    M --> N[Trả về danh sách sản phẩm]

    N --> O[Hiển thị kết quả]
```

## 8. Luồng Quản Lý Mã Giảm Giá

```mermaid
flowchart TD
    A[Admin] --> B{Hành động}

    B -->|Tạo mã| C[POST /api/coupons]
    B -->|Sửa mã| D[PATCH /api/coupons/:code]
    B -->|Xóa mã| E[DELETE /api/coupons/:code]

    C --> F[Nhập thông tin coupon]
    F --> G{Loại coupon}
    G -->|New User| H[forNewUser: true]
    G -->|Member| I[forMember: true]
    G -->|Public| J[isPublic: true]

    H --> K[Tạo Coupon trong MongoDB]
    I --> K
    J --> K

    K --> L[Đặt ngày hết hạn]
    L --> M[Coupon sẵn sàng sử dụng]

    M --> N[Khách hàng áp dụng]
    N --> O[POST /api/coupons/validate]

    O --> P{Kiểm tra}
    P -->|Hết hạn| Q[Lỗi: Expired]
    P -->|Không đủ điều kiện| R[Lỗi: Not Eligible]
    P -->|Đã dùng| S[Lỗi: Already Used]
    P -->|Hợp lệ| T[Trả về discount amount]

    T --> U[Áp dụng vào đơn hàng]
```

## Tóm Tắt Các API Endpoints Chính

### Authentication

- Clerk Webhooks: `/api/webhooks/user`

### Stores

- `GET /api/stores` - Danh sách cửa hàng
- `POST /api/stores` - Tạo cửa hàng mới
- `PATCH /api/stores/:id` - Cập nhật cửa hàng
- `DELETE /api/stores/:id` - Xóa cửa hàng

### Products

- `GET /api/products` - Danh sách sản phẩm (có filter, search)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PATCH /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Orders

- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PATCH /api/orders/:id` - Cập nhật trạng thái đơn hàng

### Addresses

- `GET /api/addresses` - Danh sách địa chỉ
- `POST /api/addresses` - Tạo địa chỉ mới
- `PATCH /api/addresses/:id` - Cập nhật địa chỉ
- `DELETE /api/addresses/:id` - Xóa địa chỉ

### Ratings

- `GET /api/ratings?productId=xxx` - Đánh giá của sản phẩm
- `POST /api/ratings` - Tạo đánh giá mới

### Coupons

- `POST /api/coupons/validate` - Xác thực mã giảm giá
- `GET /api/coupons` - Danh sách mã (admin)
- `POST /api/coupons` - Tạo mã mới (admin)

### Payments

- `POST /api/payment/create-intent` - Tạo payment intent với Stripe
- `POST /api/payment/webhook` - Webhook từ Stripe
