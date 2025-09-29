import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";

export const metadata = {
  title: "Vendoor",
  description: "Multi-Vendor E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
