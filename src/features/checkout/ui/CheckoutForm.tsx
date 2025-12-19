"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { CheckoutFormData } from "../model";

interface CheckoutFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function CheckoutForm({ form }: CheckoutFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Liên Hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Họ tên *</Label>
            <Input {...register("name")} placeholder="Nguyễn Văn A" />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Số điện thoại *</Label>
            <Input {...register("phone")} placeholder="0901234567" />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Địa Chỉ Giao Hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Địa chỉ *</Label>
            <Input {...register("address")} placeholder="Số nhà, tên đường" />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <Label>Phường/Xã *</Label>
            <Input {...register("ward")} placeholder="Phường 1" />
            {errors.ward && (
              <p className="text-sm text-destructive mt-1">
                {errors.ward.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quận/Huyện *</Label>
              <Input {...register("district")} placeholder="Quận 1" />
              {errors.district && (
                <p className="text-sm text-destructive mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>
            <div>
              <Label>Tỉnh/TP *</Label>
              <Input {...register("city")} placeholder="TP.HCM" />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Ghi chú</Label>
            <Textarea
              {...register("note")}
              placeholder="Ghi chú cho người bán..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
