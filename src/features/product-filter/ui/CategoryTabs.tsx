"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { buildCategoryUrl } from "../lib";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface CategoryTabsProps {
  categories: Category[];
  currentCategorySlug?: string;
  totalAllProducts: number;
}

/**
 * Category navigation tabs - giữ lại search params khi chuyển category
 */
export function CategoryTabs({
  categories,
  currentCategorySlug,
  totalAllProducts,
}: CategoryTabsProps) {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={buildCategoryUrl(searchParams, null)}>
        <Button
          variant={!currentCategorySlug ? "default" : "outline"}
          size="sm"
        >
          Tất cả ({totalAllProducts})
        </Button>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.id} href={buildCategoryUrl(searchParams, cat.slug)}>
          <Button
            variant={currentCategorySlug === cat.slug ? "default" : "outline"}
            size="sm"
          >
            {cat.name} ({cat._count.products})
          </Button>
        </Link>
      ))}
    </div>
  );
}
