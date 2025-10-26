# Sơ Đồ ER Database - Nền Tảng Thương Mại Điện Tử Vendoor

```mermaid
erDiagram
    USER ||--o{ STORE : "tạo"
    USER ||--o{ ORDER : "đặt"
    USER ||--o{ RATING : "viết"
    USER ||--o{ ADDRESS : "có"

    STORE ||--o{ PRODUCT : "bán"
    STORE ||--o{ ORDER : "nhận"

    PRODUCT ||--o{ ORDER_ITEM : "chứa"
    PRODUCT ||--o{ RATING : "nhận"
    PRODUCT }o--|| STORE : "thuộc về"

    ORDER ||--|{ ORDER_ITEM : "chứa"
    ORDER }o--|| ADDRESS : "giao đến"
    ORDER }o--|| USER : "đặt bởi"
    ORDER }o--|| STORE : "xử lý bởi"
    ORDER }o--o| COUPON : "sử dụng"

    COUPON ||--o{ ORDER : "áp dụng cho"

    RATING }o--|| USER : "viết bởi"
    RATING }o--|| PRODUCT : "đánh giá"
    RATING }o--|| ORDER : "dựa trên"

    ADDRESS }o--|| USER : "thuộc về"

    USER {
        string id PK "Clerk User ID"
        string email "Địa chỉ email"
        string name "Họ và tên"
        string image "URL ảnh đại diện"
        datetime createdAt "Ngày tạo tài khoản"
        datetime updatedAt "Ngày cập nhật cuối"
    }

    STORE {
        string id PK "Mã cửa hàng duy nhất"
        string userId FK "Mã chủ cửa hàng"
        string name "Tên cửa hàng"
        string username "Tên người dùng cửa hàng"
        string description "Mô tả cửa hàng"
        string address "Địa chỉ vật lý"
        string email "Email liên hệ"
        string contact "Số điện thoại"
        string logo "URL logo cửa hàng"
        enum status "pending, approved, rejected"
        boolean isActive "Trạng thái hoạt động"
        datetime createdAt "Ngày tạo cửa hàng"
        datetime updatedAt "Ngày cập nhật cuối"
    }

    PRODUCT {
        string id PK "Mã sản phẩm duy nhất"
        string storeId FK "Mã cửa hàng bán"
        string name "Tên sản phẩm"
        string description "Mô tả sản phẩm"
        float mrp "Giá niêm yết"
        float price "Giá bán"
        array images "URL hình ảnh sản phẩm"
        string category "Danh mục sản phẩm"
        boolean inStock "Tình trạng còn hàng"
        datetime createdAt "Ngày tạo sản phẩm"
        datetime updatedAt "Ngày cập nhật cuối"
    }

    ORDER {
        string id PK "Mã đơn hàng duy nhất"
        string userId FK "Mã khách hàng"
        string storeId FK "Mã cửa hàng bán"
        string addressId FK "Mã địa chỉ giao hàng"
        string couponId FK "Mã giảm giá áp dụng"
        float total "Tổng tiền đơn hàng"
        string paymentMethod "COD, CARD, etc"
        enum status "ORDER_PLACED, PROCESSING, SHIPPED, DELIVERED, CANCELLED"
        boolean isCouponUsed "Đã dùng mã giảm giá"
        datetime createdAt "Ngày đặt hàng"
        datetime updatedAt "Ngày cập nhật cuối"
    }

    ORDER_ITEM {
        string id PK "Mã chi tiết đơn hàng"
        string orderId FK "Mã đơn hàng cha"
        string productId FK "Mã sản phẩm"
        int quantity "Số lượng đặt"
        datetime createdAt "Ngày tạo"
    }

    ADDRESS {
        string id PK "Mã địa chỉ duy nhất"
        string userId FK "Mã chủ sở hữu"
        string name "Tên người nhận"
        string email "Email liên hệ"
        string street "Địa chỉ đường"
        string city "Thành phố"
        string state "Tỉnh/Thành"
        string zip "Mã bưu điện"
        string country "Quốc gia"
        string phone "Số điện thoại"
        datetime createdAt "Ngày tạo địa chỉ"
    }

    RATING {
        string id PK "Mã đánh giá duy nhất"
        string userId FK "Mã người đánh giá"
        string productId FK "Mã sản phẩm được đánh giá"
        string orderId FK "Mã đơn hàng liên quan"
        float rating "Điểm đánh giá 1-5"
        string review "Nội dung đánh giá"
        datetime createdAt "Ngày gửi đánh giá"
    }

    COUPON {
        string code PK "Mã giảm giá duy nhất"
        string description "Mô tả mã giảm giá"
        int discount "Phần trăm giảm giá"
        boolean forNewUser "Chỉ dành cho user mới"
        boolean forMember "Chỉ dành cho thành viên"
        boolean isPublic "Hiển thị công khai"
        datetime expiresAt "Ngày hết hạn"
        datetime createdAt "Ngày tạo mã"
    }
```

## Các Mối Quan Hệ Chính

### Mối Quan Hệ Người Dùng

- **USER → STORE**: Một người dùng có thể tạo một cửa hàng (tài khoản người bán)
- **USER → ORDER**: Một người dùng có thể đặt nhiều đơn hàng
- **USER → RATING**: Một người dùng có thể viết nhiều đánh giá sản phẩm
- **USER → ADDRESS**: Một người dùng có thể có nhiều địa chỉ đã lưu

### Mối Quan Hệ Cửa Hàng

- **STORE → PRODUCT**: Một cửa hàng có thể bán nhiều sản phẩm
- **STORE → ORDER**: Một cửa hàng có thể nhận nhiều đơn hàng

### Mối Quan Hệ Sản Phẩm

- **PRODUCT → ORDER_ITEM**: Một sản phẩm có thể xuất hiện trong nhiều chi tiết đơn hàng
- **PRODUCT → RATING**: Một sản phẩm có thể có nhiều đánh giá

### Mối Quan Hệ Đơn Hàng

- **ORDER → ORDER_ITEM**: Một đơn hàng chứa nhiều sản phẩm
- **ORDER → ADDRESS**: Mỗi đơn hàng giao đến một địa chỉ
- **ORDER → COUPON**: Mỗi đơn hàng có thể sử dụng một mã giảm giá (tùy chọn)

### Tính Năng Bổ Sung

- **Hệ Thống Mã Giảm Giá**: Hỗ trợ giảm giá cho người dùng mới, thành viên và mã công khai
- **Hệ Thống Đánh Giá**: Liên kết với cả sản phẩm và đơn hàng để xác thực đánh giá
- **Đa Nhà Bán**: Mỗi sản phẩm và đơn hàng được liên kết với một cửa hàng cụ thể

## Quy Tắc Nghiệp Vụ

1. **Tạo Cửa Hàng**: Người dùng phải đăng ký và được admin phê duyệt trước khi cửa hàng hoạt động
2. **Quản Lý Sản Phẩm**: Chỉ cửa hàng đã được duyệt mới có thể đăng sản phẩm
3. **Xử Lý Đơn Hàng**: Đơn hàng được xử lý bởi từng cửa hàng riêng biệt
4. **Xác Thực Mã Giảm Giá**: Kiểm tra trạng thái người dùng (mới/thành viên) và ngày hết hạn
5. **Hệ Thống Đánh Giá**: Người dùng chỉ có thể đánh giá sản phẩm từ đơn hàng đã hoàn thành
6. **Quản Lý Địa Chỉ**: Nhiều địa chỉ cho mỗi người dùng, chọn một địa chỉ cho mỗi đơn hàng
