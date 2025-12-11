# 🔍 Manual Testing Checklist

Checklist để test thủ công các tính năng trước khi deploy. Dùng để cross-check với automated tests.

---

## 📋 Hướng Dẫn Sử Dụng

1. Mở file này khi cần test
2. Copy checklist vào issue/task tracking
3. Tick ✅ khi pass, ❌ khi fail
4. Ghi note nếu có bug

**Test Environment:**

- Local: `http://localhost:3000`
- Staging: `[staging-url]`

**Test Accounts:**

```
Customer: customer@test.com / password123
Vendor: vendor@test.com / password123
Admin: admin@test.com / password123
```

---

## 🛒 Customer Features

### 1. Authentication

| #   | Test Case                     | Steps                                                                    | Expected                             | Status |
| --- | ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------ | ------ |
| 1.1 | Đăng ký tài khoản mới         | 1. Vào `/auth/register`<br>2. Điền email, password, confirm<br>3. Submit | Tạo account thành công, redirect `/` | ✅     |
| 1.2 | Đăng ký - email đã tồn tại    | 1. Đăng ký với email đã có                                               | Hiện lỗi "Email đã được sử dụng"     | ✅     |
| 1.3 | Đăng ký - password không khớp | 1. Nhập confirm password khác                                            | Hiện lỗi validation                  | ✅     |
| 1.4 | Đăng nhập thành công          | 1. Vào `/auth/login`<br>2. Nhập credentials đúng                         | Redirect về homepage                 | ✅     |
| 1.5 | Đăng nhập - sai password      | 1. Nhập password sai                                                     | Hiện lỗi "Sai email hoặc mật khẩu"   | ✅     |
| 1.6 | Đăng xuất                     | 1. Click avatar → Đăng xuất                                              | Clear session, redirect `/`          | ✅     |
| 1.7 | Protected route redirect      | 1. Logout<br>2. Truy cập `/account`                                      | Redirect đến `/auth/login`           | ✅     |
| 1.8 | OAuth Google                  | 1. Click "Đăng nhập với Google"<br>2. Chọn account                       | Đăng nhập thành công                 | ✅     |
| 1.9 | Quên mật khẩu                 | 1. Click "Quên mật khẩu"<br>2. Nhập email<br>3. Check email              | Nhận email reset password            | ☐      |

### 2. Duyệt Sản Phẩm

| #   | Test Case           | Steps                                           | Expected                                | Status |
| --- | ------------------- | ----------------------------------------------- | --------------------------------------- | ------ |
| 2.1 | Trang chủ load      | 1. Vào `/`                                      | Hero banner, featured products hiển thị | ✅     |
| 2.2 | Category navigation | 1. Click vào category từ navbar                 | Redirect đến `/category/[slug]`         | ✅     |
| 2.3 | Product detail      | 1. Click vào sản phẩm                           | Hiển thị ảnh, giá, mô tả, variants      | ✅     |
| 2.4 | Image gallery       | 1. Vào trang sản phẩm<br>2. Click ảnh thumbnail | Main image thay đổi                     | ☐      |
| 2.5 | Variant selection   | 1. Click variant khác (size, color)             | Giá cập nhật, stock hiển thị            | ✅     |
| 2.6 | Related products    | 1. Scroll xuống cuối product page               | Hiển thị sản phẩm liên quan             | ✅     |

### 3. Search

| #   | Test Case                    | Steps                                     | Expected                                | Status |
| --- | ---------------------------- | ----------------------------------------- | --------------------------------------- | ------ |
| 3.1 | Search suggestions           | 1. Gõ "iphone" vào search bar             | Dropdown hiện suggestions với ảnh, giá  | ✅     |
| 3.2 | Search debounce              | 1. Gõ nhanh                               | Không spam requests (check Network tab) | ✅     |
| 3.3 | Search results page          | 1. Nhấn Enter sau khi search              | Redirect `/search?q=...` với kết quả    | ✅     |
| 3.4 | Category filter trong search | 1. Chọn category từ dropdown<br>2. Search | Kết quả filter theo category            | ✅     |
| 3.5 | Keyboard navigation          | 1. Gõ search<br>2. Dùng ↑↓ Enter          | Navigate suggestions, chọn được         | ✅     |
| 3.6 | No results                   | 1. Search "xyzabc123"                     | Hiện "Không tìm thấy sản phẩm"          | ✅     |

