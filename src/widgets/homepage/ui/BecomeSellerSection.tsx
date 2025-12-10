import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/lib/constants";
import {
  Store,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "2 triệu+ khách hàng",
    description: "Tiếp cận hàng triệu khách hàng tiềm năng",
  },
  {
    icon: TrendingUp,
    title: "Tăng doanh thu 300%",
    description: "Công cụ marketing và phân tích hiệu quả",
  },
  {
    icon: ShieldCheck,
    title: "Hỗ trợ toàn diện",
    description: "Đội ngũ hỗ trợ 24/7 cho người bán",
  },
];

const stats = [
  { value: "0%", label: "Phí đăng ký", color: "bg-primary/5" },
  { value: "5'", label: "Thời gian đăng ký", color: "bg-accent/10" },
  {
    value: "24/7",
    label: "Hỗ trợ người bán",
    color: "bg-green-500/10",
    textColor: "text-green-600",
  },
  {
    value: "2%",
    label: "Hoa hồng thấp",
    color: "bg-purple-500/10",
    textColor: "text-purple-600",
  },
];

export function BecomeSellerSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
              <Store className="h-4 w-4" />
              Dành cho người bán
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Mở cửa hàng công nghệ của bạn ngay hôm nay
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Gia nhập cộng đồng hơn 10,000 cửa hàng đang kinh doanh thành công
              trên Vendoor. Đăng ký miễn phí và bắt đầu bán hàng chỉ trong 5
              phút.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href={ROUTES.BECOME_VENDOR}>
                  Đăng ký bán hàng
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.BECOME_VENDOR}>Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>

          {/* Image/Stats */}
          <div className="relative">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`text-center p-6 ${stat.color} rounded-2xl`}
                  >
                    <p
                      className={`text-4xl font-bold ${
                        stat.textColor || "text-primary"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium">+500 cửa hàng mới</p>
                    <p className="text-sm text-muted-foreground">
                      đăng ký trong tháng này
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
