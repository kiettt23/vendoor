import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Vendoor",
  description: "Đăng nhập vào tài khoản Vendoor của bạn",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