### 4. Giỏ Hàng

| #   | Test Case             | Steps                                                               | Expected                         | Status |
| --- | --------------------- | ------------------------------------------------------------------- | -------------------------------- | ------ |
| 4.1 | Thêm vào giỏ          | 1. Vào product detail<br>2. Chọn variant<br>3. Click "Thêm vào giỏ" | Toast success, cart badge update | ✅     |
| 4.2 | Thêm số lượng > stock | 1. Thêm qty > available stock                                       | Hiện lỗi hoặc cap tại max stock  | ✅     |
| 4.3 | Cập nhật số lượng     | 1. Vào cart<br>2. +/- số lượng                                      | Subtotal cập nhật                | ✅     |
| 4.4 | Xóa item              | 1. Click icon xóa item                                              | Item biến mất, total cập nhật    | ✅     |
| 4.5 | Persist sau refresh   | 1. Thêm items<br>2. Refresh page                                    | Cart items vẫn còn               | ✅     |
| 4.6 | Multi-vendor grouping | 1. Thêm sản phẩm từ 2+ vendors                                      | Items nhóm theo vendor           | ✅     |
| 4.7 | Empty cart            | 1. Xóa hết items                                                    | Hiện "Giỏ hàng trống"            | ✅     |

### 5. Checkout

| #   | Test Case        | Steps                                              | Expected                              | Status |
| --- | ---------------- | -------------------------------------------------- | ------------------------------------- | ------ |
| 5.1 | Checkout form    | 1. Vào checkout                                    | Form hiển thị: tên, SĐT, địa chỉ      | ✅     |
| 5.2 | Form validation  | 1. Submit form trống                               | Hiện lỗi validation mỗi field         | ✅     |
| 5.3 | Phone validation | 1. Nhập SĐT sai format (8 số)                      | Hiện lỗi "Số điện thoại không hợp lệ" | ✅     |
| 5.4 | COD checkout     | 1. Điền đủ thông tin<br>2. Chọn COD<br>3. Đặt hàng | Tạo order, redirect success page      | ✅     |
| 5.5 | Stripe checkout  | 1. Chọn Stripe<br>2. Đặt hàng                      | Redirect đến Stripe checkout          | ✅     |
| 5.6 | Stripe success   | 1. Complete Stripe payment                         | Redirect về `/checkout/success`       | ✅     |
| 5.7 | Order splitting  | 1. Checkout với 2+ vendor items                    | Tạo 2 orders riêng biệt               | ✅     |

### 6. Wishlist

| #   | Test Case         | Steps                                        | Expected                    | Status |
| --- | ----------------- | -------------------------------------------- | --------------------------- | ------ |
| 6.1 | Thêm vào wishlist | 1. Vào product detail<br>2. Click heart icon | Heart filled, toast success | ✅     |
| 6.2 | Xóa khỏi wishlist | 1. Click heart icon lần nữa                  | Heart unfilled, removed     | ✅     |
| 6.3 | Wishlist page     | 1. Vào `/wishlist`                           | Hiển thị tất cả saved items | ✅     |
| 6.4 | Require login     | 1. Logout<br>2. Click heart                  | Redirect đến login          | ✅     |

### 7. Reviews

