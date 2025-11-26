"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/features/auth";
import { authClient } from "@/shared/lib/auth/client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signIn.email({ email: data.email, password: data.password });
      if (result.error) {
        setError(result.error.message || "Email hoặc mật khẩu không đúng");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu để đăng nhập</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" disabled={isLoading} {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" disabled={isLoading} {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            {error && <div className="rounded-md bg-destructive/10 p-3"><p className="text-sm text-destructive">{error}</p></div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản? <Link href="/register" className="text-primary hover:underline">Đăng ký</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
