import Banner from "@/components/layout/Banner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserDataProvider from "@/components/providers/UserDataProvider";

// ✅ Server Component - Layout structure only
export default function PublicLayout({ children }) {
  return (
    <>
      <Banner />
      <Navbar />
      <UserDataProvider>{children}</UserDataProvider>
      <Footer />
    </>
  );
}
