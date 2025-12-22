import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client/client";
import { scrypt, randomBytes, ScryptOptions } from "crypto";
import { promisify } from "util";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// Password hashing - MUST match Better Auth's exact implementation
// From: packages/better-auth/src/crypto/password.ts
// Better Auth uses @noble/hashes/scrypt with: N=16384, r=16, p=1, dkLen=64
const scryptAsync = promisify<
  string | Buffer,
  string | Buffer,
  number,
  ScryptOptions,
  Buffer
>(scrypt);

const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

async function hashPassword(password: string): Promise<string> {
  // Generate 16 bytes salt and encode as hex (32 chars)
  const salt = randomBytes(16).toString("hex");

  // Generate key with Better Auth's exact config
  const key = await scryptAsync(
    password.normalize("NFKC"),
    salt,
    config.dkLen,
    {
      N: config.N,
      r: config.r,
      p: config.p,
      maxmem: 128 * config.N * config.r * 2,
    }
  );

  // Format: salt:hexEncodedKey (exactly like Better Auth)
  return `${salt}:${key.toString("hex")}`;
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
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "laptop" },
      update: {},
      create: {
        name: "Laptop",
        slug: "laptop",
        description: "Laptop cho công việc và giải trí",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tablet" },
      update: {},
      create: {
        name: "Tablet",
        slug: "tablet",
        description: "Máy tính bảng cao cấp",
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tai-nghe" },
      update: {},
      create: {
        name: "Tai nghe",
        slug: "tai-nghe",
        description: "Tai nghe chính hãng chất lượng cao",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "phu-kien" },
      update: {},
      create: {
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Phụ kiện công nghệ đa dạng",
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        name: "Gaming",
        slug: "gaming",
        description: "Thiết bị gaming chuyên nghiệp",
        image:
          "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80",
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
      logo: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&q=80",
      banner:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
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
      logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&q=80",
      banner:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
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
      logo: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
      banner:
        "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=800&q=80",
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
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80",
      banner:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
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

  // Use same password for all vendors: Test@123456
  const vendorPassword = "Test@123456";

  await Promise.all([
    createCredentialAccount(appleStoreUser.id, vendorPassword),
    createCredentialAccount(samsungUser.id, vendorPassword),
    createCredentialAccount(sonyUser.id, vendorPassword),
    createCredentialAccount(techzoneUser.id, vendorPassword),
    createCredentialAccount(logitechUser.id, vendorPassword),
    createCredentialAccount(asusUser.id, vendorPassword),
  ]);

  console.log("✅ Created 6 vendor accounts (password: Test@123456)");

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
  console.log("✅ Created admin user (admin@vendoor.com / Test@123456)");

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
  console.log("✅ Created test customer (customer@vendoor.com / Test@123456)");

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
    variants?: Array<{
      name: string;
      price: number;
      compareAtPrice?: number;
      stock: number;
    }>;
  }) {
    // Use upsert to allow re-seeding
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        description: data.description,
        isActive: true,
      },
      create: {
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: true,
      },
    });

    // Delete existing variants and images for clean re-seed
    await prisma.productVariant.deleteMany({
      where: { productId: product.id },
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });

    // Create variants (default or multiple)
    if (data.variants && data.variants.length > 0) {
      await Promise.all(
        data.variants.map((variant, index) =>
          prisma.productVariant.create({
            data: {
              productId: product.id,
              name: variant.name,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              stock: variant.stock,
              isDefault: index === 0,
            },
          })
        )
      );
    } else {
      // Default single variant
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
    }

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
    vendorId: logitechUser.id,
    categoryId: gamingCategory.id,
    name: "Bàn phím cơ gaming RGB",
    slug: "ban-phim-co-gaming-rgb",
    description:
      "Bàn phím cơ switches blue, đèn RGB đầy đủ với phần mềm tùy chỉnh",
    price: 1290000,
    stock: 100,
    images: ["/asus-rog-strix-gaming-laptop.jpg"], // Reuse gaming image
    sales: 45,
    rating: 4.6,
    reviews: 67,
  });

  await createProduct({
    vendorId: logitechUser.id,
    categoryId: accessoryCategory.id,
    name: "Webcam HD Pro 1080p",
    slug: "webcam-hd-pro-1080p",
    description: "Webcam chất lượng cao cho meeting và streaming với mic kép",
    price: 1490000,
    stock: 80,
    images: ["/logitech-mx-master-3s-mouse.jpg"], // Logitech product
    sales: 23,
    rating: 4.5,
    reviews: 34,
  });

  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "Hub USB-C 7 in 1",
    slug: "hub-usbc-7-in-1",
    description:
      "Hub đa năng với HDMI 4K, USB 3.0, SD card reader, sạc PD 100W",
    price: 890000,
    stock: 150,
    images: ["/samsung-990-pro-ssd.jpg"], // Tech accessory
    sales: 78,
    rating: 4.7,
    reviews: 92,
  });

  // More products for diversity
  await createProduct({
    vendorId: asusUser.id,
    categoryId: gamingCategory.id,
    name: "Chuột gaming ROG",
    slug: "chuot-gaming-rog",
    description: "Chuột gaming không dây với sensor 25K DPI, pin 150 giờ",
    price: 2190000,
    compareAtPrice: 2590000,
    stock: 75,
    images: ["/logitech-mx-master-3s-mouse.jpg"],
    sales: 156,
    rating: 4.8,
    reviews: 189,
  });

  await createProduct({
    vendorId: samsungUser.id,
    categoryId: accessoryCategory.id,
    name: "Samsung DeX Station",
    slug: "samsung-dex-station",
    description: "Biến điện thoại thành máy tính với đế kết nối đa năng",
    price: 1890000,
    stock: 40,
    images: ["/samsung-990-pro-ssd.jpg"],
    sales: 34,
    rating: 4.4,
    reviews: 45,
  });

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: accessoryCategory.id,
    name: "Apple Magic Keyboard",
    slug: "apple-magic-keyboard",
    description: "Bàn phím không dây với Touch ID cho Mac",
    price: 3990000,
    stock: 60,
    images: ["/macbook-air-m3-laptop-silver.jpg"],
    sales: 89,
    rating: 4.7,
    reviews: 102,
  });

  await createProduct({
    vendorId: sonyUser.id,
    categoryId: headphoneCategory.id,
    name: "Sony WF-1000XM5",
    slug: "sony-wf-1000xm5",
    description: "True wireless earbuds cao cấp với LDAC và DSEE Extreme",
    price: 6290000,
    compareAtPrice: 6990000,
    stock: 90,
    images: ["/airpods-pro-2-earbuds-white.jpg"],
    sales: 234,
    rating: 4.8,
    reviews: 278,
  });

  await createProduct({
    vendorId: asusUser.id,
    categoryId: laptopCategory.id,
    name: "ASUS ZenBook 14 OLED",
    slug: "asus-zenbook-14-oled",
    description: "Ultrabook mỏng nhẹ với màn OLED 2.8K và Intel Core Ultra",
    price: 28990000,
    compareAtPrice: 32990000,
    stock: 35,
    images: ["/macbook-air-m3-laptop-silver.jpg"],
    sales: 67,
    rating: 4.7,
    reviews: 89,
  });

  await createProduct({
    vendorId: techzoneUser.id,
    categoryId: accessoryCategory.id,
    name: "Sạc nhanh GaN 65W",
    slug: "sac-nhanh-gan-65w",
    description: "Sạc GaN siêu nhỏ gọn, 3 cổng, hỗ trợ PD 3.0",
    price: 590000,
    stock: 200,
    images: ["/samsung-990-pro-ssd.jpg"],
    sales: 456,
    rating: 4.9,
    reviews: 523,
  });

  await createProduct({
    vendorId: logitechUser.id,
    categoryId: accessoryCategory.id,
    name: "Logitech StreamCam",
    slug: "logitech-streamcam",
    description: "Webcam Full HD 1080p 60fps cho streaming chuyên nghiệp",
    price: 3490000,
    stock: 45,
    images: ["/logitech-mx-master-3s-mouse.jpg"],
    sales: 78,
    rating: 4.6,
    reviews: 95,
  });

  // ============================================
  // PRODUCTS WITH MULTIPLE VARIANTS
  // ============================================
  console.log("📦 Creating products with variants...");

  // iPhone với nhiều màu/dung lượng
  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: phoneCategory.id,
    name: "iPhone 15",
    slug: "iphone-15",
    description: "iPhone 15 mới với Dynamic Island, camera 48MP",
    price: 22990000,
    stock: 0, // Will be overridden by variants
    images: ["/iphone-15-pro-max.png"],
    sales: 320,
    rating: 4.8,
    reviews: 420,
    variants: [
      { name: "128GB - Đen", price: 22990000, stock: 25 },
      { name: "128GB - Xanh", price: 22990000, stock: 18 },
      { name: "256GB - Đen", price: 25990000, stock: 12 },
      { name: "256GB - Hồng", price: 25990000, stock: 8 },
      { name: "512GB - Đen", price: 30990000, stock: 5 },
    ],
  });

  // MacBook với nhiều cấu hình
  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: laptopCategory.id,
    name: "MacBook Air M2",
    slug: "macbook-air-m2",
    description: "MacBook Air với chip M2, mỏng nhẹ, pin cả ngày",
    price: 27990000,
    stock: 0,
    images: ["/macbook-air-m3-laptop-silver.jpg"],
    sales: 180,
    rating: 4.9,
    reviews: 210,
    variants: [
      { name: "8GB/256GB - Xám", price: 27990000, stock: 20 },
      { name: "8GB/256GB - Vàng", price: 27990000, stock: 15 },
      { name: "8GB/512GB - Xám", price: 32990000, stock: 10 },
      { name: "16GB/512GB - Bạc", price: 39990000, stock: 5 },
    ],
  });

  // Samsung với nhiều màu
  await createProduct({
    vendorId: samsungUser.id,
    categoryId: phoneCategory.id,
    name: "Galaxy Z Flip 5",
    slug: "galaxy-z-flip-5",
    description: "Điện thoại gập thời trang với Flex Window lớn hơn",
    price: 25990000,
    stock: 0,
    images: ["/samsung-galaxy-s24-ultra.png"],
    sales: 95,
    rating: 4.6,
    reviews: 130,
    variants: [
      { name: "256GB - Tím", price: 25990000, stock: 12 },
      { name: "256GB - Kem", price: 25990000, stock: 8 },
      { name: "512GB - Xám", price: 29990000, stock: 5 },
    ],
  });

  console.log("✅ Created 3 products with variants");

  // ============================================
  // OUT OF STOCK PRODUCTS
  // ============================================
  console.log("📦 Creating out-of-stock products...");

  await createProduct({
    vendorId: appleStoreUser.id,
    categoryId: phoneCategory.id,
    name: "iPhone 15 Pro Max Limited",
    slug: "iphone-15-pro-max-limited",
    description: "Phiên bản giới hạn màu Titan Đen - ĐÃ HẾT HÀNG",
    price: 46990000,
    compareAtPrice: 49990000,
    stock: 0,
    images: ["/iphone-15-pro-max.png"],
    sales: 500,
    rating: 5.0,
    reviews: 320,
  });

  await createProduct({
    vendorId: sonyUser.id,
    categoryId: headphoneCategory.id,
    name: "Sony WH-1000XM5 Limited Edition",
    slug: "sony-wh-1000xm5-limited",
    description: "Phiên bản giới hạn màu Midnight Blue - ĐÃ HẾT HÀNG",
    price: 9990000,
    compareAtPrice: 10990000,
    stock: 0,
    images: ["/sony-wh-1000xm5-headphones-black.jpg"],
    sales: 150,
    rating: 4.9,
    reviews: 89,
  });

  await createProduct({
    vendorId: asusUser.id,
    categoryId: gamingCategory.id,
    name: "ROG Phone 8 Pro",
    slug: "rog-phone-8-pro",
    description: "Gaming phone cao cấp nhất - ĐÃ HẾT HÀNG",
    price: 32990000,
    stock: 0,
    images: ["/asus-rog-strix-gaming-laptop.jpg"],
    sales: 80,
    rating: 4.8,
    reviews: 65,
  });

  console.log("✅ Created 3 out-of-stock products");

  console.log("✅ Created 24 products total");

  // ============================================
  // 4. CREATE ORDERS (For analytics)
  // ============================================
  console.log("📋 Creating orders for analytics...");

  // Get products to create orders for
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      vendor: {
        include: {
          vendorProfile: true,
        },
      },
    },
    take: 10,
  });

  // Generate orders over the last 60 days
  const orderStatuses = [
    "DELIVERED",
    "SHIPPED",
    "PROCESSING",
    "PENDING",
  ] as const;
  const ordersToCreate: Array<{
    customerId: string;
    vendorId: string;
    variantId: string;
    productName: string;
    variantName: string | null;
    price: number;
    quantity: number;
    status: (typeof orderStatuses)[number];
    createdAt: Date;
  }> = [];

  // Create varied orders over 60 days
  for (let daysAgo = 0; daysAgo < 60; daysAgo++) {
    // More orders on some days for realistic data
    const ordersThisDay = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < ordersThisDay; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const variant =
        product.variants[Math.floor(Math.random() * product.variants.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(Math.floor(Math.random() * 24));

      // Older orders more likely to be delivered
      const statusIndex =
        daysAgo > 7 ? 0 : Math.floor(Math.random() * orderStatuses.length);

      // Use VendorProfile.id, not User.id
      const vendorProfileId = product.vendor.vendorProfile?.id;
      if (!vendorProfileId) {
        console.warn(`Skipping product ${product.name} - no vendor profile`);
        continue;
      }

      ordersToCreate.push({
        customerId: customerUser.id,
        vendorId: vendorProfileId,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        price: variant.price,
        quantity,
        status: orderStatuses[statusIndex],
        createdAt,
      });
    }
  }

  // Create orders in database
  let orderNumber = 1;
  for (const orderData of ordersToCreate) {
    const subtotal = orderData.price * orderData.quantity;
    const platformFeeRate = 0.1;
    const platformFee = subtotal * platformFeeRate;
    const vendorEarnings = subtotal - platformFee;

    await prisma.order.create({
      data: {
        customerId: orderData.customerId,
        vendorId: orderData.vendorId,
        orderNumber: `ORD-SEED-${String(orderNumber++).padStart(4, "0")}`,
        status: orderData.status,
        subtotal,
        platformFee,
        vendorEarnings,
        platformFeeRate,
        total: subtotal,
        shippingName: "Test Customer",
        shippingPhone: "0901234567",
        shippingAddress: "123 Đường Test, Quận 1",
        shippingCity: "Hồ Chí Minh",
        createdAt: orderData.createdAt,
        items: {
          create: {
            variantId: orderData.variantId,
            productName: orderData.productName,
            variantName: orderData.variantName,
            price: orderData.price,
            quantity: orderData.quantity,
            subtotal,
          },
        },
      },
    });
  }

  console.log(`✅ Created ${ordersToCreate.length} orders`);

  // ============================================
  // 5. CREATE REVIEWS (Some with images)
  // ============================================
  console.log("⭐ Creating reviews with images...");

  const reviewTexts = [
    "Sản phẩm rất tốt, đúng như mô tả!",
    "Giao hàng nhanh, đóng gói cẩn thận.",
    "Chất lượng tuyệt vời, sẽ mua lại!",
    "Hàng chính hãng, giá tốt.",
    "Rất hài lòng với sản phẩm này.",
    "Mua lần 2 rồi, vẫn tốt như lần đầu.",
    "Pin trâu, chạy mượt mà.",
    "Màn hình đẹp, thiết kế sang trọng.",
    "Tư vấn nhiệt tình, ship nhanh.",
    "Giá hợp lý cho chất lượng này.",
  ];

  const reviewImages = [
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  ];

  // Create reviews for delivered orders
  const deliveredOrders = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
    take: 30,
  });

  let reviewCount = 0;
  const reviewedProducts = new Set<string>(); // Track user+product to avoid duplicates

  for (const order of deliveredOrders) {
    for (const item of order.items) {
      const reviewKey = `${order.customerId}-${item.variant.product.id}`;

      // Skip if already reviewed this product
      if (reviewedProducts.has(reviewKey)) {
        continue;
      }

      // 70% chance to leave a review
      if (Math.random() > 0.3) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
        const text =
          reviewTexts[Math.floor(Math.random() * reviewTexts.length)];

        // 30% chance to include images
        const hasImages = Math.random() < 0.3;
        const images = hasImages
          ? reviewImages.slice(0, Math.floor(Math.random() * 2) + 1)
          : [];

        await prisma.review.create({
          data: {
            userId: order.customerId,
            productId: item.variant.product.id,
            orderId: order.id,
            rating,
            content: text,
            images,
            isVerifiedPurchase: true,
            createdAt: new Date(
              order.createdAt.getTime() +
                24 * 60 * 60 * 1000 * Math.random() * 7
            ),
          },
        });
        reviewedProducts.add(reviewKey);
        reviewCount++;
      }
    }
  }

  console.log(`✅ Created ${reviewCount} reviews`);

  // ============================================
  // 6. CREATE LOW STOCK PRODUCTS
  // ============================================
  console.log("📦 Updating some products to low stock...");

  // Get some random variants and set low stock
  const variantsToUpdate = await prisma.productVariant.findMany({
    take: 5,
    skip: 3,
  });

  for (const variant of variantsToUpdate) {
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: { stock: Math.floor(Math.random() * 10) + 1 }, // 1-10 stock
    });
  }

  console.log("✅ Updated 5 products to low stock");

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
