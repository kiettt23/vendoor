"use client";
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import type { RootState } from "@/lib/store";
import Rating from "@/components/ui/Rating";
import { useState } from "react";
import { toast } from "sonner";
import RatingModal from "../rating/RatingModal";
import { vi } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils/format/currency";
import { formatDate } from "@/lib/utils/format/date";
import { getOrderStatusText } from "@/lib/utils/helpers/order";
import type { OrderWithDetails } from "@/types";

interface OrderItemProps {
  order: OrderWithDetails;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const [ratingModal, setRatingModal] = useState(null);

  const { ratings } = useAppSelector((state: RootState) => state.rating);

  return (
    <>
      <tr className="text-sm">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                  <Image
                    className="h-14 w-auto"
                    src={item.product.images[0]}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col justify-center text-sm">
                  <p className="font-medium text-slate-600 text-base">
                    {item.product.name}
                  </p>
                  <p>
                    {formatPrice(item.price)} | Số lượng: {item.quantity}{" "}
                  </p>
                  <p className="mb-1">{formatDate(order.createdAt)}</p>
                  <div>
                    {ratings.find(
                      (rating) =>
                        order.id === rating.orderId &&
                        item.product.id === rating.productId
                    ) ? (
                      <Rating
                        value={
                          ratings.find(
                            (rating) =>
                              order.id === rating.orderId &&
                              item.product.id === rating.productId
                          ).rating
                        }
                      />
                    ) : (
                      <button
                        onClick={() => {
                          if (!item.product || !item.product.id) {
                            return toast.error("Sản phẩm không tồn tại");
                          }
                          setRatingModal({
                            orderId: order.id,
                            productId: item.product.id,
                          });
                        }}
                        className={`text-purple-500 hover:bg-purple-50 transition ${
                          order.status !== "DELIVERED" && "hidden"
                        }`}
                      >
                        {vi.rating.writeReview}
                      </button>
                    )}
                  </div>
                  {ratingModal && (
                    <RatingModal
                      ratingModal={ratingModal}
                      setRatingModal={setRatingModal}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </td>

        <td className="text-center max-md:hidden">
          {formatPrice(order.total)}
        </td>

        <td className="text-left max-md:hidden">
          <p>
            {order.address.name}, {order.address.street},
          </p>
          <p>
            {order.address.city}, {order.address.state}
          </p>
          <p>{order.address.phone}</p>
        </td>

        <td className="text-left space-y-2 text-sm max-md:hidden">
          <div
            className={`flex items-center justify-center gap-1 rounded-full p-1 ${
              order.status === "PROCESSING"
                ? "text-yellow-500 bg-yellow-100"
                : order.status === "DELIVERED"
                ? "text-green-500 bg-green-100"
                : order.status === "SHIPPED"
                ? "text-blue-500 bg-blue-100"
                : "text-slate-500 bg-slate-100"
            }`}
          >
            <DotIcon size={10} className="scale-250" />
            {getOrderStatusText(order.status)}
          </div>
        </td>
      </tr>
      {/* Mobile */}
      <tr className="md:hidden">
        <td colSpan={5}>
          <p>
            {order.address.name}, {order.address.street}
          </p>
          <p>
            {order.address.city}, {order.address.state}
          </p>
          <p>{order.address.phone}</p>
          <br />
          <div className="flex items-center">
            <span className="text-center mx-auto px-6 py-1.5 rounded bg-purple-100 text-purple-700">
              {getOrderStatusText(order.status)}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-300 w-6/7 mx-auto" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
