"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/shared/lib/format/currency";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { ProductCardProps } from "@/types";

export const ProductCard = ({ product }: ProductCardProps) => {
  // Calculate the average rating of the product
  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );

  // Calculate discount percentage (mrp vs price)
  const hasDiscount = product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group max-xl:mx-auto w-full max-w-[240px]"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col p-0">
        <div className="relative bg-slate-50 w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
          <Image
            width={500}
            height={500}
            className="max-h-[75%] w-auto group-hover:scale-110 transition-transform duration-500 ease-out object-contain"
            src={product.images[0]}
            alt={product.name}
          />
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 font-semibold bg-orange-500 hover:bg-orange-600 text-white border-0">
              -{discountPercent}%
            </Badge>
          )}
          {product.inStock === false && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Hết hàng
            </Badge>
          )}
        </div>
        <div className="p-3 space-y-1 flex-1 flex flex-col">
          <div className="flex justify-between gap-3 text-sm flex-1">
            <div className="flex-1 min-w-0 flex flex-col">
              <p className="font-medium text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                {product.name}
              </p>
              <div className="flex items-center mt-1">
                {Array(5)
                  .fill("")
                  .map((_, index) => (
                    <StarIcon
                      key={index}
                      size={12}
                      className="text-transparent"
                      fill={rating >= index + 1 ? "#9333EA" : "#D1D5DB"}
                    />
                  ))}
                <span className="text-xs text-slate-500 ml-1">
                  ({product.rating.length})
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col justify-start gap-0.5">
              <p className="font-semibold text-slate-800 whitespace-nowrap">
                {formatPrice(product.price)}
              </p>
              {hasDiscount && (
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(product.mrp)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
