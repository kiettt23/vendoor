# ⚡ Quick Start Guide

Hướng dẫn nhanh để bắt đầu làm việc với dự án Vendoor.

---

## 🚀 Setup trong 5 phút

### 1. Clone & Install

```bash
git clone https://github.com/kiettt23/vendoor.git
cd vendoor
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Cần điền:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="generate-a-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"

# Stripe (optional for payment)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup

```bash
pnpm db:push    # Push schema to database
pnpm db:seed    # Seed sample data
```

### 4. Run Development Server

```bash
pnpm dev
```

Mở http://localhost:3000

---

## 🧪 Test Accounts (After Seeding)

| Role     | Email             | Password    |
| -------- | ----------------- | ----------- |
| Customer | customer@test.com | password123 |
| Vendor   | vendor@test.com   | password123 |
| Admin    | admin@test.com    | password123 |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (customer)/        # Customer routes
│   ├── (vendor)/          # Vendor routes (protected)
│   └── (admin)/           # Admin routes (protected)
├── widgets/               # Page compositions
├── features/              # User interactions
├── entities/              # Business objects
└── shared/                # Utilities, UI components
```

**FSD Layer Rule:** Higher layers chỉ import từ lower layers.

```
app/ → widgets/ → features/ → entities/ → shared/
```

---

## 🛠️ Common Commands

### Development

| Command          | Description      |
| ---------------- | ---------------- |
| `pnpm dev`       | Start dev server |
| `pnpm build`     | Production build |
| `pnpm lint`      | Run ESLint       |
| `pnpm typecheck` | TypeScript check |

### Database

| Command           | Description         |
| ----------------- | ------------------- |
| `pnpm db:push`    | Push schema changes |
| `pnpm db:studio`  | Open Prisma Studio  |
| `pnpm db:seed`    | Seed sample data    |
| `pnpm db:migrate` | Run migrations      |

### Testing

| Command              | Description                |
| -------------------- | -------------------------- |
| `pnpm test`          | Run unit tests             |
| `pnpm test:watch`    | Watch mode                 |
| `pnpm test:coverage` | Coverage report            |
| `pnpm test:e2e`      | E2E tests (cần dev server) |

---

## 📖 Documentation Index

| File                                     | Nội dung                      |
| ---------------------------------------- | ----------------------------- |
| [FEATURES.md](./FEATURES.md)             | Danh sách tính năng theo role |
| [ARCHITECTURE.md](./ARCHITECTURE.md)     | Kiến trúc FSD                 |
| [CODE_MAP.md](./CODE_MAP.md)             | Bản đồ code - file nào làm gì |
| [USER_FLOWS.md](./USER_FLOWS.md)         | Luồng người dùng              |
| [TESTING.md](./TESTING.md)               | Test coverage                 |
| [MANUAL_TESTING.md](./MANUAL_TESTING.md) | Manual test checklist         |
| [COMMANDS.md](./COMMANDS.md)             | Chi tiết commands             |
| [STRIPE_SETUP.md](./STRIPE_SETUP.md)     | Hướng dẫn setup Stripe        |

---

## 🎯 Common Tasks

### Thêm tính năng mới

1. Xác định layer (feature/entity/shared)
2. Tạo folder structure:
   ```
   src/features/[feature-name]/
   ├── api/
   │   ├── actions.ts    # Server actions
   │   └── queries.ts    # Data fetching
   ├── model/
   │   ├── schema.ts     # Zod schemas
   │   └── types.ts      # TypeScript types
   └── ui/
       └── Component.tsx
   ```
3. Export qua `index.ts`
4. Viết tests

### Thêm component UI

1. Nếu dùng lại nhiều nơi → `src/shared/ui/`
2. Nếu specific cho entity → `src/entities/[name]/ui/`
3. Nếu specific cho feature → `src/features/[name]/ui/`

### Thêm API endpoint

1. Server Actions (preferred): `src/features/[name]/api/actions.ts`
2. API Routes (webhooks, external): `src/app/api/[route]/route.ts`

### Debug

```bash
# Check TypeScript errors
pnpm typecheck

# Check lint errors
pnpm lint

# Open Prisma Studio
pnpm db:studio

# Run specific test
pnpm test [file-name]
```

---

## 🔍 Tìm Code Nhanh

### Theo tính năng

| Feature   | Location                             |
| --------- | ------------------------------------ |
| Cart      | `src/entities/cart/`                 |
| Checkout  | `src/features/checkout/`             |
| Product   | `src/entities/product/`              |
| Review    | `src/features/review/`               |
| Inventory | `src/features/inventory-management/` |
| Analytics | `src/features/vendor-analytics/`     |
| Auth      | `src/features/auth/`                 |

### Theo UI component

| Component           | Location                     |
| ------------------- | ---------------------------- |
| Button, Input, etc. | `src/shared/ui/` (shadcn/ui) |
| ProductCard         | `src/entities/product/ui/`   |
| CartDrawer          | `src/entities/cart/ui/`      |
| Header, Footer      | `src/widgets/layout/`        |

### Theo utility

| Utility              | Location                         |
| -------------------- | -------------------------------- |
| Format (price, date) | `src/shared/lib/utils/format.ts` |
| Validation           | `src/shared/lib/validation/`     |
| Constants            | `src/shared/lib/constants/`      |
| Result pattern       | `src/shared/lib/utils/result.ts` |

---

## 🐛 Troubleshooting

### Database connection error

```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
pnpm db:push
```

### Prisma client not found

```bash
pnpm prisma generate
```

### Port 3000 in use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
pnpm dev -- -p 3001
```

### Hydration mismatch

- Check server/client data consistency
- Ensure dates are serialized properly
- Avoid browser-only APIs in SSR

### Test failures

```bash
# Clear cache and re-run
rm -rf .vitest
pnpm test
```

---

## 📞 Need Help?

1. Check [CODE_MAP.md](./CODE_MAP.md) để tìm file
2. Check [FEATURES.md](./FEATURES.md) để hiểu tính năng
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) để hiểu cấu trúc
4. Search codebase với `grep` hoặc IDE search

---

_Last updated: December 3, 2025_
