// Cấu hình ngôn ngữ tiếng Việt cho toàn bộ ứng dụng
export const vi = {
  // Navigation
  nav: {
    home: "Trang chủ",
    shop: "Cửa hàng",
    about: "Giới thiệu",
    contact: "Liên hệ",
    cart: "Giỏ hàng",
    login: "Đăng nhập",
    logout: "Đăng xuất",
    myOrders: "Đơn hàng của tôi",
    searchPlaceholder: "Tìm kiếm sản phẩm...",
    myStore: "Cửa hàng của tôi",
    createStore: "Tạo cửa hàng",
    adminPanel: "Quản trị",
  },

  // Common
  common: {
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    edit: "Sửa",
    add: "Thêm",
    update: "Cập nhật",
    submit: "Gửi",
    confirm: "Xác nhận",
    back: "Quay lại",
    next: "Tiếp theo",
    previous: "Trước",
    search: "Tìm kiếm",
    filter: "Lọc",
    sort: "Sắp xếp",
    loading: "Đang tải...",
    noData: "Không có dữ liệu",
    error: "Đã có lỗi xảy ra",
    success: "Thành công",
    viewAll: "Xem tất cả",
    viewDetails: "Xem chi tiết",
    close: "Đóng",
    yes: "Có",
    no: "Không",
  },

  // Product
  product: {
    name: "Tên sản phẩm",
    description: "Mô tả",
    price: "Giá",
    mrp: "Giá niêm yết",
    discount: "Giảm giá",
    category: "Danh mục",
    inStock: "Còn hàng",
    outOfStock: "Hết hàng",
    addToCart: "Thêm vào giỏ",
    buyNow: "Mua ngay",
    quantity: "Số lượng",
    images: "Hình ảnh",
    rating: "Đánh giá",
    reviews: "Nhận xét",
    productDetails: "Chi tiết sản phẩm",
    relatedProducts: "Sản phẩm liên quan",
    latestProducts: "Sản phẩm mới nhất",
    bestSelling: "Bán chạy nhất",
    specifications: "Thông số kỹ thuật",
    writeReview: "Viết đánh giá",
    noReviews: "Chưa có đánh giá",
  },

  // Cart
  cart: {
    title: "Giỏ hàng",
    emptyCart: "Giỏ hàng trống",
    continueShopping: "Tiếp tục mua sắm",
    subtotal: "Tạm tính",
    total: "Tổng cộng",
    checkout: "Thanh toán",
    removeItem: "Xóa khỏi giỏ",
    updateCart: "Cập nhật giỏ hàng",
    applyCoupon: "Áp dụng mã giảm giá",
    couponCode: "Mã giảm giá",
    discount: "Giảm giá",
    shipping: "Phí vận chuyển",
    freeShipping: "Miễn phí vận chuyển",
  },

  // Order
  order: {
    title: "Đơn hàng",
    orderNumber: "Mã đơn hàng",
    orderDate: "Ngày đặt",
    orderStatus: "Trạng thái",
    orderTotal: "Tổng tiền",
    orderDetails: "Chi tiết đơn hàng",
    shippingAddress: "Địa chỉ giao hàng",
    paymentMethod: "Phương thức thanh toán",
    orderPlaced: "Đã đặt hàng",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
    trackOrder: "Theo dõi đơn hàng",
    cancelOrder: "Hủy đơn hàng",
    myOrders: "Đơn hàng của tôi",
    noOrders: "Chưa có đơn hàng nào",
    orderSummary: "Tóm tắt đơn hàng",
    orderConfirmation: "Xác nhận đơn hàng",
    thankYou: "Cảm ơn bạn đã đặt hàng!",
  },

  // Payment
  payment: {
    cod: "Thanh toán khi nhận hàng",
    stripe: "Thanh toán online",
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    paymentSuccess: "Thanh toán thành công",
    paymentFailed: "Thanh toán thất bại",
    payNow: "Thanh toán ngay",
  },

  // Address
  address: {
    title: "Địa chỉ",
    addAddress: "Thêm địa chỉ",
    editAddress: "Sửa địa chỉ",
    deleteAddress: "Xóa địa chỉ",
    selectAddress: "Chọn địa chỉ",
    name: "Họ tên",
    email: "Email",
    phone: "Số điện thoại",
    street: "Địa chỉ",
    city: "Thành phố",
    state: "Quận/Huyện",
    zip: "Mã bưu điện",
    country: "Quốc gia",
    vietnam: "Việt Nam",
    noAddress: "Chưa có địa chỉ nào",
    defaultAddress: "Địa chỉ mặc định",
  },

  // Store
  store: {
    title: "Cửa hàng",
    storeName: "Tên cửa hàng",
    storeDescription: "Mô tả cửa hàng",
    createStore: "Tạo cửa hàng",
    myStore: "Cửa hàng của tôi",
    manageProducts: "Quản lý sản phẩm",
    addProduct: "Thêm sản phẩm",
    editProduct: "Sửa sản phẩm",
    deleteProduct: "Xóa sản phẩm",
    storeOrders: "Đơn hàng",
    storeDashboard: "Bảng điều khiển",
    storeSettings: "Cài đặt cửa hàng",
    storeLogo: "Logo cửa hàng",
    storeContact: "Liên hệ",
    storeAddress: "Địa chỉ cửa hàng",
    storeUsername: "Tên định danh",
    pendingApproval: "Đang chờ duyệt",
    approved: "Đã duyệt",
    active: "Hoạt động",
    inactive: "Không hoạt động",
    noStore: "Bạn chưa có cửa hàng",
    createStoreNow: "Tạo cửa hàng ngay",
  },

  // Admin
  admin: {
    dashboard: "Bảng điều khiển",
    users: "Người dùng",
    stores: "Cửa hàng",
    products: "Sản phẩm",
    orders: "Đơn hàng",
    coupons: "Mã giảm giá",
    settings: "Cài đặt",
    approveStore: "Duyệt cửa hàng",
    rejectStore: "Từ chối",
    toggleStore: "Bật/Tắt cửa hàng",
    addCoupon: "Thêm mã giảm giá",
    editCoupon: "Sửa mã giảm giá",
    deleteCoupon: "Xóa mã giảm giá",
    statistics: "Thống kê",
    revenue: "Doanh thu",
    totalOrders: "Tổng đơn hàng",
    totalProducts: "Tổng sản phẩm",
    totalUsers: "Tổng người dùng",
  },

  // Coupon
  coupon: {
    code: "Mã giảm giá",
    description: "Mô tả",
    discount: "Giảm giá",
    forNewUser: "Dành cho khách mới",
    forMember: "Dành cho thành viên",
    isPublic: "Công khai",
    expiresAt: "Hết hạn",
    expired: "Đã hết hạn",
    apply: "Áp dụng",
    remove: "Xóa mã",
    invalidCoupon: "Mã giảm giá không hợp lệ",
    couponApplied: "Đã áp dụng mã giảm giá",
    youSave: "Bạn tiết kiệm",
  },

  // Rating & Review
  rating: {
    writeReview: "Viết đánh giá",
    yourRating: "Đánh giá của bạn",
    yourReview: "Nhận xét của bạn",
    submitReview: "Gửi đánh giá",
    editReview: "Sửa đánh giá",
    deleteReview: "Xóa đánh giá",
    stars: "sao",
    helpful: "Hữu ích",
    notHelpful: "Không hữu ích",
    verified: "Đã mua hàng",
    reviewGuidelines: "Hướng dẫn đánh giá",
  },

  // Hero Section
  hero: {
    title: "Nền tảng thương mại điện tử cho mọi người",
    subtitle: "Mua sắm dễ dàng - Bán hàng hiệu quả",
    shopNow: "Mua sắm ngay",
    sellNow: "Bắt đầu bán hàng",
    features: {
      freeShipping: "Miễn phí vận chuyển",
      securePayment: "Thanh toán an toàn",
      support247: "Hỗ trợ 24/7",
      easyReturn: "Đổi trả dễ dàng",
    },
  },

  // Footer
  footer: {
    aboutUs: "Về chúng tôi",
    contactUs: "Liên hệ",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Điều khoản dịch vụ",
    help: "Trợ giúp",
    faq: "Câu hỏi thường gặp",
    shipping: "Vận chuyển",
    returns: "Đổi trả",
    followUs: "Theo dõi chúng tôi",
    newsletter: "Đăng ký nhận tin",
    subscribeMessage: "Nhận thông tin về sản phẩm mới và ưu đãi",
    enterEmail: "Nhập email của bạn",
    subscribe: "Đăng ký",
    copyright: "Bản quyền",
    allRightsReserved: "Đã đăng ký bản quyền",
  },

  // Messages
  messages: {
    itemAddedToCart: "Đã thêm sản phẩm vào giỏ hàng",
    itemRemovedFromCart: "Đã xóa sản phẩm khỏi giỏ hàng",
    cartUpdated: "Đã cập nhật giỏ hàng",
    orderPlaced: "Đặt hàng thành công",
    orderCancelled: "Đã hủy đơn hàng",
    addressAdded: "Đã thêm địa chỉ",
    addressUpdated: "Đã cập nhật địa chỉ",
    addressDeleted: "Đã xóa địa chỉ",
    reviewSubmitted: "Đã gửi đánh giá",
    reviewUpdated: "Đã cập nhật đánh giá",
    reviewDeleted: "Đã xóa đánh giá",
    storeCreated: "Đã tạo cửa hàng",
    storeUpdated: "Đã cập nhật cửa hàng",
    productAdded: "Đã thêm sản phẩm",
    productUpdated: "Đã cập nhật sản phẩm",
    productDeleted: "Đã xóa sản phẩm",
    couponApplied: "Đã áp dụng mã giảm giá",
    couponRemoved: "Đã xóa mã giảm giá",
    loginRequired: "Vui lòng đăng nhập",
    loginSuccess: "Đăng nhập thành công",
    logoutSuccess: "Đăng xuất thành công",
    error: "Đã có lỗi xảy ra. Vui lòng thử lại",
    success: "Thành công",
    confirmDelete: "Bạn có chắc chắn muốn xóa?",
  },

  // Categories
  categories: {
    all: "Tất cả",
    electronics: "Điện tử",
    fashion: "Thời trang",
    accessories: "Phụ kiện",
    shoes: "Giày dép",
    homeLiving: "Nhà cửa & Đời sống",
    beauty: "Làm đẹp",
    sports: "Thể thao",
    books: "Sách",
    toys: "Đồ chơi",
    food: "Thực phẩm",
    other: "Khác",
  },

  // Time
  time: {
    justNow: "Vừa xong",
    minutesAgo: "phút trước",
    hoursAgo: "giờ trước",
    daysAgo: "ngày trước",
    weeksAgo: "tuần trước",
    monthsAgo: "tháng trước",
    yearsAgo: "năm trước",
  },
};

// Format tiền tệ VND
export function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Format số lượng
export function formatNumber(number) {
  return new Intl.NumberFormat("vi-VN").format(number);
}

// Format ngày tháng
export function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Format ngày giờ
export function formatDateTime(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default vi;
