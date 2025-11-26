# Vendoor - Multi-Vendor E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![FSD](https://img.shields.io/badge/Architecture-FSD-purple)

Nền tảng thương mại điện tử đa người bán.

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

## Project Structure

```
src/
├── app/          # Next.js routing
├── widgets/      # Header, Footer, ProductGrid
├── features/     # AddToCart, Checkout, Auth
├── entities/     # Product, Order, Cart, User, Vendor
└── shared/       # UI, lib, hooks, providers
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** Better Auth
- **UI:** Shadcn/UI + Tailwind CSS 4
- **State:** Zustand

## Import Examples

```typescript
import { ProductCard } from "@/entities/product";
import { useCart } from "@/entities/cart";
import { AddToCartButton } from "@/features/cart";
import { Header } from "@/widgets/header";
import { Button } from "@/shared/ui";
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Prisma Studio |

## Documentation

- [FSD Architecture](docs/FSD.md)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vendoor.vn | Admin123 |
| Vendor | vendor@vendoor.vn | Vendor123 |
| Customer | customer@vendoor.vn | Customer123 |
