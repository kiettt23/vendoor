# 🏗️ Vendoor - Feature-Based Architecture

> Multi-vendor e-commerce platform built with Next.js 16 App Router

## 📁 Project Structure

```
vendoor/
├── app/                    # Next.js App Router (Pages & Layouts)
├── features/               # Feature-based modules
│   ├── auth/              # Authentication & Authorization
│   ├── products/          # Product catalog & management
│   ├── cart/              # Shopping cart (Server State)
│   ├── orders/            # Order management
│   ├── stores/            # Multi-vendor store management
│   ├── coupons/           # Coupon & discount system
│   ├── address/           # User address management
│   └── ratings/           # Product ratings & reviews
├── shared/                # Shared utilities & components
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── hooks/            # Shared React hooks
│   └── types/            # Shared TypeScript types
├── components/            # Legacy components (to be migrated)
├── lib/                   # Legacy lib (to be migrated)
└── prisma/               # Database schema & migrations
```

## 🎯 Feature Structure Convention

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/
│   ├── client/            # Client Components ("use client")
│   │   └── *.client.tsx
│   └── server/            # Server Components (RSC)
│       └── *.server.tsx
├── actions/               # Server Actions (mutations)
│   └── *.action.ts
├── queries/               # Data fetching (reads)
│   └── *.query.ts
├── hooks/                 # Client hooks
│   └── use*.ts
├── schemas/               # Zod validation
│   └── *.schema.ts
├── types/                 # TypeScript types
│   └── *.types.ts
├── index.client.ts        # Client exports
├── index.server.ts        # Server exports
└── README.md             # Feature documentation
```

## 🚀 Key Features

### ✅ Completed Refactoring (Phases 0-8)

1. **Phase 0**: Setup folder structure
2. **Phase 1**: Auth feature migration
3. **Phase 2**: Products feature migration
4. **Phase 3**: Cart feature (Redux → Server State)
5. **Phase 4**: Orders feature migration
6. **Phase 5**: Stores feature migration
7. **Phase 6**: Coupons feature migration
8. **Phase 7**: Address & Ratings migration
9. **Phase 8**: Shared layer creation

### 🎨 Architecture Highlights

- **Feature-Based**: Modular, scalable architecture
- **Client/Server Separation**: Clear `.client.tsx` / `.server.tsx` naming
- **Server Actions**: No API routes, direct server mutations
- **Type Safety**: Full TypeScript with Zod validation
- **Server State**: Cart migrated from Redux to Server State with optimistic updates
- **Barrel Exports**: Clean imports via `index.client.ts` / `index.server.ts`

## 📚 Import Conventions

```typescript
// Client Components
import { Component, useHook } from "@/features/[feature]/index.client";

// Server Components & Actions
import { ServerAction, query } from "@/features/[feature]/index.server";

// Shared utilities
import { formatPrice, cn } from "@/shared/lib";
import { Button, Card } from "@/shared/components/ui";
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Better Auth 1.3.34
- **Database**: PostgreSQL (Neon) + Prisma 6.16.3
- **State**: Server State (React 19 + Server Actions)
- **Validation**: Zod
- **UI**: Shadcn UI + Tailwind CSS
- **Payments**: Stripe
- **Image Optimization**: ImageKit

## 📖 Documentation

- See individual feature `README.md` files for detailed documentation
- Import path changes documented in git commits
- Type definitions in `features/[feature]/types/`

## 🚦 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run type-check

# Database
npx prisma studio
npx prisma migrate dev
```

## 📝 Notes

- **Backward Compatibility**: Old imports still work during transition
- **Progressive Migration**: Features migrated incrementally
- **Zero Breaking Changes**: All existing functionality preserved
- **Type Safety**: Full TypeScript coverage across all features

---

Last Updated: November 11, 2025
Branch: refactor/fbd
