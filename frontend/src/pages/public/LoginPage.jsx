import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogIn, AlertCircle, Eye, EyeOff, GraduationCap, ShieldCheck, 
  UsersRound, Mail, Lock, Sparkles, Compass, ArrowRight, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  // Quản lý hiển thị tài khoản demo: Chỉ hiển thị trong development hoặc khi có cờ ?demo=true
  const isDemoMode = import.meta.env.DEV || searchParams.get('demo') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Ngăn chặn double submit
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  // Helper điền nhanh tài khoản thử nghiệm (chỉ hoạt động khi isDemoMode)
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F7FA]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* ================= CỘT TRÁI: NHẬN DIỆN & BRANDING (DESKTOP) ================= */}
        <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between p-10 bg-[#142B49] text-white">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#167C66]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F3B846]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Wordmark */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#167C66] flex items-center justify-center text-white shadow-md shadow-[#167C66]/30">
              <GraduationCap className="w-6 h-6 text-[#F3B846]" />
            </div>
            <div>
              <div className="font-extrabold text-sm uppercase tracking-wider text-white">Đại Học Nông - Lâm</div>
              <div className="text-xs text-slate-300 font-medium">Bắc Giang (BAFU) Portal</div>
            </div>
          </div>

          {/* Center Pitch Content */}
          <div className="relative z-10 space-y-5 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F3B846] text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Nền tảng hoạt động sinh viên
            </div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Khám phá đam mê.<br />
              <span className="text-[#F3B846]">Kết nối cộng đồng.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cổng thông tin câu lạc bộ chính thức của Trường Đại học Nông - Lâm Bắc Giang. Nơi bạn tìm kiếm sân chơi học thuật, thể thao, văn hóa và phát triển trọn vẹn kỹ năng thế hệ mới.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <div className="text-xl font-black text-white">10+</div>
                <div className="text-[11px] text-slate-300">CLB trực thuộc trường</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                <div className="text-xl font-black text-[#F3B846]">100%</div>
                <div className="text-[11px] text-slate-300">Ứng tuyển trực tuyến</div>
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 Đoàn Thanh Niên - BAFU</span>
            <Link to="/clubs" className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold transition-colors">
              Khám phá CLB <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ================= CỘT PHẢI: FORM ĐĂNG NHẬP (DESKTOP & MOBILE) ================= */}
        <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          
          {/* Header Mobile Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#142B49] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6 text-[#F3B846]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase">Trường ĐH Nông - Lâm Bắc Giang</div>
                <div className="text-[11px] text-slate-500">Cổng Thông Tin Câu Lạc Bộ</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C66] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#167C66]" />
              Xác Thực Tài Khoản
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B49] tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Vui lòng nhập email nhà trường hoặc tài khoản sinh viên để tiếp tục
            </p>
          </div>

          {/* Thông báo lỗi an toàn */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed font-semibold">{error}</div>
            </div>
          )}

          {/* Form Đăng Nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email tài khoản</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten@bafu.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Mật khẩu</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] transition-all bg-slate-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full text-sm font-bold shadow-sm mt-2"
              icon={LogIn}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Links Đăng ký & Khám phá CLB */}
          <div className="space-y-3 pt-2 text-center text-xs text-slate-500">
            <div>
              Chưa có tài khoản sinh viên?{' '}
              <Link to="/register" className="text-[#167C66] font-bold hover:underline">
                Đăng ký tài khoản mới
              </Link>
            </div>
            <div>
              <Link to="/clubs" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors">
                <Compass className="w-4 h-4 text-[#167C66]" /> Quay về xem danh sách CLB
              </Link>
            </div>
          </div>

          {/* Demo Testing Accounts Pill (Chỉ xuất hiện khi ở môi trường DEV hoặc có query ?demo=true) */}
          {isDemoMode && (
            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F3B846]" /> Tài khoản kiểm thử nhanh (Demo / Dev):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@bafu.edu.vn', 'AdminPassword@2026')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 text-slate-700 text-xs font-bold text-left flex flex-col gap-0.5 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">admin@bafu.edu.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('it.leader@bafu.edu.vn', '12345678')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 text-slate-700 text-xs font-bold text-left flex flex-col gap-0.5 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1 text-[#167C66] font-bold">
                    <UsersRound className="w-3.5 h-3.5" /> Club Admin
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">it.leader@bafu.edu.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('haidang.sv@bafu.edu.vn', '12345678')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 text-slate-700 text-xs font-bold text-left flex flex-col gap-0.5 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1 text-[#142B49] font-bold">
                    <GraduationCap className="w-3.5 h-3.5" /> Sinh viên
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">haidang.sv@bafu.edu.vn</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
