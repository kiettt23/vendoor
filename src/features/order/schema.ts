import { z } from "zod";

// ============================================
// CHECKOUT SCHEMA
// ============================================

/**
 * Checkout form validation schema
 *
 * **Why these validations:**
 * - Phone: Vietnamese format (10 digits, starts with 0)
 * - Email: Standard email validation
 * - Address fields: Ensure complete shipping info
 * - Optional note: For customer-vendor communication
 */
export const checkoutSchema = z.object({
  // Contact Info
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên quá dài"),

  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)")
    .length(10, "Số điện thoại phải có 10 số"),

  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),

  // Address
  address: z
    .string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ quá dài"),

  ward: z
    .string()
    .min(2, "Phường/Xã là bắt buộc")
    .max(50, "Tên phường/xã quá dài"),

  district: z
    .string()
    .min(2, "Quận/Huyện là bắt buộc")
    .max(50, "Tên quận/huyện quá dài"),

  city: z
    .string()
    .min(2, "Tỉnh/Thành phố là bắt buộc")
    .max(50, "Tên tỉnh/thành phố quá dài"),

  // Optional
  note: z.string().max(500, "Ghi chú quá dài (tối đa 500 ký tự)").optional(),
});

export type CheckoutFormInput = z.infer<typeof checkoutSchema>;

// ============================================
// ORDER STATUS SCHEMA (for vendor updates)
// ============================================

/**
 * Order status update validation
 *
 * **Status transition rules:**
 * - PENDING_PAYMENT → Can't update (waiting for payment)
 * - PENDING → PROCESSING (vendor accepts)
 * - PROCESSING → SHIPPED (vendor ships)
 * - SHIPPED → DELIVERED (delivery confirmed)
 * - Any → CANCELLED (before shipped)
 * - DELIVERED → REFUNDED (refund request)
 */
export const updateOrderStatusSchema = z
  .object({
    orderId: z.string().cuid("Order ID không hợp lệ"),

    status: z.enum([
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ]),

    // Tracking number (required for SHIPPED)
    trackingNumber: z.string().optional(),

    // Cancellation reason (required for CANCELLED)
    cancellationReason: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate trackingNumber when status is SHIPPED
    if (data.status === "SHIPPED" && !data.trackingNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mã vận đơn là bắt buộc khi gửi hàng",
        path: ["trackingNumber"],
      });
    }

    // Validate cancellationReason when status is CANCELLED
    if (data.status === "CANCELLED" && !data.cancellationReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lý do hủy đơn là bắt buộc",
        path: ["cancellationReason"],
      });
    }
  });

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
