import prisma from "@/server/db/prisma";
import ShopClient from "./_components/ShopClient";

// ✅ Server Component - Fetch data directly from DB
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // ✅ Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const search = params?.q || "";

  // ✅ Fetch products directly from database
  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      // Filter active stores only
      store: {
        isActive: true,
      },
    },
    include: {
      rating: {
        select: {
          rating: true,
          review: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      store: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ✅ Pass data to Client Component
  return <ShopClient products={products} initialSearch={search} />;
}
