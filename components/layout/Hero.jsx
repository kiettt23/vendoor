"use client";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesMarquee from "../features/CategoriesMarquee";
import { formatPrice } from "@/lib/i18n";

const Hero = () => {
  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
        <div className="relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group">
          <div className="p-5 sm:p-16">
            <div className="inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm">
              <span className="bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">
                MỚI
              </span>{" "}
              Miễn phí vận chuyển cho đơn hàng trên {formatPrice(200000)}!{" "}
              <ChevronRightIcon
                className="group-hover:ml-2 transition-all"
                size={16}
              />
            </div>
            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-linear-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs  sm:max-w-md">
              Công nghệ tuyệt vời. Giá cả hợp lý.
            </h2>
            <div className="text-slate-800 text-sm font-medium mt-4 sm:mt-8">
              <p>Chỉ từ</p>
              <p className="text-3xl">{formatPrice(200000)}</p>
            </div>
            <button className="bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition">
              XEM THÊM
            </button>
          </div>
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
            src="/images/hero_model_img.png"
            alt="Hero"
            width={400}
            height={400}
          />
        </div>

        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          <div className="flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium bg-linear-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40">
                Sản phẩm tốt nhất
              </p>
              <p className="flex items-center gap-1 mt-4">
                Xem thêm{" "}
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                />{" "}
              </p>
            </div>
            <Image
              className="w-35"
              src="/images/hero_product_img1.png"
              alt="Product"
              width={140}
              height={140}
            />
          </div>

          <div className="flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium bg-linear-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40">
                Giảm giá 10%
              </p>
              <p className="flex items-center gap-1 mt-4">
                Xem thêm{" "}
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                />{" "}
              </p>
            </div>
            <Image
              className="w-35"
              src="/images/hero_product_img2.png"
              alt="Product"
              width={140}
              height={140}
            />
          </div>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
};

export default Hero;
