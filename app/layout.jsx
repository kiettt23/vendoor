import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata = {
  title: "Vendoor",
  description: "Multi-Vendor E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
