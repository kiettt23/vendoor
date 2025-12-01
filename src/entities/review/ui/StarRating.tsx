"use client";

import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

/**
 * Component hiển thị rating bằng sao
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 > 0;

        return (
          <div key={index} className="relative">
            {/* Background star (empty) */}
            <Star
              className={cn(
                sizeClasses[size],
                "text-muted-foreground/30 fill-muted-foreground/10"
              )}
            />

            {/* Filled star overlay */}
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: partial ? `${(rating % 1) * 100}%` : "100%",
                }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "text-yellow-500 fill-yellow-400"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}

      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
