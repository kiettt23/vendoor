import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Smartphone,
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { FOOTER_LINKS } from "@/shared/lib/constants";
import { Logo } from "@/shared/ui/logo";

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

const features = [
  { icon: ShieldCheck, text: "Hàng chính hãng 100%" },
  { icon: Truck, text: "Giao hàng toàn quốc" },
  { icon: CreditCard, text: "Thanh toán an toàn" },
  { icon: Smartphone, text: "Hỗ trợ 24/7" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 md:justify-center"
              >
                <feature.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" showText={true} />
            <p className="text-background/70 mt-4 text-sm">
              Sàn thương mại điện tử công nghệ đa người bán hàng đầu Việt Nam.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="h-9 w-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20"
                  aria-label={`Theo dõi trên ${social.name}`}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2025 Vendoor. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-background/50 mr-2">Thanh toán:</span>
            {[
              "visa-card-logo.png",
              "mastercard-logo.png",
              "generic-mobile-payment-logo.png",
              "zalopay-logo.png",
              "generic-payment-gateway-logo.png",
            ].map((img) => (
              <div key={img} className="relative h-6 w-12">
                <OptimizedImage
                  src={`/${img}`}
                  alt=""
                  fill
                  className="object-contain opacity-70"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
