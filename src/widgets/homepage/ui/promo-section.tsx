import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ArrowRight, Smartphone, Laptop } from "lucide-react";

export function PromoSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Promo Card 1 */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 lg:p-12">
            <div className="relative z-10 max-w-sm">
              <span className="inline-block px-4 py-1.5 bg-primary-foreground/20 rounded-full text-sm font-medium mb-6">
                Ưu đãi độc quyền
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Giảm đến 40% cho điện thoại flagship
              </h3>
              <p className="text-primary-foreground/80 mb-8">
                iPhone, Samsung, Xiaomi... với giá tốt nhất từ các cửa hàng
                chính hãng.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link href="/products?category=dien-thoai">
                  Xem ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20">
              <Smartphone className="h-48 w-48" />
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent to-accent/80 p-8 lg:p-12">
            <div className="relative z-10 max-w-sm">
              <span className="inline-block px-4 py-1.5 bg-foreground/10 rounded-full text-sm font-medium mb-6">
                Back to School
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Laptop học tập & làm việc
              </h3>
              <p className="text-muted-foreground mb-8">
                MacBook, Dell, ASUS... tặng kèm phụ kiện trị giá đến 3 triệu
                đồng.
              </p>
              <Button size="lg" className="gap-2" asChild>
                <Link href="/products?category=laptop">
                  Khám phá
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20">
              <Laptop className="h-48 w-48" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
