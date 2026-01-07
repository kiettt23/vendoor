"use client";

import { useState } from "react";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  type: "seller" | "buyer";
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    role: "Chủ cửa hàng TechZone",
    avatar: "/vietnamese-man-entrepreneur.jpg",
    content:
      "Từ khi mở cửa hàng trên Vendoor, doanh thu của tôi tăng 200%. Hệ thống quản lý đơn hàng rất tiện lợi và đội ngũ hỗ trợ người bán cực kỳ chuyên nghiệp.",
    rating: 5,
    type: "seller",
  },
  {
    id: 2,
    name: "Trần Đức Hoàng",
    role: "Khách hàng thân thiết",
    avatar: "/vietnamese-young-man-tech-enthusiast.jpg",
    content:
      "Mua iPhone trên Vendoor yên tâm hơn hẳn vì có thể so sánh giá từ nhiều cửa hàng. Sản phẩm chính hãng, bảo hành rõ ràng và giao hàng siêu nhanh!",
    rating: 5,
    type: "buyer",
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    role: "Tech Reviewer",
    avatar: "/vietnamese-woman-professional.jpg",
    content:
      "Vendoor là sàn TMĐT công nghệ tốt nhất mà tôi từng trải nghiệm. Đa dạng sản phẩm, giá cả cạnh tranh và chính sách bảo vệ người mua xuất sắc.",
    rating: 5,
    type: "buyer",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Cộng đồng Vendoor nói gì
          </h2>
          <p className="text-muted-foreground mt-2">
            Hơn 2 triệu người dùng tin tưởng
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary flex items-center justify-center z-10">
              <Quote className="h-5 w-5 text-primary-foreground" />
            </div>

            {/* Testimonial Card */}
            <div className="bg-card rounded-2xl p-6 lg:p-10 border border-border shadow-sm">
              <div className="text-center">
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-lg lg:text-xl text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex flex-col items-center">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden mb-3">
                    <OptimizedImage
                      src={
                        testimonials[currentIndex].avatar ||
                        "/placeholder-user.jpg"
                      }
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {testimonials[currentIndex].name}
                    </p>
                    {testimonials[currentIndex].type === "seller" && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 bg-transparent"
                onClick={prevTestimonial}
                aria-label="Đánh giá trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`rounded-full transition-all flex items-center justify-center ${
                      index === currentIndex
                        ? "h-6 w-8 bg-primary" // Active: larger for visibility
                        : "h-6 w-6 bg-border hover:bg-muted-foreground" // 24px minimum touch target
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Chuyển đến đánh giá ${index + 1}`}
                    aria-current={index === currentIndex ? "true" : "false"}
                  >
                    {/* Visual dot inside clickable area */}
                    <span
                      className={`rounded-full ${
                        index === currentIndex
                          ? "h-2 w-6 bg-primary-foreground/20"
                          : "h-2 w-2 bg-current"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 bg-transparent"
                onClick={nextTestimonial}
                aria-label="Đánh giá tiếp theo"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
