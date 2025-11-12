import { XIcon } from "lucide-react";
import { AddressManager } from "@/features/address/index.client";
import { toast } from "sonner";
import { useSession } from "@/features/auth/index.client";
import { formatPrice } from "@/shared/lib/format/currency";
import { APP_CONFIG } from "@/shared/configs/app";
import { useOrderManagement } from "@/features/orders/hooks/useOrderManagement";
import type { OrderSummaryProps } from "@/shared/types";

export const OrderSummary = ({ totalPrice, items }: OrderSummaryProps) => {
  const { data: session } = useSession();
  const user = session?.user;

  const hasPlusPlan = true;

  const {
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
  } = useOrderManagement();

  // Calculate shipping fee (0 for Plus members, 30000 for regular users)
  const shippingFee = hasPlusPlan ? 0 : APP_CONFIG.SHIPPING_FEE;

  // Calculate discount amount
  const discountAmount = coupon ? (coupon.discount / 100) * totalPrice : 0;

  // Calculate final total (for Plus members)
  const totalWithoutShipping = totalPrice - discountAmount;

  // Calculate final total (for regular users)
  const totalWithShipping =
    totalPrice + APP_CONFIG.SHIPPING_FEE - discountAmount;

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Tóm tắt đơn hàng</h2>
      <p className="text-slate-400 text-xs my-4">Phương thức thanh toán</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-gray-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          Thanh toán khi nhận hàng (COD)
        </label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          id="STRIPE"
          name="payment"
          onChange={() => setPaymentMethod("STRIPE")}
          checked={paymentMethod === "STRIPE"}
          className="accent-gray-500"
        />
        <label htmlFor="STRIPE" className="cursor-pointer">
          Thanh toán trực tuyến (Stripe)
        </label>
      </div>

      <AddressManager
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Tạm tính:</p>
            <p>Phí vận chuyển:</p>
            {coupon && <p>Giảm giá:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{formatPrice(totalPrice)}</p>
            <p>
              {hasPlusPlan ? "Miễn phí" : formatPrice(APP_CONFIG.SHIPPING_FEE)}
            </p>
            {coupon && (
              <p className="text-green-600">-{formatPrice(discountAmount)}</p>
            )}
          </div>
        </div>
        {!coupon ? (
          <form
            onSubmit={(e) =>
              toast.promise(handleApplyCoupon(e), {
                loading: "Đang kiểm tra mã...",
              })
            }
            className="flex justify-center gap-3 mt-3"
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder="Nhập mã giảm giá"
              className="border border-slate-400 p-1.5 rounded w-full outline-none"
            />
            <button className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all">
              Áp dụng
            </button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              Mã:{" "}
              <span className="font-semibold ml-1">
                {coupon.code.toUpperCase()}
              </span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={removeCoupon}
              className="hover:text-red-700 transition cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>Tổng cộng:</p>
        <p className="font-medium text-right">
          {hasPlusPlan
            ? formatPrice(totalWithoutShipping)
            : formatPrice(totalWithShipping)}
        </p>
      </div>
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(items), {
            loading: "Đang đặt hàng...",
          })
        }
        className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all"
      >
        Đặt hàng
      </button>
    </div>
  );
};
