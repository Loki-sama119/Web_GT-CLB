import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandWordmark from '../components/ui/BrandWordmark';
import { 
  UsersThree, ClipboardText, Plus, SignOut, ArrowSquareOut,
  ChartBar, ShieldCheck, FileText, UserCheck, House, List, X, CaretRight
} from '@phosphor-icons/react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isClubAdmin = location.pathname.includes('/club-admin');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* 1. DESKTOP SIDEBAR (256px / w-64) */}
      <aside className="hidden lg:flex w-64 bg-[#142B49] text-white flex-col shrink-0 border-r border-slate-800/40 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="inline-block">
            <BrandWordmark variant="dark" size="small" />
          </Link>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F3B846]">
            {isSuperAdmin ? 'Trung Tâm Quản Trị Hệ Thống' : 'Không Gian Ban Chủ Nhiệm'}
          </span>
          <div className="text-xs text-slate-300 font-semibold truncate mt-0.5">
            {isSuperAdmin ? 'Toàn Trường BAFU' : user?.studentProfile?.fullName || 'Club Admin'}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {isSuperAdmin ? (
            <>
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quản Trị Toàn Trường
              </div>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-[#167C66] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ChartBar size={18} weight="duotone" />
                <span>Bảng Điều Khiển</span>
              </Link>
            </>
          ) : (
            <>
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quản Trị Câu Lạc Bộ
              </div>
              <Link
                to="/club-admin"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === '/club-admin'
                    ? 'bg-[#167C66] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ClipboardText size={18} weight="duotone" />
                <span>Quản Lý Nhân Sự & Đơn</span>
              </Link>
            </>
          )}

          <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Lối Tắt Cổng Thông Tin
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <House size={18} />
              <span>Xem Cổng Sinh Viên</span>
            </div>
            <ArrowSquareOut size={14} className="text-slate-400" />
          </Link>
        </div>

        {/* Sidebar Footer User & Logout */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#167C66] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.studentProfile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate text-xs">
                <div className="font-bold text-white truncate">{user?.studentProfile?.fullName || 'Người Dùng'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <SignOut size={16} weight="bold" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-64 bg-[#142B49] text-white flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <BrandWordmark variant="dark" size="small" />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-4 space-y-2">
              <Link
                to={isSuperAdmin ? '/admin/dashboard' : '/club-admin'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#167C66] text-white"
              >
                <ChartBar size={18} />
                <span>Bảng Điều Khiển</span>
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                <House size={18} />
                <span>Cổng Sinh Viên</span>
              </Link>
            </div>
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
              <button onClick={handleLogout} className="text-rose-400 p-1">
                <SignOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Top Header & Breadcrumb */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Mở menu quản trị"
            >
              <List size={20} weight="bold" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-slate-800">BAFU Portal</Link>
              <CaretRight size={12} className="text-slate-400" />
              <span className="text-slate-900 font-bold">
                {isSuperAdmin ? 'Quản Trị Toàn Trường' : 'Ban Chủ Nhiệm CLB'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ Thống Trực Tuyến</span>
            </span>
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <SignOut size={14} weight="bold" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
