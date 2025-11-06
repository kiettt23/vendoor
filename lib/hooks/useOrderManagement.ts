/**
 * useOrderManagement - Reusable order management logic
 * Separates business logic from UI components
 */

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { applyCoupon, createOrder } from "@/lib/actions/user/order.action";
import type { Coupon } from "@/types";
import { vi } from "@/lib/i18n";

interface OrderItem {
  id: string;
  productId?: string;
  quantity: number;
  price: number;
  name?: string;
}

export function useOrderManagement() {
  const { user } = useUser();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const handleApplyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast(vi.messages.loginRequired);
      return;
    }

    const result = await applyCoupon(couponCodeInput);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setCoupon(result.coupon);
    toast.success(vi.messages.couponApplied);
  };

  const handlePlaceOrder = async (items: OrderItem[]) => {
    if (!user) {
      toast(vi.messages.loginRequired);
      return;
    }

    if (!selectedAddress) {
      toast("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const orderData: any = {
      addressId: selectedAddress.id,
      items: items.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      })),
      paymentMethod,
    };

    if (coupon) {
      orderData.couponCode = coupon.code;
    }

    const result = await createOrder(orderData);

    if (!result.success) {
      toast.error(result.message || "Không thể đặt hàng");
      return;
    }

    if (paymentMethod === "STRIPE" && result.session) {
      window.location.href = result.session.url;
    } else {
      toast.success(result.message);
      router.push("/orders");
      window.location.reload();
    }
  };

  const removeCoupon = () => setCoupon(null);

  return {
    paymentMethod,
    setPaymentMethod,
    selectedAddress,
    setSelectedAddress,
    couponCodeInput,
    setCouponCodeInput,
    coupon,
    handleApplyCoupon,
    handlePlaceOrder,
    removeCoupon,
  };
}
