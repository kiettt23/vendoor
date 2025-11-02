const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.rating.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log("👥 Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_admin_001",
        name: "Admin User",
        email: "admin@vendoor.com",
        image: "https://i.pravatar.cc/150?img=1",
        cart: JSON.stringify({}),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_seller_001",
        name: "Nguyễn Văn A",
        email: "seller1@example.com",
        image: "https://i.pravatar.cc/150?img=2",
        cart: JSON.stringify({}),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_seller_002",
        name: "Trần Thị B",
        email: "seller2@example.com",
        image: "https://i.pravatar.cc/150?img=3",
        cart: JSON.stringify({}),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_seller_003",
        name: "Hoàng Minh E",
        email: "seller3@example.com",
        image: "https://i.pravatar.cc/150?img=6",
        cart: JSON.stringify({}),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_buyer_001",
        name: "Lê Văn C",
        email: "buyer1@example.com",
        image: "https://i.pravatar.cc/150?img=4",
        // User có sản phẩm trong giỏ hàng
        cart: JSON.stringify({
          items: [
            { productId: "temp_product_1", quantity: 2 },
            { productId: "temp_product_2", quantity: 1 },
          ],
        }),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_buyer_002",
        name: "Phạm Thị D",
        email: "buyer2@example.com",
        image: "https://i.pravatar.cc/150?img=5",
        cart: JSON.stringify({}),
      },
    }),
    prisma.user.create({
      data: {
        id: "user_buyer_003",
        name: "Đặng Thị F",
        email: "buyer3@example.com",
        image: "https://i.pravatar.cc/150?img=7",
        cart: JSON.stringify({}),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Stores
  console.log("🏪 Creating stores...");
  const stores = await Promise.all([
    // Store được duyệt và đang hoạt động
    prisma.store.create({
      data: {
        userId: "user_seller_001",
        name: "Tech World Store",
        username: "techworld",
        email: "contact@techworld.com",
        contact: "+84 901234567",
        logo: "https://ui-avatars.com/api/?name=Tech+World&background=random",
        description:
          "Chuyên cung cấp các sản phẩm công nghệ cao cấp, chính hãng với giá tốt nhất thị trường.",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        status: "approved",
        isActive: true,
      },
    }),
    // Store được duyệt và đang hoạt động
    prisma.store.create({
      data: {
        userId: "user_seller_002",
        name: "Fashion Hub",
        username: "fashionhub",
        email: "hello@fashionhub.com",
        contact: "+84 907654321",
        logo: "https://ui-avatars.com/api/?name=Fashion+Hub&background=random",
        description:
          "Thời trang cao cấp, phong cách hiện đại dành cho giới trẻ năng động.",
        address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
        status: "approved",
        isActive: true,
      },
    }),
    // Store đang chờ duyệt (pending)
    prisma.store.create({
      data: {
        userId: "user_seller_003",
        name: "Home & Living Store",
        username: "homeliving",
        email: "info@homeliving.com",
        contact: "+84 905555555",
        logo: "https://ui-avatars.com/api/?name=Home+Living&background=random",
        description:
          "Đồ gia dụng, nội thất và phụ kiện trang trí nhà cửa hiện đại.",
        address: "789 Hai Bà Trưng, Quận 3, TP.HCM",
        status: "pending", // Đang chờ admin duyệt
        isActive: false,
      },
    }),
  ]);

  console.log(`✅ Created ${stores.length} stores`);

  // Create Products
  console.log("📦 Creating products...");
  const products = await Promise.all([
    // Tech World Products - In Stock
    prisma.product.create({
      data: {
        name: "iPhone 15 Pro Max",
        description:
          "iPhone 15 Pro Max 256GB - Màn hình Super Retina XDR 6.7 inch, chip A17 Pro, camera 48MP với zoom quang học 5x. Thiết kế titan cao cấp, bền bỉ và sang trọng.",
        mrp: 34990000,
        price: 32990000,
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
          "https://images.unsplash.com/photo-1695048133082-ff50e1eb8b43?w=500",
        ],
        category: "Electronics",
        inStock: true,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "MacBook Air M3",
        description:
          "MacBook Air M3 13 inch - Chip M3 mạnh mẽ, RAM 8GB, SSD 256GB. Siêu mỏng nhẹ chỉ 1.24kg, pin 18 giờ sử dụng. Hoàn hảo cho công việc và giải trí.",
        mrp: 32990000,
        price: 29990000,
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        ],
        category: "Electronics",
        inStock: true,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "AirPods Pro 2",
        description:
          "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động nâng cấp gấp đôi, âm thanh thích ứng. Hộp sạc MagSafe với loa tích hợp giúp dễ tìm kiếm.",
        mrp: 6990000,
        price: 6490000,
        images: [
          "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500",
          "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=500",
        ],
        category: "Electronics",
        inStock: true,
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "iPad Air M2",
        description:
          "iPad Air với chip M2 mạnh mẽ, màn hình Liquid Retina 10.9 inch. Hỗ trợ Apple Pencil Pro và Magic Keyboard. Lý tưởng cho sáng tạo và học tập.",
        mrp: 18990000,
        price: 17490000,
        images: [
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
          "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500",
        ],
        category: "Electronics",
        inStock: true,
        storeId: stores[0].id,
      },
    }),
    // Tech World - Out of Stock Product
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24 Ultra",
        description:
          "Samsung Galaxy S24 Ultra - Màn hình Dynamic AMOLED 6.8 inch, Snapdragon 8 Gen 3, camera 200MP. Bút S Pen tích hợp, pin 5000mAh.",
        mrp: 31990000,
        price: 29490000,
        images: [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        ],
        category: "Electronics",
        inStock: false, // Hết hàng
        storeId: stores[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sony WH-1000XM5",
        description:
          "Tai nghe chống ồn cao cấp Sony WH-1000XM5 - Chất lượng âm thanh Hi-Res, pin 30 giờ, Bluetooth multipoint.",
        mrp: 9990000,
        price: 8990000,
        images: [
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        ],
        category: "Electronics",
        inStock: false, // Hết hàng
        storeId: stores[0].id,
      },
    }),

    // Fashion Hub Products
    prisma.product.create({
      data: {
        name: "Áo Khoác Denim Unisex",
        description:
          "Áo khoác jean cao cấp, chất liệu denim bền đẹp, phong cách năng động. Thiết kế oversize trendy, phù hợp cả nam và nữ. Form rộng thoải mái.",
        mrp: 850000,
        price: 650000,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
        ],
        category: "Fashion",
        inStock: true,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Quần Jeans Skinny",
        description:
          "Quần jeans skinny ôm body, chất liệu co giãn 4 chiều thoải mái. Màu xanh vintage thời thượng, phom dáng chuẩn Hàn Quốc. Tôn dáng hoàn hảo.",
        mrp: 550000,
        price: 420000,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
        ],
        category: "Fashion",
        inStock: true,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Váy Midi Hoa Nhí",
        description:
          "Váy midi hoa nhí dáng xòe nhẹ nhàng, nữ tính. Chất liệu voan mềm mại, thoáng mát. Thiết kế tay phồng xinh xắn, thắt eo tôn dáng.",
        mrp: 680000,
        price: 520000,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
        ],
        category: "Fashion",
        inStock: true,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Túi Xách Tote Canvas",
        description:
          "Túi tote canvas size lớn, thiết kế đơn giản tiện dụng. Chất liệu bền chắc, có túi nhỏ bên trong. Phù hợp đi học, đi làm, đi chơi.",
        mrp: 280000,
        price: 199000,
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        ],
        category: "Accessories",
        inStock: true,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Giày Sneaker Trắng Classic",
        description:
          "Giày sneaker trắng basic, thiết kế tối giản sang trọng. Đế cao su êm ái, chất liệu da PU cao cấp. Dễ phối đồ, phù hợp mọi phong cách.",
        mrp: 590000,
        price: 450000,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500",
        ],
        category: "Shoes",
        inStock: true,
        storeId: stores[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Áo Thun Oversized Premium",
        description:
          "Áo thun form rộng chất cotton 100%, mềm mại thoáng mát. Nhiều màu sắc basic dễ phối. Unisex phù hợp cả nam và nữ.",
        mrp: 350000,
        price: 250000,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        ],
        category: "Fashion",
        inStock: true,
        storeId: stores[1].id,
      },
    }),

    // Home & Living Products (từ store pending)
    prisma.product.create({
      data: {
        name: "Bộ Chăn Ga Gối Cotton",
        description:
          "Bộ chăn ga gối 6 món cotton cao cấp, họa tiết tối giản hiện đại. Chất liệu thấm hút tốt, mềm mại.",
        mrp: 1200000,
        price: 950000,
        images: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
        ],
        category: "Home & Living",
        inStock: true,
        storeId: stores[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Đèn Ngủ LED Thông Minh",
        description:
          "Đèn ngủ LED có điều khiển từ xa, 16 màu thay đổi. Tiết kiệm điện, ánh sáng dịu nhẹ.",
        mrp: 450000,
        price: 320000,
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
        ],
        category: "Home & Living",
        inStock: true,
        storeId: stores[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create Addresses
  console.log("📍 Creating addresses...");
  const addresses = await Promise.all([
    // Buyer 1 có 2 địa chỉ
    prisma.address.create({
      data: {
        userId: "user_buyer_001",
        name: "Lê Văn C",
        email: "buyer1@example.com",
        street: "789 Võ Văn Tần",
        city: "TP.HCM",
        state: "Quận 3",
        zip: "70000",
        country: "Việt Nam",
        phone: "+84 908888888",
      },
    }),
    prisma.address.create({
      data: {
        userId: "user_buyer_001",
        name: "Lê Văn C (Văn phòng)",
        email: "buyer1@example.com",
        street: "123 Nguyễn Đình Chiểu",
        city: "TP.HCM",
        state: "Quận 1",
        zip: "70000",
        country: "Việt Nam",
        phone: "+84 908888888",
      },
    }),
    // Buyer 2
    prisma.address.create({
      data: {
        userId: "user_buyer_002",
        name: "Phạm Thị D",
        email: "buyer2@example.com",
        street: "321 Trần Hưng Đạo",
        city: "Hà Nội",
        state: "Hoàn Kiếm",
        zip: "10000",
        country: "Việt Nam",
        phone: "+84 909999999",
      },
    }),
    // Buyer 3 có 2 địa chỉ
    prisma.address.create({
      data: {
        userId: "user_buyer_003",
        name: "Đặng Thị F",
        email: "buyer3@example.com",
        street: "456 Lê Duẩn",
        city: "Đà Nẵng",
        state: "Hải Châu",
        zip: "50000",
        country: "Việt Nam",
        phone: "+84 905551234",
      },
    }),
    prisma.address.create({
      data: {
        userId: "user_buyer_003",
        name: "Đặng Thị F (Nhà cũ)",
        email: "buyer3@example.com",
        street: "789 Nguyễn Văn Linh",
        city: "Đà Nẵng",
        state: "Thanh Khê",
        zip: "50000",
        country: "Việt Nam",
        phone: "+84 905551234",
      },
    }),
  ]);

  console.log(`✅ Created ${addresses.length} addresses`);

  // Create Orders with OrderItems
  console.log("🛒 Creating orders...");
  const orders = await Promise.all([
    // Order đã giao (DELIVERED) - Đã thanh toán qua Stripe
    prisma.order.create({
      data: {
        total: 6490000,
        status: "DELIVERED",
        userId: "user_buyer_001",
        storeId: stores[0].id,
        addressId: addresses[0].id,
        isPaid: true,
        paymentMethod: "STRIPE",
        isCouponUsed: false,
        coupon: JSON.stringify({}),
        orderItems: {
          create: [
            {
              productId: products[2].id, // AirPods Pro 2
              quantity: 1,
              price: 6490000,
            },
          ],
        },
      },
    }),
    // Order đang giao (SHIPPED) - Đã thanh toán qua Stripe
    prisma.order.create({
      data: {
        total: 36480000,
        status: "SHIPPED",
        userId: "user_buyer_002",
        storeId: stores[0].id,
        addressId: addresses[2].id,
        isPaid: true,
        paymentMethod: "STRIPE",
        isCouponUsed: false,
        coupon: JSON.stringify({}),
        orderItems: {
          create: [
            {
              productId: products[1].id, // MacBook Air M3
              quantity: 1,
              price: 29990000,
            },
            {
              productId: products[2].id, // AirPods Pro 2
              quantity: 1,
              price: 6490000,
            },
          ],
        },
      },
    }),
    // Order đã giao (DELIVERED) - COD
    prisma.order.create({
      data: {
        total: 1070000,
        status: "DELIVERED",
        userId: "user_buyer_001",
        storeId: stores[1].id,
        addressId: addresses[0].id,
        isPaid: true,
        paymentMethod: "COD",
        isCouponUsed: false,
        coupon: JSON.stringify({}),
        orderItems: {
          create: [
            {
              productId: products[6].id, // Áo Khoác Denim
              quantity: 1,
              price: 650000,
            },
            {
              productId: products[7].id, // Quần Jeans
              quantity: 1,
              price: 420000,
            },
          ],
        },
      },
    }),
    // Order vừa đặt (ORDER_PLACED) - Chưa thanh toán - COD
    prisma.order.create({
      data: {
        total: 450000,
        status: "ORDER_PLACED",
        userId: "user_buyer_003",
        storeId: stores[1].id,
        addressId: addresses[3].id,
        isPaid: false, // Chưa thanh toán
        paymentMethod: "COD",
        isCouponUsed: false,
        coupon: JSON.stringify({}),
        orderItems: {
          create: [
            {
              productId: products[10].id, // Giày Sneaker
              quantity: 1,
              price: 450000,
            },
          ],
        },
      },
    }),
    // Order đang xử lý (PROCESSING) - Đã thanh toán qua Stripe - Có dùng coupon
    prisma.order.create({
      data: {
        total: 23392000, // Giá gốc 29490000 giảm 20% còn 23592000, trừ thêm coupon
        status: "PROCESSING",
        userId: "user_buyer_002",
        storeId: stores[0].id,
        addressId: addresses[2].id,
        isPaid: true,
        paymentMethod: "STRIPE",
        isCouponUsed: true,
        coupon: JSON.stringify({
          code: "MEMBER20",
          discount: 20,
          discountAmount: 5898000,
        }),
        orderItems: {
          create: [
            {
              productId: products[4].id, // Samsung Galaxy S24 Ultra (out of stock)
              quantity: 1,
              price: 29490000,
            },
          ],
        },
      },
    }),
    // Order đã giao - Có nhiều sản phẩm - Dùng coupon
    prisma.order.create({
      data: {
        total: 1188000, // Giá gốc 1320000 giảm 10% còn 1188000
        status: "DELIVERED",
        userId: "user_buyer_003",
        storeId: stores[1].id,
        addressId: addresses[3].id,
        isPaid: true,
        paymentMethod: "STRIPE",
        isCouponUsed: true,
        coupon: JSON.stringify({
          code: "WELCOME10",
          discount: 10,
          discountAmount: 132000,
        }),
        orderItems: {
          create: [
            {
              productId: products[8].id, // Váy Midi
              quantity: 1,
              price: 520000,
            },
            {
              productId: products[9].id, // Túi Xách
              quantity: 2,
              price: 398000, // 199000 x 2
            },
            {
              productId: products[11].id, // Áo Thun
              quantity: 1,
              price: 250000,
            },
          ],
        },
      },
    }),
    // Order chưa thanh toán - ORDER_PLACED
    prisma.order.create({
      data: {
        total: 32990000,
        status: "ORDER_PLACED",
        userId: "user_buyer_001",
        storeId: stores[0].id,
        addressId: addresses[1].id, // Địa chỉ văn phòng
        isPaid: false, // Chưa thanh toán
        paymentMethod: "STRIPE",
        isCouponUsed: false,
        coupon: JSON.stringify({}),
        orderItems: {
          create: [
            {
              productId: products[0].id, // iPhone 15 Pro Max
              quantity: 1,
              price: 32990000,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  // Create Ratings
  console.log("⭐ Creating ratings...");
  const ratings = await Promise.all([
    // Rating 5 sao
    prisma.rating.create({
      data: {
        rating: 5,
        review:
          "Sản phẩm rất tuyệt vời! Âm thanh trong trẻo, chống ồn hiệu quả. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng với mua sắm này!",
        userId: "user_buyer_001",
        productId: products[2].id, // AirPods Pro 2
        orderId: orders[0].id,
      },
    }),
    // Rating 5 sao
    prisma.rating.create({
      data: {
        rating: 5,
        review:
          "Áo khoác đẹp lắm, chất vải dày dặn. Form rộng vừa vặn, mặc rất thoải mái và phong cách. Giá hợp lý, sẽ quay lại mua thêm!",
        userId: "user_buyer_001",
        productId: products[6].id, // Áo Khoác Denim
        orderId: orders[2].id,
      },
    }),
    // Rating 4 sao
    prisma.rating.create({
      data: {
        rating: 4,
        review:
          "Quần đẹp, form chuẩn. Chất vải co giãn tốt. Trừ 1 sao vì giao hơi lâu một chút nhưng nhìn chung ok.",
        userId: "user_buyer_001",
        productId: products[7].id, // Quần Jeans
        orderId: orders[2].id,
      },
    }),
    // Rating 5 sao - Nhiều sản phẩm
    prisma.rating.create({
      data: {
        rating: 5,
        review:
          "Váy xinh quá! Chất vải mềm mại, thoáng mát. Mặc vào rất nữ tính và thanh lịch. Rất đáng tiền!",
        userId: "user_buyer_003",
        productId: products[8].id, // Váy Midi
        orderId: orders[5].id,
      },
    }),
    // Rating 4 sao
    prisma.rating.create({
      data: {
        rating: 4,
        review:
          "Túi rộng rãi, đựng được nhiều đồ. Chất canvas bền chắc. Thiết kế đơn giản nhưng đẹp. Giá tốt!",
        userId: "user_buyer_003",
        productId: products[9].id, // Túi Xách
        orderId: orders[5].id,
      },
    }),
    // Rating 3 sao
    prisma.rating.create({
      data: {
        rating: 3,
        review:
          "Áo ổn, chất liệu cotton tốt. Tuy nhiên màu hơi khác ảnh một chút. Nhìn chung vẫn ok với giá này.",
        userId: "user_buyer_003",
        productId: products[11].id, // Áo Thun
        orderId: orders[5].id,
      },
    }),
    // Rating 5 sao - MacBook
    prisma.rating.create({
      data: {
        rating: 5,
        review:
          "MacBook Air M3 quá đỉnh! Hiệu năng mượt mà, pin trâu. Siêu mỏng nhẹ, thiết kế đẹp. Xứng đáng 5 sao!",
        userId: "user_buyer_002",
        productId: products[1].id, // MacBook Air M3
        orderId: orders[1].id,
      },
    }),
    // Rating 2 sao - Đánh giá tiêu cực
    prisma.rating.create({
      data: {
        rating: 2,
        review:
          "Sản phẩm hơi không như mong đợi. Giá hơi cao so với chất lượng. Giao hàng cũng chậm.",
        userId: "user_buyer_002",
        productId: products[2].id, // AirPods Pro 2
        orderId: orders[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${ratings.length} ratings`);

  // Create Coupons
  console.log("🎟️  Creating coupons...");
  const coupons = await Promise.all([
    // Coupon cho khách mới - Còn hạn - Public
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        description:
          "Giảm 10% cho khách hàng mới - Chào mừng bạn đến với Vendoor",
        discount: 10,
        forNewUser: true,
        forMember: false,
        isPublic: true,
        expiresAt: new Date("2025-12-31"),
      },
    }),
    // Coupon cho thành viên - Còn hạn - Private
    prisma.coupon.create({
      data: {
        code: "MEMBER20",
        description: "Giảm 20% dành riêng cho thành viên VIP",
        discount: 20,
        forNewUser: false,
        forMember: true,
        isPublic: false,
        expiresAt: new Date("2025-12-31"),
      },
    }),
    // Flash Sale - Còn hạn - Public
    prisma.coupon.create({
      data: {
        code: "FLASH50",
        description:
          "Flash Sale cuối tuần - Giảm ngay 50% cho đơn hàng đầu tiên",
        discount: 50,
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: new Date("2025-11-30"),
      },
    }),
    // Năm mới - Còn hạn - Public
    prisma.coupon.create({
      data: {
        code: "NEWYEAR2026",
        description: "Chúc mừng năm mới 2026 - Giảm 30% toàn bộ sản phẩm",
        discount: 30,
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: new Date("2026-01-31"),
      },
    }),
    // Black Friday - Còn hạn sắp hết
    prisma.coupon.create({
      data: {
        code: "BLACKFRIDAY",
        description: "Black Friday - Giảm 40% tất cả sản phẩm công nghệ",
        discount: 40,
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: new Date("2025-11-29"),
      },
    }),
    // Coupon đã hết hạn
    prisma.coupon.create({
      data: {
        code: "SUMMER2025",
        description: "Ưu đãi hè 2025 - Giảm 25% (ĐÃ HẾT HẠN)",
        discount: 25,
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: new Date("2025-08-31"), // Đã hết hạn
      },
    }),
    // Coupon cho member - Đã hết hạn
    prisma.coupon.create({
      data: {
        code: "OLDMEMBER15",
        description: "Ưu đãi thành viên cũ - Giảm 15% (ĐÃ HẾT HẠN)",
        discount: 15,
        forNewUser: false,
        forMember: true,
        isPublic: false,
        expiresAt: new Date("2025-09-30"), // Đã hết hạn
      },
    }),
  ]);

  console.log(`✅ Created ${coupons.length} coupons`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Stores: ${stores.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Addresses: ${addresses.length}`);
  console.log(`   - Orders: ${orders.length}`);
  console.log(`   - Ratings: ${ratings.length}`);
  console.log(`   - Coupons: ${coupons.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
