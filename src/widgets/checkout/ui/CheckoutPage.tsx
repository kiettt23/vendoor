"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  ArrowLeft,
  ShoppingBag,
  Loader2,
  CreditCard,
  Banknote,
} from "lucide-react";
import {
  TOAST_MESSAGES,
  showInfoToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import {
  useCart,
  groupItemsByVendor,
  calculateCartTotals,
} from "@/entities/cart";
import {
  checkoutSchema,
  type CheckoutFormData,
  type PaymentMethod,
  createOrders,
  validateCheckout,
} from "@/features/checkout";
import { formatPrice } from "@/shared/lib";

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

export function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vendorGroups = groupItemsByVendor(items);
  const totals = calculateCartTotals(items);

  // Load saved checkout info
  const savedInfo = getSavedCheckoutInfo();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
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

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-6">
          Thêm sản phẩm trước khi thanh toán
        </p>
        <Button asChild>
          <Link href="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
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

      const { paymentMethod, note, email, ...shippingInfo } = data;

      // Lưu thông tin để dùng lại
      saveCheckoutInfo(shippingInfo);

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

      // Nếu là Stripe, redirect tới Stripe Checkout
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

        // Redirect to Stripe Checkout URL
        clearCart();
        router.push(url);
        return;
      }

      // COD: Xóa giỏ hàng và redirect
      clearCart();
      showCustomToast.success(
        `${TOAST_MESSAGES.order.placed} ${result.orders.length} đơn hàng`
      );
      router.replace(
        `/orders?success=true&orders=${result.orders
          .map((o) => o.id)
          .join(",")}`
      );
    } catch {
      showErrorToast("generic");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Liên Hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Họ tên *</Label>
                  <Input {...register("name")} placeholder="Nguyễn Văn A" />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Số điện thoại *</Label>
                  <Input {...register("phone")} placeholder="0901234567" />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Địa Chỉ Giao Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Địa chỉ *</Label>
                  <Input
                    {...register("address")}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phường/Xã *</Label>
                  <Input {...register("ward")} placeholder="Phường 1" />
                  {errors.ward && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.ward.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quận/Huyện *</Label>
                    <Input {...register("district")} placeholder="Quận 1" />
                    {errors.district && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Tỉnh/TP *</Label>
                    <Input {...register("city")} placeholder="TP.HCM" />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Ghi chú</Label>
                  <Textarea
                    {...register("note")}
                    placeholder="Ghi chú cho người bán..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương Thức Thanh Toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="COD"
                  onValueChange={(value: PaymentMethod) =>
                    setValue("paymentMethod", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Banknote className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Trả tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="STRIPE" id="stripe" />
                    <Label
                      htmlFor="stripe"
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, JCB... (Demo mode)
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-sm text-destructive mt-2">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </CardContent>
            </Card>

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
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Đơn Hàng ({totals.itemCount} sản phẩm)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendorGroups.map((group) => (
                <div key={group.vendorId} className="space-y-3">
                  <p className="font-semibold text-sm">{group.vendorName}</p>
                  {group.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded overflow-hidden bg-muted shrink-0">
                        <OptimizedImage
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(totals.shippingFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
