"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * Component input rating bằng sao (interactive)
 */
export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false,
  className,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || value;

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= displayRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={disabled}
            className={cn(
              "transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
              "cursor-pointer"
            )}
            aria-label={`Đánh giá ${starValue} sao`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled
                  ? "text-yellow-500 fill-yellow-400"
                  : "text-muted-foreground/40 fill-transparent hover:text-yellow-400"
              )}
            />
          </button>
        );
      })}

      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value} sao` : "Chọn đánh giá"}
      </span>
    </div>
  );
}
