"use client";
import Counter from "@/components/ui/Counter";
import OrderSummary from "@/components/features/order/OrderSummary";
import PageTitle from "@/components/ui/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cart-slice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import type { RootState } from "@/lib/store";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  [key: string]: any;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartClientProps {
  products: Product[];
}

export default function CartClient({ products }: CartClientProps) {
  const { cartItems } = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();

  const [cartArray, setCartArray] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      setTotalPrice(0);
      const newCartArray: CartItem[] = [];
      for (const [key, value] of Object.entries(cartItems)) {
        const product = products.find((product) => product.id === key);
        if (product) {
          newCartArray.push({
            ...product,
            quantity: value as number,
          });
          setTotalPrice((prev) => prev + product.price * (value as number));
        }
      }
      setCartArray(newCartArray);
    }
  }, [cartItems, products]);

  const handleDeleteItemFromCart = (productId: string) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto ">
        {/* Title */}
        <PageTitle
          heading="Giỏ hàng"
          text={`${cartArray.length} sản phẩm trong giỏ hàng`}
          linkText="Tiếp tục mua sắm"
        />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm">
                <th className="text-left">Sản phẩm</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th className="max-md:hidden">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartArray.map((item, index) => (
                <tr key={index} className="space-x-2">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                      <Image
                        src={item.images[0]}
                        className="h-14 w-auto"
                        alt=""
                        width={45}
                        height={45}
                      />
                    </div>
                    <div>
                      <p className="max-sm:text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                      <p>
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="text-center">
                    <Counter productId={item.id} />
                  </td>
                  <td className="text-center">
                    {(item.price * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleDeleteItemFromCart(item.id)}
                      className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <OrderSummary
            totalPrice={totalPrice}
            items={cartArray.map((item) => ({
              id: item.id,
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            }))}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">
        Giỏ hàng của bạn đang trống
      </h1>
    </div>
  );
}
