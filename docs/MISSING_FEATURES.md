# 🚧 Tính Năng Còn Thiếu

Danh sách các tính năng chưa được implement trong Vendoor, phân loại theo mức độ ưu tiên.

> **Note:** Các tính năng đã hoàn thành được ghi chi tiết trong `FEATURES.md`

---

## 🔴 High Priority - Cần làm trước khi launch

### 1. Refund Flow

**Vấn đề:** Model `Payment` có status `REFUNDED` nhưng chưa có logic xử lý

**Cần implement:**

| Tính năng           | Mô tả                              |
| ------------------- | ---------------------------------- |
| Yêu cầu hoàn tiền   | Customer request refund với reason |
| Duyệt refund        | Vendor/Admin approve/reject        |
| Xử lý Stripe refund | API call để refund payment         |
| Refund history      | Lịch sử các refund                 |

**Schema cần thêm:**

```prisma
model RefundRequest {
  id          String @id @default(cuid())
  orderId     String
  reason      String @db.Text
  status      RefundStatus @default(PENDING)
  amount      Float
  // ...
}
```

**FSD Location:** `src/entities/refund/`, `src/features/refund/`

---

### 2. Payment History

**Vấn đề:** Roadmap ghi planned nhưng chưa implement

**Cần implement:**

| Tính năng          | Mô tả                          |
| ------------------ | ------------------------------ |
| Lịch sử thanh toán | Danh sách payments của user    |
| Chi tiết payment   | Thông tin method, status, time |
| Download invoice   | PDF invoice cho mỗi payment    |

**FSD Location:** `src/app/(customer)/payments/`, `src/entities/payment/`

---

### 3. Email Notifications

**Vấn đề:** Chưa có gửi email cho các sự kiện quan trọng

**Cần implement:**

| Event               | Email                     |
| ------------------- | ------------------------- |
| Đặt hàng thành công | Order confirmation        |
| Status change       | Order shipped, delivered  |
| Vendor duyệt        | Vendor approved/rejected  |
| Review reply        | Vendor đã phản hồi review |
| Password reset      | Reset password link       |

**Providers gợi ý:** Resend, SendGrid, AWS SES

**FSD Location:** `src/shared/lib/email/`

---

## 🟡 Medium Priority - Có thể launch MVP trước

### 4. Coupon/Voucher System

**Schema cần thêm:**

```prisma
model Voucher {
  id             String @id @default(cuid())
  code           String @unique
  discountType   DiscountType // PERCENTAGE, FIXED_AMOUNT
  discountValue  Float
  minOrderAmount Float?
  maxDiscount    Float?
  usageLimit     Int?
  usedCount      Int @default(0)
  validFrom      DateTime
  validTo        DateTime
  isActive       Boolean @default(true)
  vendorId       String? // null = platform voucher
}
```

**Cần implement:**

| Tính năng        | Mô tả                       |
| ---------------- | --------------------------- |
| Áp dụng voucher  | Input code ở checkout       |
| Validate voucher | Kiểm tra điều kiện, hết hạn |
| Vendor vouchers  | Vendor tạo voucher cho shop |
| Admin vouchers   | Platform-wide promotions    |

---

### 5. Flash Sales thực sự

**Vấn đề:** Component `FlashDeals` dùng mock data

**Cần implement:**

| Tính năng         | Mô tả                             |
| ----------------- | --------------------------------- |
| Flash sale entity | Products với giá sale + thời gian |
| Countdown timer   | Real-time countdown               |
| Stock limited     | Số lượng giới hạn cho flash sale  |
| Admin management  | Tạo/quản lý flash sales           |

---

### 6. Order Tracking chi tiết

**Vấn đề:** Có `trackingNumber` nhưng chưa có UI

**Cần implement:**

| Tính năng          | Mô tả                          |
| ------------------ | ------------------------------ |
| Timeline status    | Visual timeline các trạng thái |
| Tracking link      | Link đến 3rd party tracking    |
| Estimated delivery | Dự kiến ngày giao              |
| Shipping provider  | Chọn đơn vị vận chuyển         |

---

### 7. Review Moderation (Admin)

**Vấn đề:** Có `ReviewStatus` enum nhưng admin chưa quản lý

**Cần implement:**

| Tính năng        | Mô tả                       |
| ---------------- | --------------------------- |
| Review list      | Danh sách tất cả reviews    |
| Moderate reviews | Approve/Reject reviews      |
| Report review    | Customer báo cáo review xấu |
| Auto-moderation  | Filter từ ngữ không phù hợp |

---

### 8. Static Pages

**Vấn đề:** Footer có links nhưng không có pages

**Cần tạo:**

| Page               | Route      |
| ------------------ | ---------- |
| Giới thiệu         | `/about`   |
| Liên hệ            | `/contact` |
| Điều khoản         | `/terms`   |
| Chính sách bảo mật | `/privacy` |
| FAQ                | `/faq`     |
| Hướng dẫn mua hàng | `/guide`   |

---

## 🟢 Low Priority - Future Roadmap

### 9. Chat Vendor-Customer

- Real-time messaging
- File/Image sharing
- Chat history
- Notification badge

### 10. Push/In-app Notifications

- Browser push notifications
- In-app notification center
- Notification preferences

### 11. Multi-language (i18n)

- Vietnamese (default)
- English
- Language switcher

### 12. Vendor Payout Management

- Payout requests
- Admin approve payouts
- Payout history
- Bank account management

### 13. Additional Payment Methods

- VNPay integration
- MoMo integration
- ZaloPay integration

### 14. SEO Optimization

- Dynamic metadata cho tất cả pages
- Structured data (JSON-LD)
- Sitemap generation
- OpenGraph images

---

## 📊 Tóm tắt

| Priority  | Số tính năng | Effort estimate |
| --------- | ------------ | --------------- |
| 🔴 High   | 3            | 1-2 weeks       |
| 🟡 Medium | 5            | 2-3 weeks       |
| 🟢 Low    | 6            | 4+ weeks        |

---

## 🎯 Gợi ý thứ tự implement

1. **Email Notifications** - User engagement
2. **Refund Flow** - Business requirement
3. **Payment History** - User transparency
4. **Coupon System** - Marketing & sales
5. **Order Tracking** - Better UX
6. **Static Pages** - SEO & legal compliance

---

## 📝 Notes

- Tất cả tính năng mới cần follow **FSD architecture**
- Viết **unit tests** cho business logic
- Thêm **E2E tests** cho critical flows
- Cập nhật **FEATURES.md** sau khi implement

---

_Last updated: December 3, 2025_
