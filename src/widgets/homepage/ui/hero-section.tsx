import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowRight, Sparkles, Truck, Shield, CreditCard } from "lucide-react";

const features = [
  { icon: Truck, text: "Miễn phí vận chuyển" },
  { icon: Shield, text: "Bảo hành chính hãng" },
  { icon: CreditCard, text: "Thanh toán an toàn" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Ưu đãi đặc biệt tháng này</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Mua sắm công nghệ
              <span className="text-primary"> dễ dàng hơn</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Khám phá hàng ngàn sản phẩm công nghệ chính hãng từ các nhà bán hàng uy tín trên Vendoor.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Khám phá ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/seller/register">Trở thành người bán</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-9xl">📱</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

