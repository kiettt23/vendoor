import { toast } from "sonner";

export const TOAST_MESSAGES = {
  // Cart
  cart: {
    added: "Đã thêm vào giỏ hàng",
    removed: "Đã xóa khỏi giỏ hàng",
    updated: "Đã cập nhật giỏ hàng",
    cleared: "Đã xóa giỏ hàng",
    cannotAdd: "Không thể thêm",
    invalidQuantity: "Số lượng không hợp lệ",
  },

  // Wishlist
  wishlist: {
    added: "Đã thêm vào yêu thích",
    removed: "Đã xóa khỏi yêu thích",
    loginRequired: "Vui lòng đăng nhập để thêm vào yêu thích",
  },

  // Review
  review: {
    submitted: "Đã gửi đánh giá thành công!",
    updated: "Đã cập nhật đánh giá",
    deleted: "Đã xóa đánh giá",
    replyAdded: "Đã gửi phản hồi",
    replyDeleted: "Đã xóa phản hồi",
    ratingRequired: "Vui lòng chọn số sao đánh giá",
  },

  // Order
  order: {
    placed: "Đặt hàng thành công!",
    cancelled: "Đã hủy đơn hàng",
    statusUpdated: "Đã cập nhật trạng thái đơn hàng",
    checkingStock: "Đang kiểm tra tồn kho...",
    creating: "Đang tạo đơn hàng...",
    redirecting: "Đang chuyển đến trang thanh toán...",
  },

  // Vendor
  vendor: {
    registered: "Đã gửi đơn đăng ký thành công!",
    approved: "Đã duyệt người bán",
    rejected: "Đã từ chối người bán",
    productCreated: "Đã tạo sản phẩm",
    productUpdated: "Đã cập nhật sản phẩm",
    productDeleted: "Đã xóa sản phẩm",
    stockUpdated: "Cập nhật tồn kho thành công",
  },

  // Admin
  admin: {
    categoryCreated: "Đã tạo danh mục",
    categoryUpdated: "Đã cập nhật",
    categoryDeleted: "Đã xóa",
    categoryHasProducts: "Không thể xóa danh mục có sản phẩm",
  },

  // Auth
  auth: {
    loginSuccess: "Đăng nhập thành công",
    logoutSuccess: "Đăng xuất thành công",
    registerSuccess: "Đăng ký thành công",
    loginRequired: "Vui lòng đăng nhập để tiếp tục",
    passwordResetSent: "Đã gửi link đặt lại mật khẩu",
    passwordResetSuccess: "Đặt lại mật khẩu thành công",
  },

  // Profile
  profile: {
    updated: "Cập nhật thông tin thành công",
  },

  // AI
  ai: {
    generated: "Đã tạo thông tin sản phẩm từ AI!",
  },

  // Generic errors
  error: {
    generic: "Có lỗi xảy ra, vui lòng thử lại",
    network: "Lỗi kết nối, vui lòng kiểm tra internet",
    unauthorized: "Bạn không có quyền thực hiện thao tác này",
    notFound: "Không tìm thấy dữ liệu",
    validation: "Dữ liệu không hợp lệ",
    cannotCreateOrder: "Không thể tạo đơn hàng",
    invalidQuantity: "Số lượng không hợp lệ",
    uploadFailed: "Upload ảnh thất bại",
    imageRequired: "Vui lòng upload hình ảnh trước",
    invalidImageType: "Chỉ hỗ trợ file JPG, PNG, WebP, GIF",
    imageTooLarge: "File ảnh không được vượt quá 10MB",
  },
} as const;

// Type helpers
type ToastCategory = keyof typeof TOAST_MESSAGES;
type ToastKey<T extends ToastCategory> = keyof (typeof TOAST_MESSAGES)[T];

/**
 * Show success toast with centralized message
 * @example showToast("cart", "added") // "Đã thêm vào giỏ hàng"
 */
export function showToast<T extends Exclude<ToastCategory, "error">>(
  category: T,
  key: ToastKey<T>
): void {
  const message = TOAST_MESSAGES[category][key] as string;
  toast.success(message);
}

/**
 * Show error toast with centralized message
 * @example showErrorToast("generic") // "Có lỗi xảy ra..."
 * @example showErrorToast("generic", "Chi tiết lỗi") // "Chi tiết lỗi"
 */
export function showErrorToast(
  key: ToastKey<"error">,
  customMessage?: string
): void {
  const message = customMessage || (TOAST_MESSAGES.error[key] as string);
  toast.error(message);
}

/**
 * Show custom toast (không dùng message từ config)
 * Dùng khi cần message dynamic
 */
export const showCustomToast = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),
  error: (message: string, description?: string) =>
    toast.error(message, { description }),
  info: (message: string, description?: string) =>
    toast.info(message, { description }),
  warning: (message: string, description?: string) =>
    toast.warning(message, { description }),
};

/**
 * Show info toast with centralized message
 * @example showInfoToast("order", "checkingStock")
 */
export function showInfoToast<T extends Exclude<ToastCategory, "error">>(
  category: T,
  key: ToastKey<T>
): void {
  const message = TOAST_MESSAGES[category][key] as string;
  toast.info(message);
}

/**
 * Confirmation dialog messages
 *
 * Sử dụng với window.confirm() hoặc custom confirm dialog
 *
 * @example
 * ```ts
 * if (confirm(CONFIRM_MESSAGES.deleteProduct)) {
 *   // Delete logic
 * }
 * ```
 */
export const CONFIRM_MESSAGES = {
  // Product
  deleteProduct: "Xác nhận xóa sản phẩm này?",
  deleteVariant: "Xác nhận xóa biến thể này?",

  // Category
  deleteCategory: "Xác nhận xóa danh mục này?",

  // Review
  deleteReview: "Xác nhận xóa đánh giá này?",
  deleteReply: "Xác nhận xóa phản hồi?",

  // Order
  cancelOrder: "Xác nhận hủy đơn hàng?",
  updateOrderStatus: "Xác nhận cập nhật trạng thái đơn hàng?",

  // Vendor
  rejectVendor: "Xác nhận từ chối vendor này?",
  approveVendor: "Xác nhận duyệt vendor này?",
  suspendVendor: "Xác nhận tạm ngưng vendor này?",

  // Cart
  clearCart: "Xác nhận xóa tất cả sản phẩm trong giỏ hàng?",
  removeCartItem: "Xác nhận xóa sản phẩm khỏi giỏ hàng?",

  // General
  unsavedChanges: "Bạn có thay đổi chưa lưu. Xác nhận rời khỏi trang?",
  permanentAction: "Hành động này không thể hoàn tác. Tiếp tục?",
} as const;
