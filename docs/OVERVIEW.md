# Vendoor - Tổng Quan Dự Án

## 🎯 Giới thiệu

**Vendoor** là một **Multi-Vendor Marketplace** (sàn thương mại điện tử đa người bán) tương tự như Shopee, Lazada. Nền tảng cho phép:

- **Nhiều vendor** (người bán) đăng ký và bán hàng
- **Khách hàng** mua sắm từ nhiều shop khác nhau
- **Admin** quản lý toàn bộ hệ thống

---

## 🛠️ Tech Stack

### Core Framework

| Công nghệ      | Version | Vai trò              | Tại sao chọn                                  |
| -------------- | ------- | -------------------- | --------------------------------------------- |
| **Next.js**    | 16      | Full-stack framework | App Router, Server Components, Server Actions |
| **React**      | 19      | UI Library           | Concurrent features, Server Components        |
| **TypeScript** | 5       | Type Safety          | Catch errors at compile time                  |

### Database & ORM

| Công nghệ      | Version | Vai trò  | Tại sao chọn                                 |
| -------------- | ------- | -------- | -------------------------------------------- |
| **PostgreSQL** | -       | Database | Relational, ACID, scalable                   |
| **Prisma**     | 7       | ORM      | Type-safe queries, migrations, Prisma Studio |

### Authentication

| Công nghệ       | Version | Vai trò        | Tại sao chọn                       |
| --------------- | ------- | -------------- | ---------------------------------- |
| **Better Auth** | 1.3     | Authentication | Flexible, modern, TypeScript-first |

### State Management

| Công nghệ          | Version | Vai trò             | Tại sao chọn                    |
| ------------------ | ------- | ------------------- | ------------------------------- |
| **Zustand**        | 5       | Client state (Cart) | Simple, persist to localStorage |
| **TanStack Query** | 5       | Server state        | Caching, mutations, devtools    |

### UI & Styling

| Công nghệ        | Version | Vai trò       | Tại sao chọn                         |
| ---------------- | ------- | ------------- | ------------------------------------ |
| **Tailwind CSS** | 4       | Styling       | Utility-first, consistent design     |
| **Shadcn/UI**    | -       | UI Components | Accessible, customizable, copy-paste |
| **Lucide React** | -       | Icons         | Consistent icon set                  |

### External Services

| Công nghệ      | Vai trò   | Tại sao chọn                       |
| -------------- | --------- | ---------------------------------- |
| **Cloudinary** | Image CDN | Upload, transform, optimize images |
| **Stripe**     | Payment   | Global, secure, well-documented    |

### Testing

| Công nghệ           | Version | Vai trò                  |
| ------------------- | ------- | ------------------------ |
| **Vitest**          | 4       | Unit & Integration tests |
| **Playwright**      | 1.57    | E2E tests                |
| **Testing Library** | -       | Component testing        |

---

## 👥 Vai trò người dùng

### 👤 Customer (Khách hàng)

- Xem & tìm kiếm sản phẩm (filter, sort, pagination)
- Giỏ hàng (persist localStorage)
- Wishlist (yêu thích)
- Checkout (COD & Stripe)
- Theo dõi đơn hàng
- Đánh giá sản phẩm

### 🏪 Vendor (Người bán)

- Dashboard analytics (thống kê doanh thu, đơn hàng)
- Quản lý sản phẩm (CRUD, variants, images)
- Quản lý đơn hàng (cập nhật status, tracking)
- Quản lý tồn kho
- Phản hồi đánh giá của khách

### 🔐 Admin (Quản trị viên)

- Approve/Reject vendor đăng ký
- Quản lý categories
- Quản lý đơn hàng toàn hệ thống
- Dashboard tổng quan (revenue, users, orders)

---

## 💰 Business Model

### Commission System

- Platform thu **2% phí** trên mỗi đơn hàng (`PLATFORM_FEE_RATE = 0.02`)
- Vendor commission mặc định **10%** (có thể điều chỉnh)
- Phí ship: **30,000 VND/vendor** trong đơn hàng

```
platformFee = subtotal × 0.02 (2%)
vendorEarnings = subtotal - platformFee
shippingFee = 30,000 × số vendor trong đơn
```

Xem chi tiết tại [BUSINESS_LOGIC.md](./BUSINESS_LOGIC.md).

### Payment Methods

- **COD** (Cash on Delivery): Thanh toán khi nhận hàng
- **Stripe**: Thanh toán online (credit/debit cards)
- VNPay, Momo, ZaloPay: Planned for future

---

## 📜 Scripts

| Lệnh             | Mô tả                                      |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Development server (http://localhost:3000) |
| `pnpm build`     | Production build                           |
| `pnpm start`     | Start production server                    |
| `pnpm test`      | Unit & Integration tests (Vitest)          |
| `pnpm test:e2e`  | E2E tests (Playwright)                     |
| `pnpm lint`      | ESLint check                               |
| `pnpm typecheck` | TypeScript check                           |
| `pnpm db:studio` | Prisma Studio (GUI database)               |
| `pnpm db:seed`   | Seed sample data                           |
| `pnpm db:reset`  | Reset database                             |

---

## 🧪 Testing Stats

| Type        | Files | Tests | Tools      |
| ----------- | ----- | ----- | ---------- |
| Unit        | 7     | 215   | Vitest     |
| Integration | 4     | 78    | Vitest     |
| E2E         | 3     | ~35   | Playwright |
| **Total**   | **14**| **293+** |         |

**Coverage:**
- Unit: Format, ID generation, Order/Cart/Product utils, Schema validation
- Integration: Checkout flow, Auth guards, Inventory management
- E2E: Auth, Customer journey, Vendor flow

Xem chi tiết tại [TESTING.md](./TESTING.md) và [MANUAL_TESTING.md](./MANUAL_TESTING.md).
