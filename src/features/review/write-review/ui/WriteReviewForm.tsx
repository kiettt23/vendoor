"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  showToast,
  showErrorToast,
} from "@/shared/lib/constants";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";

import {
  StarRatingInput,
  createReview,
  type CreateReviewInput,
} from "@/entities/review";
import { ReviewImageUpload } from "./ReviewImageUpload";

interface WriteReviewFormProps {
  productId: string;
  userId: string;
  onSuccess?: () => void;
}

export function WriteReviewForm({
  productId,
  userId,
  onSuccess,
}: WriteReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showErrorToast("validation", "Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreateReviewInput = {
        productId,
        rating,
        title: title.trim() || undefined,
        content: content.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      };

      const result = await createReview(userId, data);

      if (result.success) {
        showToast("review", "submitted");
        setRating(0);
        setTitle("");
        setContent("");
        setImages([]);
        router.refresh();
        onSuccess?.();
      } else {
        showErrorToast("generic", result.error);
      }
    } catch (error) {
      console.error("WriteReviewForm submit error:", error);
      showErrorToast("generic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Đánh giá của bạn</Label>
        <StarRatingInput
          value={rating}
          onChange={setRating}
          size="lg"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">Tiêu đề (tùy chọn)</Label>
        <Input
          id="review-title"
          placeholder="Tóm tắt đánh giá của bạn"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-content">Nội dung đánh giá (tùy chọn)</Label>
        <Textarea
          id="review-content"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={4}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground text-right">
          {content.length}/2000
        </p>
      </div>

      <ReviewImageUpload
        images={images}
        onChange={setImages}
        disabled={isSubmitting}
      />

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          "Gửi đánh giá"
        )}
      </Button>
    </form>
  );
}
