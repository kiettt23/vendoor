import { MessageSquare } from "lucide-react";

import { ReviewCard, ReviewStatsSummary } from "@/entities/review";
import type { ReviewListItem, ReviewStats } from "@/entities/review";

interface ReviewListProps {
  reviews: ReviewListItem[];
  stats: ReviewStats;
  showStats?: boolean;
}

/**
 * Component hiển thị danh sách reviews
 */
export function ReviewList({
  reviews,
  stats,
  showStats = true,
}: ReviewListProps) {
  return (
    <div className="space-y-6">
      {/* Stats summary */}
      {showStats && <ReviewStatsSummary stats={stats} />}

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
        </div>
      )}
    </div>
  );
}
