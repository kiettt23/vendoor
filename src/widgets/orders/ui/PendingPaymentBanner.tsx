"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";

interface PendingPaymentBannerProps {
  orderId: string;
  orderNumber: string;
}

export function PendingPaymentBanner({
  orderId,
  orderNumber,
}: PendingPaymentBannerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumePayment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout/stripe/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      router.push(data.url);
    } catch (error) {
      console.error("Resume payment error:", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
      setIsLoading(false);
    }
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Đơn hàng chờ thanh toán</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Đơn hàng <strong>{orderNumber}</strong> chưa được thanh toán. Vui lòng
          hoàn tất thanh toán để đơn hàng được xử lý.
        </p>
        <Button onClick={handleResumePayment} disabled={isLoading} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Thanh toán ngay
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
