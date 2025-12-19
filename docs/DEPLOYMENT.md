# Vendoor - Hướng Dẫn Deployment

Tài liệu hướng dẫn deploy dự án Vendoor lên production.

---

## 📋 Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Stripe account (nếu dùng payment online)

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Tại sao Vercel:**

- Native Next.js support
- Edge functions
- Automatic HTTPS
- Preview deployments

**Steps:**

1. **Push code lên GitHub**

2. **Import project trên Vercel**

   - Vào [vercel.com](https://vercel.com)
   - Click "New Project" → Import repository

3. **Configure Environment Variables**

   ```
   # Database (Neon)
   DATABASE_URL=postgresql://user:pass@xxxxx.neon.tech/vendoor

   # Auth
   BETTER_AUTH_SECRET=<random-32-char-string>
   BETTER_AUTH_URL=https://your-domain.vercel.app

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx

   # Stripe
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   ```

4. **Deploy**

   - Vercel sẽ tự động detect Next.js và build

5. **Run Migrations**

   ```bash
   # Trong Vercel terminal hoặc local với DATABASE_URL production
   pnpm prisma migrate deploy
   pnpm db:seed  # Optional: seed data
   ```

6. **Configure Stripe Webhook**
   - Vào Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy webhook secret → set `STRIPE_WEBHOOK_SECRET`

---

### Option 2: Docker

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      # ... other env vars
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=vendoor
      - POSTGRES_USER=vendoor
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:
```

---

## 🗄️ Database Setup (Neon)

### 1. Tạo Neon Project

- Vào [neon.tech](https://neon.tech)
- Create new project
- Copy connection string

### 2. Connection String Format

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
```

### 3. Run Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Deploy migrations
pnpm prisma migrate deploy

# (Optional) Seed data
pnpm db:seed
```

### 4. Neon Features

- **Branching**: Tạo branch cho development/staging
- **Scale to zero**: Tiết kiệm chi phí khi không có traffic
- **Connection pooling**: Built-in, không cần PgBouncer

---

## 🔐 Environment Variables

### Required

| Variable                | Description             | Example               |
| ----------------------- | ----------------------- | --------------------- |
| `DATABASE_URL`          | Neon connection string  | `postgresql://...`    |
| `BETTER_AUTH_SECRET`    | Auth secret (32+ chars) | Random string         |
| `BETTER_AUTH_URL`       | App URL                 | `https://vendoor.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name   | `your-cloud`          |
| `CLOUDINARY_API_KEY`    | Cloudinary API key      | `123456789`           |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret   | `abc123...`           |

### Optional (Payment)

| Variable                             | Description           |
| ------------------------------------ | --------------------- |
| `STRIPE_SECRET_KEY`                  | Stripe secret key     |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key     |

### Optional (OAuth)

| Variable               | Description            |
| ---------------------- | ---------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret    |

---

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      # Vercel auto-deploys on push, no action needed
```

---

## 📊 Monitoring

### Recommended Tools

| Tool                 | Purpose                | Integration      |
| -------------------- | ---------------------- | ---------------- |
| **Vercel Analytics** | Performance monitoring | Built-in         |
| **Sentry**           | Error tracking         | `@sentry/nextjs` |
| **Neon Dashboard**   | Database monitoring    | Built-in         |

---

## 🔗 Related Documentation

- [OVERVIEW.md](./OVERVIEW.md) - Tech stack overview
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Technical decisions
