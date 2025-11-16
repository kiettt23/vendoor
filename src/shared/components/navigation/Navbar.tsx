"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "@/features/cart/hooks/useCart";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

// ============================================
// NAVBAR COMPONENT
// ============================================

/**
 * Main navigation bar
 *
 * **Features:**
 * - Responsive design (mobile hamburger menu)
 * - Cart badge with item count
 * - User authentication state
 * - Role-based navigation (Customer/Vendor/Admin)
 * - Active link highlighting
 */

interface NavbarProps {
  user?: {
    name?: string;
    email: string;
    roles: string[];
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const cart = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Check user roles
  const isVendor = user?.roles.includes("VENDOR");
  const isAdmin = user?.roles.includes("ADMIN");

  // Navigation links
  const publicLinks = [{ href: "/products", label: "Sản phẩm", icon: Package }];

  const userLinks = user
    ? [
        {
          href: "/cart",
          label: "Giỏ hàng",
          icon: ShoppingCart,
          badge: cartItemCount,
        },
        { href: "/orders", label: "Đơn hàng", icon: Package },
      ]
    : [
        {
          href: "/cart",
          label: "Giỏ hàng",
          icon: ShoppingCart,
          badge: cartItemCount,
        },
      ];

  const roleLinks = [];
  if (isVendor) {
    roleLinks.push({
      href: "/vendor",
      label: "Quản lý Shop",
      icon: LayoutDashboard,
    });
  }
  if (isAdmin) {
    roleLinks.push({
      href: "/admin",
      label: "Admin Panel",
      icon: LayoutDashboard,
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Package className="h-6 w-6 text-primary" />
            <span>Vendoor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Public Links */}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* User Links */}
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {link.badge > 99 ? "99+" : link.badge}
                  </Badge>
                )}
              </Link>
            ))}

            {/* Role Links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">
                      {user.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Đơn hàng của tôi</Link>
                  </DropdownMenuItem>
                  {isVendor && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendor">Quản lý Shop</Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form
                      action="/api/auth/sign-out"
                      method="POST"
                      className="w-full"
                    >
                      <button type="submit" className="w-full text-left">
                        Đăng xuất
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {/* Public Links */}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* User Links */}
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {link.badge > 99 ? "99+" : link.badge}
                  </Badge>
                )}
              </Link>
            ))}

            {/* Role Links */}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* User Section */}
            <div className="pt-4 border-t">
              {user ? (
                <div className="space-y-4">
                  <div className="px-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <form action="/api/auth/sign-out" method="POST">
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng xuất
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="justify-start"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="justify-start">
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