| #   | Test Case                 | Steps                                               | Expected                        | Status |
| --- | ------------------------- | --------------------------------------------------- | ------------------------------- | ------ |
| 7.1 | Viết review (no purchase) | 1. Vào product chưa mua<br>2. Viết review           | Không có badge "Đã mua hàng"    | ☐      |
| 7.2 | Viết review (purchased)   | 1. Vào product đã mua & delivered<br>2. Viết review | Có badge "Đã mua hàng"          | ☐      |
| 7.3 | Rating validation         | 1. Submit review không chọn sao                     | Hiện lỗi "Chọn số sao"          | ✅     |
| 7.4 | Upload images             | 1. Upload 3 ảnh cho review                          | Preview hiện, submit thành công | ✅     |
| 7.5 | Max 5 images              | 1. Thử upload 6 ảnh                                 | Chỉ chấp nhận 5, warning hiện   | ✅     |
| 7.6 | Image lightbox            | 1. Click ảnh trong review                           | Lightbox full-screen mở         | ✅     |
| 7.7 | Lightbox navigation       | 1. Dùng ←→ hoặc click prev/next                     | Navigate giữa ảnh               | ✅     |

### 8. Order History

| #   | Test Case    | Steps                    | Expected                             | Status |
| --- | ------------ | ------------------------ | ------------------------------------ | ------ |
| 8.1 | View orders  | 1. Vào `/account/orders` | Danh sách đơn hàng hiển thị          | ✅     |
| 8.2 | Order detail | 1. Click vào order       | Chi tiết: items, status, vendor info | ✅     |
| 8.3 | Order status | 1. Check order mới       | Status PENDING hiển thị đúng         | ✅     |

---

## 🏪 Vendor Features

### 9. Vendor Registration

| #   | Test Case            | Steps                             | Expected                              | Status |
| --- | -------------------- | --------------------------------- | ------------------------------------- | ------ |
| 9.1 | Registration form    | 1. Vào `/vendor/register`         | Form hiển thị đầy đủ fields           | ✅     |
| 9.2 | Submit đăng ký       | 1. Điền đủ thông tin<br>2. Submit | Tạo application, status PENDING       | ✅     |
| 9.3 | Shop name validation | 1. Nhập tên < 3 ký tự             | Hiện lỗi validation                   | ✅     |
| 9.4 | Phone validation     | 1. Nhập SĐT sai format            | Hiện lỗi "Số điện thoại không hợp lệ" | ✅     |
| 9.5 | Duplicate shop name  | 1. Đăng ký với tên shop đã có     | Hiện lỗi "Tên shop đã tồn tại"        | ☐      |

### 10. Product Management

| #    | Test Case       | Steps                                                     | Expected                            | Status |
| ---- | --------------- | --------------------------------------------------------- | ----------------------------------- | ------ |
| 10.1 | Products list   | 1. Vào `/vendor/products`                                 | Danh sách sản phẩm của vendor       | ✅     |
| 10.2 | Add product     | 1. Click "Thêm sản phẩm"<br>2. Điền form<br>3. Submit     | Tạo product mới                     | ✅     |
| 10.3 | Required fields | 1. Submit form thiếu tên                                  | Hiện lỗi validation                 | ✅     |
| 10.4 | Add variant     | 1. Trong form, click "Thêm biến thể"                      | Variant row xuất hiện               | ☐      |
| 10.5 | Image upload    | 1. Upload ảnh sản phẩm                                    | Preview hiện, upload lên Cloudinary | ☐      |
| 10.6 | Edit product    | 1. Click Edit trên product<br>2. Sửa thông tin<br>3. Save | Cập nhật thành công                 | ☐      |
| 10.7 | Delete product  | 1. Click Delete<br>2. Confirm                             | Product bị soft delete              | ☐      |
| 10.8 | AI auto-fill    | 1. Upload ảnh<br>2. Click "AI gợi ý"                      | Tên, mô tả, tags được fill          | ☐      |

### 11. Inventory Management

