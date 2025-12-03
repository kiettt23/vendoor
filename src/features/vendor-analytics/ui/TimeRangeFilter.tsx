"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { TIME_RANGE_OPTIONS, type TimeRange } from "../model/types";

interface TimeRangeFilterProps {
  currentRange: TimeRange;
}

export function TimeRangeFilter({ currentRange }: TimeRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (range: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TIME_RANGE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={currentRange === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleChange(option.value)}
          className={cn(currentRange === option.value && "pointer-events-none")}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
