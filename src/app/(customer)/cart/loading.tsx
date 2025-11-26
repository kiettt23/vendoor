import { CartItemsLoading, OrderSummaryLoading } from "@/shared/ui/loading";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemsLoading items={3} />
        </div>
        <div>
          <OrderSummaryLoading />
        </div>
      </div>
    </div>
  );
}
