"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import {
  showToast,
  showCustomToast,
  TOAST_MESSAGES,
} from "@/shared/lib/constants";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { toggleWishlist } from "@/entities/wishlist/api/actions";

interface WishlistButtonProps {
  productId: string;
  userId: string | null;
  initialIsInWishlist?: boolean;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function WishlistButton({
  productId,
  userId,
  initialIsInWishlist = false,
  variant = "icon",
  size = "md",
  className,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!userId) {
      showCustomToast.error(TOAST_MESSAGES.wishlist.loginRequired);
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlist(userId, productId);

      if (result.success) {
        setIsInWishlist(result.data.added);
        showToast("wishlist", result.data.added ? "added" : "removed");
      } else {
        showCustomToast.error(result.error);
      }
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "p-2 rounded-full transition-colors",
          "hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isPending && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-label={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        {isPending ? (
          <Loader2 className={cn(sizeClasses[size], "animate-spin")} />
        ) : (
          <Heart
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground hover:text-red-500"
            )}
          />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={isInWishlist ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "mr-2 h-4 w-4",
            isInWishlist && "fill-red-500 text-red-500"
          )}
        />
      )}
      {isInWishlist ? "Đã yêu thích" : "Yêu thích"}
    </Button>
  );
}
