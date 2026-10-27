import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  House, Compass, CalendarDays, LogIn, UserPlus, LogOut, 
  LayoutDashboard, UsersRound, ShieldCheck, ChevronDown, Menu, X, GraduationCap
} from 'lucide-react';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Kiểm tra quyền Club Admin
  const isClubAdmin = user?.role === 'SUPER_ADMIN' || (user?.memberships && user.memberships.some(m => ['LEADER', 'VICE_LEADER'].includes(m.role)));

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#142B49] text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#167C66] transition-colors">
            <GraduationCap className="w-6 h-6 text-[#F3B846]" />
          </div>
          <div>
            <div className="font-extrabold text-[#142B49] tracking-tight text-lg leading-tight flex items-center gap-1.5">
              BAFU <span className="text-[#167C66] font-bold text-base">ClubPortal</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Đại Học Nông - Lâm Bắc Giang</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isActive('/')
                ? 'text-[#167C66] bg-[#167C66]/10 font-extrabold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/80'
            }`}
          >
            <House className="w-4 h-4" />
            Trang chủ
          </Link>
          <Link
            to="/clubs"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isActive('/clubs')
                ? 'text-[#167C66] bg-[#167C66]/10 font-extrabold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            Khám phá CLB
          </Link>
          <Link
            to="/events"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isActive('/events')
                ? 'text-[#167C66] bg-[#167C66]/10 font-extrabold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/80'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Sự kiện
          </Link>
        </nav>

        {/* Right Action: Auth Buttons or User Dropdown & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-2xl hover:bg-slate-100/80 transition-all border border-slate-200/90 bg-white shadow-2xs cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#142B49] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                  {user.studentProfile?.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight max-w-[130px] truncate">
                    {user.studentProfile?.fullName || user.email.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {user.role === 'SUPER_ADMIN' ? 'Ban Quản Trị' : (user.studentProfile?.studentCode || 'Sinh viên')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user.studentProfile?.fullName || 'Tài khoản'}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/student/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#167C66]/10 hover:text-[#167C66] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Cổng thông tin sinh viên
                    </Link>

                    {isClubAdmin && (
                      <Link
                        to="/club-admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#167C66]/10 hover:text-[#167C66] transition-colors"
                      >
                        <UsersRound className="w-4 h-4 text-[#167C66]" />
                        Quản lý CLB (Ban chủ nhiệm)
                      </Link>
                    )}

                    {user.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#142B49]/10 hover:text-[#142B49] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Quản trị cấp trường
                      </Link>
                    )}
                  </div>

                  <div className="my-1 border-t border-slate-100" />

                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất an toàn
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 hover:text-[#142B49] hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex px-4 py-2 text-xs font-bold text-white bg-[#167C66] hover:bg-[#115E4D] rounded-xl shadow-xs transition-colors items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive('/') ? 'text-[#167C66] bg-[#167C66]/10' : 'text-slate-700'
              }`}
            >
              <House className="w-4 h-4" />
              Trang chủ
            </Link>
            <Link
              to="/clubs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive('/clubs') ? 'text-[#167C66] bg-[#167C66]/10' : 'text-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              Khám phá câu lạc bộ
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive('/events') ? 'text-[#167C66] bg-[#167C66]/10' : 'text-slate-700'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Lịch sự kiện BAFU
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <div className="text-xs font-bold text-slate-900">{user.studentProfile?.fullName}</div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Cổng sinh viên
                </Link>
                {isClubAdmin && (
                  <Link
                    to="/club-admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <UsersRound className="w-4 h-4 text-[#167C66]" />
                    Quản lý CLB
                  </Link>
                )}
                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Quản trị toàn trường
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-center border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-center text-white bg-[#167C66] hover:bg-[#115E4D] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
