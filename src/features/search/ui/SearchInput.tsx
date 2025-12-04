/**
 * SearchInput Component
 *
 * Desktop search input với:
 * - Debounced search suggestions (300ms delay)
 * - Dropdown gợi ý sản phẩm khi gõ
 * - Category dropdown
 * - Keyboard navigation
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  searchProductsAction,
  type SearchSuggestion,
} from "@/entities/product/api/actions";
import { formatPrice } from "@/shared/lib/utils";

interface SearchInputProps {
  /** Danh sách categories cho dropdown */
  categories?: readonly string[];
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay (ms) - default 300ms */
  debounceDelay?: number;
  /** CSS class */
  className?: string;
}

export function SearchInput({
  categories = [],
  placeholder = "Tìm kiếm sản phẩm...",
  debounceDelay = 300,
  className,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get initial value from URL
  const initialQuery = searchParams.get("search") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Navigate to search results
  const navigateToSearch = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
        params.delete("page"); // Reset pagination
      } else {
        params.delete("search");
      }

      setShowSuggestions(false);
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch suggestions với debounce
  const fetchSuggestions = useDebouncedCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchProductsAction(value, 6);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, debounceDelay);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);

    if (value.trim().length >= 2) {
      setIsLoading(true);
      setShowSuggestions(true);
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        navigateToSearch(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const selected = suggestions[highlightedIndex];
          router.push(`/products/${selected.slug}`);
          setShowSuggestions(false);
        } else {
          navigateToSearch(query);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch(query);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`flex items-center rounded-xl border-2 transition-colors ${
          isFocused ? "border-primary" : "border-border"
        } bg-secondary/50`}
      >
        {/* Category Dropdown */}
        {categories.length > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="rounded-l-xl rounded-r-none h-10 px-3 cursor-pointer"
                >
                  Danh mục <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/products">Tất cả sản phẩm</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    asChild
                    className="cursor-pointer"
                  >
                    <Link href={`/products?category=${cat.toLowerCase()}`}>
                      {cat}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-6 w-px bg-border" />
          </>
        )}

        {/* Search Input */}
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 h-10"
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
        />

        {/* Loading / Search Button */}
        {isLoading ? (
          <div className="h-10 w-12 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="rounded-none rounded-r-xl h-10 w-12 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.length > 0 ? (
            <>
              <ul className="py-2">
                {suggestions.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      href={`/products/${item.slug}`}
                      className={`flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors ${
                        highlightedIndex === index ? "bg-accent" : ""
                      }`}
                      onClick={() => setShowSuggestions(false)}
                    >
                      {/* Product Image */}
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                        {item.image ? (
                          <OptimizedImage
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      {item.price && (
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* View All Results */}
              <div className="border-t px-4 py-2">
                <button
                  type="button"
                  onClick={() => navigateToSearch(query)}
                  className="text-sm text-primary hover:underline w-full text-center"
                >
                  Xem tất cả kết quả cho &quot;{query}&quot;
                </button>
              </div>
            </>
          ) : !isLoading && query.length >= 2 ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <p className="text-sm">Không tìm thấy sản phẩm nào</p>
              <button
                type="button"
                onClick={() => navigateToSearch(query)}
                className="text-sm text-primary hover:underline mt-2"
              >
                Tìm kiếm &quot;{query}&quot;
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
