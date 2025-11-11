# 📋 Feature Structure Convention

Mỗi feature trong Vendoor tuân theo quy ước **2-file barrel exports**:

---

## 📁 Standard Feature Structure

```
features/
├── [feature-name]/
│   ├── components/
│   │   ├── client/              # Client Components ("use client")
│   │   │   └── *.client.tsx
│   │   └── server/              # Server Components (RSC)
│   │       └── *.server.tsx
│   │
│   ├── actions/                 # Server Actions (mutations)
│   │   └── *.action.ts
│   │
│   ├── queries/                 # Data fetching (reads) - OPTIONAL
│   │   └── *.query.ts
│   │
│   ├── hooks/                   # Client hooks
│   │   └── use*.ts
│   │
│   ├── schemas/                 # Zod validation
│   │   └── *.schema.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── *.types.ts
│   │
│   ├── index.client.ts          # ⭐ Client barrel export
│   ├── index.server.ts          # ⭐ Server barrel export
│   ├── index.ts                 # ⭐ Main barrel (re-exports both)
│   └── README.md                # Feature documentation
```

---

## ⭐ The 2-File Convention

### 1. `index.client.ts` - Client Exports

**Chỉ chứa**:

- Client Components (`"use client"`)
- Client Hooks
- Client utilities

```typescript
/**
 * Feature Name - Client Components & Hooks
 * Import from: @/features/[feature]/index.client
 */

// Client Components
export { ComponentName } from "./components/client/ComponentName.client";

// Client Hooks
export { useHookName } from "./hooks/useHookName";
```

**Usage**:

```typescript
// In Client Component
"use client";
import { ComponentName, useHookName } from "@/features/[feature]/index.client";
```

---

### 2. `index.server.ts` - Server Exports

**Chỉ chứa**:

- Server Components (RSC)
- Server Actions
- Queries (data fetching)
- Server utilities

```typescript
/**
 * Feature Name - Server Components & Utilities
 * Import from: @/features/[feature]/index.server
 *
 * ⚠️ Server-only imports - DO NOT import in client components
 */

// Server Components
export { ServerComponent } from "./components/server/ServerComponent.server";

// Server Actions
export { createAction } from "./actions/create.action";

// Queries
export { getQuery } from "./queries/get.query";
```

**Usage**:

```typescript
// In Server Component
import { ServerComponent, getQuery } from "@/features/[feature]/index.server";

export default async function Page() {
  const data = await getQuery();
  return <ServerComponent data={data} />;
}
```

---

### 3. `index.ts` - Main Barrel (Optional)

**Chỉ chứa**:

- Shared types
- Shared schemas
- Re-exports từ `.client` và `.server`

```typescript
/**
 * Feature Name - Main Barrel Export
 *
 * Usage:
 * - Client: import from '@/features/[feature]/index.client'
 * - Server: import from '@/features/[feature]/index.server'
 * - Shared: import from '@/features/[feature]'
 */

// Schemas
export { schema } from "./schemas/schema.schema";

// Types
export type { Type } from "./types/type.types";

// Re-exports
export * from "./index.client";
export * from "./index.server";
```

**Usage**:

```typescript
// Import shared types/schemas
import { schema, type Type } from "@/features/[feature]";

// Or use main barrel (auto re-exports client & server)
import { ClientComponent, ServerAction } from "@/features/[feature]";
```

---

## 🎯 Why This Convention?

### ✅ Advantages:

1. **Clear Separation**: Rõ ràng client/server boundaries
2. **Import Clarity**: Nhìn import path biết ngay client hay server
3. **Tree Shaking**: Better code splitting
4. **No Confusion**: Không bao giờ nhầm import server code vào client
5. **Simple**: Chỉ 2 files chính, dễ maintain

### ⚠️ Rules:

1. **Client Component** → import from `.index.client`
2. **Server Component** → import from `.index.server`
3. **Shared types/schemas** → import from main `index.ts`
4. **NEVER** import `.server` trong client component

---

## 📝 Examples

### Auth Feature:

```typescript
// Client
import { SignInForm, UserButton } from "@/features/auth/index.client";

// Server
import { requireAuth, getCurrentUser } from "@/features/auth/index.server";

// Shared
import { type AuthUser, signInSchema } from "@/features/auth";
```

### Products Feature:

```typescript
// Client
import {
  ProductCard,
  useProductFilters,
} from "@/features/products/index.client";

// Server
import { LatestProducts, getProducts } from "@/features/products/index.server";

// Shared
import { type Product, productSchema } from "@/features/products";
```

---

## 🛠️ Creating New Feature

### Template:

```bash
# Create structure
mkdir -p features/new-feature/{components/{client,server},actions,queries,hooks,schemas,types}

# Create barrel exports
touch features/new-feature/index.client.ts
touch features/new-feature/index.server.ts
touch features/new-feature/index.ts
touch features/new-feature/README.md
```

### Fill in templates:

Copy from existing features (`auth`, `products`, `cart`) and modify.

---

Last Updated: November 11, 2025
