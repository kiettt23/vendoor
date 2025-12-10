import { formatPrice } from "@/shared/lib/utils";
import { Badge } from "./badge";
import { cn } from "@/shared/lib/utils/cn";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { price: "text-sm font-semibold", compare: "text-xs", badge: "text-xs" },
  md: { price: "text-lg font-bold", compare: "text-sm", badge: "text-xs" },
  lg: { price: "text-3xl font-bold", compare: "text-xl", badge: "text-sm" },
} as const;

function calculateDiscountPercent(
  price: number,
  compareAtPrice: number | null | undefined
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const classes = sizeClasses[size];
  const discountPercent = calculateDiscountPercent(price, compareAtPrice);
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("text-primary", classes.price)}>
        {formatPrice(price)}
      </span>

      {hasDiscount && (
        <span
          className={cn("text-muted-foreground line-through", classes.compare)}
        >
          {formatPrice(compareAtPrice)}
        </span>
      )}

      {showDiscount && discountPercent && (
        <Badge variant="destructive" className={classes.badge}>
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
