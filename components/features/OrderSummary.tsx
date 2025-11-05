import { XIcon } from "lucide-react";
import React, { useState } from "react";
import AddressManager from "./AddressManager";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Protect, useUser } from "@clerk/nextjs";
import { fetchCart } from "@/lib/features/cart/cartSlice";
import { vi, formatPrice } from "@/lib/i18n";
import { APP_CONFIG } from "@/configs/app";
import { applyCoupon, createOrder } from "./actions/order";

const OrderSummary = ({ totalPrice, items }) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [coupon, setCoupon] = useState("");

  const handleCouponCode = async (event) => {
    event.preventDefault();
    try {
      if (!user) {
        return toast(vi.messages.loginRequired);
      }
      const result = await applyCoupon(couponCodeInput);

      if (!result.success) {
        return toast.error(result.error);
      }

      setCoupon(result.coupon);
      toast.success(vi.messages.couponApplied);
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        return toast(vi.messages.loginRequired);
      }
      if (!selectedAddress) {
        return toast("Vui lòng chọn địa chỉ giao hàng");
      }

      const orderData = {
        addressId: selectedAddress.id,
        items,
        paymentMethod,
      };

      if (coupon) {
        orderData.couponCode = coupon.code;
      }

      const result = await createOrder(orderData);

      if (paymentMethod === "STRIPE" && result.session) {
        window.location.href = result.session.url;
      } else {
        toast.success(result.message);
        router.push("/orders");
        // Refresh cart (note: may need to adjust this)
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">
        {vi.order.orderSummary}
      </h2>
      <p className="text-slate-400 text-xs my-4">{vi.payment.paymentMethod}</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-gray-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          {vi.payment.cod}
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
          {vi.payment.stripe}
        </label>
      </div>

      <AddressManager
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>{vi.cart.subtotal}:</p>
            <p>{vi.cart.shipping}:</p>
            {coupon && <p>{vi.coupon.discount}:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>{formatPrice(totalPrice)}</p>
            <p>
              <Protect
                plan={"plus"}
                fallback={formatPrice(APP_CONFIG.SHIPPING_FEE)}
              >
                {vi.cart.freeShipping}
              </Protect>
            </p>
            {coupon && (
              <p>-{formatPrice((coupon.discount / 100) * totalPrice)}</p>
            )}
          </div>
        </div>
        {!coupon ? (
          <form
            onSubmit={(e) =>
              toast.promise(handleCouponCode(e), {
                loading: "Đang kiểm tra mã...",
              })
            }
            className="flex justify-center gap-3 mt-3"
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder={vi.cart.couponCode}
              className="border border-slate-400 p-1.5 rounded w-full outline-none"
            />
            <button className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all">
              {vi.coupon.apply}
            </button>
          </form>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              {vi.coupon.code}:{" "}
              <span className="font-semibold ml-1">
                {coupon.code.toUpperCase()}
              </span>
            </p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon("")}
              className="hover:text-red-700 transition cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>{vi.cart.total}:</p>
        <p className="font-medium text-right">
          <Protect
            plan={"plus"}
            fallback={formatPrice(
              coupon
                ? totalPrice + 5000 - (coupon.discount / 100) * totalPrice
                : totalPrice + 5000
            )}
          >
            {formatPrice(
              coupon
                ? totalPrice - (coupon.discount / 100) * totalPrice
                : totalPrice
            )}
          </Protect>
        </p>
      </div>
      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "Đang đặt hàng..." })
        }
        className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all"
      >
        {vi.order.orderPlaced.replace("Đã đặt hàng", "Đặt hàng")}
      </button>
    </div>
  );
};

export default OrderSummary;
