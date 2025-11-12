import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/index.client";
import { applyCoupon, createOrder } from "@/features/orders/index.server";
import type { Coupon } from "@/features/coupons/types/coupon.types";

interface OrderItem {
  id: string;
  productId?: string;
  quantity: number;
  price: number;
  name?: string;
}

interface Address {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  phone: string;
}

export function useOrderManagement() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const handleApplyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast("Vui lòng đăng nhập để sử dụng mã giảm giá");
      return;
    }

    const result = await applyCoupon(couponCodeInput);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setCoupon(result.coupon ?? null);
    toast.success("Đã áp dụng mã giảm giá thành công!");
  };

  const handlePlaceOrder = async (items: OrderItem[]) => {
    if (!user) {
      toast("Vui lòng đăng nhập để đặt hàng");
      return;
    }

    if (!selectedAddress) {
      toast("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const orderData = {
      addressId: selectedAddress.id,
      items: items.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      })),
      paymentMethod,
      couponCode: coupon?.code,
    };

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
