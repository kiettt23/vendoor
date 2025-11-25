"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutFormInput } from "../schema";
import type { CartItem } from "@/features/cart/types";
import { useCart } from "@/features/cart/hooks/useCart";
import { createOrders } from "../actions/create-orders";
import { validateCheckout } from "../actions/validate-checkout";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("Checkout");

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader2, ShoppingBag, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

// ============================================
// CHECKOUT FORM COMPONENT
// ============================================

/**
 * Checkout form with validation
 *
 * **Form fields:**
 * - Name, Phone, Email (contact info)
 * - Address, Ward, District, City (shipping address)
 * - Note (optional message to vendor)
 *
 * **Validation flow:**
 * 1. Client validation (Zod schema)
 * 2. Server validation (stock check)
 * 3. Create orders
 * 4. Mock payment (for now)
 * 5. Clear cart + redirect
 *
 * **Why React Hook Form:**
 * - Easy Zod integration
 * - Good error handling
 * - Better UX (field-level validation)
 */

interface CheckoutFormProps {
  items: CartItem[];
  onCheckoutStart?: () => void;
}

export function CheckoutForm({ items, onCheckoutStart }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // FORM SETUP
  // ============================================
  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      note: "",
    },
  });

  // ============================================
  // SUBMIT HANDLER
  // ============================================
  async function onSubmit(data: CheckoutFormInput) {
    setIsSubmitting(true);

    // Notify parent that checkout has started (prevent cart empty redirect)
    onCheckoutStart?.();

    try {
      // ============================================
      // 1. VALIDATE STOCK (Server-side)
      // ============================================
      toast.info("Đang kiểm tra tồn kho...");

      const validation = await validateCheckout(items);

      if (!validation.isValid) {
        toast.error("Có sản phẩm hết hàng hoặc không đủ số lượng");

        // Show specific errors
        validation.invalidItems.forEach((item) => {
          toast.error(
            `${item.productName} - ${item.variantName}: Chỉ còn ${item.availableStock} (yêu cầu ${item.requestedQuantity})`
          );
        });

        setIsSubmitting(false);
        return;
      }

      // ============================================
      // 2. CREATE ORDERS
      // ============================================
      toast.info("Đang tạo đơn hàng...");

      const result = await createOrders(items, data);

      if (!result.success) {
        toast.error(result.error || "Không thể tạo đơn hàng");
        setIsSubmitting(false);
        return;
      }

      // ============================================
      // 3. SUCCESS - Clear cart and redirect
      // ============================================
      // Clear cart immediately (no toast)
      useCart.getState().clearCart();

      // Prepare redirect URL
      const orderIds = result.orders.map((o) => o.id).join(",");

      // Show success toast
      toast.success(
        `Đặt hàng thành công! Đã tạo ${result.orders.length} đơn hàng`
      );

      // Navigate to success page (use replace to prevent back to checkout)
      router.replace(`/orders?orders=${orderIds}`);
    } catch (error) {
      logger.error("Checkout failed", error);

      // Better error messages
      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          toast.error(
            "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại."
          );
        } else if (error.message.includes("timeout")) {
          toast.error("Yêu cầu quá lâu. Vui lòng thử lại sau.");
        } else {
          toast.error(`Lỗi: ${error.message}`);
        }
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
      }

      setIsSubmitting(false);
    }
  }

  // ============================================
  // RENDER FORM
  // ============================================
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Mock Payment Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">Demo Mode:</span> Payment gateway chưa
          tích hợp. Đơn hàng sẽ được tạo với trạng thái &ldquo;Chờ thanh
          toán&rdquo;.
        </AlertDescription>
      </Alert>

      <FieldGroup>
        {/* Contact Information */}
        <FieldSet>
          <FieldLegend>Thông Tin Liên Hệ</FieldLegend>

          <FieldGroup>
            {/* Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Họ và tên *</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Nguyễn Văn A"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Số điện thoại *</FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    placeholder="0901234567"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {/* Shipping Address */}
        <FieldSet>
          <FieldLegend>Địa Chỉ Giao Hàng</FieldLegend>

          <FieldGroup>
            {/* Address */}
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Địa chỉ *</FieldLabel>
                  <Input
                    {...field}
                    id="address"
                    placeholder="Số nhà, tên đường"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Ward */}
            <Controller
              control={form.control}
              name="ward"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ward">Phường/Xã *</FieldLabel>
                  <Input
                    {...field}
                    id="ward"
                    placeholder="Phường 1"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* District + City (2 columns) */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="district"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="district">Quận/Huyện *</FieldLabel>
                    <Input
                      {...field}
                      id="district"
                      placeholder="Quận 1"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">Tỉnh/Thành phố *</FieldLabel>
                    <Input
                      {...field}
                      id="city"
                      placeholder="TP. Hồ Chí Minh"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        {/* Optional Note */}
        <FieldSet>
          <FieldLegend>Ghi Chú</FieldLegend>

          <FieldGroup>
            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="note">
                    Ghi chú cho người bán (tùy chọn)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="note"
                    placeholder="Ví dụ: Giao hàng sau 6pm, gọi trước khi giao..."
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Ghi chú sẽ được gửi đến người bán khi đặt hàng
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Đặt Hàng
          </>
        )}
      </Button>
    </form>
  );
}