| #    | Test Case                 | Steps                                                | Expected                      | Status |
| ---- | ------------------------- | ---------------------------------------------------- | ----------------------------- | ------ |
| 11.1 | Inventory list            | 1. Vào `/vendor/inventory`                           | Danh sách variants với stock  | ✅     |
| 11.2 | Inline edit               | 1. Click vào ô Tồn kho<br>2. Nhập số mới<br>3. Enter | Stock cập nhật, toast success | ✅     |
| 11.3 | Negative stock validation | 1. Nhập số âm                                        | Hiện lỗi, không cho save      | ✅     |
| 11.4 | Filter: Còn hàng          | 1. Chọn filter "Còn hàng"                            | Chỉ hiện stock > 5            | ✅     |
| 11.5 | Filter: Sắp hết           | 1. Chọn filter "Sắp hết"                             | Chỉ hiện 1 ≤ stock ≤ 5        | ✅     |
| 11.6 | Filter: Hết hàng          | 1. Chọn filter "Hết hàng"                            | Chỉ hiện stock = 0            | ✅     |
| 11.7 | Low stock alert           | 1. Có product sắp hết                                | Alert box hiển thị số lượng   | ✅     |
| 11.8 | Search                    | 1. Gõ tên sản phẩm                                   | Filter theo tên               | ☐      |

### 12. Order Management

| #    | Test Case          | Steps                                            | Expected                           | Status |
| ---- | ------------------ | ------------------------------------------------ | ---------------------------------- | ------ |
| 12.1 | Orders list        | 1. Vào `/vendor/orders`                          | Danh sách đơn của vendor           | ✅     |
| 12.2 | Filter by status   | 1. Chọn filter status                            | Chỉ hiện orders với status đó      | ✅     |
| 12.3 | Order detail       | 1. Click vào order                               | Chi tiết: customer, items, address | ✅     |
| 12.4 | Update status      | 1. Click "Xác nhận"<br>2. Chuyển sang PROCESSING | Status update, toast success       | ✅     |
| 12.5 | Status transition  | 1. PENDING → PROCESSING → SHIPPED                | Các nút đúng theo workflow         | ✅     |
| 12.6 | Commission display | 1. Xem order detail                              | Hiển thị phần vendor nhận được     | ✅     |

### 13. Analytics

| #    | Test Case           | Steps                        | Expected                     | Status |
| ---- | ------------------- | ---------------------------- | ---------------------------- | ------ |
| 13.1 | Analytics page      | 1. Vào `/vendor/analytics`   | 4 summary cards hiển thị     | ✅     |
| 13.2 | Revenue chart       | 1. Scroll xuống              | Chart hiển thị đúng data     | ✅     |
| 13.3 | Top products        | 1. Xem bảng Top Products     | 5 sản phẩm bán chạy nhất     | ✅     |
| 13.4 | Time range: 7 days  | 1. Chọn "7 ngày"             | Data filter 7 ngày gần nhất  | ✅     |
| 13.5 | Time range: 30 days | 1. Chọn "30 ngày"            | Data filter 30 ngày          | ✅     |
| 13.6 | Period comparison   | 1. Check % change trên cards | Hiển thị +/- so với kỳ trước | ✅     |
| 13.7 | Empty state         | 1. Vendor mới không có order | Hiện "Chưa có dữ liệu"       | ✅     |

### 14. Review Replies

| #    | Test Case    | Steps                                                | Expected                     | Status |
| ---- | ------------ | ---------------------------------------------------- | ---------------------------- | ------ |
| 14.1 | Reviews list | 1. Vào `/vendor/reviews`                             | Danh sách reviews của vendor | ✅     |
| 14.2 | Reply review | 1. Click "Phản hồi"<br>2. Nhập nội dung<br>3. Submit | Reply hiển thị dưới review   | ✅     |
| 14.3 | Edit reply   | 1. Click "Sửa" trên reply<br>2. Cập nhật             | Reply updated                | ✅     |
| 14.4 | Delete reply | 1. Click "Xóa"<br>2. Confirm                         | Reply removed                | ✅     |

---

## 👨‍💼 Admin Features

### 15. Admin Dashboard

