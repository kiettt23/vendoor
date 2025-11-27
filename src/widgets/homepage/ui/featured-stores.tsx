import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Star, MapPin, Users } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

interface Store {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  followers: string;
  products: number;
  location: string;
  verified: boolean;
  badge: string | null;
}

interface FeaturedStoresProps {
  stores?: Store[];
}

// Mock data - sau này sẽ thay bằng data thật từ API
const mockStores: Store[] = [
  {
    id: "1",
    name: "Apple Store VN",
    logo: "/apple-logo-minimal.jpg",
    cover: "/apple-store-modern-interior.jpg",
    rating: 4.9,
    followers: "125K",
    products: 234,
    location: "TP. Hồ Chí Minh",
    verified: true,
    badge: "Premium",
  },
  {
    id: "2",
    name: "Samsung Official",
    logo: "/samsung-logo-blue.jpg",
    cover: "/samsung-store-display.jpg",
    rating: 4.8,
    followers: "98K",
    products: 456,
    location: "Hà Nội",
    verified: true,
    badge: "Top Seller",
  },
  {
    id: "3",
    name: "TechZone",
    logo: "/placeholder.jpg",
    cover: "/placeholder.jpg",
    rating: 4.7,
    followers: "67K",
    products: 1234,
    location: "Đà Nẵng",
    verified: true,
    badge: null,
  },
  {
    id: "4",
    name: "Gaming Gear Pro",
    logo: "/placeholder.jpg",
    cover: "/placeholder.jpg",
    rating: 4.9,
    followers: "89K",
    products: 567,
    location: "TP. Hồ Chí Minh",
    verified: true,
    badge: "Gaming",
  },
  {
    id: "5",
    name: "AudioPro Store",
    logo: "/placeholder.jpg",
    cover: "/placeholder.jpg",
    rating: 4.8,
    followers: "45K",
    products: 189,
    location: "Hà Nội",
    verified: false,
    badge: null,
  },
  {
    id: "6",
    name: "Smart Home VN",
    logo: "/placeholder.jpg",
    cover: "/placeholder.jpg",
    rating: 4.6,
    followers: "32K",
    products: 345,
    location: "TP. Hồ Chí Minh",
    verified: true,
    badge: "New",
  },
];

const badgeColors: Record<string, string> = {
  Premium: "bg-amber-500",
  "Top Seller": "bg-green-500",
  Gaming: "bg-purple-500",
  New: "bg-primary",
};

export function FeaturedStores({ stores = mockStores }: FeaturedStoresProps) {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Cửa hàng nổi bật</h2>
            <p className="text-muted-foreground mt-2">
              Những cửa hàng uy tín được nhiều người theo dõi
            </p>
          </div>
          <Link
            href="/stores"
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
              href={`/stores/${store.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all"
            >
              {/* Cover */}
              <div className="relative h-24 overflow-hidden">
                <Image
                  src={store.cover || "/placeholder.jpg"}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
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
                    <Image
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
                      {store.rating}
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
