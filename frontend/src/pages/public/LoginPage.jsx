import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // Helper điền nhanh tài khoản demo
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            B
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đăng Nhập Hệ Thống</h2>
          <p className="text-xs text-slate-500">
            Cổng thông tin câu lạc bộ Trường Đại học Nông - Lâm Bắc Giang
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên / quản trị</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@bafu.edu.vn"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Pill Buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Tài khoản mẫu chạy thử nhanh:
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@bafu.edu.vn', 'AdminPassword@2026')}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold text-left flex items-center justify-between"
            >
              <span>👑 Super Admin (Đoàn Trường)</span>
              <span className="text-[10px] text-red-500">Bấm để điền</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('it.leader@bafu.edu.vn', '12345678')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold text-left flex items-center justify-between"
            >
              <span>⚡ Club Admin (Chủ nhiệm CLB Tech)</span>
              <span className="text-[10px] text-amber-500">Bấm để điền</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('haidang.sv@bafu.edu.vn', '12345678')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold text-left flex items-center justify-between"
            >
              <span>🎓 Sinh viên mẫu (Nguyễn Hải Đăng)</span>
              <span className="text-[10px] text-blue-500">Bấm để điền</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Chưa có tài khoản sinh viên?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
