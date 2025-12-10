"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth";
import { authClient } from "@/shared/lib/auth";
import { translateAuthError } from "@/shared/lib/auth/error-messages";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/password-input";
import { Label } from "@/shared/ui/label";
import { Logo } from "@/shared/ui/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ROUTES } from "@/shared/lib/constants";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check for invalid token from URL param
  useEffect(() => {
    if (errorParam === "INVALID_TOKEN") {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  }, [errorParam]);

  // No token = redirect to forgot password
  if (!token && !errorParam) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-8">
        <div className="w-full max-w-md">
          <Logo size="lg" className="mb-8 justify-center" />

          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Link không hợp lệ</CardTitle>
              <CardDescription>
                Vui lòng yêu cầu link đặt lại mật khẩu mới.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href={ROUTES.FORGOT_PASSWORD}>
                <Button>Yêu cầu link mới</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-8">
        <div className="w-full max-w-md">
          <Logo size="lg" className="mb-8 justify-center" />

          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Đặt lại thành công!</CardTitle>
              <CardDescription>
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật
                khẩu mới.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href={ROUTES.LOGIN}>
                <Button>Đăng nhập ngay</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (result.error) {
        setError(translateAuthError(result.error.message));
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        <Logo size="lg" className="mb-8 justify-center" />

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
            <CardDescription>Nhập mật khẩu mới cho tài khoản</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <PasswordInput
                  id="password"
                  placeholder="Nhập mật khẩu mới"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
