"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, LogIn, Loader2 } from "lucide-react";
import { showToast, showInfoToast, ROUTES } from "@/shared/lib/constants";
import {
  loginSchema,
  type LoginFormData,
  GoogleSignInButton,
} from "@/features/auth";
import { authClient, useSession } from "@/shared/lib/auth";
import { translateAuthError } from "@/shared/lib/auth/error-messages";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Thông báo lý do redirect nếu có callbackUrl (bị bắt đăng nhập)
  useEffect(() => {
    if (searchParams.get("callbackUrl")) {
      showInfoToast("auth", "loginRequired");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        setError(translateAuthError(result.error.message));
        return;
      }
      showToast("auth", "loginSuccess");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Logo size="lg" className="justify-center mb-8" />

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
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
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Hoặc
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <GoogleSignInButton
                callbackUrl={callbackUrl}
                className="w-full"
              />
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href={ROUTES.REGISTER} className="text-primary hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
