# 🛠️ Vendoor - Commands Reference

> Tất cả lệnh sử dụng trong dự án, giải thích chi tiết.

## 📦 Package Manager (pnpm)

### Tại sao dùng pnpm?

- **Nhanh hơn npm 2-3x** nhờ caching và symlinks
- **Tiết kiệm disk** - packages dùng chung, không copy
- **Strict** - chỉ thấy deps đã khai báo trong package.json

### So sánh syntax

| Mục đích          | npm                     | pnpm                         |
| ----------------- | ----------------------- | ---------------------------- |
| Install all       | `npm install`           | `pnpm install`               |
| Add package       | `npm install lodash`    | `pnpm add lodash`            |
| Add dev dep       | `npm install -D vitest` | `pnpm add -D vitest`         |
| Remove            | `npm uninstall lodash`  | `pnpm remove lodash`         |
| Run script        | `npm run dev`           | `pnpm dev` (hoặc `pnpm run`) |
| Execute binary    | `npx prisma`            | `pnpm exec prisma`           |
| Run once (remote) | `npx create-next-app`   | `pnpm dlx create-next-app`   |
| Global install    | `npm install -g pkg`    | `pnpm add -g pkg`            |
| Update deps       | `npm update`            | `pnpm update`                |
| List outdated     | `npm outdated`          | `pnpm outdated`              |

---

## 🚀 Development

```bash
# Start dev server (Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## 🗄️ Database (Prisma)

```bash
# Mở Prisma Studio (GUI xem data)
pnpm db:studio

# Seed database với data mẫu
pnpm db:seed

# Reset database (xóa sạch + re-migrate + seed)
pnpm db:reset

# Generate Prisma Client (sau khi sửa schema)
npx prisma generate

# Tạo migration mới
npx prisma migrate dev --name <tên_migration>

# Check migration status
npx prisma migrate status

# Deploy migrations (production)
npx prisma migrate deploy
```

### Lưu ý Prisma với pnpm

```bash
# ⚠️ KHÔNG dùng: pnpm dlx prisma generate
# Lý do: pnpm dlx dùng Prisma 7 (latest) có breaking changes

# ✅ Dùng npx để chạy local version (6.19.0)
npx prisma generate
npx prisma migrate dev
```

---

## 🧪 Testing

### Unit & Integration Tests (Vitest)

```bash
# Chạy tests (watch mode - tự re-run khi file thay đổi)
pnpm test

# Chạy một lần rồi exit
pnpm test -- --run

# UI mode (xem tests trong browser)
pnpm test:ui

# Chạy với coverage report
pnpm test:coverage

# Chạy test file cụ thể
pnpm test format.test.ts

# Chạy tests matching pattern
pnpm test -- --grep "formatPrice"
```

### E2E Tests (Playwright)

```bash
# Chạy tất cả E2E tests (headless)
pnpm test:e2e

# UI mode (debug step-by-step)
pnpm test:e2e:ui

# Xem HTML report sau khi chạy
pnpm test:e2e:report

# Chạy test file cụ thể
pnpm test:e2e auth.spec.ts

# Chạy với headed browser (nhìn thấy browser)
pnpm test:e2e -- --headed

# Debug mode (pause at each step)
pnpm test:e2e -- --debug
```

---

## 🔧 Utility Commands

```bash
# Check TypeScript errors
pnpm exec tsc --noEmit

# Format code với Prettier (nếu có)
pnpm exec prettier --write .

# Xem dependency tree
pnpm why <package-name>

# Clean install (xóa sạch và cài lại)
rm -rf node_modules && pnpm install

# Update pnpm-lock.yaml sau khi sửa package.json
pnpm install
```

---

## 📋 Script Reference (package.json)

| Script            | Command                  | Mô tả                    |
| ----------------- | ------------------------ | ------------------------ |
| `dev`             | `next dev`               | Dev server với Turbopack |
| `build`           | `next build`             | Build production         |
| `start`           | `next start`             | Start production server  |
| `lint`            | `eslint`                 | Lint code                |
| `test`            | `vitest`                 | Unit tests (watch mode)  |
| `test:ui`         | `vitest --ui`            | Vitest UI mode           |
| `test:coverage`   | `vitest run --coverage`  | Tests với coverage       |
| `test:e2e`        | `playwright test`        | E2E tests                |
| `test:e2e:ui`     | `playwright test --ui`   | Playwright UI mode       |
| `test:e2e:report` | `playwright show-report` | Xem E2E report           |
| `db:seed`         | `tsx prisma/seed.ts`     | Seed database            |
| `db:reset`        | `prisma migrate reset`   | Reset database           |
| `db:studio`       | `prisma studio`          | Mở Prisma Studio         |

---

## 🌐 Environment

```bash
# Xem biến môi trường (Windows)
echo %DATABASE_URL%

# Xem biến môi trường (Bash/Git Bash)
echo $DATABASE_URL

# Load .env manually (nếu cần)
# Next.js tự động load .env, .env.local
```

---

## 💡 Tips

### 1. pnpm vs npm trong scripts

```bash
# Đều hoạt động
pnpm dev
pnpm run dev

# Nhưng pnpm cho phép bỏ "run"
pnpm dev        # ✅ Ngắn hơn
npm run dev     # npm bắt buộc "run"
```

### 2. Pass arguments qua script

```bash
# Cần -- để pass args
pnpm test -- --run
pnpm test:e2e -- --headed
```

### 3. Xem output dài

```bash
# Pipe qua less để scroll
pnpm outdated | less
```

### 4. Debug Prisma

```bash
# Xem SQL queries
DEBUG="prisma:query" pnpm dev
```

---

# Project Commands

## Development

```bash
pnpm dev        # Start dev server (localhost:3000)
pnpm build      # Build production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Testing

```bash
# Unit Tests (Vitest)
pnpm test              # Watch mode
pnpm test:run          # Run once
pnpm test:coverage     # With coverage

# E2E Tests (Playwright)
pnpm test:e2e                      # Run all
pnpm exec playwright test --ui     # UI Mode (interactive)
pnpm exec playwright show-report   # View HTML report
pnpm exec playwright test --debug  # Debug mode
pnpm exec playwright codegen       # Generate test code
```

## Database

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
pnpm db:studio     # Open Prisma Studio
pnpm db:seed       # Seed database
```

## Package Management

```bash
pnpm add <pkg>        # Add dependency
pnpm add -D <pkg>     # Add dev dependency
pnpm remove <pkg>     # Remove package
pnpm update           # Update all packages
```

---

_Last updated: December 3, 2025_
