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
    <header className="sticky top-0 z-40 bg-white border-b border-[#D8D5CD] transition-all">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link to="/" className="flex items-center focus:outline-hidden">
          <BrandWordmark size="default" />
        </Link>

        {/* Desktop Navigation Links — Editorial Style */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 text-xs uppercase tracking-[0.08em] font-bold transition-colors flex items-center gap-2 border-b-2 ${
              isActive('/')
                ? 'text-[#12674D] border-[#12674D]'
                : 'text-[#575E5B] border-transparent hover:text-[#181C1B]'
            }`}
          >
            <House size={16} weight={isActive('/') ? 'bold' : 'regular'} />
            <span>Trang chủ</span>
          </Link>

          <Link
            to="/clubs"
            className={`px-3.5 py-2 text-xs uppercase tracking-[0.08em] font-bold transition-colors flex items-center gap-2 border-b-2 ${
              isActive('/clubs')
                ? 'text-[#12674D] border-[#12674D]'
                : 'text-[#575E5B] border-transparent hover:text-[#181C1B]'
            }`}
          >
            <Compass size={16} weight={isActive('/clubs') ? 'bold' : 'regular'} />
            <span>Khám phá CLB</span>
          </Link>

          <Link
            to="/events"
            className={`px-3.5 py-2 text-xs uppercase tracking-[0.08em] font-bold transition-colors flex items-center gap-2 border-b-2 ${
              isActive('/events')
                ? 'text-[#12674D] border-[#12674D]'
                : 'text-[#575E5B] border-transparent hover:text-[#181C1B]'
            }`}
          >
            <CalendarDots size={16} weight={isActive('/events') ? 'bold' : 'regular'} />
            <span>Sự kiện</span>
          </Link>
        </nav>

        {/* Right Section: Auth Actions or User Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 border border-[#D8D5CD] bg-[#F4F0E7] hover:bg-white transition-colors text-left focus:outline-hidden cursor-pointer"
              >
                <div className="w-7 h-7 bg-[#181C1B] text-white flex items-center justify-center font-bold text-xs">
                  {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-[#181C1B] truncate max-w-[130px]">
                    {user.studentProfile?.fullName || user.email.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-[#7A827F] uppercase tracking-wider font-semibold">
                    {user.role === 'SUPER_ADMIN' ? 'Ban Quản Trị' : user.studentProfile?.studentCode || 'Sinh viên'}
                  </div>
                </div>
                <CaretDown size={14} className="text-[#575E5B]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-[#181C1B] py-2 z-50 animate-in fade-in duration-100"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-[#D8D5CD] bg-[#F4F0E7]">
                    <p className="text-[10px] text-[#7A827F] font-bold uppercase tracking-wider">Đăng nhập với tư cách</p>
                    <p className="text-xs font-bold text-[#181C1B] truncate mt-0.5">
                      {user.studentProfile?.fullName || user.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#12674D]/10 text-[#12674D]">
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin BAFU' : isClubAdmin ? 'Ban Chủ Nhiệm CLB' : 'Hội Viên Sinh Viên'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/student/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7] transition-colors"
                    >
                      <Gauge size={16} />
                      Dashboard Sinh Viên
                    </Link>

                    {isClubAdmin && (
                      <Link
                        to="/club-admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7] transition-colors"
                      >
                        <UsersThree size={16} />
                        Quản Lý CLB (Admin)
                      </Link>
                    )}

                    {user.role === 'SUPER_ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7] transition-colors"
                      >
                        <ShieldCheck size={16} />
                        Quản Trị Hệ Thống
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-[#D8D5CD] pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <SignOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#181C1B] hover:text-[#12674D] border border-[#D8D5CD] hover:border-[#181C1B] transition-colors flex items-center gap-1.5"
              >
                <SignIn size={16} />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#12674D] hover:bg-[#0E523D] transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={16} />
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
              className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#181C1B] border border-[#D8D5CD] flex items-center gap-1"
            >
              <SignIn size={15} />
              <span>Đăng nhập</span>
            </Link>
          )}
          {user && (
            <Link 
              to="/student/dashboard" 
              className="w-7 h-7 bg-[#181C1B] text-white flex items-center justify-center font-bold text-xs"
            >
              {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
            </Link>
          )}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 text-[#181C1B] hover:bg-[#F4F0E7] transition-colors focus:outline-hidden"
            aria-label="Mở menu"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-[#181C1B]/60 transition-opacity" 
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white border-l border-[#D8D5CD] flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[#D8D5CD] flex items-center justify-between bg-[#F4F0E7]">
              <BrandWordmark size="small" showSubtitle={false} />
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#575E5B] hover:text-[#181C1B] transition-colors"
                aria-label="Đóng menu"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {user && (
              <div className="p-4 bg-white border-b border-[#D8D5CD]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#181C1B] text-white flex items-center justify-center font-bold text-sm">
                    {user.studentProfile?.fullName ? user.studentProfile.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#181C1B] truncate">
                      {user.studentProfile?.fullName || user.email}
                    </div>
                    <div className="text-[10px] text-[#7A827F] uppercase tracking-wider font-semibold">
                      {user.role === 'SUPER_ADMIN' ? 'Ban Quản Trị Toàn Trường' : user.studentProfile?.studentCode || 'Sinh viên BAFU'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 flex-1 overflow-y-auto space-y-1">
              <Link
                to="/"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
                  isActive('/') ? 'text-[#12674D] bg-[#12674D]/10' : 'text-[#575E5B] hover:bg-[#F4F0E7]'
                }`}
              >
                <House size={18} />
                Trang chủ
              </Link>

              <Link
                to="/clubs"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
                  isActive('/clubs') ? 'text-[#12674D] bg-[#12674D]/10' : 'text-[#575E5B] hover:bg-[#F4F0E7]'
                }`}
              >
                <Compass size={18} />
                Khám phá CLB
              </Link>

              <Link
                to="/events"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors ${
                  isActive('/events') ? 'text-[#12674D] bg-[#12674D]/10' : 'text-[#575E5B] hover:bg-[#F4F0E7]'
                }`}
              >
                <CalendarDots size={18} />
                Sự kiện
              </Link>

              {user && (
                <div className="pt-4 mt-4 border-t border-[#D8D5CD] space-y-1">
                  <div className="px-3 text-[10px] font-bold text-[#7A827F] uppercase tracking-[0.12em]">
                    Không gian cá nhân
                  </div>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7]"
                  >
                    <Gauge size={16} />
                    Dashboard Sinh Viên
                  </Link>
                  {isClubAdmin && (
                    <Link
                      to="/club-admin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7]"
                    >
                      <UsersThree size={16} />
                      Quản Lý CLB (Admin)
                    </Link>
                  )}
                  {user.role === 'SUPER_ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#181C1B] hover:bg-[#F4F0E7]"
                    >
                      <ShieldCheck size={16} />
                      Quản Trị Hệ Thống
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#D8D5CD] bg-[#F4F0E7]">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-rose-300 bg-white text-rose-600 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 transition-colors"
                >
                  <SignOut size={16} />
                  Đăng xuất
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#181C1B] bg-white text-[#181C1B] font-bold text-xs uppercase tracking-wider"
                  >
                    <SignIn size={16} />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#12674D] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    <UserPlus size={16} />
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
