"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Send, CheckCircle, Zap, Gift, Bell } from "lucide-react";

const benefits = [
  { icon: Zap, text: "Flash Sale sớm nhất" },
  { icon: Gift, text: "Voucher độc quyền" },
  { icon: Bell, text: "Thông báo deal hot" },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 lg:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Đừng bỏ lỡ deal công nghệ hot
            </h2>
            <p className="text-muted-foreground mb-8">
              Đăng ký để nhận thông báo Flash Sale, voucher giảm giá và tin tức
              công nghệ mới nhất.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {benefits.map((benefit) => (
                <div
                  key={benefit.text}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>

            {isSubscribed ? (
              <div className="flex items-center justify-center gap-3 p-4 bg-green-500/10 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="font-medium text-green-700">
                  Đăng ký thành công! Kiểm tra email để nhận voucher 50K.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-card"
                  required
                />
                <Button type="submit" size="lg" className="gap-2 h-12">
                  Đăng ký ngay
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-6">
              Tặng ngay voucher 50.000đ cho đăng ký mới. Hủy đăng ký bất cứ lúc
              nào.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
