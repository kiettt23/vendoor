import {
  PrismaClient,
  VendorStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";
import { getPlaceholderImageUrl } from "../src/shared/lib/cloudinary";
import { auth } from "../src/shared/lib/auth";

const prisma = new PrismaClient();

// ============================================
// 1. CLEAR DATABASE
// ============================================

async function clearDatabase() {
  console.log("🗑️  Clearing database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared");
}

// ============================================
// 2. SEED USERS
// ============================================

async function seedUsers() {
  console.log("👤 Seeding users...");

  // ============================================
  // 2.1 ADMIN - Dùng Better Auth API
  // ============================================

  const adminResult = await auth.api.signUpEmail({
    body: {
      email: "admin@vendoor.com",
      password: "Password123!",
      name: "Admin",
    },
  });

  if (!adminResult) {
    throw new Error("Failed to create admin user");
  }

  // Update roles (Better Auth tạo với roles: ["CUSTOMER"] mặc định)
  const admin = await prisma.user.update({
    where: { email: "admin@vendoor.com" },
    data: {
      roles: ["ADMIN"],
      emailVerified: true,
    },
  });

  // ============================================
  // 2.2 CUSTOMERS - Dùng Better Auth API
  // ============================================

  const customers = [];

  for (let i = 1; i <= 3; i++) {
    await auth.api.signUpEmail({
      body: {
        email: `customer${i}@example.com`,
        password: "Password123!",
        name: `Khách Hàng ${i}`,
      },
    });

    const customer = await prisma.user.update({
      where: { email: `customer${i}@example.com` },
      data: {
        emailVerified: true,
      },
    });

    customers.push(customer);
  }

  // ============================================
  // 2.3 VENDORS
  // ============================================

  const vendorData = [
    {
      email: "vendor1@example.com",
      name: "Shop Thời Trang XYZ",
      shopName: "Shop Thời Trang XYZ",
      slug: "shop-thoi-trang-xyz",
      description: "Chuyên cung cấp quần áo thời trang nam nữ",
    },
    {
      email: "vendor2@example.com",
      name: "Điện Tử ABC",
      shopName: "Điện Tử ABC",
      slug: "dien-tu-abc",
      description: "Phụ kiện điện tử, công nghệ",
    },
    {
      email: "vendor3@example.com",
      name: "Mỹ Phẩm DEF",
      shopName: "Mỹ Phẩm DEF",
      slug: "my-pham-def",
      description: "Mỹ phẩm chính hãng",
    },
  ];

  const vendors = [];

  for (const data of vendorData) {
    // Tạo user qua Better Auth
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: "Password123!",
        name: data.name,
      },
    });

    // Update roles + tạo vendorProfile
    const vendor = await prisma.user.update({
      where: { email: data.email },
      data: {
        roles: ["VENDOR"],
        emailVerified: true,
        vendorProfile: {
          create: {
            shopName: data.shopName,
            slug: data.slug,
            description: data.description,
            status: VendorStatus.APPROVED,
          },
        },
      },
      include: {
        vendorProfile: true,
      },
    });

    vendors.push(vendor);
  }

  console.log(
    `✅ Created ${customers.length} customers, ${vendors.length} vendors, 1 admin`
  );

  return { admin, customers, vendors };
}

// ============================================
// 3. SEED CATEGORIES
// ============================================

async function seedCategories() {
  console.log("📁 Seeding categories...");

  const categoriesData = [
    {
      name: "Thời Trang",
      slug: "thoi-trang",
      description: "Quần áo, giày dép, phụ kiện thời trang",
    },
    {
      name: "Điện Tử",
      slug: "dien-tu",
      description: "Điện thoại, laptop, phụ kiện công nghệ",
    },
    {
      name: "Mỹ Phẩm",
      slug: "my-pham",
      description: "Son, kem dưỡng da, nước hoa",
    },
    {
      name: "Thực Phẩm",
      slug: "thuc-pham",
      description: "Đồ ăn, đồ uống, thực phẩm chức năng",
    },
    {
      name: "Nội Thất",
      slug: "noi-that",
      description: "Bàn ghế, tủ kệ, đồ trang trí",
    },
  ];

  await prisma.category.createMany({
    data: categoriesData,
  });

  const allCategories = await prisma.category.findMany();

  console.log(`✅ Created ${allCategories.length} categories`);

  return allCategories;
}

// ============================================
// 4. SEED PRODUCTS
// ============================================

