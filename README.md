# Vendoor - Multi-Vendor E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![FSD](https://img.shields.io/badge/Architecture-FSD-purple)
![Tests](https://img.shields.io/badge/Tests-533%20passing-green)

Sàn thương mại điện tử đa người bán (Multi-Vendor Marketplace) - tương tự Shopee, Lazada.

## 📚 Documentation

| Tài liệu | Mô tả |
|----------|-------|
| **[📖 Full Documentation](./docs/INDEX.md)** | Index tất cả docs |
| [Quick Start](./docs/QUICKSTART.md) | Setup trong 5 phút |
| [Architecture](./docs/ARCHITECTURE.md) | FSD structure |
| [Features](./docs/FEATURES.md) | Tính năng theo role |
| [Database Schema](./docs/DATABASE_SCHEMA.md) | Prisma models |
| [Caching Strategy](./docs/CACHING_STRATEGY.md) | Performance optimization |
| [Testing](./docs/TESTING.md) | Test strategy |

---

## ⚡ Quick Start

```bash
# 1. Clone & cài dependencies
git clone <repo-url>
cd vendoor
pnpm install

# 2. Setup môi trường
cp .env.example .env
# Điền DATABASE_URL, BETTER_AUTH_SECRET, CLOUDINARY_* vào .env

# 3. Khởi tạo database
pnpm prisma migrate dev
pnpm db:seed

# 4. Chạy dự án
pnpm dev
```

Mở http://localhost:3000 🎉

---

## 🛠️ Tech Stack

| Công nghệ         | Phiên bản | Vai trò                  |
| ----------------- | --------- | ------------------------ |
| **Next.js**       | 16        | Framework, App Router    |
| **React**         | 19        | UI Library               |
| **TypeScript**    | 5         | Type Safety              |
| **Prisma**        | 7         | Database ORM             |
| **PostgreSQL**    | -         | Database                 |
| **Better Auth**   | 1.3       | Authentication           |
| **Zustand**       | 5         | Client State (Cart)      |
| **Tanstack Query**| 5         | Server State             |
| **Tailwind**      | 4         | Styling                  |
| **Shadcn/UI**     | -         | UI Components            |
| **Cloudinary**    | -         | Image Optimization       |
| **Stripe**        | -         | Payment Processing       |
| **Open AI**     | -         | AI Product Descriptions  |
| **Vitest**        | 4         | Unit/Integration Testing |
| **Playwright**    | 1.57      | E2E Testing              |

---

## 🏗️ Architecture (Feature-Sliced Design)

```
src/
├── app/          # Routing (Next.js App Router)
├── widgets/      # Page sections (Header, Footer, ProductGrid, CheckoutPage)
├── features/     # User interactions (AddToCart, Checkout, Auth, Wishlist)
├── entities/     # Business objects (Product, Order, Cart, User, Vendor)
└── shared/       # Shared code (UI components, utils, hooks, constants)
```

**Quy tắc:** `app → widgets → features → entities → shared` (import từ trên xuống)

### Layer Details

| Layer | Chứa gì | Ví dụ |
|-------|---------|-------|
| `app/` | Routes, layouts, pages | `(customer)/`, `(vendor)/`, `(admin)/` |
| `widgets/` | Composed UI sections | `Header`, `CheckoutPage`, `ProductGrid` |
| `features/` | Interactive features | `checkout/`, `wishlist/`, `auth/` |
| `entities/` | Business logic + UI | `product/`, `order/`, `cart/`, `vendor/` |
| `shared/` | Reusable code | `ui/`, `lib/`, `hooks/`, `constants/` |

---

## ✨ Features

### 👤 Customer
- Xem & tìm kiếm sản phẩm (filter, sort, pagination)
- Giỏ hàng (persist localStorage)
- Wishlist (yêu thích)
- Checkout (COD & Stripe)
- Theo dõi đơn hàng
- Đánh giá sản phẩm

### 🏪 Vendor
- Dashboard analytics
- Quản lý sản phẩm (CRUD, variants, images)
- AI-powered product descriptions
- Quản lý đơn hàng
- Quản lý tồn kho
- Phản hồi đánh giá

### 🔐 Admin
- Approve/Reject vendors
- Quản lý categories
- Quản lý đơn hàng toàn hệ thống
- Dashboard tổng quan

---

## 📜 Scripts

| Lệnh | Mô tả |
| ---- | ----- |
| `pnpm dev` | Dev server (http://localhost:3000) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Unit & Integration tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm test:coverage` | Test với coverage report |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:studio` | Prisma Studio (GUI database) |
| `pnpm db:seed` | Seed sample data |
| `pnpm db:reset` | Reset database |

---

## 🧪 Testing

**35 test files, 533 tests passing**

| Type | Tools | Coverage |
|------|-------|----------|
| Unit | Vitest | Entities, Features, Shared utils |
| Integration | Vitest | Checkout flow, Inventory, Analytics |
| E2E | Playwright | Auth, Customer journey, Vendor flow, Admin flow |

```bash
# Chạy tất cả tests
pnpm test

# Chạy E2E tests
pnpm test:e2e

# Watch mode
pnpm test -- --watch
```

---

## 👤 Test Accounts

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `admin@vendoor.com` | `Kiet1461!` |
| Vendor | `vendor@vendoor.com` | `Kiet1461!` |
| Customer | `customer@vendoor.com` | `Kiet1461!` |

---

## 🗄️ Database Schema

```
User ─────┬───── VendorProfile ───── Product ───── ProductVariant
          │                              │              │
          │                              ├──── ProductImage
          │                              │
          ├───── Order ─────────────── OrderItem
          │         │
          │         └──── ShippingAddress
          │
          ├───── Review (rating, comment, vendor reply)
          │
          ├───── Wishlist
          │
          └───── Cart (client-side, Zustand)
          
Category ───── Product
```

### Key Relations
- **User** có thể là Customer, Vendor, hoặc Admin (roles)
- **VendorProfile** 1:1 với User (khi được approve)
- **Product** thuộc 1 Vendor, 1 Category
- **ProductVariant** chứa price, stock, SKU
- **Order** chứa nhiều OrderItem từ nhiều Vendor

---

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/vendoor"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary (Image upload)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (Payment - optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Google OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## 📦 Import Conventions

```typescript
// Entities - business objects
import { ProductCard } from "@/entities/product";
import { useCart } from "@/entities/cart";
import { OrderStatusBadge } from "@/entities/order";

// Features - user interactions
import { AddToCartButton } from "@/features/checkout";
import { WishlistButton } from "@/features/wishlist";

// Widgets - composed sections
import { Header } from "@/widgets/header";
import { CheckoutPage } from "@/widgets/checkout";

// Shared - reusable code
import { Button, Card, Input } from "@/shared/ui";
import { formatPrice, generateId } from "@/shared/lib";
```

---

## 📁 Key Files

| File | Mô tả |
|------|-------|
| `prisma/schema.prisma` | Database schema |
| `src/shared/lib/auth/` | Better Auth config |
| `src/shared/lib/db.ts` | Prisma client |
| `src/entities/cart/model/store.ts` | Cart Zustand store |
| `src/features/checkout/api/actions.ts` | Checkout server actions |

---

## 📝 License

MIT
