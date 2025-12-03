/**
 * SearchInputMobile Component
 *
 * Mobile search với slide-down panel và search suggestions.
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { searchProducts, type SearchSuggestion } from "@/entities/product";
import { formatPrice } from "@/shared/lib/utils";

interface SearchInputMobileProps {
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay (ms) */
  debounceDelay?: number;
}

export function SearchInputMobile({
  placeholder = "Tìm kiếm sản phẩm...",
  debounceDelay = 300,
}: SearchInputMobileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const initialQuery = searchParams.get("search") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Navigate to search results
  const navigateToSearch = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
        params.delete("page");
      } else {
        params.delete("search");
      }

      router.push(`/products?${params.toString()}`);
      setIsOpen(false);
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
      const results = await searchProducts(value, 6);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, debounceDelay);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      setIsLoading(true);
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch(query);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  const handleSelectProduct = (slug: string) => {
    router.push(`/products/${slug}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Search Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Tìm kiếm"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Search Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden animate-in slide-in-from-top duration-200">
          {/* Header */}
          <div className="border-b">
            <form
              onSubmit={handleSubmit}
              className="container mx-auto px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    className="pl-10 pr-4 h-10"
                  />
                </div>
                {isLoading ? (
                  <div className="h-9 w-9 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Button type="submit" size="sm">
                    Tìm
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Suggestions */}
          <div className="container mx-auto px-4 py-2 overflow-y-auto max-h-[calc(100vh-80px)]">
            {suggestions.length > 0 ? (
              <ul className="space-y-1">
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(item.slug)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      {/* Product Image */}
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.category && (
                          <p className="text-sm text-muted-foreground">
                            {item.category}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      {item.price && (
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}

                {/* View All */}
                <li className="pt-2 border-t mt-2">
                  <button
                    type="button"
                    onClick={() => navigateToSearch(query)}
                    className="w-full py-3 text-center text-primary hover:underline"
                  >
                    Xem tất cả kết quả cho &quot;{query}&quot;
                  </button>
                </li>
              </ul>
            ) : query.length >= 2 && !isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>Không tìm thấy sản phẩm nào</p>
                <button
                  type="button"
                  onClick={() => navigateToSearch(query)}
                  className="text-primary hover:underline mt-2"
                >
                  Tìm kiếm &quot;{query}&quot;
                </button>
              </div>
            ) : query.length < 2 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>Nhập ít nhất 2 ký tự để tìm kiếm</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
