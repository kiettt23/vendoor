"use client";

import { Heart, Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useWishlistMutation } from "../use-wishlist-mutation";

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
  const { isInWishlist, isPending, toggle } = useWishlistMutation({
    productId,
    userId,
    initialIsInWishlist,
  });

  if (variant === "icon") {
    return (
      <button
        onClick={toggle}
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
      onClick={toggle}
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
