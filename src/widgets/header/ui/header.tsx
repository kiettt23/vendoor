"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Store,
  ChevronDown,
  MapPin,
  LogOut,
  Package,
  Shield,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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
import { signOut } from "@/shared/lib/auth/client";
import { toast } from "sonner";
import { HEADER_NAV_ITEMS, HEADER_CATEGORIES } from "@/shared/lib/constants";

type HeaderProps = {
  user?: { name: string | null; email: string | null; roles: string[] } | null;
};

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Có lỗi xảy ra");
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
              href="/seller/register"
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

          <div className="flex-1 max-w-2xl hidden md:block">
            <form
              onSubmit={handleSearch}
              className={`flex items-center rounded-xl border-2 transition-colors ${
                isSearchFocused ? "border-primary" : "border-border"
              } bg-secondary/50`}
            >
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
                  {HEADER_CATEGORIES.map((cat) => (
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
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 h-10"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="rounded-l-none rounded-r-lg h-10 w-12 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
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
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
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

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
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
          </div>
        </div>
      </div>
    </header>
  );
}
