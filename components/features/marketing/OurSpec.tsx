import React from "react";
import ViewMore from "@/components/ui/ViewMore";
import { ClockIcon, HeadsetIcon, TruckIcon } from "lucide-react";

const OurSpecs = () => {
  const ourSpecsData = [
    {
      title: "Miễn phí vận chuyển",
      description:
        "Giao hàng nhanh chóng, miễn phí cho mọi đơn hàng. Không điều kiện, chỉ có sự tin cậy.",
      icon: TruckIcon,
      accent: "#05DF72",
    },
    {
      title: "Đổi trả dễ dàng trong 7 ngày",
      description:
        "Đổi ý? Không sao cả. Đổi trả bất kỳ sản phẩm nào trong 7 ngày.",
      icon: ClockIcon,
      accent: "#FF8904",
    },
    {
      title: "Hỗ trợ khách hàng 24/7",
      description:
        "Chúng tôi luôn sẵn sàng hỗ trợ. Nhận trợ giúp từ đội ngũ chuyên nghiệp.",
      icon: HeadsetIcon,
      accent: "#A684FF",
    },
  ];

  return (
    <div className="px-6 my-20 max-w-6xl mx-auto">
      <ViewMore
        visibleButton={false}
        title="Cam kết của chúng tôi"
        description="Mang đến trải nghiệm mua sắm tốt nhất với những cam kết chất lượng"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26">
        {ourSpecsData.map((spec, index) => {
          return (
            <div
              className="relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group"
              style={{
                backgroundColor: spec.accent + 10,
                borderColor: spec.accent + 30,
              }}
              key={index}
            >
              <h3 className="text-slate-800 font-medium">{spec.title}</h3>
              <p className="text-sm text-slate-600 mt-3">{spec.description}</p>
              <div
                className="absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition"
                style={{ backgroundColor: spec.accent }}
              >
                <spec.icon size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurSpecs;
