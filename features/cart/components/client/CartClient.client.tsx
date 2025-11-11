"use client";

import { useCart, type CartProduct } from "@/features/cart/index.client";
import { CartCounter } from "./CartCounter.client";
import OrderSummary from "@/components/features/order/OrderSummary";
import PageTitle from "@/components/ui/PageTitle";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartClientProps {
  products: CartProduct[];
}

export function CartClient({ products }: CartClientProps) {
  const { items, removeItem } = useCart();
  const [cartArray, setCartArray] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      setTotalPrice(0);
      const newCartArray: CartProduct[] = [];
      
      for (const [productId, quantity] of Object.entries(items)) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          newCartArray.push({
            ...product,
            quantity,
          });
          setTotalPrice((prev) => prev + product.price * quantity);
        }
      }
      
      setCartArray(newCartArray);
    } else {
      setCartArray([]);
      setTotalPrice(0);
    }
  }, [items, products]);

  const handleDeleteItem = (productId: string) => {
    removeItem(productId);
  };

  if (cartArray.length === 0) {
    return (
      <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Giỏ hàng của bạn đang trống
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
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
              {cartArray.map((item) => (
                <tr key={item.id} className="space-x-2">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                      <Image
                        src={item.images[0]}
                        className="h-14 w-auto"
                        alt={item.name}
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
                    <CartCounter productId={item.id} />
                  </td>
                  <td className="text-center">
                    {(item.price * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
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
            items={cartArray}
          />
        </div>
      </div>
    </div>
  );
}
