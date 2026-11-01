import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { List, X, SignOut, ShieldCheck, UsersThree, Gauge } from '@phosphor-icons/react';
import BrandWordmark from '../ui/BrandWordmark';

/**
 * AdminShell - Khung sườn quản trị Functional Minimalism (Linear UI inspired)
 * Sidebar 240px, Topbar 56px, mật độ thông tin cao, giảm thiểu nhiễu thị giác
 */
export default function AdminShell({ children, roleTitle = 'Ban Quản Trị' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#181C1B] flex flex-col font-sans">
      {/* Topbar 56px */}
      <header className="h-14 bg-white border-b border-[#D8D5CD] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-[#575E5B] hover:text-[#181C1B] hover:bg-[#F4F0E7]"
          >
            <List size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-wider text-[#181C1B]">BAFU</span>
            <span className="text-xs uppercase tracking-wider text-[#12674D] font-bold px-1.5 py-0.5 bg-[#12674D]/10">
              {roleTitle}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-[#181C1B] truncate max-w-[180px]">
              {user?.studentProfile?.fullName || user?.email}
            </div>
            <div className="text-[10px] text-[#7A827F] uppercase tracking-wider">
              {isSuperAdmin ? 'Super Administrator' : 'Club Leader'}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-[#575E5B] hover:text-[#EF673F] hover:bg-[#F4F0E7] transition-colors"
            title="Đăng xuất"
          >
            <SignOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex grow">
        {/* Desktop Sidebar 240px */}
        <aside className="w-60 bg-white border-r border-[#D8D5CD] shrink-0 hidden md:flex flex-col justify-between p-4 space-y-6">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A827F] px-3">
              Không gian làm việc
            </div>
            <nav className="space-y-1">
              {isSuperAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                      location.pathname === '/admin/dashboard'
                        ? 'bg-[#181C1B] text-white'
                        : 'text-[#575E5B] hover:text-[#181C1B] hover:bg-[#F4F0E7]'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>Quản trị toàn trường</span>
                  </Link>
                  <Link
                    to="/club-admin"
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                      location.pathname === '/club-admin'
                        ? 'bg-[#181C1B] text-white'
                        : 'text-[#575E5B] hover:text-[#181C1B] hover:bg-[#F4F0E7]'
                    }`}
                  >
                    <UsersThree size={16} />
                    <span>Quản lý CLB</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/club-admin"
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                    location.pathname === '/club-admin'
                      ? 'bg-[#181C1B] text-white'
                      : 'text-[#575E5B] hover:text-[#181C1B] hover:bg-[#F4F0E7]'
                  }`}
                >
                  <UsersThree size={16} />
                  <span>Quản lý CLB</span>
                </Link>
              )}

              <Link
                to="/student/dashboard"
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                  location.pathname === '/student/dashboard'
                    ? 'bg-[#181C1B] text-white'
                    : 'text-[#575E5B] hover:text-[#181C1B] hover:bg-[#F4F0E7]'
                }`}
              >
                <Gauge size={16} />
                <span>Cổng sinh viên</span>
              </Link>
            </nav>
          </div>

          <div className="p-3 border-t border-[#D8D5CD] text-[11px] text-[#7A827F]">
            <div>Hệ thống CLB BAFU</div>
            <div className="font-mono text-[10px] text-[#575E5B] mt-0.5">v2.6.0 Editorial</div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="grow p-4 sm:p-6 lg:p-8 max-w-[1440px] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
