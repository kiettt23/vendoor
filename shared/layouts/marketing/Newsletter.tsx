"use client";
import React, { useState } from "react";
import ViewMore from "@/shared/components/ui/ViewMore";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";
import { MailIcon } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Đã đăng ký nhận tin thành công!");
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <ViewMore
        title="Nhận tin mới nhất"
        description="Đăng ký để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt"
        visibleButton={false}
      />
      <form
        onSubmit={handleSubscribe}
        className="flex gap-2 w-full max-w-xl my-10"
      >
        <div className="relative flex-1">
          <MailIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12 h-12"
          />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="px-8">
          {loading ? "Đang gửi..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
