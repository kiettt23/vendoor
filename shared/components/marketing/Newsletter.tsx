"use client";
import React, { useState } from "react";
import ViewMore from "@/components/ui/ViewMore";
import { vi } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MailIcon } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Đã đăng ký nhận tin thành công!");
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <ViewMore
        title={vi.footer.newsletter}
        description={vi.footer.subscribeMessage}
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
            placeholder={vi.footer.enterEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12 h-12"
          />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="px-8">
          {loading ? "Đang gửi..." : vi.footer.subscribe}
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
