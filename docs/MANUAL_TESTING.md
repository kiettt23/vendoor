# Vendoor - Manual Testing Checklist

Checklist test thủ công trước khi release. Tập trung vào những gì **unit test không thể cover**:
- UI/UX interactions
- Real database operations
- Third-party integrations (Stripe, Cloudinary)
- Cross-browser compatibility
- Responsive design
- Performance & loading states
- Error handling hiển thị cho user

---

## 📋 Mục lục

1. [Pre-Release Checklist](#1-pre-release-checklist)
2. [Authentication Flows](#2-authentication-flows)
3. [Customer Journey](#3-customer-journey)
4. [Vendor Operations](#4-vendor-operations)
5. [Admin Operations](#5-admin-operations)
6. [Payment Integration](#6-payment-integration)
7. [Image Upload](#7-image-upload)
8. [Responsive & Cross-Browser](#8-responsive--cross-browser)
9. [Error Handling](#9-error-handling)
10. [Performance](#10-performance)

---

## 1. Pre-Release Checklist

### Environment Check

- [ ] Database seeded với test data (`pnpm db:seed`)
- [ ] Environment variables đã set đầy đủ
- [ ] Cloudinary credentials hoạt động
- [ ] Stripe test keys configured (nếu test payment)
- [ ] Build production thành công (`pnpm build`)

### Quick Smoke Test

| Test | Expected | Status |
|------|----------|--------|
| Homepage loads | Hiển thị products, categories | ⬜ |
| Login works | Redirect sau login | ⬜ |
| Add to cart | Toast success, cart updates | ⬜ |
| Checkout COD | Order created, redirect to success | ⬜ |
| Vendor dashboard | Stats hiển thị, products list loads | ⬜ |
| Admin dashboard | Stats hiển thị, vendor list loads | ⬜ |

---

## 2. Authentication Flows

### 2.1 Login

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Login thành công | 1. Vào `/login`<br>2. Nhập `customer@vendoor.com` / `Kiet1461!`<br>3. Click "Đăng nhập" | Redirect về `/`, user menu hiển thị | ⬜ |
| Login sai password | Nhập email đúng, password sai | Hiển thị error message rõ ràng | ⬜ |
| Login email không tồn tại | Nhập email không có trong DB | Hiển thị error "Email không tồn tại" hoặc generic | ⬜ |
| Validation empty fields | Submit form trống | Hiển thị validation errors cho từng field | ⬜ |
| Remember session | Login, close browser, mở lại | Vẫn logged in | ⬜ |

### 2.2 Register

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Register thành công | 1. Vào `/register`<br>2. Điền đầy đủ thông tin hợp lệ<br>3. Submit | Account created, redirect hoặc auto-login | ⬜ |
| Email đã tồn tại | Dùng email đã có trong DB | Error "Email đã được sử dụng" | ⬜ |
| Password mismatch | Confirm password khác password | Error "Mật khẩu không khớp" | ⬜ |
| Weak password | Password < 8 ký tự hoặc không có số/chữ hoa | Validation error cụ thể | ⬜ |

### 2.3 Logout

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Logout thành công | Click menu → "Đăng xuất" | Redirect về home, user menu thành "Đăng nhập" | ⬜ |
| Session cleared | Sau logout, vào `/orders` | Redirect về `/login` | ⬜ |

### 2.4 Protected Routes

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Access `/orders` khi chưa login | Direct URL | Redirect `/login` | ⬜ |
| Access `/vendor` khi là Customer | Login as customer, go to `/vendor` | Redirect về home | ⬜ |
| Access `/admin` khi không phải Admin | Login as vendor, go to `/admin` | Redirect về home | ⬜ |

---

## 3. Customer Journey

### 3.1 Product Browsing

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Product listing loads | Vào `/products` | Grid sản phẩm hiển thị, có pagination | ⬜ |
| Filter by category | Click category trong sidebar | Products filtered, URL updated | ⬜ |
| Sort by price | Chọn "Giá thấp → cao" | Products re-ordered | ⬜ |
| Search products | Nhập keyword, Enter | Results hiển thị, có highlight | ⬜ |
| Product detail | Click sản phẩm | Chi tiết, ảnh gallery, variants, reviews | ⬜ |
| Select variant | Chọn color/size | Price updates, stock updates | ⬜ |
| Out of stock variant | Chọn variant stock = 0 | Button "Hết hàng" disabled | ⬜ |

### 3.2 Cart Operations

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Add to cart | Click "Thêm vào giỏ" | Toast success, cart icon badge updates | ⬜ |
| Add same item twice | Add, then add again | Quantity increased, not duplicate | ⬜ |
| Add over stock | Thử add qty > stock | Error message, không cho add | ⬜ |
| View cart | Click cart icon | Slide-in panel với items | ⬜ |
| Update quantity | +/- buttons | Total recalculated | ⬜ |
| Remove item | Click xóa | Item removed, total updated | ⬜ |
| Cart persist | Add items, refresh page | Items vẫn còn (localStorage) | ⬜ |
| Multi-vendor cart | Add từ 2+ shops | Shipping fee = 30k × vendor count | ⬜ |

### 3.3 Checkout (COD)

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Access checkout | Click "Thanh toán" từ cart | Form shipping + payment options | ⬜ |
| Validation errors | Submit form thiếu fields | Specific errors per field | ⬜ |
| Invalid phone | Nhập SĐT < 10 số | Error "SĐT phải 10 số" | ⬜ |
| Select COD | Chọn "Thanh toán khi nhận" | COD selected, no Stripe form | ⬜ |
| Place order | Fill valid data, submit | Loading → Success page | ⬜ |
| Stock deducted | Check product after order | Stock giảm đúng quantity | ⬜ |
| Order created | Check `/orders` | Order mới với status PENDING | ⬜ |
| Cart cleared | Sau order thành công | Cart trống | ⬜ |
| Multi-vendor split | Order từ 2 shops | Tạo 2 orders riêng | ⬜ |

### 3.4 Order Tracking

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View order list | Vào `/orders` | Danh sách orders, sorted by date | ⬜ |
| View order detail | Click order | Chi tiết items, shipping, status | ⬜ |
| Status badge | Xem order | Badge màu đúng theo status | ⬜ |
| Cancel order | Cancel PENDING order | Status → CANCELLED | ⬜ |
| Cannot cancel SHIPPED | Thử cancel order đã ship | Button disabled hoặc error | ⬜ |

### 3.5 Wishlist

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Add to wishlist | Click heart icon | Heart filled, toast success | ⬜ |
| View wishlist | Vào `/wishlist` | List products đã thích | ⬜ |
| Remove from wishlist | Click heart again | Removed từ list | ⬜ |
| Move to cart | Click "Thêm vào giỏ" từ wishlist | Added to cart | ⬜ |
| Require login | Click heart khi chưa login | Redirect to login | ⬜ |

### 3.6 Reviews

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View reviews | Xem product detail | Reviews list với rating, images | ⬜ |
| Write review | Click "Viết đánh giá" | Form với stars, text, image upload | ⬜ |
| Submit review | Fill và submit | Review hiển thị, average updated | ⬜ |
| One review per product | Thử review lại | Error "Bạn đã đánh giá" | ⬜ |
| Verified purchase badge | Review sản phẩm đã mua | Badge "Đã mua hàng" hiển thị | ⬜ |

---

## 4. Vendor Operations

### 4.1 Dashboard

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Access dashboard | Login vendor, vào `/vendor` | Stats: revenue, orders, products | ⬜ |
| Stats accuracy | Compare với actual orders | Numbers match | ⬜ |
| Recent orders | Xem "Đơn hàng gần đây" | Orders mới nhất, clickable | ⬜ |

### 4.2 Product Management

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| List products | Vào `/vendor/products` | Grid/table sản phẩm của vendor | ⬜ |
| Create product | Click "Thêm sản phẩm" | Form với đầy đủ fields | ⬜ |
| Upload images | Add images | Preview, reorder drag-drop | ⬜ |
| Add variants | Add color/size variants | Price, stock per variant | ⬜ |
| Save product | Submit form hợp lệ | Product created, redirect to list | ⬜ |
| Edit product | Click edit | Pre-filled form | ⬜ |
| Update product | Change và save | Updated, cache invalidated | ⬜ |
| Delete product | Click delete | Soft delete, không hiển thị | ⬜ |

### 4.3 Order Management

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View orders | Vào `/vendor/orders` | Orders của shop | ⬜ |
| Filter by status | Select "Đang xử lý" | Filtered results | ⬜ |
| Update to PROCESSING | Click "Xác nhận" | Status updated | ⬜ |
| Update to SHIPPED | Add tracking, click "Gửi hàng" | Status updated, tracking saved | ⬜ |
| Cannot skip status | Thử PENDING → SHIPPED trực tiếp | Error hoặc blocked | ⬜ |

### 4.4 Inventory

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View inventory | Vào `/vendor/inventory` | All variants với stock | ⬜ |
| Low stock warning | Variant stock ≤ 10 | Badge "Sắp hết" | ⬜ |
| Update stock | Change số lượng | Saved, product page updated | ⬜ |
| Bulk update | Update nhiều variants | All saved in one action | ⬜ |

### 4.5 Review Reply

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View reviews | Vào `/vendor/reviews` | Reviews cho shop | ⬜ |
| Reply to review | Click reply, write, submit | Reply hiển thị dưới review | ⬜ |
| One reply only | Thử reply lại | Button disabled hoặc error | ⬜ |

---

## 5. Admin Operations

### 5.1 Dashboard

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Access dashboard | Login admin, vào `/admin` | Platform-wide stats | ⬜ |
| Total revenue | Xem "Tổng doanh thu" | Sum của tất cả orders | ⬜ |
| Platform earnings | Xem "Thu nhập sàn" | Sum của platformFee | ⬜ |

### 5.2 Vendor Approval

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View pending vendors | Vào `/admin/vendors` | List vendors PENDING | ⬜ |
| Review application | Click vendor | Chi tiết shop info | ⬜ |
| Approve vendor | Click "Duyệt" | Status → APPROVED | ⬜ |
| Reject vendor | Click "Từ chối" + reason | Status → REJECTED | ⬜ |
| Suspend vendor | Chọn vendor APPROVED, suspend | Status → SUSPENDED | ⬜ |
| Approved vendor can sell | Login vendor đã approve | Access `/vendor` thành công | ⬜ |
| Suspended vendor blocked | Login vendor bị suspend | Redirect hoặc error message | ⬜ |

### 5.3 Category Management

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View categories | Vào `/admin/categories` | List categories | ⬜ |
| Create category | Add name, slug, image | Category created | ⬜ |
| Edit category | Change name, save | Updated | ⬜ |
| Delete category | Delete category không có products | Deleted | ⬜ |
| Cannot delete if has products | Delete category có products | Error message | ⬜ |

### 5.4 Order Oversight

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| View all orders | Vào `/admin/orders` | All orders in system | ⬜ |
| Filter by vendor | Select vendor | Filtered | ⬜ |
| Filter by status | Select status | Filtered | ⬜ |
| View order detail | Click order | Full detail với vendor info | ⬜ |

---

## 6. Payment Integration

### 6.1 Stripe (Test Mode)

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Select Stripe | Chọn "Thanh toán thẻ" | Stripe form appears | ⬜ |
| Test card success | Card: `4242 4242 4242 4242` | Payment success, order created | ⬜ |
| Test card declined | Card: `4000 0000 0000 0002` | Error "Card declined" | ⬜ |
| Test card 3DS | Card: `4000 0025 0000 3155` | 3DS popup, then success | ⬜ |
| Cancel payment | Close Stripe, quay lại | Cart vẫn còn, không tạo order | ⬜ |
| Webhook received | Check order sau payment | Status: PENDING (không phải PENDING_PAYMENT) | ⬜ |

**Test Cards:** https://stripe.com/docs/testing

---

## 7. Image Upload

### 7.1 Product Images

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Upload single image | Select 1 file | Preview hiển thị | ⬜ |
| Upload multiple | Select nhiều files | All previews | ⬜ |
| Drag and drop | Drag file vào zone | Upload works | ⬜ |
| Reorder images | Drag to reorder | Order saved | ⬜ |
| Delete image | Click X trên preview | Removed | ⬜ |
| Large file | Upload > 5MB | Error "File quá lớn" | ⬜ |
| Invalid format | Upload .pdf | Error "Chỉ hỗ trợ ảnh" | ⬜ |
| Cloudinary upload | Save product | Images có Cloudinary URL | ⬜ |

### 7.2 Avatar/Logo

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Upload avatar | Profile → change avatar | New avatar displays | ⬜ |
| Upload shop logo | Vendor settings → logo | Logo updated | ⬜ |
| Crop/resize | Upload large image | Auto-resized | ⬜ |

---

## 8. Responsive & Cross-Browser

### 8.1 Responsive Breakpoints

| Screen | Test Pages | Status |
|--------|------------|--------|
| Mobile (< 640px) | Home, Products, Cart, Checkout | ⬜ |
| Tablet (640-1024px) | Home, Products, Vendor Dashboard | ⬜ |
| Desktop (> 1024px) | All pages | ⬜ |

### 8.2 Mobile-Specific

| Test Case | Expected | Status |
|-----------|----------|--------|
| Navigation hamburger | Menu opens/closes | ⬜ |
| Cart sheet | Full-screen on mobile | ⬜ |
| Product images | Swipeable gallery | ⬜ |
| Forms | Keyboard doesn't cover inputs | ⬜ |
| Touch targets | Buttons ≥ 44px | ⬜ |

### 8.3 Cross-Browser

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ⬜ |
| Firefox | Latest | ⬜ |
| Safari | Latest | ⬜ |
| Edge | Latest | ⬜ |
| Mobile Safari (iOS) | Latest | ⬜ |
| Chrome Mobile (Android) | Latest | ⬜ |

---

## 9. Error Handling

### 9.1 Network Errors

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Offline mode | Disconnect network, navigate | Error page hoặc offline indicator | ⬜ |
| API timeout | Slow network | Loading state, then retry option | ⬜ |
| Submit form offline | Fill form, disconnect, submit | Error message, data preserved | ⬜ |

### 9.2 Validation Errors

| Test Case | Expected | Status |
|-----------|----------|--------|
| Form errors visible | Red border, error text below field | ⬜ |
| Focus on first error | Auto-scroll to first error | ⬜ |
| Clear error on fix | Error disappears when fixed | ⬜ |

### 9.3 Server Errors

| Test Case | Expected | Status |
|-----------|----------|--------|
| 404 page | Custom 404 với link về home | ⬜ |
| 500 error | Friendly error message, không show stack trace | ⬜ |
| Rate limit | "Quá nhiều request, thử lại sau" | ⬜ |

---

## 10. Performance

### 10.1 Page Load

| Page | Target | Actual | Status |
|------|--------|--------|--------|
| Homepage | < 3s | ___ s | ⬜ |
| Product listing | < 2s | ___ s | ⬜ |
| Product detail | < 2s | ___ s | ⬜ |
| Checkout | < 2s | ___ s | ⬜ |
| Vendor dashboard | < 3s | ___ s | ⬜ |

### 10.2 Interactions

| Action | Target | Status |
|--------|--------|--------|
| Add to cart | Instant feedback (< 100ms) | ⬜ |
| Search autocomplete | < 300ms after typing stops | ⬜ |
| Filter products | < 500ms | ⬜ |
| Submit order | Loading state, < 5s total | ⬜ |

### 10.3 Images

| Test | Expected | Status |
|------|----------|--------|
| Lazy loading | Images below fold load on scroll | ⬜ |
| Placeholder | Skeleton/blur while loading | ⬜ |
| Responsive images | Serve appropriate size | ⬜ |

---

## 📝 Notes

### Khi tìm thấy bug

1. Screenshot/video lỗi
2. Steps to reproduce
3. Expected vs Actual
4. Browser/device info
5. Console errors (nếu có)

### Sau khi test xong

- [ ] Tất cả checklist items passed
- [ ] Không có critical bugs
- [ ] Performance acceptable
- [ ] Cross-browser OK
- [ ] Mobile OK

---

## 🔗 Related Documentation

- [TESTING.md](./TESTING.md) - Automated tests
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy process
