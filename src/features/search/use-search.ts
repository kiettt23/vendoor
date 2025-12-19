"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import {
  searchProductsAction,
  type SearchSuggestion,
} from "@/entities/product";
import { queryKeys, STALE_TIME, GC_TIME } from "@/shared/lib/constants";
import { LIMITS } from "@/shared/lib/constants/limits";

interface UseSearchSuggestionsOptions {
  debounceMs?: number;
  minChars?: number;
  limit?: number;
  enabled?: boolean;
}

export function useSearchSuggestions({
  debounceMs = 300,
  minChars = 2,
  limit = LIMITS.AUTOCOMPLETE,
  enabled = true,
}: UseSearchSuggestionsOptions = {}) {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSetQuery = useDebouncedCallback((query: string) => {
    setDebouncedQuery(query.trim());
  }, debounceMs);

  const query = useQuery<SearchSuggestion[]>({
    queryKey: queryKeys.products.search(debouncedQuery),
    queryFn: () => searchProductsAction(debouncedQuery, limit),
    enabled: enabled && debouncedQuery.length >= minChars,
    staleTime: STALE_TIME.SEARCH,
    gcTime: GC_TIME.SHORT,
    refetchOnWindowFocus: false,
  });

  const setQuery = (value: string) => {
    debouncedSetQuery(value);
  };

  return {
    suggestions: query.data ?? [],
    isLoading: query.isFetching,
    isError: query.isError,
    error: query.error,
    setQuery,
    clearSuggestions: () => setDebouncedQuery(""),
    currentQuery: debouncedQuery,
  };
}
