import React from "react";
import ViewMore from "@/shared/components/ui/ViewMore";
import { ClockIcon, HeadsetIcon, TruckIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

const OurSpecs = () => {
  const ourSpecsData = [
    {
      title: "Miễn phí vận chuyển",
      description:
        "Giao hàng nhanh chóng, miễn phí cho mọi đơn hàng. Không điều kiện, chỉ có sự tin cậy.",
      icon: TruckIcon,
      accent: "#05DF72",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      title: "Đổi trả dễ dàng trong 7 ngày",
      description:
        "Đổi ý? Không sao cả. Đổi trả bất kỳ sản phẩm nào trong 7 ngày.",
      icon: ClockIcon,
      accent: "#FF8904",
      bgGradient: "from-orange-50 to-amber-50",
    },
    {
      title: "Hỗ trợ khách hàng 24/7",
      description:
        "Chúng tôi luôn sẵn sàng hỗ trợ. Nhận trợ giúp từ đội ngũ chuyên nghiệp.",
      icon: HeadsetIcon,
      accent: "#A684FF",
      bgGradient: "from-purple-50 to-violet-50",
    },
  ];

  return (
    <div className="px-6 my-20 max-w-6xl mx-auto">
      <ViewMore
        visibleButton={false}
        title="Cam kết của chúng tôi"
        description="Mang đến trải nghiệm mua sắm tốt nhất với những cam kết chất lượng"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {ourSpecsData.map((spec, index) => {
          return (
            <Card
              key={index}
              className={`relative border-2 bg-gradient-to-br ${spec.bgGradient} hover:shadow-xl transition-all duration-300 group pt-8`}
            >
              <CardContent className="p-8 pt-4 text-center">
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-white size-12 flex items-center justify-center rounded-xl shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: spec.accent }}
                >
                  <spec.icon size={24} />
                </div>
                <h3 className="text-slate-800 font-semibold text-lg mb-3 mt-4">
                  {spec.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {spec.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OurSpecs;
