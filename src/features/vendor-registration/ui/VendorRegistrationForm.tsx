"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Store, CheckCircle } from "lucide-react";
import {
  showToast,
  showErrorToast,
  showCustomToast,
} from "@/shared/lib/constants";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/shared/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

import { vendorRegistrationSchema } from "../model";
import type { VendorRegistrationInput } from "../model";
import { registerAsVendor } from "../api";

interface VendorRegistrationFormProps {
  userId: string;
}

export function VendorRegistrationForm({
  userId,
}: VendorRegistrationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<VendorRegistrationInput>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      shopName: "",
      description: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
    },
  });

  const onSubmit = async (data: VendorRegistrationInput) => {
    setIsSubmitting(true);

    try {
      const result = await registerAsVendor(userId, data);

      if (result.success) {
        setIsSuccess(true);
        showToast("vendor", "registered");
      } else {
        showCustomToast.error(result.error);
      }
    } catch {
      showErrorToast("generic");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Đã gửi đơn đăng ký thành công!
          </h3>
          <p className="text-muted-foreground mb-6">
            Đơn đăng ký của bạn đang chờ được xét duyệt.
            <br />
            Chúng tôi sẽ thông báo cho bạn qua email khi có kết quả.
          </p>
          <Button onClick={() => router.push("/account")}>
            Về trang tài khoản
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Đăng ký bán hàng</CardTitle>
            <CardDescription>
              Điền thông tin cửa hàng để bắt đầu bán hàng trên Vendoor
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Shop Name */}
            <Field data-invalid={!!form.formState.errors.shopName}>
              <FieldLabel htmlFor="shopName">Tên cửa hàng *</FieldLabel>
              <Input
                id="shopName"
                placeholder="VD: Cửa hàng ABC"
                {...form.register("shopName")}
                disabled={isSubmitting}
              />
              <FieldDescription>
                Tên này sẽ hiển thị trên trang shop của bạn
              </FieldDescription>
              <FieldError errors={[form.formState.errors.shopName]} />
            </Field>

            {/* Description */}
            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="description">Mô tả cửa hàng</FieldLabel>
              <Textarea
                id="description"
                placeholder="Giới thiệu về cửa hàng của bạn..."
                rows={3}
                {...form.register("description")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            {/* Business Address */}
            <Field data-invalid={!!form.formState.errors.businessAddress}>
              <FieldLabel htmlFor="businessAddress">
                Địa chỉ kinh doanh
              </FieldLabel>
              <Input
                id="businessAddress"
                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                {...form.register("businessAddress")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.businessAddress]} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Phone */}
              <Field data-invalid={!!form.formState.errors.businessPhone}>
                <FieldLabel htmlFor="businessPhone">
                  Số điện thoại liên hệ
                </FieldLabel>
                <Input
                  id="businessPhone"
                  placeholder="VD: 0901234567"
                  {...form.register("businessPhone")}
                  disabled={isSubmitting}
                />
                <FieldError errors={[form.formState.errors.businessPhone]} />
              </Field>

              {/* Business Email */}
              <Field data-invalid={!!form.formState.errors.businessEmail}>
                <FieldLabel htmlFor="businessEmail">
                  Email kinh doanh
                </FieldLabel>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="VD: shop@email.com"
                  {...form.register("businessEmail")}
                  disabled={isSubmitting}
                />
                <FieldError errors={[form.formState.errors.businessEmail]} />
              </Field>
            </div>
          </FieldGroup>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Store className="mr-2 h-4 w-4" />
                  Gửi đơn đăng ký
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
