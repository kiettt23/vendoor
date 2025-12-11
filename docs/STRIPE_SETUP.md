# Hướng dẫn Setup Stripe Payment

## Tổng quan

Vendoor sử dụng **Stripe Checkout** cho thanh toán online (bên cạnh COD). Flow:

```
Chọn sản phẩm → Checkout → Chọn Stripe → Tạo Order (PENDING_PAYMENT)
→ Redirect Stripe Checkout → Thanh toán → Webhook update Order (PENDING)
→ Redirect Success Page
```

## 1. Tạo tài khoản Stripe

1. Đăng ký tại [stripe.com](https://stripe.com)
2. Vào Dashboard → Developers → API keys
3. Copy **Publishable key** (pk_test_xxx) và **Secret key** (sk_test_xxx)

> ⚠️ Dùng **Test mode** (keys bắt đầu bằng `pk_test_` và `sk_test_`) để test

## 2. Cấu hình Environment Variables

Thêm vào file `.env`:

```bash
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL (cho redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Setup Webhook (Local Development)

### Cách 1: Stripe CLI (Recommended)

```bash
# Cài Stripe CLI
# Windows (scoop)
scoop install stripe

# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Sau khi chạy, CLI sẽ hiển thị webhook secret (whsec_xxx). Copy vào `STRIPE_WEBHOOK_SECRET`.

### Cách 2: Ngrok (Alternative)

```bash
ngrok http 3000
```

Sau đó vào Stripe Dashboard → Webhooks → Add endpoint với URL ngrok.

## 4. Test thanh toán

### Thẻ test

| Loại        | Số thẻ              | CVC         | Ngày hết hạn |
| ----------- | ------------------- | ----------- | ------------ |
| Thành công  | 4242 4242 4242 4242 | Bất kỳ 3 số | Tương lai    |
| Bị từ chối  | 4000 0000 0000 0002 | Bất kỳ 3 số | Tương lai    |
| Xác thực 3D | 4000 0000 0000 3220 | Bất kỳ 3 số | Tương lai    |

### Các bước test

1. **Start dev server:**

   ```bash
   pnpm dev
   ```

2. **Start Stripe CLI webhook listener:**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Thực hiện checkout:**

   - Đăng nhập với account demo (customer@vendoor.vn / Customer123)
   - Thêm sản phẩm vào giỏ hàng
   - Vào Checkout
   - Chọn "Thẻ tín dụng / Ghi nợ" (Stripe)
   - Điền thông tin giao hàng
   - Click "Đặt Hàng"
   - Nhập thẻ test: `4242 4242 4242 4242`
   - Hoàn tất thanh toán

4. **Kiểm tra:**
   - Stripe CLI log: `checkout.session.completed`
   - Order status chuyển từ `PENDING_PAYMENT` → `PENDING`
   - Redirect về `/orders?success=true`

## 5. Cấu trúc code

```
src/
├── shared/lib/payment/
│   ├── stripe.ts          # Server-side Stripe config
│   ├── stripe-client.ts   # Client-side (optional, chưa dùng)
│   └── index.ts           # Exports
│
├── app/api/
│   ├── checkout/stripe/route.ts   # Tạo Checkout Session
│   └── webhooks/stripe/route.ts   # Handle webhook events
│
├── features/checkout/
│   ├── model/schema.ts    # PaymentMethod type (COD | STRIPE)
│   └── api/create-orders.ts
│
└── widgets/checkout/ui/
    └── checkout-page.tsx  # UI chọn phương thức thanh toán
```

## 6. Flow chi tiết

### Checkout Flow

```
1. User click "Đặt Hàng" với paymentMethod = "STRIPE"
   ↓
2. createOrders() tạo Order với status = "PENDING_PAYMENT"
   ↓
3. Frontend gọi POST /api/checkout/stripe
   ↓
4. API tạo Stripe Checkout Session với:
   - line_items: Từ order items
   - metadata: { userId, orderIds }
   - success_url, cancel_url
   ↓
5. Frontend redirect user đến session.url (Stripe Checkout)
   ↓
6. User nhập thẻ và thanh toán
   ↓
7. Stripe gửi webhook "checkout.session.completed"
   ↓
8. Webhook handler update Order status → "PENDING"
   ↓
9. User được redirect về success_url
```

### Webhook Events

| Event                           | Xử lý                                       |
| ------------------------------- | ------------------------------------------- |
| `checkout.session.completed`    | Update order → PENDING, payment → COMPLETED |
| `checkout.session.expired`      | Log (optional: cancel orders)               |
| `payment_intent.payment_failed` | Log payment failure                         |

## 7. Production Checklist

- [ ] Đổi sang Live keys (pk*live*, sk*live*)
- [ ] Setup webhook endpoint trên Stripe Dashboard
- [ ] Update `NEXT_PUBLIC_APP_URL` với domain production
- [ ] Test với thẻ thật (số tiền nhỏ)
- [ ] Enable Stripe Radar (chống gian lận)
- [ ] Cấu hình email receipts

## 8. Troubleshooting

### Webhook không nhận được

```bash
# Kiểm tra Stripe CLI đang chạy
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-json

# Xem logs
stripe logs tail
```

### Lỗi "Webhook signature verification failed"

- Kiểm tra `STRIPE_WEBHOOK_SECRET` đúng chưa
- Nếu dùng Stripe CLI, dùng secret mà CLI hiển thị
- Nếu dùng Stripe Dashboard webhook, dùng secret từ Dashboard

### Lỗi currency VND

Stripe yêu cầu `unit_amount` cho VND phải là số nguyên (không có decimal).
Code đã handle bằng `Math.round(item.price)`.

### Order không update sau thanh toán

1. Kiểm tra webhook có được gọi không (xem Stripe CLI output)
2. Kiểm tra `metadata.orderIds` có đúng không
3. Xem console.log trong webhook handler

## 9. Tài liệu tham khảo

- [Stripe Checkout Docs](https://stripe.com/docs/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)
