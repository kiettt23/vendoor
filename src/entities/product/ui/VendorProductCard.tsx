import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Badge } from "@/shared/ui/badge";
import { ClickableCard } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import { ROUTES, getProductStatusBadge } from "@/shared/lib/constants";
import type { VendorProduct } from "../api/vendor-product.queries";

interface VendorProductCardProps {
  product: VendorProduct;
}

export function VendorProductCard({ product }: VendorProductCardProps) {
  const statusBadge = getProductStatusBadge(product.isActive);

  return (
    <ClickableCard href={ROUTES.VENDOR_PRODUCT_EDIT(product.id)}>
      <div className="flex gap-3 sm:gap-4">
        {/* Product Image */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded overflow-hidden bg-muted shrink-0">
          {product.images[0] && (
            <OptimizedImage
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate text-sm sm:text-base">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {product.category.name}
              </p>
            </div>
            <Badge variant={statusBadge.variant} className="shrink-0 text-xs">
              {statusBadge.label}
            </Badge>
          </div>

          {/* Price & Stock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
            <span className="font-bold text-primary text-sm sm:text-base">
              {formatPrice(product.variants[0]?.price || 0)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Kho: {product.variants[0]?.stock || 0}
            </span>
          </div>
        </div>
      </div>
    </ClickableCard>
  );
}
