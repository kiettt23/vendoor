# Vendoor - Multi-Vendor E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![FSD](https://img.shields.io/badge/Architecture-FSD-purple)

Sàn thương mại điện tử đa người bán (Multi-Vendor Marketplace) - tương tự Shopee, Lazada.

> 🆕 **Người mới?** Đọc [Hướng dẫn cho người mới](docs/GETTING_STARTED.md) để bắt đầu.

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
npx prisma migrate dev
pnpm db:seed

# 4. Chạy dự án
pnpm dev
```

Mở http://localhost:3000 🎉

---

## 🏗️ Cấu trúc dự án (FSD)

```
src/
├── app/          # Routing (Next.js App Router)
├── widgets/      # Các section lớn (Header, Footer, ProductGrid)
├── features/     # Tính năng tương tác (AddToCart, Checkout)
├── entities/     # Đối tượng nghiệp vụ (Product, Order, Cart)
└── shared/       # Code dùng chung (UI, utils, hooks)
```

**Quy tắc:** Layer cao import từ layer thấp, không ngược lại.

---

## 🛠️ Tech Stack

| Công nghệ    | Phiên bản | Vai trò               |
| ------------ | --------- | --------------------- |
| Next.js      | 16        | Framework, App Router |
| React        | 19        | UI Library            |
| TypeScript   | 5         | Type Safety           |
| Prisma       | 6         | Database ORM          |
| PostgreSQL   | -         | Database              |
| Better Auth  | 1.3       | Authentication        |
| Zustand      | 5         | Client State          |
| Tailwind CSS | 4         | Styling               |
| Shadcn/UI    | -         | UI Components         |
| Vitest       | 4         | Unit Testing          |
| Playwright   | 1.57      | E2E Testing           |

---

## 📜 Scripts

| Lệnh             | Mô tả               |
| ---------------- | ------------------- |
| `pnpm dev`       | Chạy dev server     |
| `pnpm build`     | Build production    |
| `pnpm test`      | Chạy unit tests     |
| `pnpm test:e2e`  | Chạy E2E tests      |
| `pnpm db:studio` | Mở GUI xem database |
| `pnpm db:seed`   | Seed data mẫu       |
| `pnpm db:reset`  | Reset database      |

---

## 👤 Tài khoản test

| Vai trò  | Email                  | Password    |
| -------- | ---------------------- | ----------- |
| Admin    | `admin@vendoor.com`    | `Kiet1461!` |
| Vendor   | `vendor@vendoor.com`   | `Kiet1461!` |
| Customer | `customer@vendoor.com` | `Kiet1461!` |

---

## 📚 Documentation

| Tài liệu                                       | Mô tả                                  |
| ---------------------------------------------- | -------------------------------------- |
| [⚡ Quick Start](docs/QUICKSTART.md)           | **Bắt đầu nhanh** - Setup 5 phút       |
| [🗺️ Code Map](docs/CODE_MAP.md)                | **Muốn sửa gì? Xem đây** - Bản đồ code |
| [📐 Architecture](docs/ARCHITECTURE.md)        | Chi tiết cấu trúc FSD                  |
| [🗄️ Database Schema](docs/DATABASE_SCHEMA.md) | **Schema database** - ERD & relations  |
| [✨ Features](docs/FEATURES.md)                | Danh sách tính năng theo role          |
| [🚀 User Flows](docs/USER_FLOWS.md)            | **Luồng người dùng** - Hiểu hệ thống   |
| [🧪 Testing](docs/TESTING.md)                  | Test coverage & automated tests        |
| [🔍 Manual Testing](docs/MANUAL_TESTING.md)    | **Checklist test thủ công** - QA       |
| [🛠️ Commands](docs/COMMANDS.md)                | Tất cả commands hay dùng               |
| [💳 Stripe Setup](docs/STRIPE_SETUP.md)        | Cấu hình thanh toán Stripe             |

---

## 📦 Import Examples

```typescript
// Entities - đối tượng nghiệp vụ
import { ProductCard } from "@/entities/product";
import { useCartStore } from "@/entities/cart";

// Features - tính năng tương tác
import { AddToCartButton } from "@/features/cart";
import { LoginForm } from "@/features/auth";

// Widgets - section lớn
import { Header } from "@/widgets/header";
import { ProductGrid } from "@/widgets/product-grid";

// Shared - code dùng chung
import { Button, Card } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/utils";
```
