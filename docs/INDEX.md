# 📚 Vendoor Documentation Index

> Tổng hợp tất cả documentation của dự án Vendoor.

---

## 🚀 Bắt Đầu

| Tài liệu | Mô tả |
|----------|-------|
| [Quick Start](./QUICKSTART.md) | Setup dự án trong 5 phút |
| [Commands](./COMMANDS.md) | Danh sách scripts và lệnh thường dùng |
| [Contributing](../CONTRIBUTING.md) | Hướng dẫn đóng góp code |

---

## 🏗️ Kiến Trúc & Cấu Trúc

| Tài liệu | Mô tả |
|----------|-------|
| [Architecture](./ARCHITECTURE.md) | Feature-Sliced Design, layer structure |
| [Code Map](./CODE_MAP.md) | Cấu trúc thư mục chi tiết |
| [Database Schema](./DATABASE_SCHEMA.md) | Prisma models, relations, constraints |
| [API Reference](./API_REFERENCE.md) | Server Actions & Queries documentation |

---

## ⚡ Performance & Optimization

| Tài liệu | Mô tả |
|----------|-------|
| [Caching Strategy](./CACHING_STRATEGY.md) | Multi-layer caching (React Query, unstable_cache, revalidateTag) |

---

## ✨ Tính Năng

| Tài liệu | Mô tả |
|----------|-------|
| [Features](./FEATURES.md) | Danh sách tính năng theo role (Customer, Vendor, Admin) |
| [User Flows](./USER_FLOWS.md) | Luồng xử lý nghiệp vụ (checkout, order lifecycle) |
| [Stripe Setup](./STRIPE_SETUP.md) | Hướng dẫn cấu hình thanh toán Stripe |

---

## 🧪 Testing

| Tài liệu | Mô tả |
|----------|-------|
| [Testing](./TESTING.md) | Strategy, structure, best practices |
| [Manual Testing](./MANUAL_TESTING.md) | Checklist test thủ công |

---

## 📋 Roadmap & Status

| Tài liệu | Mô tả |
|----------|-------|
| [Missing Features](./MISSING_FEATURES.md) | Tính năng chưa implement |
| [Improvements](./IMPROVEMENTS.md) | Cải tiến kỹ thuật cần làm |

---

## 📖 Quick Reference

### Tech Stack

| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| Next.js | 16 | Framework (App Router) |
| React | 19 | UI Library |
| TypeScript | 5 | Type Safety |
| Prisma | 7 | Database ORM |
| PostgreSQL | - | Database |
| Better Auth | 1.3 | Authentication |
| Zustand | 5 | Client State (Cart) |
| Tailwind CSS | 4 | Styling |
| Shadcn/UI | - | UI Components |
| React Query | 5 | Server State |
| Cloudinary | - | Image Optimization |
| Stripe | - | Payment |
| Vitest | 4 | Unit Testing |
| Playwright | 1.57 | E2E Testing |

### FSD Layer Hierarchy

```
src/
├── app/          # Layer 1: Routing & Pages
├── widgets/      # Layer 2: Page sections (Header, Footer)
├── features/     # Layer 3: User interactions (AddToCart, Checkout)
├── entities/     # Layer 4: Business objects (Product, Order, Cart)
└── shared/       # Layer 5: Reusable code (UI, lib, hooks)

Import rule: app → widgets → features → entities → shared
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vendoor.com` | `Kiet1461!` |
| Vendor | `vendor@vendoor.com` | `Kiet1461!` |
| Customer | `customer@vendoor.com` | `Kiet1461!` |

### Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production

# Testing
pnpm test             # Unit tests (Vitest)
pnpm test:e2e         # E2E tests (Playwright)
pnpm test:coverage    # Coverage report

# Database
pnpm db:studio        # Prisma Studio
pnpm db:seed          # Seed sample data
pnpm db:reset         # Reset database
```

### Key Directories

| Path | Mô tả |
|------|-------|
| `src/app/` | Next.js App Router (routes, layouts) |
| `src/entities/` | Business logic: product, order, cart, user, vendor |
| `src/features/` | Interactive features: checkout, wishlist, auth |
| `src/widgets/` | Page sections: header, footer, checkout page |
| `src/shared/ui/` | Shadcn/UI components |
| `src/shared/lib/` | Utilities, constants, auth config |
| `prisma/` | Schema, migrations, seed |
| `tests/` | E2E tests (Playwright) |

---

## 🔗 External Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Query](https://tanstack.com/query/latest)
