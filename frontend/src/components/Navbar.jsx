import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogIn, UserPlus, LogOut, LayoutDashboard, Shield, ChevronDown, Calendar, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Kiểm tra xem user có phải Club Admin của ít nhất 1 CLB không
  const isClubAdmin = user?.role === 'SUPER_ADMIN' || (user?.memberships && user.memberships.some(m => ['LEADER', 'VICE_LEADER'].includes(m.role)));

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight flex items-center gap-1.5">
              BAFU <span className="text-blue-600 font-semibold text-base">ClubPortal</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Cổng Thông Tin Câu Lạc Bộ Sinh Viên</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Trang chủ
          </Link>
          <Link
            to="/clubs"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/clubs') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Khám phá CLB
          </Link>
          <Link
            to="/events"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/events') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sự kiện
          </Link>
        </nav>

        {/* Auth CTA or User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
                  {user.studentProfile?.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">
                    {user.studentProfile?.fullName || user.email.split('@')[0]}
                  </div>
                  <div className="text-[11px] text-slate-500 capitalize">
                    {user.role === 'SUPER_ADMIN' ? 'Quản trị viên' : (user.studentProfile?.studentCode || 'Sinh viên')}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                    <div className="text-sm font-bold text-slate-800">{user.studentProfile?.fullName}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>

                  <Link
                    to="/student/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Bảng điều khiển sinh viên
                  </Link>

                  {isClubAdmin && (
                    <Link
                      to="/club-admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Users className="w-4 h-4 text-amber-500" />
                      Quản lý CLB (Ban chủ nhiệm)
                    </Link>
                  )}

                  {user.role === 'SUPER_ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-red-500" />
                      Quản trị toàn trường
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
