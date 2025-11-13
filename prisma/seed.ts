// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Thời trang nam",
        slug: "thoi-trang-nam",
        description: "Quần áo, giày dép nam",
      },
    }),
    prisma.category.create({
      data: {
        name: "Thời trang nữ",
        slug: "thoi-trang-nu",
        description: "Quần áo, giày dép nữ",
      },
    }),
    prisma.category.create({
      data: {
        name: "Điện tử",
        slug: "dien-tu",
        description: "Điện thoại, laptop, phụ kiện",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.length);

  // 2. Create users
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@vendoor.com",
      password,
      name: "Admin",
      roles: ["ADMIN"],
    },
  });

  const vendor1 = await prisma.user.create({
    data: {
      email: "vendor1@test.com",
      password,
      name: "Vendor 1",
      roles: ["VENDOR", "CUSTOMER"],
      vendorProfile: {
        create: {
          shopName: "Shop Thời Trang ABC",
          slug: "shop-thoi-trang-abc",
          description: "Chuyên quần áo nam nữ chất lượng",
          status: "APPROVED",
          commissionRate: 0.1,
        },
      },
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@test.com",
      password,
      name: "Customer Test",
      roles: ["CUSTOMER"],
    },
  });

  console.log("✅ Created users:", { admin, vendor1, customer });

  // 3. Create products cho vendor1
  const product1 = await prisma.product.create({
    data: {
      name: "Áo thun nam basic",
      slug: "ao-thun-nam-basic",
      description: "Áo thun cotton 100%, form regular",
      vendorId: vendor1.id,
      categoryId: categories[0].id,
      variants: {
        create: [
          {
            name: "Đỏ - Size M",
            sku: "SHIRT-RED-M",
            color: "Đỏ",
            size: "M",
            price: 150000,
            compareAtPrice: 200000,
            stock: 10,
          },
          {
            name: "Xanh - Size L",
            sku: "SHIRT-BLUE-L",
            color: "Xanh",
            size: "L",
            price: 160000,
            stock: 5,
          },
        ],
      },
      images: {
        create: [
          {
            url: "https://placehold.co/800x800",
            altText: "Áo thun đỏ",
            order: 0,
          },
          {
            url: "https://placehold.co/800x800",
            altText: "Áo thun xanh",
            order: 1,
          },
        ],
      },
    },
  });

  console.log("✅ Created product:", product1.name);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
