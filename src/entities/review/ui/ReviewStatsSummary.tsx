import { Progress } from "@/shared/ui/progress";

import type { ReviewStats } from "../model";
import { StarRating } from "./StarRating";

interface ReviewStatsSummaryProps {
  stats: ReviewStats;
}

export function ReviewStatsSummary({ stats }: ReviewStatsSummaryProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
      {/* Left: Overall rating */}
      <div className="flex flex-col items-center justify-center min-w-[120px]">
        <span className="text-4xl font-bold">
          {averageRating > 0 ? averageRating.toFixed(1) : "-"}
        </span>
        <StarRating rating={averageRating} size="md" className="mt-1" />
        <span className="text-sm text-muted-foreground mt-1">
          {totalReviews} đánh giá
        </span>
      </div>

      {/* Right: Rating distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-8 text-right">{rating} ★</span>
              <Progress
                value={percentage}
                className="flex-1 h-2"
                aria-label={`${rating} sao: ${percentage.toFixed(0)}% (${count} đánh giá)`}
              />
              <span className="text-sm text-muted-foreground w-10 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
