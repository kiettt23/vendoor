# Vendoor - Hướng Dẫn Đóng Góp

Hướng dẫn cho developers muốn đóng góp vào dự án Vendoor.

---

## 🚀 Quick Start cho Contributors

### 1. Fork & Clone

```bash
# Fork repo trên GitHub

# Clone về local
git clone https://github.com/YOUR_USERNAME/vendoor.git
cd vendoor
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Điền các biến môi trường cần thiết
```

### 4. Setup Database

```bash
# Dùng Neon (recommended) hoặc local PostgreSQL
pnpm prisma migrate dev
pnpm db:seed
```

### 5. Run Development Server

```bash
pnpm dev
```

---

## 📐 Code Style Guide

### Naming Conventions

| Type               | Convention            | Example               |
| ------------------ | --------------------- | --------------------- |
| **Component**      | PascalCase            | `ProductCard.tsx`     |
| **Hook**           | camelCase, use prefix | `useCart.ts`          |
| **Utility**        | camelCase             | `formatPrice.ts`      |
| **Constant**       | UPPER_SNAKE_CASE      | `CACHE_TAGS`          |
| **Type/Interface** | PascalCase            | `Product`, `CartItem` |
| **Folder**         | kebab-case            | `product-form/`       |

### File Structure trong Feature/Entity

```
feature-name/
├── api/
│   └── actions.ts      # Server Actions
├── ui/
│   └── Component.tsx   # React components
├── model/
│   ├── types.ts        # TypeScript types
│   └── schemas.ts      # Zod schemas
├── lib/
│   └── utils.ts        # Feature utilities
└── index.ts            # Barrel export
```

### Import Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { z } from "zod";
import { toast } from "sonner";

// 3. Internal imports (by layer)
import { ProductCard } from "@/entities/product";
import { AddToCartButton } from "@/features/cart";
import { Button } from "@/shared/ui";
import { formatPrice } from "@/shared/lib/utils";

// 4. Relative imports
import { LocalComponent } from "./LocalComponent";
import type { LocalType } from "./types";
```

### Component Structure

```tsx
// 1. Imports
import { ... } from "...";

// 2. Types (nếu nhỏ, else tách file)
interface Props {
  product: Product;
  onAddToCart?: () => void;
}

// 3. Component
export function ProductCard({ product, onAddToCart }: Props) {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

---

## 🏗️ Architecture Guidelines

### Layer Rules (FSD)

```
✅ app/ có thể import từ widgets/, features/, entities/, shared/
✅ widgets/ có thể import từ features/, entities/, shared/
✅ features/ có thể import từ entities/, shared/
✅ entities/ có thể import từ shared/
✅ shared/ không import từ layer khác

❌ entities/ KHÔNG import từ features/
❌ features/ KHÔNG import từ widgets/
❌ shared/ KHÔNG import từ bất kỳ layer nào khác
```

### Adding New Feature

1. **Tạo folder** trong `src/features/`:

   ```
   src/features/new-feature/
   ├── api/
   │   └── actions.ts
   ├── ui/
   │   └── NewFeatureComponent.tsx
   ├── model/
   │   └── types.ts
   └── index.ts
   ```

2. **Export từ index.ts**:

   ```typescript
   export { NewFeatureComponent } from "./ui";
   export { someAction } from "./api";
   export type { SomeType } from "./model";
   ```

3. **Sử dụng trong app/**:
   ```typescript
   import { NewFeatureComponent } from "@/features/new-feature";
   ```

### Adding New Entity

1. Tạo folder trong `src/entities/`
2. Thêm model vào `prisma/schema.prisma` nếu cần
3. Run `pnpm prisma migrate dev`
4. Implement queries trong `api/queries.ts`
5. Implement actions trong `api/actions.ts`

---

## 🧪 Testing Guidelines

### Running Tests

```bash
# Unit & Integration tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

### Writing Tests

**Unit Test Example:**

```typescript
// entities/product/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { calculateDiscount } from "./utils";

describe("calculateDiscount", () => {
  it("returns correct percentage", () => {
    expect(calculateDiscount(100, 80)).toBe(20);
  });

  it("returns 0 if no discount", () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
```

**Integration Test Example:**

```typescript
// features/checkout/api/actions.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createOrders } from "./actions";

describe("createOrders", () => {
  beforeEach(async () => {
    // Setup test data
  });

  it("creates orders and decrements stock", async () => {
    const result = await createOrders(mockCartItems, mockShipping, "COD");
    expect(result.success).toBe(true);
  });
});
```

---

## 📝 Commit Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type       | Description                   |
| ---------- | ----------------------------- |
| `feat`     | New feature                   |
| `fix`      | Bug fix                       |
| `docs`     | Documentation                 |
| `style`    | Code style (formatting, etc.) |
| `refactor` | Refactoring                   |
| `test`     | Adding tests                  |
| `chore`    | Maintenance                   |

### Examples

```bash
feat(checkout): add Stripe payment integration
fix(cart): prevent adding out-of-stock items
docs(api): add API reference documentation
refactor(product): extract variant logic to separate hook
test(order): add integration tests for order creation
```

---

## 🔄 Pull Request Process

1. **Create branch từ main:**

   ```bash
   git checkout -b feat/new-feature
   ```

2. **Commit changes** theo convention

3. **Push và tạo PR:**

   ```bash
   git push origin feat/new-feature
   ```

4. **PR Template checklist:**

   - [ ] Tests pass (`pnpm test`)
   - [ ] Linting pass (`pnpm lint`)
   - [ ] Type check pass (`pnpm typecheck`)
   - [ ] Documentation updated if needed
   - [ ] No breaking changes (or documented)

5. **Wait for review** và address feedback

---

## 🐛 Reporting Issues

### Bug Report

```markdown
## Description

Brief description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Screenshots

If applicable

## Environment

- OS: Windows 11
- Browser: Chrome 120
- Node: v20.10.0
```

### Feature Request

```markdown
## Problem

What problem does this feature solve?

## Proposed Solution

How would you implement it?

## Alternatives

Other solutions considered

## Additional Context

Screenshots, mockups, etc.
```

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc dự án
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Cấu trúc thư mục
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Technical decisions
