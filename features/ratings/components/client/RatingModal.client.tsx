"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { submitRating } from "@/features/ratings/actions/rating.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratingSchema, type RatingFormData } from "../../schemas/rating.schema";
import { Field } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import type { RatingModalProps } from "@/types";

export function RatingModal({
  ratingModal,
  setRatingModal,
  onSuccess,
}: RatingModalProps & { onSuccess: () => void }) {
  const [rating, setRating] = useState(0);

  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      productId: ratingModal?.productId || "",
      orderId: ratingModal?.orderId || "",
      rating: 0,
      review: "",
    },
  });

  const handleSubmit = async (data: RatingFormData) => {
    const result = await submitRating(data);

    if (!result.success) {
      return toast.error(result.error);
    }

    toast.success(result.message);
    setRatingModal(null);
    onSuccess(); // Notify parent to refetch
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => setRatingModal(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>
        <h2 className="text-xl font-medium text-slate-600 mb-4">
          Viết đánh giá
        </h2>

        <form
          onSubmit={form.handleSubmit((data) =>
            toast.promise(handleSubmit(data), {
              loading: "Đang gửi đánh giá...",
            })
          )}
        >
          {/* Star Rating */}
          <div className="flex items-center justify-center mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-8 cursor-pointer ${
                  rating > i ? "text-purple-400 fill-current" : "text-gray-300"
                }`}
                onClick={() => {
                  setRating(i + 1);
                  form.setValue("rating", i + 1);
                }}
              />
            ))}
          </div>
          {form.formState.errors.rating && (
            <p className="text-red-500 text-sm text-center mb-2">
              {form.formState.errors.rating.message}
            </p>
          )}

          {/* Review Field */}
          <Textarea
            {...form.register("review")}
            placeholder="Nhập đánh giá của bạn..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {form.formState.errors.review && (
            <p className="text-red-500 text-sm mb-2">
              {form.formState.errors.review.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
          >
            Gửi đánh giá
          </Button>
        </form>
      </div>
    </div>
  );
}
