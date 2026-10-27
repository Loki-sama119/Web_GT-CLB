import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, EnvelopeSimple } from '@phosphor-icons/react';
import BrandWordmark from './ui/BrandWordmark';

export default function Footer() {
  return (
    <footer className="bg-[#0E1F35] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Cột 1: Nhận diện & Thông tin trường (5 cột) */}
          <div className="md:col-span-5 space-y-4">
            <BrandWordmark variant="dark" size="default" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm pt-1">
              Hệ thống kết nối, hỗ trợ tuyển thành viên trực tuyến và số hóa toàn diện hoạt động của các câu lạc bộ, đội, nhóm sinh viên BAFU.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#167C66] shrink-0 mt-0.5" />
                <span>Thị xã Việt Yên, Tỉnh Bắc Giang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#167C66] shrink-0" />
                <span>(0204) 3874 112 — Văn phòng Đoàn Thanh niên</span>
              </div>
              <div className="flex items-center gap-2.5">
                <EnvelopeSimple size={16} className="text-[#167C66] shrink-0" />
                <span>doanthanhnien@bafu.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Khám phá CLB (4 cột) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lĩnh Vực Hoạt Động</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/clubs?category=hoc-thuat-cong-nghe" className="hover:text-white transition-colors">
                  Học thuật & Công nghệ số
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=the-thao" className="hover:text-white transition-colors">
                  Thể dục & Thể thao sinh viên
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=tinh-nguyen-cong-dong" className="hover:text-white transition-colors">
                  Tình nguyện & Hoạt động vì cộng đồng
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=nghe-thuat-van-hoa" className="hover:text-white transition-colors">
                  Nghệ thuật, Âm nhạc & Truyền thông
                </Link>
              </li>
              <li>
                <Link to="/clubs?recruiting=true" className="hover:text-[#F3B846] transition-colors flex items-center gap-2 font-bold text-[#F3B846]">
                  <span className="w-2 h-2 rounded-full bg-[#F3B846] animate-pulse" />
                  Đang mở đợt tuyển thành viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cổng sinh viên & Pháp lý (3 cột) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cổng Dịch Vụ</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/clubs" className="hover:text-white transition-colors">Danh bạ câu lạc bộ</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">Lịch sự kiện & Hoạt động</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">Hồ sơ & Đơn ứng tuyển</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Chính sách bảo vệ dữ liệu</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền & Tiêu chuẩn */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Trường Đại học Nông - Lâm Bắc Giang. Nhận diện dự án BAFU Club Portal.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Quyền riêng tư
            </Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
