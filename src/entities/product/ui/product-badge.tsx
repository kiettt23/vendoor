import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib";

interface ProductStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function ProductStatusBadge({ isActive, className }: ProductStatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className={cn(className)}>
      {isActive ? "Đang bán" : "Ngừng bán"}
    </Badge>
  );
}

interface ProductStockBadgeProps {
  stock: number;
  className?: string;
}

export function ProductStockBadge({ stock, className }: ProductStockBadgeProps) {
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <Badge
      variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
      className={cn(className)}
    >
      {isOutOfStock ? "Hết hàng" : isLowStock ? `Còn ${stock}` : `Còn ${stock}`}
    </Badge>
  );
}

