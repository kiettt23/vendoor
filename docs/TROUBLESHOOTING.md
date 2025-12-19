# Vendoor - Troubleshooting Guide

Hướng dẫn xử lý các lỗi thường gặp khi phát triển và vận hành Vendoor.

---

## 🔴 Database Errors

### Error: Connection refused to Neon

**Symptoms:**

```
Error: connect ECONNREFUSED
```

**Solutions:**

1. Kiểm tra `DATABASE_URL` trong `.env`
2. Kiểm tra Neon project đang active (không bị pause)
3. Kiểm tra IP whitelist (nếu có)

```bash
# Verify connection
pnpm prisma db pull
```

---

### Error: Prisma Client not generated

**Symptoms:**

```
Error: @prisma/client did not initialize yet
```

**Solution:**

```bash
pnpm prisma generate
```

---

### Error: Migration failed

**Symptoms:**

```
Error: Migration failed to apply
```

**Solutions:**

1. **Development:** Reset database

   ```bash
   pnpm db:reset
   ```

2. **Production:** Fix manually

   ```bash
   # Check migration status
   pnpm prisma migrate status

   # Mark as applied (nếu đã apply thủ công)
   pnpm prisma migrate resolve --applied "migration_name"
   ```

---

## 🔴 Authentication Errors

### Error: Session not found

**Symptoms:**

- User bị redirect về login sau khi đã login
- `useSession()` trả về null

**Solutions:**

1. Kiểm tra `BETTER_AUTH_SECRET` có đúng không
2. Kiểm tra cookies được set đúng domain
3. Clear cookies và login lại

---

### Error: OAuth callback failed

**Symptoms:**

```
Error: OAuth callback URL mismatch
```

**Solution:**

1. Kiểm tra Google OAuth redirect URIs:

   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

2. Kiểm tra `BETTER_AUTH_URL` matches domain

---

## 🔴 Payment Errors

### Error: Stripe webhook failed

**Symptoms:**

- Payment successful nhưng order status không update
- Stripe dashboard shows webhook failures

**Solutions:**

1. Kiểm tra `STRIPE_WEBHOOK_SECRET` đúng
2. Verify webhook endpoint URL trong Stripe Dashboard
3. Check webhook events đã enable

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### Error: Payment intent failed

**Symptoms:**

```
Error: Your card was declined
```

**Solutions:**

1. Kiểm tra test cards: `4242 4242 4242 4242`
2. Check Stripe mode (test vs live)
3. Verify API keys match mode

---

## 🔴 Image Upload Errors

### Error: Cloudinary upload failed

**Symptoms:**

```
Error: Upload failed: Invalid API key
```

**Solutions:**

1. Kiểm tra Cloudinary credentials:

   ```env
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```

2. Verify account không bị locked

---

### Error: Image too large

**Symptoms:**

```
Error: File size exceeds limit
```

**Solution:**

- Max file size: 10MB
- Compress image trước khi upload

---

## 🔴 Build Errors

### Error: Type errors in production build

**Symptoms:**

```
Type error: Property 'x' does not exist on type 'y'
```

**Solutions:**

1. Run type check locally:

   ```bash
   pnpm typecheck
   ```

2. Fix type errors

3. Check for missing types:
   ```bash
   pnpm prisma generate  # Regenerate Prisma types
   ```

---

### Error: Module not found

**Symptoms:**

```
Error: Cannot find module '@/entities/product'
```

**Solutions:**

1. Check import path matches `tsconfig.json` paths
2. Verify file exists
3. Clear Next.js cache:
   ```bash
   rm -rf .next
   pnpm dev
   ```

---

## 🔴 Runtime Errors

### Error: Hydration mismatch

**Symptoms:**

```
Warning: Text content did not match
```

**Solutions:**

1. Check for client-only code in Server Components
2. Wrap client-only code với `useEffect`:

   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null;
   ```

3. Use `suppressHydrationWarning` nếu intentional

---

### Error: Server Actions failed

**Symptoms:**

```
Error: Server action failed to execute
```

**Solutions:**

1. Check `"use server"` directive
2. Verify authenticated (nếu action cần auth)
3. Check console cho error details

---

## 🔴 Cart Issues

### Cart không persist sau reload

**Solutions:**

1. Check localStorage:

   ```javascript
   localStorage.getItem("cart-storage");
   ```

2. Verify Zustand persist middleware setup

3. Clear localStorage và test lại:
   ```javascript
   localStorage.removeItem("cart-storage");
   ```

---

### Stock validation failed

**Symptoms:**

- "Sản phẩm không đủ hàng"
- Cart item disabled

**Solution:**

- Stock được sync realtime
- Refresh page hoặc remove item và add lại

---

## 🔴 Performance Issues

### Slow page load

**Solutions:**

1. Check image sizes (use Cloudinary transforms)
2. Review component rendering (React Devtools)
3. Check database queries (Prisma query logging)

```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

---

### High memory usage

**Solutions:**

1. Check for memory leaks (useEffect cleanup)
2. Review cache size
3. Restart development server

---

## 🔧 Development Tips

### Reset Everything

```bash
# Nuclear option: reset all
rm -rf node_modules .next
pnpm install
pnpm prisma generate
pnpm prisma migrate reset
pnpm dev
```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* pnpm dev
```

### Check Environment

```bash
# Print all env vars
node -e "console.log(process.env)"
```

---

## 🔗 Getting Help

1. **Search existing issues** on GitHub
2. **Check docs** in `/docs` folder
3. **Ask in discussions** tab on GitHub
4. **Create issue** với đầy đủ thông tin

---

## 🔗 Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) - Technical context
