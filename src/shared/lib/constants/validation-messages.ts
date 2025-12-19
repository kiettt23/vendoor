/**
 * Centralized validation error messages (Vietnamese)
 *
 * Sử dụng trong Zod schemas để đảm bảo consistency
 */

// ============================================================================
// Generic Messages
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: "Trường này là bắt buộc",
  invalidFormat: "Định dạng không hợp lệ",

  // String
  minLength: (min: number) => `Tối thiểu ${min} ký tự`,
  maxLength: (max: number) => `Tối đa ${max} ký tự`,

  // Number
  minValue: (min: number) => `Giá trị tối thiểu là ${min}`,
  maxValue: (max: number) => `Giá trị tối đa là ${max}`,
  positiveNumber: "Phải là số dương",

  // Boolean
  mustAccept: "Bạn phải đồng ý với điều khoản này",

  // ============================================================================
  // Product Validation Messages
  // ============================================================================

  product: {
    nameRequired: "Tên sản phẩm là bắt buộc",
    nameMinLength: "Tên sản phẩm phải có ít nhất 3 ký tự",
    nameMaxLength: "Tên sản phẩm không được vượt quá 255 ký tự",

    descriptionMinLength: "Mô tả phải có ít nhất 10 ký tự",
    descriptionMaxLength: "Mô tả không được vượt quá 10000 ký tự",

    priceRequired: "Giá sản phẩm là bắt buộc",
    priceMin: "Giá phải lớn hơn 0",
    priceMax: "Giá không được vượt quá 1 tỷ VND",

    compareAtPriceMin: "Giá so sánh phải lớn hơn giá bán",

    stockRequired: "Số lượng tồn kho là bắt buộc",
    stockMin: "Số lượng phải lớn hơn hoặc bằng 0",
    stockMax: "Số lượng không được vượt quá 100,000",

    skuRequired: "SKU là bắt buộc",
    skuMinLength: "SKU phải có ít nhất 1 ký tự",
    skuMaxLength: "SKU không được vượt quá 100 ký tự",

    categoryRequired: "Danh mục là bắt buộc",

    imageUrl: "URL hình ảnh không hợp lệ",

    // Variant
    variantNameMaxLength: "Tên biến thể không được vượt quá 100 ký tự",
    variantSizeMaxLength: "Kích thước không được vượt quá 50 ký tự",
    variantColorMaxLength: "Màu sắc không được vượt quá 50 ký tự",
  },

  // ============================================================================
  // Checkout Validation Messages
  // ============================================================================

  checkout: {
    nameRequired: "Tên người nhận là bắt buộc",
    nameMinLength: "Tên phải có ít nhất 2 ký tự",
    nameMaxLength: "Tên không được vượt quá 100 ký tự",

    phoneRequired: "Số điện thoại là bắt buộc",
    phoneInvalid: "Số điện thoại không hợp lệ (VD: 0901234567 hoặc +84901234567)",
    phoneMinLength: "Số điện thoại phải có ít nhất 10 số",

    emailInvalid: "Email không hợp lệ",
    emailMaxLength: "Email không được vượt quá 100 ký tự",

    addressRequired: "Địa chỉ là bắt buộc",
    addressMinLength: "Địa chỉ phải có ít nhất 5 ký tự",
    addressMaxLength: "Địa chỉ không được vượt quá 200 ký tự",

    wardRequired: "Phường/Xã là bắt buộc",
    districtRequired: "Quận/Huyện là bắt buộc",
    cityRequired: "Tỉnh/Thành phố là bắt buộc",

    paymentMethodRequired: "Phương thức thanh toán là bắt buộc",
    paymentMethodInvalid: "Phương thức thanh toán không hợp lệ",

    noteMaxLength: "Ghi chú không được vượt quá 500 ký tự",
  },

  // ============================================================================
  // Auth Validation Messages
  // ============================================================================

  auth: {
    emailRequired: "Email là bắt buộc",
    emailInvalid: "Email không hợp lệ",
    emailMaxLength: "Email không được vượt quá 100 ký tự",

    passwordRequired: "Mật khẩu là bắt buộc",
    passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự",
    passwordMaxLength: "Mật khẩu không được vượt quá 100 ký tự",
    passwordStrength: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",

    passwordMismatch: "Mật khẩu không khớp",
    confirmPasswordRequired: "Xác nhận mật khẩu là bắt buộc",

    nameRequired: "Tên là bắt buộc",
    nameMinLength: "Tên phải có ít nhất 2 ký tự",
    nameMaxLength: "Tên không được vượt quá 50 ký tự",

    phoneInvalid: "Số điện thoại không hợp lệ",
  },

  // ============================================================================
  // Review Validation Messages
  // ============================================================================

  review: {
    ratingRequired: "Đánh giá sao là bắt buộc",
    ratingMin: "Đánh giá phải từ 1 đến 5 sao",
    ratingMax: "Đánh giá phải từ 1 đến 5 sao",

    titleMaxLength: "Tiêu đề không được vượt quá 100 ký tự",

    contentMinLength: "Nội dung phải có ít nhất 10 ký tự",
    contentMaxLength: "Nội dung không được vượt quá 1000 ký tự",

    productIdRequired: "Sản phẩm là bắt buộc",

    imagesMaxLength: "Tối đa 5 hình ảnh",

    replyMinLength: "Phản hồi phải có ít nhất 10 ký tự",
    replyMaxLength: "Phản hồi không được vượt quá 500 ký tự",
  },

  // ============================================================================
  // Vendor Validation Messages
  // ============================================================================

  vendor: {
    shopNameRequired: "Tên cửa hàng là bắt buộc",
    shopNameMinLength: "Tên cửa hàng phải có ít nhất 3 ký tự",
    shopNameMaxLength: "Tên cửa hàng không được vượt quá 100 ký tự",

    descriptionMinLength: "Mô tả phải có ít nhất 10 ký tự",
    descriptionMaxLength: "Mô tả không được vượt quá 1000 ký tự",

    logoUrl: "URL logo không hợp lệ",
    bannerUrl: "URL banner không hợp lệ",

    commissionMin: "Hoa hồng phải từ 0% đến 100%",
    commissionMax: "Hoa hồng phải từ 0% đến 100%",
  },

  // ============================================================================
  // Category Validation Messages
  // ============================================================================

  category: {
    nameRequired: "Tên danh mục là bắt buộc",
    nameMinLength: "Tên danh mục phải có ít nhất 2 ký tự",
    nameMaxLength: "Tên danh mục không được vượt quá 50 ký tự",
    nameUnique: "Tên danh mục đã tồn tại",

    slugInvalid: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
  },

  // ============================================================================
  // Order Validation Messages
  // ============================================================================

  order: {
    statusRequired: "Trạng thái đơn hàng là bắt buộc",
    statusInvalid: "Trạng thái đơn hàng không hợp lệ",

    trackingCodeMaxLength: "Mã vận đơn không được vượt quá 100 ký tự",

    cancelReasonRequired: "Lý do hủy là bắt buộc",
    cancelReasonMinLength: "Lý do hủy phải có ít nhất 10 ký tự",
    cancelReasonMaxLength: "Lý do hủy không được vượt quá 500 ký tự",
  },

  // ============================================================================
  // File Upload Validation Messages
  // ============================================================================

  upload: {
    fileRequired: "File là bắt buộc",
    fileTypeInvalid: "Loại file không được hỗ trợ",
    fileSizeMax: (maxMB: number) => `Kích thước file không được vượt quá ${maxMB}MB`,
    imageOnly: "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)",
  },
} as const;

// ============================================================================
// Helper type for type safety
// ============================================================================

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
