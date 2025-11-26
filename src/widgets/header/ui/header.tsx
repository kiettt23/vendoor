"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, User, Menu, Heart, Store,
  ChevronDown, MapPin, LogOut, Package, Shield,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useCart } from "@/entities/cart";
import { signOut } from "@/shared/lib/auth/client";
import { toast } from "sonner";

const navigation = [
  { name: "Trang Chủ", href: "/" },
  { name: "Cửa Hàng", href: "/stores" },
  { name: "Sản Phẩm", href: "/products" },
  { name: "Flash Sale", href: "/flash-sale" },
  { name: "Hỗ Trợ", href: "/support" },
];

const categories = [
  "Điện thoại", "Laptop", "Tablet", "Phụ kiện",
  "Đồng hồ thông minh", "Tai nghe", "Gaming", "Smart Home",
];

type HeaderProps = {
  user?: { name: string | null; email: string | null; roles: string[] } | null;
};

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
            <Link href="/seller/register" className="hover:underline flex items-center gap-1">
              <Store className="h-3.5 w-3.5" />
              Trở thành người bán
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold">Vendoor</span>
              </div>
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="text-lg font-medium hover:text-primary">
                    {item.name}
                  </Link>
                ))}
                <hr className="my-2" />
                <p className="text-sm text-muted-foreground font-medium">Danh mục</p>
                {categories.map((cat) => (
                  <Link key={cat} href={`/products?category=${cat.toLowerCase()}`} className="text-muted-foreground hover:text-foreground">
                    {cat}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline">Vendoor</span>
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className={`flex items-center rounded-xl border-2 transition-colors ${isSearchFocused ? "border-primary" : "border-border"} bg-secondary/50`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-l-xl rounded-r-none h-10 px-3">
                    Danh mục <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat}>{cat}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="h-6 w-px bg-border" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 h-10"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button size="icon" className="rounded-l-none rounded-r-xl h-10 w-12">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-6">
            {navigation.slice(1, 4).map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
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
                    <div className="px-2 py-1.5 text-sm font-medium">{user.name || user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" /> Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    {user.roles.includes("VENDOR") && (
                      <DropdownMenuItem asChild>
                        <Link href="/vendor" className="flex items-center gap-2">
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
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link href="/login">Đăng nhập</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/register">Đăng ký</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
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

