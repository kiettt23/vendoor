"use client";

import { useCart } from "@/features/cart/index.client";
import { CartCounter, AddToCartButton } from "@/features/cart/index.client";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { vi } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils/format/currency";
import type { ProductWithRating } from "@/types";

interface ProductDetailsProps {
  product: ProductWithRating;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const productId = product.id;
  const { items } = useCart();
  const [mainImage, setMainImage] = useState(product.images[0]);

  const averageRating =
    product.rating.reduce((acc, item) => acc + item.rating, 0) /
    product.rating.length;

  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
            >
              <Image
                src={image}
                className="group-hover:scale-103 group-active:scale-95 transition"
                alt=""
                width={45}
                height={45}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
          <Image src={mainImage} alt="" width={250} height={250} />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">
          {product.name}
        </h1>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={averageRating >= index + 1 ? "#9810FA" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            {product.rating.length} {vi.product.reviews}
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>{formatPrice(product.price)}</p>
          <p className="text-xl text-slate-500 line-through">
            {formatPrice(product.mrp)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>
            Tiết kiệm{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
            ngay bây giờ
          </p>
        </div>
        <div className="flex items-end gap-5 mt-10">
          {items[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">
                {vi.product.quantity}
              </p>
              <CartCounter productId={productId} />
            </div>
          )}
          <AddToCartButton productId={productId} />
        </div>
        <hr className="border-gray-300 my-5" />
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            {" "}
            <EarthIcon className="text-slate-400" /> Miễn phí vận chuyển toàn
            quốc{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <CreditCardIcon className="text-slate-400" /> Thanh toán an toàn
            100%{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <UserIcon className="text-slate-400" /> Đánh giá cao từ khách hàng{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
