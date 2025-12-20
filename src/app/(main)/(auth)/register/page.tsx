"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, User, UserPlus, Loader2 } from "lucide-react";
import { showToast, ROUTES } from "@/shared/lib/constants";
import {
  registerSchema,
  type RegisterFormData,
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

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const isAddingAccount = searchParams.get("addAccount") === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect nếu đã đăng nhập (trừ khi đang thêm tài khoản mới)
  useEffect(() => {
    if (!isPending && session?.user && !isAddingAccount) {
      router.replace("/");
    }
  }, [session, isPending, router, isAddingAccount]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        setError(translateAuthError(result.error.message));
        return;
      }

      // Auto-login sau khi đăng ký thành công
      const loginResult = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (loginResult.error) {
        // Fallback: nếu auto-login fail, redirect về login page
        router.push("/login");
        return;
      }

      // Login thành công, redirect về home
      showToast("auth", "registerSuccess");
      router.push("/");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading trong khi check session
  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Nếu đã đăng nhập và không phải thêm tài khoản -> không render
  if (session?.user && !isAddingAccount) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Logo size="lg" className="justify-center mb-8" />

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isAddingAccount ? "Đăng ký tài khoản mới" : "Đăng ký"}
            </CardTitle>
            <CardDescription>
              {isAddingAccount
                ? "Tạo thêm tài khoản mới để chuyển đổi nhanh"
                : "Tạo tài khoản mới"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="pl-10"
                    disabled={isLoading}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
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
                <Label htmlFor="password">Mật khẩu</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <PasswordInput
                  id="confirmPassword"
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
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Đăng ký
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
              <GoogleSignInButton className="w-full" />
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href={isAddingAccount ? `${ROUTES.LOGIN}?addAccount=true` : ROUTES.LOGIN}
                className="text-primary hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
