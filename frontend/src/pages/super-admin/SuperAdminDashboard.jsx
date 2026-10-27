import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ShieldCheck, UsersThree, Medal, FileText, CheckCircle, 
  Pulse, Plus, UserCheck, WarningCircle, DownloadSimple, ChartBar, CalendarDots, CheckSquare,
  MagnifyingGlass, UploadSimple, ArrowsClockwise, X, CaretRight
} from '@phosphor-icons/react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../utils/statusPresentation';
import ClubLogo from '../../components/ui/ClubLogo';

export default function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clubReports, setClubReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [exportingReportCSV, setExportingReportCSV] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview | reports | users | clubs | audit

  // Form phân quyền Club Admin
  const [assignUserId, setAssignUserId] = useState('');
  const [assignClubId, setAssignClubId] = useState('');
  const [assignRole, setAssignRole] = useState('LEADER');
  const [assignMsg, setAssignMsg] = useState('');

  // Form tạo CLB mới
  const [newClubName, setNewClubName] = useState('');
  const [newClubShortDesc, setNewClubShortDesc] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newClubCatId, setNewClubCatId] = useState('');
  const [newClubSchedule, setNewClubSchedule] = useState('');
  const [createClubMsg, setCreateClubMsg] = useState('');

  // CSV Import CLB
  const [importCsvContent, setImportCsvContent] = useState('');
  const [importCsvResult, setImportCsvResult] = useState(null);
  const [importingCsv, setImportingCsv] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, clubsRes, catRes] = await Promise.all([
        api.getAdminDashboard().catch(() => null),
        api.getAdminUsers().catch(() => null),
        api.getClubs({ limit: 100 }).catch(() => null),
        api.getCategories().catch(() => null)
      ]);

      if (dashRes?.data) setDashboardData(dashRes.data);
      if (usersRes?.data?.users) {
        setUsers(usersRes.data.users);
        if (usersRes.data.users.length > 0) setAssignUserId(usersRes.data.users[0].id);
      }
      if (clubsRes?.data?.clubs) {
        setClubs(clubsRes.data.clubs);
        if (clubsRes.data.clubs.length > 0) setAssignClubId(clubsRes.data.clubs[0].id);
      }
      if (catRes?.data?.categories) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) setNewClubCatId(catRes.data.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.getClubReports();
      if (res?.data?.reports) {
        setClubReports(res.data.reports);
      }
    } catch (err) {
      console.error('Lỗi khi tải báo cáo CLB:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleExportReportsCSV = async () => {
    setExportingReportCSV(true);
    try {
      const response = await fetch('/api/v1/admin/reports/clubs/export', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi tải file báo cáo CSV');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-clb-bafu-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Lỗi khi xuất file báo cáo CSV');
    } finally {
      setExportingReportCSV(false);
    }
  };

  const handleDownloadTemplateCsv = async () => {
    try {
      const response = await fetch('/api/v1/admin/clubs/template-csv', {
        credentials: 'include'
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mau-nhap-clb-bafu.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Lỗi khi tải file mẫu CSV');
    }
  };

  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!importCsvContent.trim()) return;
    setImportingCsv(true);
    setImportCsvResult(null);
    try {
      const res = await api.importClubsCsv(importCsvContent);
      setImportCsvResult(res.data);
      setImportCsvContent('');
      loadData();
    } catch (err) {
      alert(err.message || 'Lỗi khi nhập danh sách CLB từ CSV');
    } finally {
      setImportingCsv(false);
    }
  };

  const handleToggleClubStatus = async (clubId, newStatus) => {
    try {
      await api.updateClubStatus(clubId, newStatus);
      loadData();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái CLB');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignRole = async (e) => {
    e.preventDefault();
    setAssignMsg('');
    try {
      await api.assignClubRole(assignClubId, {
        userId: assignUserId,
        role: assignRole
      });
      setAssignMsg('Phân quyền Ban Chủ nhiệm thành công!');
      loadData();
    } catch (err) {
      alert(err.message || 'Lỗi khi phân quyền');
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    setCreateClubMsg('');
    try {
      await api.createClub({
        name: newClubName,
        shortDescription: newClubShortDesc,
        description: newClubDesc,
        categoryId: newClubCatId,
        meetingSchedule: newClubSchedule
      });
      setCreateClubMsg('Tạo câu lạc bộ mới thành công!');
      setNewClubName('');
      setNewClubShortDesc('');
      setNewClubDesc('');
      setNewClubSchedule('');
      loadData();
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo câu lạc bộ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Banner — Professional Institutional Console */}
      <div className="bg-[#142B49] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F3B846] uppercase tracking-wider mb-1">
            <ShieldCheck size={18} weight="fill" className="text-[#F3B846]" />
            <span>Trung Tâm Quản Trị Hệ Thống (Super Admin)</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Đại Học Nông - Lâm Bắc Giang Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Giám sát toàn bộ hoạt động câu lạc bộ, phân quyền Ban Chủ nhiệm và nhật ký kiểm toán hệ thống
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs — Linear Clean Density */}
      <div className="flex border-b border-[#E2E8F0] space-x-2 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview' ? 'border-[#167C66] text-[#167C66]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pulse size={16} />
          <span>Tổng Quan Thống Kê</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('reports');
            if (clubReports.length === 0) loadReports();
          }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-[#167C66] text-[#167C66]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ChartBar size={16} />
          <span>Báo Cáo CLB Toàn Trường</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users' ? 'border-[#167C66] text-[#167C66]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UsersThree size={16} />
          <span>Người Dùng & Phân Quyền</span>
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'clubs' ? 'border-[#167C66] text-[#167C66]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus size={16} />
          <span>Tạo Câu Lạc Bộ Mới</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'audit' ? 'border-[#167C66] text-[#167C66]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={16} />
          <span>Nhật Ký Kiểm Toán (Audit Logs)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-3xl font-black text-[#142B49]">{dashboardData?.totalUsers || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Tổng người dùng</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-3xl font-black text-[#167C66]">{dashboardData?.totalClubs || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Câu lạc bộ hoạt động</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-3xl font-black text-amber-700">{dashboardData?.totalApplications || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Đơn ứng tuyển đã nộp</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-3xl font-black text-emerald-700">{dashboardData?.totalMemberships || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Hội viên chính thức</div>
            </div>
          </div>

          {/* Đơn nộp gần đây */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-black text-[#142B49] text-base">Hồ Sơ Ứng Tuyển Gần Đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Họ tên sinh viên</th>
                    <th className="p-3.5">MSSV</th>
                    <th className="p-3.5">CLB ứng tuyển</th>
                    <th className="p-3.5">Ngày nộp</th>
                    <th className="p-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.recentApplications?.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900">{app.user?.studentProfile?.fullName}</td>
                      <td className="p-3.5 text-slate-600 font-mono">{app.user?.studentProfile?.studentCode}</td>
                      <td className="p-3.5 text-slate-700">{app.campaign?.club?.name}</td>
                      <td className="p-3.5 text-slate-500">{new Date(app.submittedAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-3.5">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL-WIDE CLUB REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#142B49] flex items-center gap-2">
                <ChartBar size={20} weight="duotone" className="text-[#167C66]" /> 
                <span>Báo Cáo Hoạt Động Câu Lạc Bộ Toàn Trường</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thống kê chi tiết số lượng hội viên, quy mô tuyển quân, tỷ lệ trúng tuyển và các hoạt động sự kiện
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={loadReports}
                disabled={loadingReports}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowsClockwise size={14} className={loadingReports ? 'animate-spin' : ''} />
                <span>Làm mới số liệu</span>
              </button>
              <button
                type="button"
                onClick={handleExportReportsCSV}
                disabled={exportingReportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>{exportingReportCSV ? 'Đang xuất file...' : 'Xuất Báo Cáo Excel (CSV)'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Tổng sự kiện CLB đã tổ chức</div>
                <CalendarDots size={20} className="text-[#142B49]" />
              </div>
              <div className="text-3xl font-black text-[#142B49] mt-2">{dashboardData?.totalEvents || 0}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Lượt sinh viên đăng ký sự kiện</div>
                <CheckSquare size={20} className="text-[#167C66]" />
              </div>
              <div className="text-3xl font-black text-[#167C66] mt-2">{dashboardData?.totalRegistrations || 0}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Tỷ lệ duyệt trúng tuyển TB</div>
                <Medal size={20} className="text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-700 mt-2">{dashboardData?.overallAcceptanceRate || 0}%</div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#142B49] text-base">Thống Kê Chi Tiết Từng Câu Lạc Bộ</h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#167C66] border border-emerald-200">
                {clubReports.length} CLB báo cáo
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Câu lạc bộ</th>
                    <th className="p-3.5">Lĩnh vực</th>
                    <th className="p-3.5 text-center">Hội viên</th>
                    <th className="p-3.5 text-center">Đợt tuyển</th>
                    <th className="p-3.5 text-center">Đơn nộp</th>
                    <th className="p-3.5 text-center">Trúng tuyển</th>
                    <th className="p-3.5 text-center">Tỷ lệ</th>
                    <th className="p-3.5 text-center">Sự kiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clubReports.map((r) => (
                    <tr key={r.clubId} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900">{r.clubName}</td>
                      <td className="p-3.5 text-slate-600">{r.categoryName}</td>
                      <td className="p-3.5 text-center font-bold text-[#142B49]">{r.membersCount}</td>
                      <td className="p-3.5 text-center">{r.campaignsCount}</td>
                      <td className="p-3.5 text-center">{r.applicationsCount}</td>
                      <td className="p-3.5 text-center text-emerald-700 font-bold">{r.acceptedCount}</td>
                      <td className="p-3.5 text-center font-semibold text-amber-700">{r.acceptanceRate}%</td>
                      <td className="p-3.5 text-center">{r.eventsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-black text-[#142B49] text-base">Cấp Quyền Ban Chủ Nhiệm Cho Thành Viên</h3>
            <p className="text-xs text-slate-500">Chỉ định quyền Chủ nhiệm (LEADER) hoặc Phó chủ nhiệm (VICE_LEADER) cho tài khoản</p>

            {assignMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                {assignMsg}
              </div>
            )}

            <form onSubmit={handleAssignRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn tài khoản người dùng</label>
                <select
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.studentProfile?.fullName || u.email} ({u.studentProfile?.studentCode || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn câu lạc bộ</label>
                <select
                  value={assignClubId}
                  onChange={(e) => setAssignClubId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                >
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức vụ bổ nhiệm</label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                >
                  <option value="LEADER">Chủ nhiệm (LEADER)</option>
                  <option value="VICE_LEADER">Phó chủ nhiệm (VICE_LEADER)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <UserCheck size={16} weight="bold" />
                <span>Xác nhận phân quyền</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-black text-[#142B49] text-base">Danh Sách Người Dùng Toàn Trường ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Họ và tên</th>
                    <th className="p-3.5">MSSV</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Khoa</th>
                    <th className="p-3.5">Quyền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900">{u.studentProfile?.fullName || 'N/A'}</td>
                      <td className="p-3.5 text-slate-600 font-mono">{u.studentProfile?.studentCode || 'N/A'}</td>
                      <td className="p-3.5 text-slate-600">{u.email}</td>
                      <td className="p-3.5 text-slate-600">{u.studentProfile?.faculty || 'N/A'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          u.role === 'SUPER_ADMIN' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role === 'SUPER_ADMIN' ? 'Quản trị viên trường' : 'Sinh viên'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLUBS MANAGEMENT & CREATION */}
      {activeTab === 'clubs' && (
        <div className="space-y-8">
          {/* 1. Bảng Phê Duyệt & Quản Lý Trạng Thái CLB */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-[#142B49] text-base sm:text-lg">Danh Sách & Phê Duyệt Câu Lạc Bộ ({clubs.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kiểm soát trạng thái hiển thị công khai: ACTIVE (công khai), PENDING (chờ duyệt), INACTIVE (tạm dừng)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Tên Câu Lạc Bộ</th>
                    <th className="p-3.5">Mã Định Danh (Slug)</th>
                    <th className="p-3.5">Lĩnh Vực</th>
                    <th className="p-3.5 text-center">Trạng Thái Hiện Tại</th>
                    <th className="p-3.5 text-right">Thao Tác Phê Duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clubs.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <ClubLogo name={c.name} logoUrl={c.logoUrl} categorySlug={c.category?.slug} size="sm" />
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{c.slug}</td>
                      <td className="p-3.5 text-slate-600">{c.category?.name || 'Chưa phân loại'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          c.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status === 'ACTIVE' ? 'Đang hoạt động' : c.status === 'PENDING' ? 'Chờ duyệt' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {c.status !== 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => handleToggleClubStatus(c.id, 'ACTIVE')}
                            className="px-2.5 py-1 rounded-lg bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-[11px] cursor-pointer"
                          >
                            Duyệt hoạt động
                          </button>
                        )}
                        {c.status !== 'INACTIVE' && (
                          <button
                            type="button"
                            onClick={() => handleToggleClubStatus(c.id, 'INACTIVE')}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer"
                          >
                            Tạm dừng
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 2. Nhập CLB từ file CSV */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-[#142B49] text-base">Nhập Danh Sách CLB Bằng CSV (Batch Import)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Dành cho Nhà trường nhập danh sách CLB chính thức</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplateCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  <DownloadSimple size={14} className="text-[#167C66]" /> 
                  <span>Tải file mẫu CSV</span>
                </button>
              </div>

              {importCsvResult && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl space-y-1 border border-emerald-200">
                  <div className="font-bold">Kết quả xử lý:</div>
                  <div>• Đã xử lý: {importCsvResult.totalProcessed} dòng</div>
                  <div>• Tạo mới thành công: {importCsvResult.created?.length || 0} CLB</div>
                  <div>• Bỏ qua (trùng tên/lỗi): {importCsvResult.skipped?.length || 0} CLB</div>
                </div>
              )}

              <form onSubmit={handleImportCsv} className="space-y-3">
                <textarea
                  rows={5}
                  value={importCsvContent}
                  onChange={(e) => setImportCsvContent(e.target.value)}
                  placeholder="Dán nội dung CSV vào đây (hoặc mở file mẫu, chỉnh sửa rồi dán)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                />
                <button
                  type="submit"
                  disabled={importingCsv || !importCsvContent.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <UploadSimple size={16} weight="bold" />
                  <span>{importingCsv ? 'Đang import...' : 'Tiến hành Import CLB'}</span>
                </button>
              </form>
            </div>

            {/* 3. Tạo CLB Thủ công */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="font-black text-[#142B49] text-base">Thêm Câu Lạc Bộ Thủ Công</h3>
              <p className="text-xs text-slate-500 mt-0.5">Khởi tạo CLB đơn lẻ với thông tin trực tiếp</p>

              {createClubMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                  {createClubMsg}
                </div>
              )}

              <form onSubmit={handleCreateClub} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên câu lạc bộ *</label>
                  <input
                    type="text"
                    required
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    placeholder="VD: CLB Robot & Sáng Tạo BAFU"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn *</label>
                  <input
                    type="text"
                    required
                    value={newClubShortDesc}
                    onChange={(e) => setNewClubShortDesc(e.target.value)}
                    placeholder="Tóm tắt 1-2 câu..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                    <select
                      value={newClubCatId}
                      onChange={(e) => setNewClubCatId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lịch sinh hoạt</label>
                    <input
                      type="text"
                      value={newClubSchedule}
                      onChange={(e) => setNewClubSchedule(e.target.value)}
                      placeholder="VD: Tối thứ 5 hàng tuần"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea
                    rows={2}
                    value={newClubDesc}
                    onChange={(e) => setNewClubDesc(e.target.value)}
                    placeholder="Tôn chỉ, mục tiêu, điều kiện..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#142B49] hover:bg-[#0E1F35] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus size={16} weight="bold" />
                  <span>Tạo câu lạc bộ</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="font-black text-[#142B49] text-base">Nhật Ký Thao Tác Hệ Thống (Audit Logs)</h3>
          <p className="text-xs text-slate-500">Ghi lại toàn bộ các hành động phê duyệt, đổi trạng thái và tác động dữ liệu</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Thời gian</th>
                  <th className="p-3.5">Người thực hiện</th>
                  <th className="p-3.5">Hành động</th>
                  <th className="p-3.5">Đối tượng</th>
                  <th className="p-3.5">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData?.recentAuditLogs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{log.user?.studentProfile?.fullName || log.user?.email || 'System'}</td>
                    <td className="p-3.5 font-semibold text-[#167C66]">{log.action}</td>
                    <td className="p-3.5 text-slate-600">{log.entityType} ({log.entityId?.slice(0, 8)}...)</td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
