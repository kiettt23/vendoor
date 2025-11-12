"use client";

import { Skeleton } from "./skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="group max-xl:mx-auto">
      <Skeleton className="h-40 sm:w-60 sm:h-68 rounded-lg" />
      <div className="flex justify-between gap-3 pt-2 max-w-60">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 my-10">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
    </div>
  );
};

export { ProductCardSkeleton, ProductGridSkeleton };
