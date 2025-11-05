// Error messages for the application

export const ERROR_MESSAGES = {
  // Auth
  AUTH: {
    UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện thao tác này",
    FORBIDDEN: "Bạn không có quyền truy cập",
    SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn",
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: "Vui lòng điền đầy đủ thông tin",
    INVALID_EMAIL: "Email không hợp lệ",
    INVALID_PHONE: "Số điện thoại không hợp lệ",
    INVALID_PRICE: "Giá không hợp lệ",
    PRICE_TOO_HIGH: "Giá bán không thể cao hơn giá niêm yết",
    INVALID_DISCOUNT: "Giảm giá phải từ 0 đến 100%",
    INVALID_DATE: "Ngày không hợp lệ",
    PAST_DATE: "Ngày phải sau ngày hiện tại",
  },

  // Product
  PRODUCT: {
    NOT_FOUND: "Không tìm thấy sản phẩm",
    OUT_OF_STOCK: "Sản phẩm đã hết hàng",
    INVALID_QUANTITY: "Số lượng không hợp lệ",
    NO_IMAGES: "Vui lòng tải lên ít nhất 1 hình ảnh",
    IMAGE_UPLOAD_FAILED: "Không thể tải lên hình ảnh",
    TOO_MANY_IMAGES: "Tối đa 5 hình ảnh",
  },

  // Order
  ORDER: {
    NOT_FOUND: "Không tìm thấy đơn hàng",
    INVALID_ADDRESS: "Địa chỉ không hợp lệ",
    EMPTY_CART: "Giỏ hàng trống",
    CANNOT_CANCEL: "Không thể hủy đơn hàng đã giao hoặc đang vận chuyển",
    INVALID_STATUS: "Trạng thái đơn hàng không hợp lệ",
  },

  // Coupon
  COUPON: {
    NOT_FOUND: "Mã giảm giá không tồn tại",
    EXPIRED: "Mã giảm giá đã hết hạn",
    ALREADY_EXISTS: "Mã giảm giá này đã tồn tại",
    NOT_ELIGIBLE: "Bạn không đủ điều kiện sử dụng mã này",
  },

  // Store
  STORE: {
    NOT_FOUND: "Không tìm thấy cửa hàng",
    NO_STORE: "Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước",
    NOT_APPROVED: "Cửa hàng của bạn chưa được phê duyệt",
    NOT_ACTIVE: "Cửa hàng của bạn chưa được kích hoạt",
    ALREADY_EXISTS: "Bạn đã có cửa hàng",
    USERNAME_TAKEN: "Tên cửa hàng đã được sử dụng",
  },

  // Address
  ADDRESS: {
    NOT_FOUND: "Không tìm thấy địa chỉ",
    INVALID: "Địa chỉ không hợp lệ",
  },

  // Generic
  GENERIC: {
    SOMETHING_WENT_WRONG: "Đã có lỗi xảy ra. Vui lòng thử lại",
    NETWORK_ERROR: "Lỗi kết nối. Vui lòng kiểm tra internet",
    SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau",
  },
} as const;

/**
 * Success messages for the application
 */
export const SUCCESS_MESSAGES = {
  // Product
  PRODUCT: {
    CREATED: "Đã thêm sản phẩm thành công!",
    UPDATED: "Đã cập nhật sản phẩm!",
    DELETED: "Đã xóa sản phẩm!",
    STOCK_UPDATED: "Đã cập nhật trạng thái hàng!",
  },

  // Order
  ORDER: {
    CREATED: "Đặt hàng thành công!",
    CANCELLED: "Đã hủy đơn hàng thành công!",
    STATUS_UPDATED: "Đã cập nhật trạng thái đơn hàng!",
  },

  // Coupon
  COUPON: {
    CREATED: "Đã tạo mã giảm giá!",
    DELETED: "Đã xóa mã giảm giá!",
    APPLIED: "Đã áp dụng mã giảm giá!",
  },

  // Store
  STORE: {
    CREATED: "Đã tạo cửa hàng thành công!",
    APPROVED: "Cửa hàng đã được phê duyệt!",
    REJECTED: "Cửa hàng đã bị từ chối!",
    ACTIVATED: "Cửa hàng đã được kích hoạt!",
    DEACTIVATED: "Cửa hàng đã bị vô hiệu hóa!",
  },

  // Address
  ADDRESS: {
    ADDED: "Đã thêm địa chỉ!",
    UPDATED: "Đã cập nhật địa chỉ!",
    DELETED: "Đã xóa địa chỉ!",
  },

  // Rating
  RATING: {
    ADDED: "Đã gửi đánh giá!",
    UPDATED: "Đã cập nhật đánh giá!",
    DELETED: "Đã xóa đánh giá!",
  },

  // Cart
  CART: {
    ITEM_ADDED: "Đã thêm vào giỏ hàng!",
    ITEM_REMOVED: "Đã xóa khỏi giỏ hàng!",
    UPDATED: "Đã cập nhật giỏ hàng!",
  },
} as const;
