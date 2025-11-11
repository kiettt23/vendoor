"use client";

import { ArrowRight, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { vi } from "@/lib/i18n";
import { formatDate } from "@/lib/utils/format/date";
import type { ProductWithRating } from "@/types";

interface ProductDescriptionProps {
  product: ProductWithRating;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const [selectedTab, setSelectedTab] = useState("Description");

  const tabs = {
    Description: "Mô tả",
    Reviews: "Đánh giá",
  };

  return (
    <div className="my-18 text-sm text-slate-600">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
        {Object.entries(tabs).map(([key, label], index) => (
          <button
            className={`${
              key === selectedTab
                ? "border-b-[1.5px] font-semibold"
                : "text-slate-400"
            } px-3 py-2 font-medium`}
            key={index}
            onClick={() => setSelectedTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Description */}
      {selectedTab === "Description" && (
        <p className="max-w-xl">{product.description}</p>
      )}

      {/* Reviews */}
      {selectedTab === "Reviews" && (
        <div className="flex flex-col gap-3 mt-14">
          {product.rating.length === 0 ? (
            <p className="text-slate-400">{vi.product.noReviews}</p>
          ) : (
            product.rating.map((item, index) => (
              <div key={index} className="flex gap-5 mb-10">
                <Image
                  src={item.user.image}
                  alt={item.user.name}
                  className="size-10 rounded-full"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill("")
                      .map((_, index) => (
                        <StarIcon
                          key={index}
                          size={18}
                          className="text-transparent mt-0.5"
                          fill={
                            item.rating >= index + 1 ? "#9810FA" : "#D1D5DB"
                          }
                        />
                      ))}
                  </div>
                  <p className="text-sm max-w-lg my-4">{item.review}</p>
                  <p className="font-medium text-slate-800">{item.user.name}</p>
                  <p className="mt-3 font-light">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Store Page */}
      <div className="flex gap-3 mt-14">
        <Image
          src={product.store.logo || "/images/gs_logo.jpg"}
          alt={product.store.name}
          className="size-11 rounded-full ring ring-slate-400 object-cover"
          width={100}
          height={100}
        />
        <div>
          <p className="font-medium text-slate-600">
            Sản phẩm từ {product.store.name}
          </p>
          <Link
            href={`/shop/${product.store.username}`}
            className="flex items-center gap-1.5 text-purple-500"
          >
            {" "}
            Xem cửa hàng <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
