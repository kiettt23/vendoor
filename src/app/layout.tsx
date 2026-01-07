import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/shared/ui/sonner";
import { ReactQueryProvider } from "@/shared/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: true, // Preload primary font for faster FCP
  adjustFontFallback: true, // Reduce CLS during font swap
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Don't preload - used less frequently
});

export const metadata: Metadata = {
  title: "Vendoor - Multi-Vendor Ecommerce",
  description: "Platform thương mại điện tử đa nhà cung cấp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Preconnect to Cloudinary CDN for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
