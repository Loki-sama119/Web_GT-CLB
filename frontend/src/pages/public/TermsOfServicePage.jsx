import React from 'react';
import { FileText, ShieldAlert, Award, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#142B49]/10 text-[#142B49] text-xs font-bold border border-[#142B49]/20">
          <FileText className="w-4 h-4" /> Quy Chế & Điều Khoản
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#142B49] tracking-tight">
          Điều Khoản Sử Dụng Cổng Thông Tin Câu Lạc Bộ Sinh Viên
        </h1>
        <p className="text-sm text-slate-500">
          Quy định áp dụng đối với toàn thể sinh viên, Ban Chủ Nhiệm các Câu Lạc Bộ và cán bộ quản trị trường BAFU.
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#142B49] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#167C66]" /> 1. Trách Nhiệm Của Sinh Viên
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Sử dụng thông tin sinh viên chính chủ (Họ tên, Mã số sinh viên, Email trường) khi đăng ký tài khoản.</li>
            <li>Bảo mật mật khẩu tài khoản cá nhân; không chia sẻ tài khoản cho người khác.</li>
            <li>Trung thực trong nội dung khai báo ứng tuyển vào các câu lạc bộ; tôn trọng quy chế sinh hoạt chung.</li>
            <li>Khi đăng ký tham gia sự kiện, có trách nhiệm tham dự đúng giờ hoặc chủ động bấm "Hủy đăng ký" trên hệ thống nếu bận đột xuất để nhường chỗ cho sinh viên khác.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> 2. Trách Nhiệm Của Ban Chủ Nhiệm Câu Lạc Bộ
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Cung cấp thông tin giới thiệu, lịch sinh hoạt thường kỳ và thông báo tuyển thành viên chính xác, minh bạch.</li>
            <li>Xét duyệt hồ sơ công tâm, khách quan; bảo mật thông tin cá nhân và số điện thoại của ứng viên.</li>
            <li>Chỉ tải lên hình ảnh hoạt động, logo, bìa phù hợp thuần phong mỹ tục, không vi phạm bản quyền hay quy định của Nhà trường.</li>
            <li>Tổ chức các sự kiện lành mạnh, bổ ích và cập nhật kịp thời sĩ số thành viên cho Nhà trường.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> 3. Các Hành Vi Nghiêm Cấm & Xử Lý Vi Phạm
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Nghiêm cấm hành vi phá hoại hệ thống, spam đơn ứng tuyển, tiêm mã độc hoặc tải lên các tệp tin độc hại.</li>
            <li>Nghiêm cấm việc thu phí tham gia trái quy định của Đoàn trường và Hội sinh viên.</li>
            <li>Mọi hành vi vi phạm tùy theo mức độ sẽ bị thu hồi tư cách hội viên, khóa tài khoản hoặc xem xét xử lý kỷ luật theo quy chế công tác sinh viên của Trường Đại học Nông - Lâm Bắc Giang.</li>
          </ul>
        </section>
      </div>

      <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-xs text-slate-500">
        <Link to="/" className="text-blue-600 hover:underline font-bold">← Quay lại Trang Chủ</Link>
        <Link to="/privacy-policy" className="text-slate-600 hover:underline">Xem Chính Sách Quyền Riêng Tư →</Link>
      </div>
    </div>
  );
}
