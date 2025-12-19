# Vendoor Documentation

Bộ tài liệu toàn diện cho dự án Vendoor - Sàn thương mại điện tử đa người bán.

## 📚 Mục lục

### Core Documentation

| Tài liệu                                           | Mô tả                                       |
| -------------------------------------------------- | ------------------------------------------- |
| [OVERVIEW.md](./OVERVIEW.md)                       | Tổng quan dự án, tech stack, roles          |
| [ARCHITECTURE.md](./ARCHITECTURE.md)               | Feature-Sliced Design & layer structure     |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)     | Chi tiết cấu trúc thư mục                   |
| [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) | Giải thích các quyết định kỹ thuật          |
| [DATABASE.md](./DATABASE.md)                       | Database schema (Neon + Prisma), models     |
| [FEATURES.md](./FEATURES.md)                       | Tính năng theo role (Customer/Vendor/Admin) |
| [DATA_FLOW.md](./DATA_FLOW.md)                     | Luồng hoạt động chính                       |

### Business & Logic

| Tài liệu                                   | Mô tả                                     |
| ------------------------------------------ | ----------------------------------------- |
| [BUSINESS_LOGIC.md](./BUSINESS_LOGIC.md)   | Business rules, tính toán, ràng buộc      |
| [DATA_FLOW.md](./DATA_FLOW.md)             | Luồng hoạt động chính (checkout, auth...) |

### Development & Operations

| Tài liệu                                     | Mô tả                             |
| -------------------------------------------- | --------------------------------- |
| [API_REFERENCE.md](./API_REFERENCE.md)       | API endpoints & Server Actions    |
| [CACHING_STRATEGY.md](./CACHING_STRATEGY.md) | Chiến lược caching chi tiết       |
| [DEPLOYMENT.md](./DEPLOYMENT.md)             | Hướng dẫn deploy (Vercel, Docker) |
| [CONTRIBUTING.md](./CONTRIBUTING.md)         | Hướng dẫn đóng góp code           |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)   | Xử lý lỗi thường gặp              |

### Testing

| Tài liệu                                   | Mô tả                                         |
| ------------------------------------------ | --------------------------------------------- |
| [TESTING.md](./TESTING.md)                 | Testing strategy, commands, coverage          |
| [MANUAL_TESTING.md](./MANUAL_TESTING.md)   | Checklist test thủ công trước release         |

### Learning Resources

| Tài liệu                       | Mô tả                             |
| ------------------------------ | --------------------------------- |
| [CODE_TOUR.md](./CODE_TOUR.md) | 🎒 Tour hướng dẫn đọc code từ đầu |

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd vendoor
pnpm install

# 2. Setup environment
cp .env.example .env
# Fill DATABASE_URL, BETTER_AUTH_SECRET, CLOUDINARY_*

# 3. Database
pnpm prisma migrate dev
pnpm db:seed

# 4. Run
pnpm dev
```

Mở http://localhost:3000 🎉

## 👤 Test Accounts

| Role     | Email                  | Password    |
| -------- | ---------------------- | ----------- |
| Admin    | `admin@vendoor.com`    | `Kiet1461!` |
| Vendor   | `vendor@vendoor.com`   | `Kiet1461!` |
| Customer | `customer@vendoor.com` | `Kiet1461!` |
