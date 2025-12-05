"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { buildPaginationUrl } from "../lib";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Pagination component - giữ lại tất cả URL params khi chuyển trang
 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link href={buildPaginationUrl(searchParams, currentPage - 1)}>
          <Button variant="outline">← Trước</Button>
        </Link>
      )}
      <span className="flex items-center px-4">
        Trang {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={buildPaginationUrl(searchParams, currentPage + 1)}>
          <Button variant="outline">Sau →</Button>
        </Link>
      )}
    </div>
  );
}
