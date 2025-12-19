"use client";

import type { UseFormReturn } from "react-hook-form";
import { CreditCard, Banknote } from "lucide-react";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import type { CheckoutFormData, PaymentMethod } from "../model";

interface PaymentMethodSelectProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function PaymentMethodSelect({ form }: PaymentMethodSelectProps) {
  const {
    setValue,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phương Thức Thanh Toán</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue="COD"
          onValueChange={(value: PaymentMethod) =>
            setValue("paymentMethod", value)
          }
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
            <RadioGroupItem value="COD" id="cod" />
            <Label
              htmlFor="cod"
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <Banknote className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                <p className="text-sm text-muted-foreground">
                  Trả tiền mặt khi nhận hàng
                </p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
            <RadioGroupItem value="STRIPE" id="stripe" />
            <Label
              htmlFor="stripe"
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, JCB... (Demo mode)
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>
        {errors.paymentMethod && (
          <p className="text-sm text-destructive mt-2">
            {errors.paymentMethod.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
