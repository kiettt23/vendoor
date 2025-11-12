"use client";
import { formatDate } from "@/shared/lib/format/date";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StarIcon,
  TagsIcon,
} from "lucide-react";
import type { Rating } from "@/features/ratings/types/rating.types";

interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

interface StoreDashboardClientProps {
  stats: StoreStats;
  ratings: Rating[];
}

export default function StoreDashboardClient({
  stats,
  ratings,
}: StoreDashboardClientProps) {
  const router = useRouter();

  // ✅ Build cards data with icons in Client Component
  const dashboardCardsData = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Tổng doanh thu",
      value: stats.totalRevenue,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: TagsIcon,
    },
    {
      title: "Tổng đánh giá",
      value: stats.averageRating,
      icon: StarIcon,
    },
  ];

  return (
    <div className=" text-slate-500 mb-28">
      <h1 className="text-2xl">Tổng quan cửa hàng</h1>

      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-slate-700">
                {card.value}
              </b>
            </div>
            <card.icon
              size={50}
              className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
            />
          </div>
        ))}
      </div>

      <h2>Tất cả đánh giá</h2>

      <div className="mt-5">
        {ratings.map((review, index) => (
          <div
            key={index}
            className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl"
          >
            <div>
              <div className="flex gap-3">
                <Image
                  src={review.user?.image || "/images/avatar_placeholder.png"}
                  alt=""
                  className="w-10 aspect-square rounded-full"
                  width={100}
                  height={100}
                />
                <div>
                  <p className="font-medium">{review.user?.name}</p>
                  <p className="font-light text-slate-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-slate-500 max-w-xs leading-6">
                {review.review}
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6 sm:items-end">
              <div className="flex flex-col sm:items-end">
                <p className="text-slate-400">{review.product?.category}</p>
                <p className="font-medium">{review.product?.name}</p>
                <div className="flex items-center">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={17}
                        className="text-transparent mt-0.5"
                        fill={
                          review.rating >= index + 1 ? "#9810FA" : "#D1D5DB"
                        }
                      />
                    ))}
                </div>
              </div>
              <button
                onClick={() =>
                  review.product?.id &&
                  router.push(`/product/${review.product.id}`)
                }
                className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
