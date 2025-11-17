import {
  CartItemsLoading,
  OrderSummaryLoading,
} from "@/shared/components/feedback/Loading";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Loading state for cart page
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items skeleton */}
        <div className="lg:col-span-2">
          <CartItemsLoading items={3} />
        </div>

        {/* Order summary skeleton */}
        <div className="lg:col-span-1">
          <OrderSummaryLoading />
        </div>
      </div>
    </div>
  );
}
