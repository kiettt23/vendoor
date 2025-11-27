import { PrismaClient } from "@prisma/client";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();

// Password hashing - match Better Auth's scrypt implementation
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

// Helper to create account for a user
async function createCredentialAccount(userId: string, password: string) {
  const hashedPassword = await hashPassword(password);
  return prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: userId,
      },
    },
    update: {},
    create: {
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
    },
  });
}

async function main() {
  console.log("🌱 Starting v0 seed...");

  // ============================================
  // 1. CREATE CATEGORIES
  // ============================================
  console.log("📁 Creating categories...");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dien-thoai" },
      update: {},
      create: {
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Điện thoại thông minh từ các thương hiệu hàng đầu",
        image: "/placeholder.jpg", // Sẽ update sau
      },
    }),
    prisma.category.upsert({
      where: { slug: "laptop" },
      update: {},
      create: {
        name: "Laptop",
        slug: "laptop",
        description: "Laptop cho công việc và giải trí",
        image: "/placeholder.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tablet" },
      update: {},
      create: {
        name: "Tablet",
        slug: "tablet",
        description: "Máy tính bảng cao cấp",
        image: "/placeholder.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tai-nghe" },
      update: {},
      create: {
        name: "Tai nghe",
        slug: "tai-nghe",
        description: "Tai nghe chính hãng chất lượng cao",
        image: "/placeholder.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "phu-kien" },
      update: {},
      create: {
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Phụ kiện công nghệ đa dạng",
        image: "/placeholder.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        name: "Gaming",
        slug: "gaming",
        description: "Thiết bị gaming chuyên nghiệp",
        image: "/placeholder.jpg",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // 2. CREATE VENDORS
  // ============================================
  console.log("🏪 Creating vendors...");

  // Create vendor users first
  const appleStoreUser = await prisma.user.upsert({
    where: { email: "apple@vendoor.com" },
    update: {},
    create: {
      email: "apple@vendoor.com",
      name: "Apple Store VN",
      phone: "1900000001",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  const samsungUser = await prisma.user.upsert({
    where: { email: "samsung@vendoor.com" },
    update: {},
    create: {
      email: "samsung@vendoor.com",
      name: "Samsung Official",
      phone: "1900000002",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  const sonyUser = await prisma.user.upsert({
    where: { email: "sony@vendoor.com" },
    update: {},
    create: {
      email: "sony@vendoor.com",
      name: "Sony Center",
      phone: "1900000003",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  const techzoneUser = await prisma.user.upsert({
    where: { email: "techzone@vendoor.com" },
    update: {},
    create: {
      email: "techzone@vendoor.com",
      name: "TechZone",
      phone: "1900000004",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  const logitechUser = await prisma.user.upsert({
    where: { email: "logitech@vendoor.com" },
    update: {},
    create: {
      email: "logitech@vendoor.com",
      name: "Logitech Store",
      phone: "1900000005",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  const asusUser = await prisma.user.upsert({
    where: { email: "asus@vendoor.com" },
    update: {},
    create: {
      email: "asus@vendoor.com",
      name: "ASUS Gaming VN",
      phone: "1900000006",
      emailVerified: true,
      roles: ["VENDOR"],
    },
  });

  // Create vendor profiles
  const appleStore = await prisma.vendorProfile.upsert({
    where: { userId: appleStoreUser.id },
    update: {},
    create: {
      userId: appleStoreUser.id,
      shopName: "Apple Store VN",
      slug: "apple-store-vn",
      description: "Nhà phân phối chính thức sản phẩm Apple tại Việt Nam",
      logo: "/apple-logo-minimal.jpg",
      banner: "/apple-store-modern-interior.jpg",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  const samsungStore = await prisma.vendorProfile.upsert({
    where: { userId: samsungUser.id },
    update: {},
    create: {
      userId: samsungUser.id,
      shopName: "Samsung Official",
      slug: "samsung-official",
      description: "Cửa hàng chính hãng Samsung",
      logo: "/samsung-logo-blue.jpg",
      banner: "/samsung-store-display.jpg",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  const sonyStore = await prisma.vendorProfile.upsert({
    where: { userId: sonyUser.id },
    update: {},
    create: {
      userId: sonyUser.id,
      shopName: "Sony Center",
      slug: "sony-center",
      description: "Trung tâm Sony chính hãng",
      logo: "/placeholder-logo.png",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  const techzoneStore = await prisma.vendorProfile.upsert({
    where: { userId: techzoneUser.id },
    update: {},
    create: {
      userId: techzoneUser.id,
      shopName: "TechZone",
      slug: "techzone",
      description: "Đa dạng sản phẩm công nghệ",
      logo: "/placeholder-logo.png",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  const logitechStore = await prisma.vendorProfile.upsert({
    where: { userId: logitechUser.id },
    update: {},
    create: {
      userId: logitechUser.id,
      shopName: "Logitech Store",
      slug: "logitech-store",
      description: "Cửa hàng Logitech chính hãng",
      logo: "/placeholder-logo.png",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  const asusStore = await prisma.vendorProfile.upsert({
    where: { userId: asusUser.id },
    update: {},
    create: {
      userId: asusUser.id,
      shopName: "ASUS Gaming VN",
      slug: "asus-gaming-vn",
      description: "Chuyên gaming gear ASUS ROG",
      logo: "/placeholder-logo.png",
      status: "APPROVED",
      commissionRate: 0.1,
    },
  });

  // Suppress unused variable warnings - we may use these later
  void appleStore;
  void samsungStore;
  void sonyStore;
  void techzoneStore;
  void logitechStore;
  void asusStore;

  console.log("✅ Created 6 vendors");

  // ============================================
  // 2b. CREATE CREDENTIAL ACCOUNTS FOR VENDORS
  // ============================================
  console.log("🔐 Creating credential accounts for vendors...");

  // Use same password for all vendors: Kiet1461!
  const vendorPassword = "Kiet1461!";

  await Promise.all([
    createCredentialAccount(appleStoreUser.id, vendorPassword),
    createCredentialAccount(samsungUser.id, vendorPassword),
    createCredentialAccount(sonyUser.id, vendorPassword),
    createCredentialAccount(techzoneUser.id, vendorPassword),
    createCredentialAccount(logitechUser.id, vendorPassword),
    createCredentialAccount(asusUser.id, vendorPassword),
  ]);

  console.log("✅ Created 6 vendor accounts (password: Kiet1461!)");

  // ============================================
  // 2c. CREATE ADMIN USER
  // ============================================
  console.log("👑 Creating admin user...");

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vendoor.com" },
    update: { roles: ["ADMIN"] },
    create: {
      email: "admin@vendoor.com",
      name: "Admin Vendoor",
      emailVerified: true,
      roles: ["ADMIN"],
    },
  });

  await createCredentialAccount(adminUser.id, vendorPassword);
  console.log("✅ Created admin user (admin@vendoor.com / Kiet1461!)");

  // ============================================
  // 2d. CREATE TEST CUSTOMER USER
  // ============================================
  console.log("👤 Creating test customer user...");

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@vendoor.com" },
    update: {},
    create: {
      email: "customer@vendoor.com",
      name: "Customer Test",
      emailVerified: true,
      roles: ["CUSTOMER"],
    },
  });

  await createCredentialAccount(customerUser.id, vendorPassword);
  console.log("✅ Created test customer (customer@vendoor.com / Kiet1461!)");

  // ============================================
  // 3. CREATE PRODUCTS (From v0 data)
  // ============================================
  console.log("📦 Creating products...");

  const laptopCategory = categories.find((c) => c.slug === "laptop")!;
  const phoneCategory = categories.find((c) => c.slug === "dien-thoai")!;
  const tabletCategory = categories.find((c) => c.slug === "tablet")!;
  const headphoneCategory = categories.find((c) => c.slug === "tai-nghe")!;
  const accessoryCategory = categories.find((c) => c.slug === "phu-kien")!;
  const gamingCategory = categories.find((c) => c.slug === "gaming")!;

  // Helper function to create product with variant and images
  async function createProduct(data: {
    vendorId: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    images: string[];
    sales?: number; // For sorting featured products
    rating?: number;
    reviews?: number;
  }) {
    const product = await prisma.product.create({
      data: {
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: true,
      },
    });

    // Create default variant
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Mặc định",
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        isDefault: true,
      },
    });

    // Create images
    await Promise.all(
      data.images.map((url, index) =>
        prisma.productImage.create({
          data: {
            productId: product.id,
            url,
            altText: data.name,
            order: index,
          },
        })
      )
    );

    return product;
  }

  // FEATURED PRODUCTS (High sales/rating for sorting)
  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: laptopCategory.id,
    name: "MacBook Pro 14 M3 Pro",
    slug: "macbook-pro-14-m3-pro",
    description:
      "Hiệu năng vượt trội với chip M3 Pro, màn hình Liquid Retina XDR",
    price: 49990000,
    compareAtPrice: 54990000,
    stock: 50,
    images: ["/macbook-pro-14-m3-laptop-space-gray.jpg"],
    sales: 256, // High sales for featured
    rating: 4.9,
    reviews: 256,
  });

  await createProduct({
    vendorId: sonyUser.id,
    categoryId: headphoneCategory.id,
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Tai nghe chống ồn hàng đầu với AI noise cancelling",
    price: 7490000,
    compareAtPrice: 8990000,
    stock: 100,
    images: ["/sony-wh-1000xm5-headphones-black.jpg"],
    sales: 189,
    rating: 4.8,
    reviews: 189,
  });

  await createProduct({
    vendorId: samsungUser.id,
    categoryId: tabletCategory.id,
    name: "Samsung Galaxy Tab S9",
    slug: "samsung-galaxy-tab-s9",
    description: "Máy tính bảng cao cấp với S Pen đi kèm",
    price: 18990000,
    compareAtPrice: 21990000,
    stock: 30,
    images: ["/samsung-galaxy-tab-s9-tablet.jpg"],
    sales: 134,
    rating: 4.7,
    reviews: 134,
  });

  await createProduct({
    vendorId: logitechUser.id,
    categoryId: accessoryCategory.id,
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    description: "Chuột không dây cao cấp cho năng suất làm việc",
    price: 2490000,
    stock: 200,
    images: ["/logitech-mx-master-3s-mouse.jpg"],
    sales: 412, // Highest sales
    rating: 5.0,
    reviews: 412,
  });

  await createProduct({
    vendorId: asusUser.id,
    categoryId: gamingCategory.id,
    name: "ASUS ROG Strix G16",
    slug: "asus-rog-strix-g16",
    description: "Gaming laptop mạnh mẽ với RTX 4070",
    price: 42990000,
    compareAtPrice: 47990000,
    stock: 20,
    images: ["/asus-rog-strix-gaming-laptop.jpg"],
    sales: 89,
    rating: 4.8,
    reviews: 89,
  });

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: accessoryCategory.id,
    name: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    description: "Đồng hồ thông minh cao cấp cho thể thao và phiêu lưu",
    price: 21990000,
    compareAtPrice: 23990000,
    stock: 40,
    images: ["/apple-watch-ultra-2-smartwatch.jpg"],
    sales: 178,
    rating: 4.9,
    reviews: 178,
  });

  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "DJI Mini 4 Pro",
    slug: "dji-mini-4-pro",
    description: "Drone nhỏ gọn với camera 4K chống rung tiên tiến",
    price: 23990000,
    stock: 15,
    images: ["/dji-mini-4-pro-drone.jpg"],
    sales: 67,
    rating: 4.7,
    reviews: 67,
  });

  await createProduct({
    vendorId: samsungUser.id,
    categoryId: accessoryCategory.id,
    name: "Samsung 990 Pro 2TB",
    slug: "samsung-990-pro-2tb",
    description: "Ổ cứng SSD NVMe tốc độ cao cho gaming và workstation",
    price: 4990000,
    compareAtPrice: 5990000,
    stock: 150,
    images: ["/samsung-990-pro-ssd.jpg"],
    sales: 234,
    rating: 4.9,
    reviews: 234,
  });

  // FLASH DEALS (For flash sale section)
  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: phoneCategory.id,
    name: "iPhone 15 Pro Max 256GB",
    slug: "iphone-15-pro-max-256gb",
    description: "iPhone cao cấp nhất với chip A17 Pro và camera 48MP",
    price: 28990000,
    compareAtPrice: 34990000,
    stock: 100,
    images: ["/iphone-15-pro-max.png"],
    sales: 350, // Very high for flash deal
    rating: 4.9,
    reviews: 420,
  });

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: laptopCategory.id,
    name: "MacBook Air M3 13 inch",
    slug: "macbook-air-m3-13",
    description: "Mỏng nhẹ, pin trâu với chip M3 tiết kiệm điện",
    price: 24990000,
    compareAtPrice: 28990000,
    stock: 80,
    images: ["/macbook-air-m3-laptop-silver.jpg"],
    sales: 280,
    rating: 4.8,
    reviews: 310,
  });

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: headphoneCategory.id,
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    description: "Tai nghe true wireless với ANC chủ động thế hệ mới",
    price: 4990000,
    compareAtPrice: 6990000,
    stock: 150,
    images: ["/airpods-pro-2-earbuds-white.jpg"],
    sales: 480, // Highest sales for flash
    rating: 4.9,
    reviews: 550,
  });

  await createProduct({
    vendorId: samsungUser.id,
    categoryId: phoneCategory.id,
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Flagship Android với S Pen và camera zoom 100x",
    price: 26990000,
    compareAtPrice: 33990000,
    stock: 60,
    images: ["/samsung-galaxy-s24-ultra.png"],
    sales: 210,
    rating: 4.8,
    reviews: 280,
  });

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: tabletCategory.id,
    name: "iPad Pro M4 11 inch",
    slug: "ipad-pro-m4-11",
    description: "Tablet cao cấp với chip M4 và màn hình OLED",
    price: 22990000,
    compareAtPrice: 27990000,
    stock: 50,
    images: ["/ipad-pro-m4-tablet.jpg"],
    sales: 145,
    rating: 4.9,
    reviews: 180,
  });

  // NEW ARRIVALS (Recent createdAt)
  // These will be created last, so they have newest createdAt
  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "Bàn phím cơ gaming RGB",
    slug: "ban-phim-co-gaming-rgb",
    description: "Bàn phím cơ switches blue, đèn RGB đầy đủ",
    price: 1290000,
    stock: 100,
    images: ["/placeholder.jpg"],
    sales: 45,
    rating: 4.6,
    reviews: 67,
  });

  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "Webcam 4K streaming",
    slug: "webcam-4k-streaming",
    description: "Webcam chất lượng cao cho streaming và meeting",
    price: 2490000,
    stock: 80,
    images: ["/placeholder.jpg"],
    sales: 23,
    rating: 4.5,
    reviews: 34,
  });

  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "Hub USB-C 7 in 1",
    slug: "hub-usbc-7-in-1",
    description: "Hub đa năng với HDMI, USB 3.0, SD card reader",
    price: 890000,
    stock: 150,
    images: ["/placeholder.jpg"],
    sales: 78,
    rating: 4.7,
    reviews: 92,
  });

  console.log("✅ Created 18 products");

  console.log("🎉 V0 seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
