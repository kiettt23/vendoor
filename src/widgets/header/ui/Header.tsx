"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, Store, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Logo } from "@/shared/ui/logo";
import { useCart } from "@/entities/cart";
import {
  HEADER_NAV_ITEMS,
  HEADER_CATEGORIES,
  HEADER_ICON_BUTTONS,
  ROUTES,
} from "@/shared/lib/constants";
import { SearchInput } from "@/features/search";
import { UserMenu } from "./UserMenu";

// Lazy load mobile-only components for better performance
const SearchInputMobile = dynamic(
  () => import("@/features/search").then((mod) => ({ default: mod.SearchInputMobile })),
  { ssr: false }
);

export type HeaderProps = {
  initialUser?: {
    name: string | null;
    email: string | null;
    roles: string[];
  } | null;
};

export function Header({ initialUser }: HeaderProps) {
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="bg-primary text-primary-foreground w-full">
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-1.5 sm:py-2 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-4 text-primary-foreground/90">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Giao hàng toàn quốc
            </span>
            <span className="hidden sm:inline text-primary-foreground/80">
              Hotline:{" "}
              <span className="text-primary-foreground font-medium">
                0912 444 449
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.BECOME_VENDOR}
              className="hover:text-white transition-colors flex items-center gap-1 text-primary-foreground/90 font-medium"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Trở thành người bán</span>
              <span className="sm:hidden">Bán hàng</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 relative">
          {/* Mobile: Menu button - only on small screens */}
          <div className="md:hidden shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex items-center gap-2 p-6 border-b">
                  <Logo size="sm" asLink={false} />
                </div>
                <nav className="flex flex-col p-4">
                  {HEADER_NAV_ITEMS.map((item, idx) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-base font-medium hover:text-primary py-3 px-2 rounded-lg hover:bg-muted transition-colors ${
                        idx < HEADER_NAV_ITEMS.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: Logo with text (md and up) */}
          <Logo size="lg" showText={true} className="hidden md:flex shrink-0" />

          {/* Mobile: Logo centered - only on small screens */}
          <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <Logo size="md" showText={false} />
          </div>

          {/* Spacer for mobile to push right icons to the end */}
          <div className="flex-1 md:hidden" />

          {/* Desktop Search - sử dụng SearchInput feature */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchInput categories={HEADER_CATEGORIES} />
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {HEADER_NAV_ITEMS.slice(1, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 rounded-full hover:bg-primary/10 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* 1. Search - Mobile only */}
            <SearchInputMobile />

            {/* 2. Cart with Badge - Always visible */}
            {HEADER_ICON_BUTTONS.filter((btn) => btn.id === "cart").map(
              (btn) => (
                <Button
                  key={btn.id}
                  variant="ghost"
                  size="icon"
                  className="relative"
                  asChild
                  aria-label={btn.label}
                >
                  <Link href={btn.href!}>
                    <btn.icon className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {totalItems > 99 ? "99+" : totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )
            )}

            {/* 3. Wishlist - Hidden on mobile (xs), shown sm+ */}
            {HEADER_ICON_BUTTONS.filter((btn) => btn.id === "wishlist").map(
              (btn) => (
                <Button
                  key={btn.id}
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex"
                  asChild
                  aria-label={btn.label}
                >
                  <Link href={btn.href!}>
                    <btn.icon className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}

            {/* 4. User Menu */}
            <UserMenu initialUser={initialUser} showRoleLinks />
          </div>
        </div>
      </div>
    </header>
  );
}
