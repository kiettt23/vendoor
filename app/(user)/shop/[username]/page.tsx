import { ProductCard } from "@/features/products/index.client";
import { MailIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { vi } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// ✅ Server Component - Fetch store data directly from DB
export default async function StoreShop({ params }) {
  // ✅ Await params (Next.js 15)
  const { username } = await params;

  // ✅ Fetch store with products directly from database
  const store = await prisma.store.findUnique({
    where: {
      username: username,
    },
    include: {
      Product: {
        where: {
          inStock: true,
        },
        include: {
          rating: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // ✅ Handle not found
  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-[70vh] mx-6">
      {/* Store Info Banner */}
      <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
        <Image
          src={store.logo || "/images/gs_logo.jpg"}
          alt={store.name}
          className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
          width={200}
          height={200}
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-semibold text-slate-800">
            {store.name}
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-lg">
            {store.description}
          </p>
          <div className="text-xs text-slate-500 mt-4 space-y-1"></div>
          <div className="space-y-2 text-sm text-slate-500">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
              <span>{store.address}</span>
            </div>
            <div className="flex items-center">
              <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
              <span>{store.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className=" max-w-7xl mx-auto mb-40">
        <h1 className="text-2xl mt-12">
          {vi.nav.shop}{" "}
          <span className="text-slate-800 font-medium">
            {vi.product.products}
          </span>
        </h1>
        <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
          {store.Product.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
