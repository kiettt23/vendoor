"use client";

import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import Link from "next/link";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";

// ============================================
// COMPONENT
// ============================================

/**
 * CartPage - Main cart page component
 *
 * Architecture:
 * - Pure composition pattern
 * - No business logic (delegates to children)
 * - Clean page wrapper
 * - 2-column layout (list + summary)
 *
 * Components:
 * - CartList: Items display + stock validation
 * - CartSummary: Order summary + checkout
 *
 * Usage:
 * Import in app/(customer)/cart/page.tsx
 */
export function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp Tục Mua Sắm
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Giỏ Hàng Của Bạn</h1>
        </div>
      </div>

      {/* Cart Content - 2 Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cart Items (2/3 width) */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <CartList />
            </CardContent>
          </Card>
        </div>

        {/* Right: Cart Summary (1/3 width) */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
