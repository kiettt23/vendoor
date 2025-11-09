import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/app/StoreProvider";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Vendoor",
  description: "Multi-Vendor E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
            <Toaster position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
