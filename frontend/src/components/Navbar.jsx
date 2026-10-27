import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  House, 
  Compass, 
  CalendarDots, 
  SignIn, 
  UserPlus, 
  SignOut, 
  Gauge, 
  UsersThree, 
  ShieldCheck, 
  CaretDown, 
  List, 
  X,
  User
} from '@phosphor-icons/react';
import BrandWordmark from './ui/BrandWordmark';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileDrawerOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Kiểm tra quyền Club Admin
  const isClubAdmin = user?.role === 'SUPER_ADMIN' || (user?.memberships && user.memberships.some(m => ['LEADER', 'VICE_LEADER'].includes(m.role)));

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center focus:outline-hidden">
          <BrandWordmark size="default" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
              isActive('/')
                ? 'text-[#167C66] bg-[#167C66]/10 font-bold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/70'
            }`}
          >
            <House size={18} weight={isActive('/') ? 'bold' : 'regular'} />
            <span>Trang chủ</span>
            {isActive('/') && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#167C66] rounded-full" />
            )}
          </Link>

          <Link
            to="/clubs"
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
              isActive('/clubs')
                ? 'text-[#167C66] bg-[#167C66]/10 font-bold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/70'
            }`}
          >
            <Compass size={18} weight={isActive('/clubs') ? 'bold' : 'regular'} />
            <span>Khám phá CLB</span>
            {isActive('/clubs') && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#167C66] rounded-full" />
            )}
          </Link>

          <Link
            to="/events"
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
              isActive('/events')
                ? 'text-[#167C66] bg-[#167C66]/10 font-bold'
                : 'text-slate-600 hover:text-[#142B49] hover:bg-slate-100/70'
            }`}
          >
            <CalendarDots size={18} weight={isActive('/events') ? 'bold' : 'regular'} />
            <span>Sự kiện</span>
            {isActive('/events') && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#167C66] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Section: Auth Actions or User Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-all text-left focus:outline-hidden"
              >
                <div className="w-8 h-8 rounded-lg bg-[#142B49] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-[#142B49] truncate max-w-[140px]">
                    {user.studentProfile?.fullName || user.email.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {user.role === 'SUPER_ADMIN' ? 'Ban Quản Trị' : user.studentProfile?.studentCode || 'Sinh viên'}
                  </div>
                </div>
                <CaretDown size={14} className="text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Đăng nhập với tư cách</p>
                    <p className="text-sm font-bold text-[#142B49] truncate">
                      {user.studentProfile?.fullName || user.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin BAFU' : isClubAdmin ? 'Ban Chủ Nhiệm CLB' : 'Hội Viên Sinh Viên'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/student/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#167C66] transition-colors"
                    >
                      <Gauge size={16} />
                      Dashboard Sinh Viên
                    </Link>

                    {isClubAdmin && (
                      <Link
                        to="/club-admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#167C66] transition-colors"
                      >
                        <UsersThree size={16} />
                        Quản Lý CLB (Admin)
                      </Link>
                    )}

                    {user.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#167C66] transition-colors"
                      >
                        <ShieldCheck size={16} />
                        Quản Trị Hệ Thống
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <SignOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#142B49] hover:text-[#167C66] hover:bg-slate-50 transition-colors flex items-center gap-1.5 border border-[#E2E8F0]"
              >
                <SignIn size={18} />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#167C66] hover:bg-[#115E4D] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus size={18} />
                <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle & Quick Login */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#142B49] border border-[#E2E8F0] hover:bg-slate-50 flex items-center gap-1"
            >
              <SignIn size={16} />
              <span>Đăng nhập</span>
            </Link>
          )}
          {user && (
            <Link 
              to="/student/dashboard" 
              className="w-8 h-8 rounded-lg bg-[#142B49] text-white flex items-center justify-center font-bold text-xs"
            >
              {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
            </Link>
          )}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-[#142B49] hover:bg-slate-100 transition-colors focus:outline-hidden"
            aria-label="Mở menu"
          >
            <List size={24} weight="bold" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <BrandWordmark size="small" showSubtitle={false} />
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Đóng menu"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Drawer User Info (if logged in) */}
            {user && (
              <div className="p-4 bg-slate-50 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#142B49] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-[#142B49] truncate">
                      {user.studentProfile?.fullName || user.email}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {user.role === 'SUPER_ADMIN' ? 'Ban Quản Trị Hệ Thống' : user.studentProfile?.studentCode || 'Sinh viên BAFU'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Links */}
            <div className="p-4 flex-1 overflow-y-auto space-y-1">
              <Link
                to="/"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-[#167C66] bg-[#167C66]/10 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <House size={20} weight={isActive('/') ? 'bold' : 'regular'} />
                Trang chủ
              </Link>

              <Link
                to="/clubs"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/clubs') ? 'text-[#167C66] bg-[#167C66]/10 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass size={20} weight={isActive('/clubs') ? 'bold' : 'regular'} />
                Khám phá CLB
              </Link>

              <Link
                to="/events"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/events') ? 'text-[#167C66] bg-[#167C66]/10 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CalendarDots size={20} weight={isActive('/events') ? 'bold' : 'regular'} />
                Sự kiện
              </Link>

              {user && (
                <div className="pt-4 mt-4 border-t border-[#E2E8F0] space-y-1">
                  <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Không gian cá nhân
                  </div>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Gauge size={20} />
                    Dashboard Sinh Viên
                  </Link>
                  {isClubAdmin && (
                    <Link
                      to="/club-admin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UsersThree size={20} />
                      Quản Lý CLB (Admin)
                    </Link>
                  )}
                  {user.role === 'SUPER_ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck size={20} />
                      Quản Trị Hệ Thống
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E2E8F0] space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition-colors"
                >
                  <SignOut size={18} />
                  Đăng xuất
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E2E8F0] text-[#142B49] font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    <SignIn size={18} />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#167C66] text-white font-semibold text-sm hover:bg-[#115E4D] transition-colors shadow-xs"
                  >
                    <UserPlus size={18} />
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
