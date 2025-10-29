import { z } from "zod";
import { ORDER_STATUS, STORE_STATUS } from "../constants";

export const createProductSchema = z
  .object({
    name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    price: z.number().positive("Giá phải lớn hơn 0"),
    mrp: z.number().positive("Giá gốc phải lớn hơn 0"),
    category: z.string().min(1, "Vui lòng chọn danh mục"),
    images: z.array(z.string()).min(1, "Phải có ít nhất 1 hình ảnh"),
    storeId: z.string(),
  })
  .refine((data) => data.mrp >= data.price, {
    message: "Giá gốc phải lớn hơn hoặc bằng giá bán",
    path: ["mrp"],
  });

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng"),
  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
      })
    )
    .min(1, "Giỏ hàng không được rỗng"),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["COD", "STRIPE"], {
    errorMap: () => ({ message: "Phương thức thanh toán không hợp lệ" }),
  }),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID không hợp lệ"),
  status: z.enum(Object.values(ORDER_STATUS)),
});

export const createStoreSchema = z.object({
  name: z.string().min(3, "Tên cửa hàng phải có ít nhất 3 ký tự"),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(20, "Username không quá 20 ký tự")
    .regex(/^[a-z0-9_]+$/, "Username chỉ chứa chữ thường, số và dấu gạch dưới"),
  description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  contact: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  logo: z.string().url("Logo URL không hợp lệ"),
});

export const approveStoreSchema = z.object({
  storeId: z.string().min(1, "Store ID không hợp lệ"),
  status: z.enum([STORE_STATUS.APPROVED, STORE_STATUS.REJECTED]),
});

export const toggleStoreSchema = z.object({
  storeId: z.string().min(1, "Store ID không hợp lệ"),
});

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Mã giảm giá phải có ít nhất 3 ký tự")
    .max(20, "Mã giảm giá không quá 20 ký tự")
    .regex(/^[A-Z0-9]+$/, "Mã giảm giá chỉ chứa chữ in hoa và số"),
  discount: z
    .number()
    .min(1, "Giảm giá phải ít nhất 1%")
    .max(100, "Giảm giá không quá 100%"),
  expiresAt: z.string().or(z.date()),
  forNewUser: z.boolean().optional(),
  forMember: z.boolean().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã giảm giá"),
});

export const createRatingSchema = z.object({
  productId: z.string().min(1, "Product ID không hợp lệ"),
  orderId: z.string().min(1, "Order ID không hợp lệ"),
  rating: z
    .number()
    .int()
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),
  comment: z.string().optional(),
});

export const saveAddressSchema = z.object({
  address: z.object({
    name: z.string().min(2, "Tên người nhận phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
    street: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
    city: z.string().min(2, "Tên thành phố không hợp lệ"),
    state: z.string().min(2, "Tên tỉnh/thành không hợp lệ"),
    zip: z.string().min(4, "Mã bưu điện không hợp lệ"),
    country: z.string().min(2, "Tên quốc gia không hợp lệ"),
  }),
});

export const saveCartSchema = z.object({
  cart: z.union([
    // Support array format: [{ id, quantity }]
    z.array(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive(),
      })
    ),
    // Support object format: { productId: quantity }
    z.record(z.string(), z.number().int().positive()),
  ]),
});

export const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  inStock: z.boolean().optional(),
  storeId: z.string().optional(),
});

export const toggleStockSchema = z.object({
  productId: z.string().min(1, "Product ID không hợp lệ"),
});
