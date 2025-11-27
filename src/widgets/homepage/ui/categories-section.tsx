import Link from "next/link";
import {
  ArrowUpRight,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Gamepad2,
  Cpu,
  Home,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

interface CategoriesSectionProps {
  categories: Category[];
}

// Mapping icon và màu sắc cho từng category theo slug
const categoryConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  "dien-thoai": { icon: Smartphone, color: "bg-blue-500/10 text-blue-600" },
  laptop: { icon: Laptop, color: "bg-purple-500/10 text-purple-600" },
  tablet: { icon: Tablet, color: "bg-green-500/10 text-green-600" },
  "tai-nghe": { icon: Headphones, color: "bg-orange-500/10 text-orange-600" },
  "dong-ho": { icon: Watch, color: "bg-pink-500/10 text-pink-600" },
  gaming: { icon: Gamepad2, color: "bg-red-500/10 text-red-600" },
  "linh-kien": { icon: Cpu, color: "bg-cyan-500/10 text-cyan-600" },
  "smart-home": { icon: Home, color: "bg-amber-500/10 text-amber-600" },
  "phu-kien": { icon: Headphones, color: "bg-indigo-500/10 text-indigo-600" },
};

const defaultConfig = { icon: Cpu, color: "bg-slate-500/10 text-slate-600" };

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">
              Danh mục sản phẩm
            </h2>
            <p className="text-muted-foreground mt-2">
              Khám phá hàng trăm ngàn sản phẩm công nghệ
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.slice(0, 8).map((category) => {
            const config = categoryConfig[category.slug] || defaultConfig;
            const IconComponent = config.icon;

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div
                  className={`h-14 w-14 rounded-2xl ${config.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category._count.products} SP
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
