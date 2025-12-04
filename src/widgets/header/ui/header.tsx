"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Store,
  MapPin,
  LogOut,
  Package,
  Shield,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Logo } from "@/shared/ui/logo";
import { useCart } from "@/entities/cart";
import { signOut, useSession } from "@/shared/lib/auth/client";
import {
  HEADER_NAV_ITEMS,
  HEADER_CATEGORIES,
  HEADER_ICON_BUTTONS,
  showToast,
  showErrorToast,
} from "@/shared/lib/constants";
import { SearchInput, SearchInputMobile } from "@/features/search";

type HeaderProps = {
  /** Initial user from server - used for SSR, then overridden by useSession */
  initialUser?: {
    name: string | null;
    email: string | null;
    roles: string[];
  } | null;
};

type UserData = {
  name: string | null;
  email: string | null;
  roles: string[];
} | null;

/**
 * Get user initial for avatar badge
 */
function getUserInitial(user: UserData): string {
  if (!user) return "";
  const name = user.name || user.email || "";
  return name.charAt(0).toUpperCase();
}

export function Header({ initialUser }: HeaderProps) {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Use client-side session for reactive updates after login/logout
  // Falls back to initialUser from server for SSR
  const { data: session } = useSession();
  const user: UserData = useMemo(() => {
    // Prefer client session (reactive) over server initial (static)
    if (session?.user) {
      return {
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || [],
      };
    }
    return initialUser ?? null;
  }, [session, initialUser]);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("auth", "logoutSuccess");
      router.push("/");
      router.refresh();
    } catch {
      showErrorToast("generic");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b">
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Giao hàng toàn quốc
            </span>
            <span className="hidden sm:inline">Hotline: 0912 444 449</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/become-vendor"
              className="hover:underline flex items-center gap-1"
            >
              <Store className="h-3.5 w-3.5" />
              Trở thành người bán
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4 relative">
          {/* Mobile: Menu button - only on small screens */}
          <div className="md:hidden shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
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

          <nav className="hidden xl:flex items-center gap-6">
            {HEADER_NAV_ITEMS.slice(1, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* 1. Search - Mobile only */}
            <SearchInputMobile />

            {/* 2. Other icon buttons */}
            {HEADER_ICON_BUTTONS.filter((btn) => btn.id !== "search").map(
              (btn) => (
                <Button
                  key={btn.id}
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={btn.label}
                >
                  <btn.icon className="h-5 w-5" />
                </Button>
              )
            )}

            {/* 2. Cart with Badge */}
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

            {/* 3. Wishlist */}
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

            {/* 4. User Menu with Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Tài khoản"
                >
                  {user ? (
                    // Logged in: Avatar with initial
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {getUserInitial(user)}
                    </div>
                  ) : (
                    // Not logged in: Simple user icon
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.name || user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" /> Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    {user.roles.includes("VENDOR") && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/vendor"
                          className="flex items-center gap-2"
                        >
                          <Store className="h-4 w-4" /> Quản lý Shop
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user.roles.includes("ADMIN") && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" /> Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/register"
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" /> Đăng ký
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
