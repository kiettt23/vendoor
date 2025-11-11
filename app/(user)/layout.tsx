import Banner from "@/shared/components/layout/Banner";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
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
