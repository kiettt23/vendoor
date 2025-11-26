import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/shared/ui/sonner";
import { ReactQueryProvider } from "@/shared/providers";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vendoor - Multi-Vendor Ecommerce",
  description: "Platform thương mại điện tử đa nhà cung cấp",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user
    ? { name: session.user.name, email: session.user.email, roles: session.user.roles || [] }
    : null;

  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <Header user={user} />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
