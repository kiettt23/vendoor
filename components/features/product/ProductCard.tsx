"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatPrice } from "@/lib/utils/format/currency";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductRating {
  rating: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  rating: ProductRating[];
  inStock?: boolean;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Calculate the average rating of the product
  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group max-xl:mx-auto">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative bg-slate-50 h-40 sm:w-60 sm:h-68 rounded-t-lg flex items-center justify-center overflow-hidden">
          <Image
            width={500}
            height={500}
            className="max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition-transform duration-500 ease-out"
            src={product.images[0]}
            alt={product.name}
          />
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 font-bold"
            >
              -{discountPercent}%
            </Badge>
          )}
          {product.inStock === false && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Hết hàng
            </Badge>
          )}
        </div>
        <div className="p-3 space-y-1">
          <div className="flex justify-between gap-3 text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                {product.name}
              </p>
              <div className="flex mt-1">
                {Array(5)
                  .fill("")
                  .map((_, index) => (
                    <StarIcon
                      key={index}
                      size={12}
                      className="text-transparent"
                      fill={rating >= index + 1 ? "#9938CA" : "#D1D5DB"}
                    />
                  ))}
                <span className="text-xs text-slate-500 ml-1">
                  ({product.rating.length})
                </span>
              </div>
            </div>
            <div className="text-right">
              {hasDiscount ? (
                <>
                  <p className="font-bold text-purple-600 whitespace-nowrap">
                    {formatPrice(product.salePrice)}
                  </p>
                  <p className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </p>
                </>
              ) : (
                <p className="font-semibold text-slate-800 whitespace-nowrap">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
