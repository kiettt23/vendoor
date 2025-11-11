# 🏗️ VENDOOR REFACTORING PLAN

**Date Started**: November 11, 2025  
**Current Branch**: feature/migrate-better-auth  
**Status**: 🚧 IN PROGRESS

---

## 📊 Progress Tracker

| Phase | Feature                 | Status     | Duration | Completion Date |
| ----- | ----------------------- | ---------- | -------- | --------------- |
| 0     | Setup & Preparation     | ✅ DONE    | 1h       | Nov 11, 2025    |
| 1     | Auth Feature            | ✅ DONE    | 1.5h     | Nov 11, 2025    |
| 2     | Products Feature        | ⏳ PENDING | 4-6h     | -               |
| 3     | Cart Feature            | ⏳ PENDING | 6-8h     | -               |
| 4     | Orders Feature          | ⏳ PENDING | 4-5h     | -               |
| 5     | Stores Feature          | ⏳ PENDING | 3-4h     | -               |
| 6     | Coupons Feature         | ⏳ PENDING | 2-3h     | -               |
| 7     | Address & Ratings       | ⏳ PENDING | 2-3h     | -               |
| 8     | Shared Layer            | ⏳ PENDING | 2-3h     | -               |
| 9     | Server Layer (Optional) | ⏳ PENDING | 4-6h     | -               |
| 10    | Cleanup                 | ⏳ PENDING | 1-2h     | -               |

**Total Estimated Time**: 26-38 hours

---

## 🎯 Architecture Goal

```
vendoor/
├── features/              # Business Logic Layer (Feature-based)
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── stores/
│   ├── coupons/
│   ├── address/
│   └── ratings/
│
├── server/               # Backend Layer (Optional)
│   ├── db/
│   ├── services/
│   └── repositories/
│
├── shared/               # Shared Layer
│   ├── components/
│   ├── lib/
│   └── hooks/
│
└── app/                  # App Router (Routing only)
```

---

## 📋 Naming Conventions

### Components:

- **Client Components**: `*.client.tsx` (uses "use client")
- **Server Components**: `*.server.tsx` (RSC, no "use client")
- **Shared Components**: `*.tsx` (can be used in both)

### Files:

- **Server Actions**: `*.action.ts` (uses "use server")
- **Queries**: `*.query.ts` (server-side data fetching)
- **Hooks**: `use*.ts` (client-side hooks)
- **Schemas**: `*.schema.ts` (Zod validation)
- **Types**: `*.types.ts` (TypeScript types)

---

## 🔄 Current Phase: Phase 1 - COMPLETED ✅

### Phase 0 - Setup (DONE):

- [x] Create folder structure for all features
- [x] Create README.md for key features
- [x] Setup 2-file barrel exports (index.client.ts, index.server.ts)
- [x] Document refactoring plan

### Phase 1 - Auth Feature (DONE):

- [x] Rename components with .client/.server extensions
- [x] Create index.client.ts barrel export
- [x] Create index.server.ts barrel export
- [x] Update all imports in pages
- [x] Test auth flows (sign-in, sign-up, user button)
- [x] Zero breaking changes ✅

---

## ⚠️ Breaking Changes Log

### Phase 0:

- ✅ None (only folder creation)

### Phase 1: ✅ COMPLETED

- ✅ Import paths changed but backward compatible
- Old: `@/features/auth/components/SignInForm`
- New: `@/features/auth/index.client` or `@/features/auth`
- Status: All imports updated, zero breaking changes

---

## 🛡️ Rollback Strategy

Each phase has its own commit. To rollback:

```bash
# Rollback specific phase
git log --oneline
git revert <commit-hash>

# Rollback entire refactoring
git checkout main
git branch -D feature/migrate-better-auth
```

---

## 📚 Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Components](https://react.dev/reference/rsc/server-components)

---

## 📝 Notes

- All refactoring must maintain backward compatibility during transition
- Each phase should be tested before moving to next
- Feature flags for risky changes (e.g., Cart Redux → Server State)
- Keep old API routes with deprecation warnings initially

---

Last Updated: November 11, 2025
