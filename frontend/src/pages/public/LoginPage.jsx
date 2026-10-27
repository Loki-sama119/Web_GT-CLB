import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff, GraduationCap, ShieldCheck, UsersRound } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  // Helper điền nhanh tài khoản thử nghiệm
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#142B49] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-xs">
            <GraduationCap className="w-7 h-7 text-[#F3B846]" />
          </div>
          <h2 className="text-2xl font-black text-[#142B49] tracking-tight">Đăng Nhập Cổng CLB</h2>
          <p className="text-xs text-slate-500">
            Hệ thống xác thực Trường Đại học Nông - Lâm Bắc Giang
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email tài khoản</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@bafu.edu.vn"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
            className="w-full"
            icon={LogIn}
          >
            Đăng nhập
          </Button>
        </form>

        {/* Demo Fast Fill Pill Buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Tài khoản kiểm thử nghiệm thu:
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo('admin@bafu.edu.vn', 'AdminPassword@2026')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Super Admin (Đoàn Trường)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bấm điền</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('it.leader@bafu.edu.vn', '12345678')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-[#167C66]" /> Club Admin (Chủ nhiệm CLB Tech)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bấm điền</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('haidang.sv@bafu.edu.vn', '12345678')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#142B49]" /> Sinh viên (Nguyễn Hải Đăng)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bấm điền</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Chưa có tài khoản sinh viên?{' '}
          <Link to="/register" className="text-[#167C66] font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
