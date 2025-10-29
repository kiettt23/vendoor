"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CURRENCY_SYMBOL, RATING } from "@/lib/constants";

const ProductCard = ({ product }) => {
  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className=" group max-xl:mx-auto"
      data-testid="product-card"
    >
      <div className="bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center">
        <Image
          width={500}
          height={500}
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300"
          src={product.images[0]}
          alt=""
        />
      </div>
      <div className="flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60">
        <div>
          <p>{product.name}</p>
          <div className="flex">
            {Array.from({ length: RATING.MAX_STARS }, (_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={
                  rating >= index + 1
                    ? RATING.ACTIVE_COLOR
                    : RATING.INACTIVE_COLOR
                }
              />
            ))}
          </div>
        </div>
        <p>
          {product.price}
          {CURRENCY_SYMBOL}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
