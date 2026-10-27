import React from 'react';
import { ShieldCheck, Lock, UserCheck, Eye, Trash2, Mail, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#167C66]/10 text-[#167C66] text-xs font-bold border border-[#167C66]/20">
          <ShieldCheck className="w-4 h-4" /> Chính Sách Bảo Mật Dữ Liệu
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#142B49] tracking-tight">
          Chính Sách Quyền Riêng Tư & Bảo Vệ Dữ Liệu Cá Nhân
        </h1>
        <p className="text-sm text-slate-500">
          Áp dụng cho Cổng Thông Tin Câu Lạc Bộ Sinh Viên — Trường Đại Học Nông - Lâm Bắc Giang (BAFU).
          Cập nhật lần cuối: Tháng 10/2026.
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#142B49] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#167C66]" /> 1. Mục Đích Thu Thập Thông Tin
          </h2>
          <p>
            Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU thu thập và xử lý dữ liệu của người dùng cho các mục đích học tập, sinh hoạt ngoại khóa và quản lý nội bộ của Nhà trường, bao gồm:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tạo và xác thực tài khoản sinh viên (Họ và tên, Mã sinh viên, Email nội bộ trường, Số điện thoại, Khoa/Ngành).</li>
            <li>Xử lý hồ sơ ứng tuyển vào các câu lạc bộ, đội, nhóm sinh viên.</li>
            <li>Quản lý danh sách hội viên, phân quyền Ban chủ nhiệm và theo dõi lịch sinh hoạt thường kỳ.</li>
            <li>Ghi nhận đăng ký tham gia các sự kiện, hội thảo và hoạt động phong trào do các CLB tổ chức.</li>
            <li>Gửi thông báo điện tử (email, thông báo hệ thống) về kết quả ứng tuyển và nhắc lịch sự kiện.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" /> 2. Quyền Của Chủ Thể Dữ Liệu (Tham chiếu OWASP ASVS)
          </h2>
          <p>
            Sinh viên và thành viên sử dụng hệ thống có đầy đủ các quyền kiểm soát thông tin cá nhân của mình:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-blue-700">
                <Eye className="w-4 h-4" /> Quyền Xem & Tra Cứu
              </div>
              <p className="text-xs text-slate-600">
                Sinh viên có thể truy cập Dashboard bất kỳ lúc nào để xem toàn bộ thông tin cá nhân, danh sách đơn đã nộp và các CLB đang tham gia.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-emerald-700">
                <CheckCircle className="w-4 h-4" /> Quyền Chỉnh Sửa Hồ Sơ
              </div>
              <p className="text-xs text-slate-600">
                Chủ động cập nhật số điện thoại, kỹ năng, sở thích, ảnh đại diện và thông tin liên hệ trong trang quản lý hồ sơ cá nhân.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-amber-700">
                <FileText className="w-4 h-4" /> Quyền Rút Hồ Sơ Ứng Tuyển
              </div>
              <p className="text-xs text-slate-600">
                Sinh viên có quyền chủ động bấm "Rút đơn ứng tuyển" khi đơn còn ở trạng thái nộp, hủy toàn bộ quyền xem chi tiết của Ban tuyển sinh.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-rose-700">
                <Trash2 className="w-4 h-4" /> Quyền Xóa Dữ Liệu & Hỗ Trợ
              </div>
              <p className="text-xs text-slate-600">
                Gửi yêu cầu xóa hoặc đóng băng tài khoản thông qua quy trình DSAR gửi về Ban Quản trị Hệ thống trường.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 3. Biện Pháp Bảo Vệ & An Toàn Thông Tin
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Mã hóa mật khẩu:</strong> Mật khẩu người dùng được băm một chiều bằng thuật toán Bcrypt với salt rounds tiêu chuẩn, không lưu trữ dạng plain-text.</li>
            <li><strong>Bảo mật phiên làm việc:</strong> Hệ thống sử dụng JSON Web Token (JWT) kèm HttpOnly Cookie, bảo vệ chống tấn công đánh cắp phiên qua XSS.</li>
            <li><strong>Phân quyền nghiêm ngặt (RBAC):</strong> Ban Chủ Nhiệm câu lạc bộ này tuyệt đối không thể truy cập, xem hoặc can thiệp vào hồ sơ ứng viên hay hội viên của câu lạc bộ khác.</li>
            <li><strong>Bảo vệ dữ liệu đánh giá nội bộ:</strong> Ghi chú phỏng vấn nội bộ (`internalNotes`) được ẩn hoàn toàn khỏi sinh viên nộp đơn và không bao giờ xuất hiện trong file CSV ứng viên.</li>
            <li><strong>Chống tấn công CSV Formula Injection:</strong> Toàn bộ dữ liệu trích xuất sang Excel tự động được làm sạch và vô hiệu hóa các ký tự điều khiển nguy hiểm (`=`, `+`, `-`, `@`).</li>
            <li><strong>Giới hạn tần suất (Rate Limiting):</strong> Bảo vệ các cổng API đăng nhập, nộp đơn và upload tệp tin chống brute-force và DoS.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-slate-100 p-6 rounded-3xl border border-slate-200 not-prose">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" /> 4. Quy Trình Tiếp Nhận & Xử Lý Yêu Cầu Dữ Liệu (DSAR)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mt-1">
            Sinh viên muốn tra cứu toàn bộ bản ghi lịch sử, yêu cầu chỉnh sửa sai sót thông tin hộ tịch/MSSV, hoặc yêu cầu hủy tài khoản vui lòng liên hệ:
          </p>
          <div className="mt-3 text-xs text-slate-800 space-y-1 font-medium">
            <div>• <strong>Đơn vị phụ trách:</strong> Phòng Công tác Sinh viên & Đoàn Thanh Niên BAFU</div>
            <div>• <strong>Email quản trị:</strong> <a href="mailto:admin@bafu.edu.vn" className="text-blue-600 underline">admin@bafu.edu.vn</a> hoặc <a href="mailto:doanthanhnien@bafu.edu.vn" className="text-blue-600 underline">doanthanhnien@bafu.edu.vn</a></div>
            <div>• <strong>Thời gian phản hồi:</strong> Tối đa 03 ngày làm việc kể từ thời điểm nhận được yêu cầu hợp lệ từ email nội bộ trường.</div>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-xs text-slate-500">
        <Link to="/" className="text-blue-600 hover:underline font-bold">← Quay lại Trang Chủ</Link>
        <Link to="/terms-of-service" className="text-slate-600 hover:underline">Xem Điều Khoản Sử Dụng →</Link>
      </div>
    </div>
  );
}