| #    | Test Case        | Steps                             | Expected                         | Status |
| ---- | ---------------- | --------------------------------- | -------------------------------- | ------ |
| 15.1 | Dashboard access | 1. Login admin<br>2. Vào `/admin` | Dashboard với stats hiển thị     | ✅     |
| 15.2 | Platform metrics | 1. Check summary cards            | Tổng doanh thu, đơn, vendor đúng | ✅     |

### 16. Vendor Approval

| #    | Test Case       | Steps                              | Expected                   | Status |
| ---- | --------------- | ---------------------------------- | -------------------------- | ------ |
| 16.1 | Pending vendors | 1. Vào `/admin/vendors`            | Danh sách vendor chờ duyệt | ✅     |
| 16.2 | Approve vendor  | 1. Click "Approve"<br>2. Confirm   | Vendor status → APPROVED   | ✅     |
| 16.3 | Reject vendor   | 1. Click "Reject"<br>2. Nhập lý do | Vendor status → REJECTED   | ✅     |

### 17. Category Management

| #    | Test Case       | Steps                             | Expected             | Status |
| ---- | --------------- | --------------------------------- | -------------------- | ------ |
| 17.1 | Categories list | 1. Vào `/admin/categories`        | Danh sách categories | ✅     |
| 17.2 | Add category    | 1. Click "Thêm"<br>2. Điền form   | Category mới tạo     | ✅     |
| 17.3 | Edit category   | 1. Click Edit<br>2. Sửa thông tin | Category updated     | ✅     |
| 17.4 | Delete category | 1. Click Delete<br>2. Confirm     | Category removed     | ✅     |

---

## 📱 Responsive Testing

| #   | Test Case                  | Breakpoint       | Status |
| --- | -------------------------- | ---------------- | ------ |
| R.1 | Homepage                   | Mobile (375px)   | ☐      |
| R.2 | Product detail             | Mobile (375px)   | ☐      |
| R.3 | Cart drawer                | Mobile (375px)   | ☐      |
| R.4 | Checkout form              | Mobile (375px)   | ☐      |
| R.5 | Search (full-screen panel) | Mobile (375px)   | ☐      |
| R.6 | Vendor dashboard           | Tablet (768px)   | ☐      |
| R.7 | Admin dashboard            | Tablet (768px)   | ☐      |
| R.8 | All pages                  | Desktop (1280px) | ☐      |

---

## 🌐 Cross-Browser Testing

| #   | Browser       | Version     | Status |
| --- | ------------- | ----------- | ------ |
| B.1 | Chrome        | Latest      | ☐      |
| B.2 | Firefox       | Latest      | ☐      |
| B.3 | Safari        | Latest      | ☐      |
| B.4 | Edge          | Latest      | ☐      |
| B.5 | Mobile Safari | iOS 16+     | ☐      |
| B.6 | Chrome Mobile | Android 12+ | ☐      |

---

## ⚡ Performance Checklist

| #   | Test Case                 | Tool         | Target             | Status |
| --- | ------------------------- | ------------ | ------------------ | ------ |
| P.1 | Homepage LCP              | Lighthouse   | < 2.5s             | ☐      |
| P.2 | Homepage FCP              | Lighthouse   | < 1.8s             | ☐      |
| P.3 | CLS                       | Lighthouse   | < 0.1              | ☐      |
| P.4 | Mobile Performance Score  | Lighthouse   | > 80               | ☐      |
| P.5 | Desktop Performance Score | Lighthouse   | > 90               | ☐      |
| P.6 | Bundle size               | Build output | < 500KB first load | ☐      |

---

## 🐛 Bug Report


---

## ✅ Release Checklist

Trước khi deploy production:

- [ ] Tất cả test cases pass
- [ ] Automated tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm test:e2e`)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Performance scores đạt target
- [ ] Responsive tested
- [ ] Cross-browser tested
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Stripe webhook configured

---

_Last updated: December 3, 2025_
