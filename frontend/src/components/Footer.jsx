import React from "react";
import { Link } from "react-router-dom";
import BrandWordmark from "./ui/BrandWordmark";
import { ArrowUpRight, ShieldCheck } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#17211C] text-white border-t border-white/10 pt-16 pb-12 select-none">
      <div className="editorial-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandWordmark variant="dark" />
            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              Cổng thông tin câu lạc bộ sinh viên thí điểm tại Trường Đại học Nông – Lâm Bắc Giang. Nơi kết nối niềm đam mê, kỹ năng và những trải nghiệm thanh xuân ngoài giảng đường.
            </p>
            <div className="pt-2">
              <a
                href="https://bafu.edu.vn/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E7B85B] hover:underline"
              >
                <span>Website Trường Đại học Nông – Lâm Bắc Giang</span>
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          {/* Nav Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm text-[#CBD5E1]">
              <li>
                <Link to="/clubs" className="hover:text-white transition-colors">
                  Danh bạ câu lạc bộ
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Sự kiện & Hoạt động
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">
                  Hồ sơ sinh viên
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Đăng nhập quản trị viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#34D399]" />
              <span>Chính sách & Minh bạch dữ liệu</span>
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Đây là dự án nghiên cứu & thí điểm cổng kết nối sinh viên. Toàn bộ hình ảnh, thông tin CLB và sự kiện được đối chiếu theo tài liệu lưu trữ của trường tại <strong className="text-white">bafu.edu.vn</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#64748B]">
              <Link to="/privacy-policy" className="hover:text-[#CBD5E1] transition-colors underline">
                Quyền riêng tư
              </Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-[#CBD5E1] transition-colors underline">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <span>
            © {new Date().getFullYear()} BAFU Campus Clubs. Dự án cổng thông tin sinh viên thí điểm.
          </span>
          <span className="flex items-center gap-1">
            Thiết kế vì cộng đồng sinh viên BAFU
          </span>
        </div>
      </div>
    </footer>
  );
}
