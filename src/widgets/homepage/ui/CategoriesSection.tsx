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
import type { CategoryWithCount } from "@/entities/category";

interface CategoriesSectionProps {
  categories: CategoryWithCount[];
}

// Mapping icon và màu sắc cho từng category theo slug
const categoryConfig: Record<
  string,
  { icon: React.ElementType; color: string; gradient: string }
> = {
  "dien-thoai": {
    icon: Smartphone,
    color: "text-blue-600",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  laptop: {
    icon: Laptop,
    color: "text-purple-600",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  tablet: {
    icon: Tablet,
    color: "text-green-600",
    gradient: "from-green-500/20 to-green-600/5",
  },
  "tai-nghe": {
    icon: Headphones,
    color: "text-orange-600",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  "dong-ho": {
    icon: Watch,
    color: "text-pink-600",
    gradient: "from-pink-500/20 to-pink-600/5",
  },
  gaming: {
    icon: Gamepad2,
    color: "text-red-600",
    gradient: "from-red-500/20 to-red-600/5",
  },
  "linh-kien": {
    icon: Cpu,
    color: "text-cyan-600",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  "smart-home": {
    icon: Home,
    color: "text-amber-600",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  "phu-kien": {
    icon: Headphones,
    color: "text-indigo-600",
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
};

const defaultConfig = {
  icon: Cpu,
  color: "text-slate-600",
  gradient: "from-slate-500/20 to-slate-600/5",
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Danh mục sản phẩm
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Khám phá hàng trăm ngàn sản phẩm công nghệ
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10"
          >
            Xem tất cả
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.slice(0, 8).map((category) => {
            const config = categoryConfig[category.slug] || defaultConfig;
            const IconComponent = config.icon;

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`relative h-16 w-16 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${config.color}`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>

                <div className="relative text-center z-10">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category._count.products} sản phẩm
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
