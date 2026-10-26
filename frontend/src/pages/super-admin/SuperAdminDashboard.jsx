import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Shield, Users, Award, FileText, CheckCircle2, 
  Activity, Plus, UserCheck, AlertCircle, Download, BarChart3, Calendar, CheckSquare
} from 'lucide-react';

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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'reports' && clubReports.length === 0) {
      loadReports();
    }
  }, [activeTab]);

  const handleAssignClubAdmin = async (e) => {
    e.preventDefault();
    setAssignMsg('');
    try {
      await api.assignClubAdmin({
        userId: assignUserId,
        clubId: assignClubId,
        role: assignRole
      });
      setAssignMsg('Phân quyền quản trị CLB thành công!');
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
      setCreateClubMsg('Đã tạo câu lạc bộ mới thành công!');
      setNewClubName('');
      setNewClubShortDesc('');
      setNewClubDesc('');
      loadData();
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo câu lạc bộ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-red-400" /> Trung Tâm Quản Trị Hệ Thống (Super Admin)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Đại Học Nông - Lâm Bắc Giang Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Giám sát toàn bộ hoạt động câu lạc bộ, phân quyền và nhật ký kiểm toán
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Tổng Quan Thống Kê
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Báo Cáo CLB Toàn Trường
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Người Dùng & Phân Quyền
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'clubs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Tạo Câu Lạc Bộ Mới
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          Nhật Ký Kiểm Toán (Audit Logs)
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-blue-600">{dashboardData?.totalUsers || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Tổng người dùng</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-slate-800">{dashboardData?.totalClubs || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Câu lạc bộ hoạt động</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-amber-500">{dashboardData?.totalApplications || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Đơn ứng tuyển đã nộp</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-emerald-600">{dashboardData?.totalMemberships || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Hội viên chính thức</div>
            </div>
          </div>

          {/* Đơn nộp gần đây */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Hồ Sơ Ứng Tuyển Gần Đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className="p-3">Họ tên sinh viên</th>
                    <th className="p-3">MSSV</th>
                    <th className="p-3">CLB ứng tuyển</th>
                    <th className="p-3">Ngày nộp</th>
                    <th className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.recentApplications?.map((app) => (
                    <tr key={app.id}>
                      <td className="p-3 font-bold text-slate-900">{app.user?.studentProfile?.fullName}</td>
                      <td className="p-3 text-slate-600">{app.user?.studentProfile?.studentCode}</td>
                      <td className="p-3 text-slate-700">{app.campaign?.club?.name}</td>
                      <td className="p-3 text-slate-500">{new Date(app.submittedAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {app.status}
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

      {/* TAB: SCHOOL-WIDE CLUB REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" /> Báo Cáo Hoạt Động Câu Lạc Bộ Toàn Trường
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Thống kê chi tiết số lượng hội viên, quy mô tuyển quân, tỷ lệ trúng tuyển và các hoạt động sự kiện
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadReports}
                disabled={loadingReports}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {loadingReports ? 'Đang tải...' : 'Làm mới số liệu'}
              </button>
              <button
                onClick={handleExportReportsCSV}
                disabled={exportingReportCSV}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                {exportingReportCSV ? 'Đang xuất file...' : 'Xuất Báo Cáo Excel (CSV)'}
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Tổng sự kiện CLB đã tổ chức</div>
                <Calendar className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-black text-indigo-600 mt-2">{dashboardData?.totalEvents || 0}</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Lượt sinh viên đăng ký sự kiện</div>
                <CheckSquare className="w-5 h-5 text-teal-500" />
              </div>
              <div className="text-3xl font-black text-teal-600 mt-2">{dashboardData?.totalRegistrations || 0}</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Tỷ lệ duyệt trúng tuyển TB</div>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-500 mt-2">{dashboardData?.overallAcceptanceRate || 0}%</div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Bảng Báo Cáo Từng Câu Lạc Bộ ({clubReports.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className="p-3">#</th>
                    <th className="p-3">Tên Câu Lạc Bộ</th>
                    <th className="p-3">Lĩnh Vực</th>
                    <th className="p-3">Chủ Nhiệm / Đại Diện</th>
                    <th className="p-3 text-center">Thành Viên</th>
                    <th className="p-3 text-center">Đợt Tuyển</th>
                    <th className="p-3 text-center">Đơn Nộp</th>
                    <th className="p-3 text-center">Trúng Tuyển</th>
                    <th className="p-3 text-center">Tỷ Lệ</th>
                    <th className="p-3 text-center">Sự Kiện</th>
                    <th className="p-3 text-center">Lượt ĐK</th>
                    <th className="p-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clubReports.map((report, idx) => (
                    <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{report.name}</td>
                      <td className="p-3 text-slate-600">{report.category}</td>
                      <td className="p-3 font-medium text-slate-800">{report.leaderName}</td>
                      <td className="p-3 text-center font-bold text-blue-600">{report.totalMembers}</td>
                      <td className="p-3 text-center text-slate-600">{report.totalCampaigns}</td>
                      <td className="p-3 text-center text-slate-700 font-medium">{report.totalApplications}</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">{report.acceptedApplications}</td>
                      <td className="p-3 text-center font-bold text-amber-600">{report.acceptanceRate}</td>
                      <td className="p-3 text-center text-indigo-600 font-semibold">{report.totalEvents}</td>
                      <td className="p-3 text-center text-teal-600 font-semibold">{report.totalRegistrations}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          report.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {report.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
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

      {/* TAB 2: USERS & ASSIGN ROLE */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Card Phân quyền */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> Cấp Quyền Ban Chủ Nhiệm Cho Thành Viên
            </h3>

            {assignMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
                {assignMsg}
              </div>
            )}

            <form onSubmit={handleAssignClubAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn tài khoản người dùng:</label>
                <select
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.studentProfile?.fullName || u.email} ({u.studentProfile?.studentCode || u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn câu lạc bộ phân công:</label>
                <select
                  value={assignClubId}
                  onChange={(e) => setAssignClubId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức vụ bổ nhiệm:</label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="LEADER">Chủ nhiệm câu lạc bộ (LEADER)</option>
                  <option value="VICE_LEADER">Phó chủ nhiệm câu lạc bộ (VICE_LEADER)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Xác nhận cấp quyền quản trị
              </button>
            </form>
          </div>

          {/* Danh sách người dùng */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Danh Sách Tài Khoản Toàn Trường</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">MSSV</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Khoa</th>
                    <th className="p-3">Quyền hệ thống</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="p-3 font-bold text-slate-900">{u.studentProfile?.fullName || 'N/A'}</td>
                      <td className="p-3 text-slate-600">{u.studentProfile?.studentCode || 'N/A'}</td>
                      <td className="p-3 text-slate-600">{u.email}</td>
                      <td className="p-3 text-slate-600">{u.studentProfile?.faculty || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role}
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

      {/* TAB 3: CREATE CLUB */}
      {activeTab === 'clubs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Thành Lập / Tạo Câu Lạc Bộ Mới</h3>

          {createClubMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
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
                placeholder="CLB Robot & Trí Tuệ Nhân Tạo..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lĩnh vực hoạt động</label>
              <select
                value={newClubCatId}
                onChange={(e) => setNewClubCatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn gọn *</label>
              <input
                type="text"
                required
                value={newClubShortDesc}
                onChange={(e) => setNewClubShortDesc(e.target.value)}
                placeholder="Mô tả 1 câu thu hút sinh viên..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giới thiệu chi tiết</label>
              <textarea
                rows={3}
                value={newClubDesc}
                onChange={(e) => setNewClubDesc(e.target.value)}
                placeholder="Mục tiêu, ban điều hành, hoạt động..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lịch sinh hoạt định kỳ</label>
              <input
                type="text"
                value={newClubSchedule}
                onChange={(e) => setNewClubSchedule(e.target.value)}
                placeholder="Ví dụ: Tối thứ Sáu hàng tuần..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Tạo câu lạc bộ
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Nhật Ký Thao Tác Hệ Thống (Audit Logs)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Người thực hiện</th>
                  <th className="p-3">Hành động</th>
                  <th className="p-3">Đối tượng</th>
                  <th className="p-3">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData?.auditLogs?.map(log => (
                  <tr key={log.id}>
                    <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="p-3 font-semibold text-slate-800">{log.user?.email || 'System'}</td>
                    <td className="p-3 font-bold text-blue-600">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.entityType}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px] truncate max-w-xs">{log.details}</td>
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
