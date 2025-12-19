"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TOAST_MESSAGES,
  showInfoToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";
import { useCart } from "@/entities/cart";
import {
  checkoutSchema,
  type CheckoutFormData,
  createOrders,
  validateCheckout,
} from "../index";

const CHECKOUT_INFO_KEY = "vendoor_checkout_info";

interface SavedCheckoutInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

function getSavedCheckoutInfo(): SavedCheckoutInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(CHECKOUT_INFO_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveCheckoutInfo(info: SavedCheckoutInfo) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHECKOUT_INFO_KEY, JSON.stringify(info));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Custom hook quản lý toàn bộ checkout form logic
 *
 * Responsibilities:
 * - Form state với react-hook-form
 * - Load/save checkout info từ localStorage
 * - Validate stock trước khi submit
 * - Xử lý COD và Stripe payment
 */
export function useCheckoutForm() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savedInfo = getSavedCheckoutInfo();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
      name: savedInfo?.name || "",
      phone: savedInfo?.phone || "",
      address: savedInfo?.address || "",
      city: savedInfo?.city || "",
      district: savedInfo?.district || "",
      ward: savedInfo?.ward || "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Step 1: Validate stock
      showInfoToast("order", "checkingStock");
      const validation = await validateCheckout(items);

      if (!validation.isValid) {
        validation.invalidItems.forEach((item) => {
          if (item.availableStock === 0) {
            showCustomToast.error(`"${item.productName}" đã hết hàng`);
          } else {
            showCustomToast.error(
              `"${item.productName}" chỉ còn ${item.availableStock} sản phẩm (bạn đang đặt ${item.requestedQuantity})`
            );
          }
        });
        setIsSubmitting(false);
        return;
      }

      // Step 2: Save shipping info for next time
      const { paymentMethod, note, email, ...shippingInfo } = data;
      saveCheckoutInfo(shippingInfo);

      // Step 3: Create orders
      showInfoToast("order", "creating");
      const result = await createOrders(
        items,
        { ...shippingInfo, email, note },
        paymentMethod
      );

      if (!result.success) {
        showErrorToast("cannotCreateOrder", result.error);
        setIsSubmitting(false);
        return;
      }

      // Step 4: Handle payment
      if (paymentMethod === "STRIPE") {
        showInfoToast("order", "redirecting");
        const response = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds: result.orders.map((o) => o.id),
            amount: result.totalAmount,
            customerEmail: data.email,
          }),
        });

        const { url, error } = await response.json();
        if (error) {
          showCustomToast.error(error);
          setIsSubmitting(false);
          return;
        }

        clearCart();
        router.push(url);
        return;
      }

      // COD: Success
      clearCart();
      showCustomToast.success(
        `${TOAST_MESSAGES.order.placed} ${result.orders.length} đơn hàng`
      );
      router.replace(
        `/orders?success=true&orders=${result.orders.map((o) => o.id).join(",")}`
      );
    } catch (error) {
      console.error("Checkout submit error:", error);
      showErrorToast("generic");
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
