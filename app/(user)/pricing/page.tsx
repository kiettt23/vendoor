import { PricingTable } from "@clerk/nextjs";
import {
  SparklesIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  HeadphonesIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <SparklesIcon size={16} />
            Nâng cấp lên Plus để mở khóa tất cả tính năng
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 pb-5">
            Gói đăng ký linh hoạt
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi cần thiết. Hủy bất cứ lúc nào, không
            ràng buộc dài hạn.
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div className="max-w-[700px] mx-auto mb-20">
          <PricingTable />
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="text-green-600" size={32} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Bảo mật tối đa
            </h3>
            <p className="text-slate-600 text-sm">
              Dữ liệu được mã hóa và bảo vệ an toàn tuyệt đối
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCardIcon className="text-blue-600" size={32} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Thanh toán linh hoạt
            </h3>
            <p className="text-slate-600 text-sm">
              Hỗ trợ đa dạng phương thức thanh toán an toàn
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="text-purple-600" size={32} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Hỗ trợ tận tâm
            </h3>
            <p className="text-slate-600 text-sm">
              Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ
            </p>
          </div>
        </div>

        {/* FAQ Section with Accordion */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-slate-600 mb-8">
            Tất cả thông tin bạn cần biết về gói đăng ký Vendoor
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  Tôi có thể hủy bất cứ lúc nào không?
                </AccordionTrigger>
                <AccordionContent>
                  Có! Bạn có thể hủy gói Plus bất cứ lúc nào mà không mất phí.
                  Sau khi hủy, bạn vẫn có thể sử dụng các tính năng Plus cho đến
                  hết chu kỳ thanh toán hiện tại.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  AI phân tích hình ảnh hoạt động như thế nào?
                </AccordionTrigger>
                <AccordionContent>
                  Khi bạn upload hình ảnh sản phẩm, AI sẽ tự động phân tích và
                  gợi ý tên, mô tả chi tiết, danh mục phù hợp và mức giá hợp lý
                  dựa trên thị trường. Điều này giúp bạn tiết kiệm thời gian và
                  tối ưu hóa doanh số.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Tôi có được hoàn tiền không?
                </AccordionTrigger>
                <AccordionContent>
                  Chúng tôi cung cấp chính sách hoàn tiền 100% trong vòng 7 ngày
                  đầu tiên nếu bạn không hài lòng với dịch vụ. Không cần lý do,
                  chỉ cần liên hệ hỗ trợ.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Tôi có thể nâng cấp từ Free lên Plus không?
                </AccordionTrigger>
                <AccordionContent>
                  Hoàn toàn có thể! Bạn có thể nâng cấp bất cứ lúc nào bằng cách
                  click vào nút &ldquo;Nâng cấp&rdquo; ở trên. Tất cả dữ liệu và
                  sản phẩm hiện tại sẽ được giữ nguyên.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Tính năng miễn phí ship có áp dụng cho tất cả đơn hàng không?
                </AccordionTrigger>
                <AccordionContent>
                  Có! Thành viên Plus được miễn phí ship cho TẤT CẢ đơn hàng mua
                  sắm trên Vendoor, không giới hạn số lượng. Đây là một trong
                  những ưu đãi đặc biệt dành riêng cho thành viên Plus.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  Có giới hạn số lượng sản phẩm cho gói Plus không?
                </AccordionTrigger>
                <AccordionContent>
                  Không! Với gói Plus, bạn có thể đăng không giới hạn số lượng
                  sản phẩm. Không có ràng buộc về dung lượng lưu trữ hình ảnh
                  hay số lượng danh mục.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  AI đoán giá có chính xác không?
                </AccordionTrigger>
                <AccordionContent>
                  AI của chúng tôi được huấn luyện trên hàng triệu sản phẩm và
                  liên tục cập nhật dữ liệu thị trường. Mức giá gợi ý thường
                  chính xác 85-90%, nhưng bạn luôn có thể điều chỉnh theo nhu
                  cầu kinh doanh của mình.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  Có hỗ trợ thanh toán quốc tế không?
                </AccordionTrigger>
                <AccordionContent>
                  Hiện tại chúng tôi hỗ trợ thanh toán qua Stripe (thẻ quốc tế)
                  và COD (tiền mặt). Chúng tôi đang tích hợp thêm các cổng thanh
                  toán nội địa như MoMo, ZaloPay trong thời gian tới.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng phát triển cửa hàng của bạn?
          </h2>
          <p className="text-purple-100 text-lg mb-6">
            Hàng nghìn người bán đã tin tưởng và phát triển cùng Vendoor
          </p>
          <p className="text-sm text-purple-200">
            ✓ Miễn phí dùng thử gói cơ bản &nbsp;&nbsp; ✓ Hủy đăng ký bất cứ lúc
            nào &nbsp;&nbsp; ✓ Hoàn tiền 100% trong 7 ngày đầu
          </p>
        </div>
      </div>
    </div>
  );
}
