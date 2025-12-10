import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getSession } from "@/shared/lib/auth/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const initialUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || [],
      }
    : null;

  return (
    <>
      <Header initialUser={initialUser} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
