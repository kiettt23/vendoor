import "./globals.css";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AuthRedirectToast } from "@/features/auth/index.client";

export const metadata = {
  title: "Vendoor",
  description: "Multi-Vendor E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthRedirectToast />
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
