import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Button } from "@/shared/ui/button";
import { ArrowRight, Shield, Truck, Headphones, Store } from "lucide-react";

const features = [
  { icon: Shield, label: "Bảo hành chính hãng" },
  { icon: Truck, label: "Giao hàng nhanh 2H" },
  { icon: Headphones, label: "Hỗ trợ 24/7" },
  { icon: Store, label: "10,000+ cửa hàng" },
];

const stats = [
  { value: "500K+", label: "Sản phẩm" },
  { value: "10K+", label: "Cửa hàng" },
  { value: "2M+", label: "Khách hàng" },
  { value: "4.9", label: "Đánh giá" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center py-16 lg:py-24">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Flash Sale đang diễn ra
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Sàn công nghệ
              <span className="text-primary"> đa người bán</span> hàng đầu
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-pretty">
              Kết nối hàng ngàn cửa hàng công nghệ uy tín. Mua sắm điện thoại,
              laptop, phụ kiện chính hãng với giá tốt nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="gap-2 h-12 px-6" asChild>
                <Link href="/products">
                  Khám phá ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-12 px-6 bg-transparent"
                asChild
              >
                <Link href="/become-vendor">
                  <Store className="h-4 w-4" />
                  Mở cửa hàng
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl lg:text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Product */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <OptimizedImage
                    src="/modern-smartphone-and-laptop-tech-devices-floating.jpg"
                    alt="Sản phẩm công nghệ"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-4 right-4 bg-card p-3 rounded-xl shadow-lg border border-border animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Chính hãng 100%</p>
                    <p className="text-xs text-muted-foreground">
                      Bảo hành toàn quốc
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-4 bg-card p-3 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Giảm đến 50%</p>
                    <p className="text-xs text-muted-foreground">
                      Flash Sale hôm nay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-border">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 text-center sm:text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-xs sm:text-sm">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
