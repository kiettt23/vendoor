import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/lib/constants";
import {
  ArrowRight,
  Shield,
  Truck,
  Headphones,
  Store,
  Zap,
} from "lucide-react";

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
    <section className="relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Flash Sale đang diễn ra
              </span>
              <Zap className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-balance animate-fade-in-up animation-delay-200">
              Sàn công nghệ
              <br />
              <span className="text-gradient">Đa người bán</span>
              <br />
              Hàng đầu
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 text-pretty animate-fade-in-up animation-delay-400">
              Kết nối hàng ngàn cửa hàng công nghệ uy tín. Trải nghiệm mua sắm
              đẳng cấp với hệ sinh thái sản phẩm đa dạng và chất lượng.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                asChild
              >
                <Link href={ROUTES.PRODUCTS}>
                  Khám phá ngay
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm"
                asChild
              >
                <Link href={ROUTES.BECOME_VENDOR}>
                  <Store className="h-5 w-5 mr-2" />
                  Mở cửa hàng
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border/50 animate-fade-in-up animation-delay-800">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Area */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in-left animation-delay-400">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Main Circle Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Main Product Image */}
              <div className="relative z-10 w-full h-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <OptimizedImage
                  src="/modern-smartphone-and-laptop-tech-devices-floating.jpg"
                  alt="Sản phẩm công nghệ"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating Glass Cards */}
              <div className="absolute top-10 -right-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Chính hãng 100%</p>
                    <p className="text-xs text-muted-foreground">
                      Bảo hành toàn quốc
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -left-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 animate-float animation-delay-2000 z-20">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Giảm đến 50%</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-border/50">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors cursor-default"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-center sm:text-left">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
