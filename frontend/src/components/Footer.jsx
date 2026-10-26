import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Cột 1: Thông tin trường */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Hệ thống kết nối, hỗ trợ tuyển thành viên và quản lý hoạt động toàn diện của các câu lạc bộ, đội, nhóm sinh viên trực thuộc Trường Đại học Nông - Lâm Bắc Giang.
            </p>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Xã Bích Động, Thị xã Việt Yên, Tỉnh Bắc Giang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>(0204) 3874 112 — Văn phòng Đoàn Thanh Niên & Hội Sinh Viên</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>doanthanhnien@bafu.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Khám phá CLB</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/clubs?category=the-thao" className="hover:text-white transition-colors">Thể dục Thể thao</Link>
              </li>
              <li>
                <Link to="/clubs?category=hoc-thuat-cong-nghe" className="hover:text-white transition-colors">Học thuật & Công nghệ</Link>
              </li>
              <li>
                <Link to="/clubs?category=nghe-thuat-van-hoa" className="hover:text-white transition-colors">Nghệ thuật & Văn hóa</Link>
              </li>
              <li>
                <Link to="/clubs?category=tinh-nguyen-cong-dong" className="hover:text-white transition-colors">Tình nguyện vì cộng đồng</Link>
              </li>
              <li>
                <Link to="/clubs?recruiting=true" className="hover:text-white transition-colors flex items-center gap-1.5 text-orange-400">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  Đang mở đợt tuyển
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dành cho sinh viên */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Dành cho Sinh Viên</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Đăng ký tài khoản</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">Hồ sơ cá nhân</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">Theo dõi đơn ứng tuyển</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">Lịch sự kiện & Sinh hoạt</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Trường Đại học Nông - Lâm Bắc Giang. Bản quyền thuộc về Đoàn Trường & Hội Sinh Viên.
          </div>
          <div className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> phục vụ sinh viên BAFU
          </div>
        </div>
      </div>
    </footer>
  );
}
