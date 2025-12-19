import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { BadgeCheck, MessageSquare, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardContent } from "@/shared/ui/card";

import type { ReviewListItem } from "../model";
import { StarRating } from "./StarRating";
import { ReviewImageGallery } from "./ReviewImageGallery";

interface ReviewCardProps {
  review: ReviewListItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Header: User info + Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.image || undefined} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {review.user.name || "Người dùng ẩn danh"}
                </span>
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="h-3 w-3" />
                    Đã mua hàng
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review content */}
        <div className="mt-3">
          {review.title && (
            <h4 className="font-medium text-sm mb-1">{review.title}</h4>
          )}
          {review.content && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {review.content}
            </p>
          )}
        </div>

        {/* Review images */}
        {review.images.length > 0 && (
          <div className="mt-3">
            <ReviewImageGallery images={review.images} />
          </div>
        )}

        {/* Vendor reply */}
        {review.vendorReply && (
          <div className="mt-4 bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Phản hồi từ người bán</span>
              {review.vendorReplyAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.vendorReplyAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {review.vendorReply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
