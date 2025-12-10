import Link from "next/link";
import { ROUTES } from "@/shared/lib/constants";
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
  Camera,
  Tv,
  Speaker,
  MonitorSmartphone,
  Keyboard,
  Mouse,
  HardDrive,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { CategoryWithCount } from "@/entities/category";

interface CategoriesSectionProps {
  categories: CategoryWithCount[];
}

const STYLE_CONFIGS = [
  {
    color: "text-blue-600",
    gradient: "from-blue-500/20 to-blue-600/5",
    icon: Smartphone,
  },
  {
    color: "text-purple-600",
    gradient: "from-purple-500/20 to-purple-600/5",
    icon: Laptop,
  },
  {
    color: "text-green-600",
    gradient: "from-green-500/20 to-green-600/5",
    icon: Tablet,
  },
  {
    color: "text-orange-600",
    gradient: "from-orange-500/20 to-orange-600/5",
    icon: Headphones,
  },
  {
    color: "text-pink-600",
    gradient: "from-pink-500/20 to-pink-600/5",
    icon: Watch,
  },
  {
    color: "text-red-600",
    gradient: "from-red-500/20 to-red-600/5",
    icon: Gamepad2,
  },
  {
    color: "text-cyan-600",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    icon: Cpu,
  },
  {
    color: "text-amber-600",
    gradient: "from-amber-500/20 to-amber-600/5",
    icon: Home,
  },
  {
    color: "text-indigo-600",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    icon: Camera,
  },
  {
    color: "text-teal-600",
    gradient: "from-teal-500/20 to-teal-600/5",
    icon: Tv,
  },
  {
    color: "text-rose-600",
    gradient: "from-rose-500/20 to-rose-600/5",
    icon: Speaker,
  },
  {
    color: "text-violet-600",
    gradient: "from-violet-500/20 to-violet-600/5",
    icon: MonitorSmartphone,
  },
  {
    color: "text-emerald-600",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    icon: Keyboard,
  },
  {
    color: "text-sky-600",
    gradient: "from-sky-500/20 to-sky-600/5",
    icon: Mouse,
  },
  {
    color: "text-fuchsia-600",
    gradient: "from-fuchsia-500/20 to-fuchsia-600/5",
    icon: HardDrive,
  },
  {
    color: "text-lime-600",
    gradient: "from-lime-500/20 to-lime-600/5",
    icon: Wifi,
  },
];

/** Hash slug để tạo style consistent cho mỗi category */
function getStyleBySlug(slug: string): {
  color: string;
  gradient: string;
  icon: LucideIcon;
} {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return STYLE_CONFIGS[Math.abs(hash) % STYLE_CONFIGS.length];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const showScrollHint = categories.length > 8;

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
            href={ROUTES.PRODUCTS}
            className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10"
          >
            Xem tất cả
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Scrollable container for many categories */}
        <div
          className={
            showScrollHint
              ? "overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
              : ""
          }
        >
          <div
            className={
              showScrollHint
                ? "flex gap-4 min-w-max"
                : "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6"
            }
          >
            {categories.map((category) => {
              const { color, gradient, icon: Icon } = getStyleBySlug(category.slug);

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 ${
                    showScrollHint ? "w-32 shrink-0" : ""
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div
                    className={`relative h-16 w-16 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <div className="relative text-center z-10">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
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

        {/* Scroll hint */}
        {showScrollHint && (
          <p className="text-xs text-muted-foreground mt-4 text-center lg:hidden">
            ← Vuốt để xem thêm →
          </p>
        )}
      </div>
    </section>
  );
}