async function seedProducts(vendors: any[], categories: any[]) {
  console.log("📦 Seeding products...");

  const products = [];

  // ============================================
  // 4.1 VENDOR 1: 8 PRODUCTS (Thời trang)
  // ============================================

  const fashionCategory = categories.find((c) => c.slug === "thoi-trang")!;

  for (let i = 1; i <= 8; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Áo Thun Nam Cao Cấp ${i}`,
        slug: `ao-thun-nam-${i}`,
        description: `Áo thun nam chất liệu cotton 100%, form regular fit, thoáng mát`,
        vendorId: vendors[0].id,
        categoryId: fashionCategory.id,
        variants: {
          create: [
            {
              name: "Size M - Trắng",
              sku: `ATN-${i}-M-WHITE`,
              price: 199000,
              stock: 50,
              isDefault: true,
            },
            {
              name: "Size L - Đen",
              sku: `ATN-${i}-L-BLACK`,
              price: 199000,
              stock: 30,
              isDefault: false,
            },
          ],
        },
        images: {
          create: [
            { url: getPlaceholderImageUrl(`product-${i}-1`), order: 0 },
            { url: getPlaceholderImageUrl(`product-${i}-2`), order: 1 },
            { url: getPlaceholderImageUrl(`product-${i}-3`), order: 2 },
          ],
        },
      },
    });
    products.push(product);
  }

  // ============================================
  // 4.2 VENDOR 2: 7 PRODUCTS (Điện tử)
  // ============================================

  const electronicsCategory = categories.find((c) => c.slug === "dien-tu")!;

  for (let i = 1; i <= 7; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Tai Nghe Bluetooth ${i}`,
        slug: `tai-nghe-bluetooth-${i}`,
        description: `Tai nghe không dây, chống ồn chủ động, pin 24h`,
        vendorId: vendors[1].id,
        categoryId: electronicsCategory.id,
        variants: {
          create: [
            {
              name: "Default",
              sku: `TNB-${i}-DEFAULT`,
              price: 599000,
              stock: 100,
              isDefault: true,
            },
          ],
        },
        images: {
          create: [
            {
              url: getPlaceholderImageUrl(`earphone-${i}-1`),
              order: 0,
            },
            {
              url: getPlaceholderImageUrl(`earphone-${i}-2`),
              order: 1,
            },
          ],
        },
      },
    });
    products.push(product);
  }

  // ============================================
  // 4.3 VENDOR 3: 5 PRODUCTS (Mỹ phẩm)
  // ============================================

  const cosmeticsCategory = categories.find((c) => c.slug === "my-pham")!;

  for (let i = 1; i <= 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Son Môi Lì ${i}`,
        slug: `son-moi-li-${i}`,
        description: `Son lì lâu trôi, không khô môi, nhiều màu sắc`,
        vendorId: vendors[2].id,
        categoryId: cosmeticsCategory.id,
        variants: {
          create: [
            {
              name: "Màu Đỏ",
              sku: `SML-${i}-RED`,
              price: 149000,
              stock: 200,
              isDefault: true,
            },
            {
              name: "Màu Hồng",
              sku: `SML-${i}-PINK`,
              price: 149000,
              stock: 150,
              isDefault: false,
            },
          ],
        },
        images: {
          create: [
            { url: getPlaceholderImageUrl(`lipstick-${i}-1`), order: 0 },
            { url: getPlaceholderImageUrl(`lipstick-${i}-2`), order: 1 },
          ],
        },
      },
    });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products`);

  return products;
}

// ============================================
// 5. SEED ORDERS
// ============================================

async function seedOrders(customers: any[], vendors: any[]) {
  console.log("🛒 Seeding orders...");

  // Get all product variants with product info
  const allVariants = await prisma.productVariant.findMany({
    include: {
      product: {
        include: {
          images: {
            where: { order: 0 },
            take: 1,
          },
        },
      },
    },
  });

  const orders = [];

  // ============================================
  // Tạo 5 orders
  // ============================================

  for (let i = 0; i < 5; i++) {
    const customer = customers[i % customers.length];
    const vendor = vendors[i % vendors.length];

    // Random 2-3 variants từ cùng 1 vendor
    const vendorVariants = allVariants.filter(
      (v) => v.product.vendorId === vendor.id
    );

    if (vendorVariants.length === 0) continue;

    const selectedVariants = vendorVariants
      .sort(() => Math.random() - 0.5)
      .slice(
        0,
        Math.min(vendorVariants.length, Math.floor(Math.random() * 2) + 2)
      );

    // ============================================
    // Create proper OrderItem data
    // ============================================

    const itemsData = selectedVariants.map((variant) => {
      const quantity = Math.floor(Math.random() * 2) + 1;
      return {
        variantId: variant.id,
        productName: variant.product.name, // ← Đúng field name từ schema
        variantName: variant.name,
        quantity,
        price: variant.price,
        subtotal: variant.price * quantity,
      };
    });

    const subtotal = itemsData.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 30000;
    const platformFeeRate = 0.1;
    const platformFee = Math.round(subtotal * platformFeeRate);
    const vendorEarnings = subtotal - platformFee;
    const total = subtotal + shippingFee;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${i}`;
    const paymentNumber = `PAY-${Date.now()}-${i}`;

    // Create payment first
    const payment = await prisma.payment.create({
      data: {
        paymentNumber,
        method: PaymentMethod.VNPAY,
        status: PaymentStatus.COMPLETED,
        amount: total,
        paidAt: new Date(),
      },
    });

    // Create order WITH items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        vendorId: vendor.id,
        paymentId: payment.id,
        status: OrderStatus.PENDING,
        subtotal,
        shippingFee,
        platformFee,
        platformFeeRate,
        vendorEarnings,
        total,
        // Shipping info (mock data)
        shippingName: customer.name || "Khách hàng",
        shippingPhone: "0909123456",
        shippingAddress: "123 Đường ABC, Phường XYZ",
        shippingCity: "Hồ Chí Minh",
        shippingDistrict: "Quận 1",
        shippingWard: "Phường Bến Nghé",
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} orders`);

  return orders;
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
  console.log("🌱 Starting seed...\n");

  await clearDatabase();

  const { admin, customers, vendors } = await seedUsers();
  const categories = await seedCategories();
  const products = await seedProducts(vendors, categories);
  const orders = await seedOrders(customers, vendors);

  console.log("\n✅ Seed completed!");
  console.log("📊 Summary:");
  console.log(`  - Users: ${customers.length + vendors.length + 1}`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Products: ${products.length}`);
  console.log(`  - Orders: ${orders.length}`);
  console.log("\n🔗 Login credentials:");
  console.log(
    "  Email: admin@vendoor.com / customer1@example.com / vendor1@example.com"
  );
  console.log("  Password: Password123!");
  console.log("\n💡 Run: npm run dev → http://localhost:3000/login");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
