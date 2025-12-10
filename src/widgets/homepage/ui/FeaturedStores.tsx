import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { ArrowUpRight, BadgeCheck, Star, MapPin, Users } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ROUTES } from "@/shared/lib/constants";
import type { FeaturedVendor } from "@/entities/vendor";

interface FeaturedStoresProps {
  stores: FeaturedVendor[];
}

const badgeColors: Record<string, string> = {
  Premium: "bg-amber-500",
  "Top Seller": "bg-green-500",
  Verified: "bg-blue-500",
  Gaming: "bg-purple-500",
  New: "bg-primary",
};

export function FeaturedStores({ stores }: FeaturedStoresProps) {
  if (stores.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Cửa hàng nổi bật</h2>
            <p className="text-muted-foreground mt-2">
              Những cửa hàng uy tín được nhiều người theo dõi
            </p>
          </div>
          <Link
            href={ROUTES.STORES}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả cửa hàng
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={ROUTES.STORE_DETAIL(store.slug || store.id)}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all"
            >
              {/* Cover */}
              <div className="relative h-24 overflow-hidden">
                <OptimizedImage
                  src={store.cover || "/placeholder.jpg"}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
                {store.badge && (
                  <Badge
                    className={`absolute top-3 right-3 ${
                      badgeColors[store.badge] || "bg-primary"
                    } text-white`}
                  >
                    {store.badge}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4 pt-0 relative">
                {/* Logo */}
                <div className="absolute -top-8 left-4">
                  <div className="h-16 w-16 rounded-xl border-4 border-card bg-card overflow-hidden shadow-lg">
                    <OptimizedImage
                      src={store.logo || "/placeholder.jpg"}
                      alt={store.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div className="pt-10">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{store.name}</h3>
                    {store.verified && (
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {store.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {store.followers}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {store.products} sản phẩm
                    </span>
                    <Button variant="outline" size="sm">
                      Theo dõi
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
