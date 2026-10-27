import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, WarningCircle, Eye, EyeSlash } from '@phosphor-icons/react';
import BrandWordmark from '../../components/ui/BrandWordmark';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    email: '',
    password: '',
    faculty: 'Khoa Công nghệ Thông tin',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const faculties = [
    'Khoa Công nghệ Thông tin',
    'Khoa Cơ Điện',
    'Khoa Kinh tế - QTKD',
    'Khoa Nông học',
    'Khoa Chăn nuôi Thú y',
    'Khoa Lâm nghiệp',
    'Khoa Tài nguyên Môi trường',
    'Khoa Ngoại ngữ'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng ký không thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandWordmark variant="light" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#142B49] tracking-tight">Tạo Tài Khoản Sinh Viên</h1>
            <p className="text-xs text-slate-500 mt-1">
              Đăng ký để ứng tuyển và quản lý tư cách hội viên CLB tại BAFU
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <WarningCircle size={16} weight="fill" className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên sinh viên *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã sinh viên *</label>
              <input
                type="text"
                required
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                placeholder="SV2026..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0987..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Khoa / Viện đào tạo</label>
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white cursor-pointer"
            >
              {faculties.map((f, idx) => (
                <option key={idx} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email sinh viên *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sinhvien@bafu.edu.vn"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu (tối thiểu 6 ký tự) *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus size={18} weight="bold" />
            <span>{loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Đã có tài khoản sinh viên?{' '}
          <Link to="/login" className="text-[#167C66] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
