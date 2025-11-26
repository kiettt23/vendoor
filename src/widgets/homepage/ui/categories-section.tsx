import Link from "next/link";
import { Card, CardContent } from "@/shared/ui/card";

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

const categoryIcons: Record<string, string> = {
  "dien-thoai": "📱",
  "laptop": "💻",
  "tablet": "📲",
  "phu-kien": "🎧",
  "gaming": "🎮",
  "smart-home": "🏠",
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-muted-foreground">Khám phá các danh mục phổ biến</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{categoryIcons[cat.slug] || "📦"}</div>
                  <h3 className="font-semibold mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat._count.products} sản phẩm</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

