"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

export function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderIds = searchParams.get("orders")?.split(",") || [];

  return (
    <div className="container mx-auto py-16 px-4 max-w-lg text-center">
      <div className="mb-8">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Đặt Hàng Thành Công!</h1>
        <p className="text-muted-foreground">
          Cảm ơn bạn đã mua hàng.{" "}
          {orderIds.length > 1
            ? `Đã tạo ${orderIds.length} đơn hàng.`
            : "Đơn hàng của bạn đang được xử lý."}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Package className="h-5 w-5" />
            <span>
              Theo dõi đơn hàng trong mục &ldquo;Đơn hàng của tôi&rdquo;
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/orders">
            Xem đơn hàng <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
}
