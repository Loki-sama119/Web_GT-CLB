import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  UsersThree, CheckCircle, XCircle, WarningCircle, 
  Plus, Trash, MagnifyingGlass, ShieldCheck, DownloadSimple, 
  ClockCounterClockwise, Clock, ClipboardText, UserCheck, UserPlus, Check, X, CaretDown
} from '@phosphor-icons/react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const [managedClubs, setManagedClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [activeTab, setActiveTab] = useState('applications'); // applications | members | create-campaign

  // Applications
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loadingApps, setLoadingApps] = useState(false);

  // Modal Review
  const [reviewingApp, setReviewingApp] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  const handleExportCSV = async () => {
    if (!selectedClubId) return;
    setExportingCSV(true);
    try {
      const response = await fetch(`/api/v1/clubs/${selectedClubId}/applications/export`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi xuất danh sách ứng viên');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `danh-sach-ung-vien-${selectedClubId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Lỗi khi tải file CSV');
    } finally {
      setExportingCSV(false);
    }
  };

  // Members
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('');
  const [exportingMembersCSV, setExportingMembersCSV] = useState(false);

  const handleExportMembersCSV = async () => {
    if (!selectedClubId) return;
    setExportingMembersCSV(true);
    try {
      const response = await fetch(`/api/v1/clubs/${selectedClubId}/members/export`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi xuất danh sách hội viên');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `danh-sach-hoi-vien-${selectedClubId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Lỗi khi tải file CSV hội viên');
    } finally {
      setExportingMembersCSV(false);
    }
  };

  // Create Campaign Form
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(20);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
  const [questions, setQuestions] = useState([
    { questionText: 'Ban/Lĩnh vực bạn muốn tham gia nhất?', questionType: 'SINGLE_CHOICE', options: ['Ban Chuyên môn', 'Ban Truyền thông', 'Ban Hậu cần'], isRequired: true },
    { questionText: 'Lý do bạn muốn gia nhập câu lạc bộ?', questionType: 'LONG_TEXT', isRequired: true }
  ]);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  // Xác định danh sách CLB mà user quản lý
  useEffect(() => {
    async function loadManagedClubs() {
      try {
        const res = await api.getClubs({ limit: 50 });
        if (res.data?.clubs) {
          if (user?.role === 'SUPER_ADMIN') {
            setManagedClubs(res.data.clubs);
            if (res.data.clubs.length > 0) setSelectedClubId(res.data.clubs[0].id);
          } else {
            const adminClubIds = (user?.memberships || [])
              .filter(m => ['LEADER', 'VICE_LEADER'].includes(m.role))
              .map(m => m.clubId);
            const myClubs = res.data.clubs.filter(c => adminClubIds.includes(c.id));
            setManagedClubs(myClubs);
            if (myClubs.length > 0) setSelectedClubId(myClubs[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadManagedClubs();
  }, [user]);

  // Load danh sách ứng viên
  const loadApplications = async () => {
    if (!selectedClubId) return;
    setLoadingApps(true);
    try {
      const res = await api.getClubApplications(selectedClubId, {
        status: statusFilter,
        search
      });
      if (res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      loadApplications();
    }
  }, [selectedClubId, activeTab, statusFilter, search]);

  // Load danh sách hội viên
  const loadMembers = async () => {
    if (!selectedClubId) return;
    setLoadingMembers(true);
    try {
      const res = await api.getClubMembers(selectedClubId, {
        search: memberSearch,
        role: memberRoleFilter
      });
      if (res.data?.members) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'members') {
      loadMembers();
    }
  }, [selectedClubId, activeTab, memberSearch, memberRoleFilter]);

  // Cập nhật vai trò hội viên
  const handleUpdateRole = async (memberId, newRole) => {
    if (!window.confirm(`Xác nhận đổi vai trò của thành viên này thành ${newRole}?`)) return;
    try {
      await api.updateMemberRole(selectedClubId, memberId, newRole);
      loadMembers();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật vai trò');
    }
  };

  // Xóa hội viên
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi câu lạc bộ?')) return;
    try {
      await api.removeMember(selectedClubId, memberId);
      loadMembers();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa thành viên');
    }
  };

  // Duyệt/từ chối hồ sơ
  const handleReviewAction = async (status) => {
    if (!reviewingApp) return;
    setReviewActionLoading(true);
    try {
      await api.reviewApplication(reviewingApp.id, {
        status,
        internalNotes
      });
      setReviewingApp(null);
      loadApplications();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setReviewActionLoading(false);
    }
  };

  // Tạo đợt tuyển mới
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!selectedClubId) return;
    setCreatingCampaign(true);
    try {
      const payload = {
        title: campaignTitle,
        description: campaignDesc,
        targetQuantity: Number(targetQuantity),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status: 'OPEN',
        questions: questions.map((q, idx) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          isRequired: q.isRequired,
          order: idx,
          options: q.options ? JSON.stringify(q.options) : null
        }))
      };
      await api.createCampaign(selectedClubId, payload);
      alert('Tạo đợt tuyển thành viên mới thành công!');
      setActiveTab('applications');
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo đợt tuyển');
    } finally {
      setCreatingCampaign(false);
    }
  };

  const currentClub = managedClubs.find(c => c.id === selectedClubId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={14} weight="fill" />
            Đã trúng tuyển (ACCEPTED)
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={14} weight="fill" />
            Từ chối (REJECTED)
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} weight="bold" />
            Đang xét duyệt (UNDER_REVIEW)
          </span>
        );
      case 'NEED_MORE_INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <WarningCircle size={14} weight="bold" />
            Cần bổ sung
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={14} weight="bold" />
            Chờ xét duyệt ({status})
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header — shadcn/ui Dashboard-01 style */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#167C66]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#167C66]">Bảng Điều Khiển Ban Chủ Nhiệm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#142B49] tracking-tight">
            Quản Lý: {currentClub?.name || 'Câu Lạc Bộ'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hệ thống quản lý nhân sự, xét duyệt hồ sơ ứng tuyển và số hóa hoạt động CLB
          </p>
        </div>

        {managedClubs.length > 1 && (
          <div className="w-full sm:w-auto space-y-1">
            <label className="block text-xs font-bold text-slate-600">Chuyển câu lạc bộ quản lý:</label>
            <div className="relative">
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#167C66] cursor-pointer appearance-none pr-8"
              >
                {managedClubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* 2. KPI Summary Cards — Linear / shadcn clean aesthetic */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng Đơn Ứng Tuyển</span>
            <div className="w-9 h-9 rounded-xl bg-[#142B49]/5 text-[#142B49] flex items-center justify-center font-bold">
              <ClipboardText size={18} weight="duotone" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#142B49] mt-2">{applications.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chờ Xét Duyệt</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock size={18} weight="duotone" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {applications.filter(a => a.status === 'SUBMITTED').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hội Viên Chính Thức</span>
            <div className="w-9 h-9 rounded-xl bg-[#167C66]/10 text-[#167C66] flex items-center justify-center font-bold">
              <UsersThree size={18} weight="duotone" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#167C66] mt-2">{members.length || currentClub?._count?.memberships || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đợt Tuyển Hoạt Động</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <UserPlus size={18} weight="duotone" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">{currentClub?.campaigns?.length || 1}</div>
        </div>
      </div>

      {/* 3. Navigation Tabs — Linear clean tab bar */}
      <div className="flex border-b border-[#E2E8F0] space-x-2 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-[#167C66] text-[#167C66]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardText size={18} />
          <span>Xét Duyệt Hồ Sơ Ứng Tuyển</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-[#167C66] text-[#167C66]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck size={18} />
          <span>Danh Sách Hội Viên</span>
        </button>
        <button
          onClick={() => setActiveTab('create-campaign')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'create-campaign'
              ? 'border-[#167C66] text-[#167C66]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus size={18} />
          <span>Mở Đợt Tuyển Mới</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm ứng viên theo họ tên, MSSV, khoa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm font-bold bg-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SUBMITTED">Đã nộp (Chờ duyệt)</option>
              <option value="UNDER_REVIEW">Đang phỏng vấn/xét duyệt</option>
              <option value="NEED_MORE_INFO">Yêu cầu bổ sung</option>
              <option value="ACCEPTED">Đã duyệt trúng tuyển</option>
              <option value="REJECTED">Từ chối</option>
            </select>

            <button
              onClick={handleExportCSV}
              disabled={exportingCSV}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              <DownloadSimple size={16} className="text-[#167C66]" />
              <span>{exportingCSV ? 'Đang xuất...' : 'Xuất Excel / CSV'}</span>
            </button>
          </div>

          {/* Applications View — Linear High-Density Data Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            {loadingApps ? (
              <div className="py-16 text-center text-xs text-slate-400">Đang đồng bộ hồ sơ ứng tuyển...</div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={ClipboardText}
                title="Không có hồ sơ nào"
                description="Chưa có hồ sơ ứng tuyển nào khớp với tiêu chí tìm kiếm hoặc đợt tuyển hiện tại."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Ứng viên</th>
                      <th className="p-4">Mã sinh viên</th>
                      <th className="p-4">Khoa / Khóa</th>
                      <th className="p-4">Đợt tuyển</th>
                      <th className="p-4">Ngày nộp</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {app.user?.studentProfile?.fullName || 'N/A'}
                        </td>
                        <td className="p-4 text-slate-600 font-mono">
                          {app.user?.studentProfile?.studentCode || 'N/A'}
                        </td>
                        <td className="p-4 text-slate-600">
                          {app.user?.studentProfile?.faculty || 'N/A'}
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {app.campaign?.title}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(app.submittedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setReviewingApp(app);
                              setInternalNotes(app.internalNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#142B49]/5 hover:bg-[#167C66] hover:text-white text-[#142B49] font-bold transition-colors cursor-pointer"
                          >
                            Xem & Xét duyệt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-[#142B49] text-base sm:text-lg">Danh Sách Hội Viên Chính Thức</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quản lý chức vụ, tìm kiếm và phân quyền nhân sự nội bộ CLB</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#167C66] border border-emerald-200">
                {members.length} thành viên
              </span>
              <button
                onClick={handleExportMembersCSV}
                disabled={exportingMembersCSV || !selectedClubId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>{exportingMembersCSV ? 'Đang xuất CSV...' : 'Xuất Danh Sách (Excel/CSV)'}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm hội viên theo Họ tên, MSSV, Khoa..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
              />
            </div>
            <div>
              <select
                value={memberRoleFilter}
                onChange={(e) => setMemberRoleFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm font-bold bg-slate-50/50 focus:bg-white cursor-pointer"
              >
                <option value="">Tất cả vai trò</option>
                <option value="LEADER">Chủ nhiệm (LEADER)</option>
                <option value="VICE_LEADER">Phó chủ nhiệm (VICE_LEADER)</option>
                <option value="MEMBER">Hội viên (MEMBER)</option>
              </select>
            </div>
          </div>

          {loadingMembers ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách hội viên...</div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={UsersThree}
              title="Không tìm thấy hội viên nào"
              description="Chưa có thành viên nào thỏa mãn bộ lọc hiện tại."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Thành viên</th>
                    <th className="p-4">MSSV</th>
                    <th className="p-4">Khoa / Khóa</th>
                    <th className="p-4">Chức vụ CLB</th>
                    <th className="p-4">Ngày gia nhập</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {m.user?.studentProfile?.fullName || 'N/A'}
                      </td>
                      <td className="p-4 text-slate-600 font-mono">
                        {m.user?.studentProfile?.studentCode || 'N/A'}
                      </td>
                      <td className="p-4 text-slate-600">
                        {m.user?.studentProfile?.faculty || 'N/A'}
                      </td>
                      <td className="p-4">
                        <select
                          value={m.role}
                          onChange={(e) => handleUpdateRole(m.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border cursor-pointer ${
                            m.role === 'LEADER' ? 'border-amber-300 text-amber-900 bg-amber-50' :
                            m.role === 'VICE_LEADER' ? 'border-purple-300 text-purple-900 bg-purple-50' :
                            'border-slate-200 text-slate-700 bg-slate-50'
                          }`}
                        >
                          <option value="MEMBER">Hội viên (MEMBER)</option>
                          <option value="VICE_LEADER">Phó chủ nhiệm (VICE_LEADER)</option>
                          <option value="LEADER">Chủ nhiệm (LEADER)</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(m.joinedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          title="Xóa khỏi CLB"
                          className="text-rose-600 hover:text-rose-800 font-bold p-1 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE CAMPAIGN */}
      {activeTab === 'create-campaign' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-black text-[#142B49] text-base sm:text-lg">Mở Đợt Tuyển & Biểu Mẫu Câu Hỏi Động</h3>
            <p className="text-xs text-slate-500 mt-0.5">Thiết lập thông tin chiến dịch tuyển sinh viên và bộ câu hỏi cho ứng viên</p>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên đợt tuyển thành viên *</label>
              <input
                type="text"
                required
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="Ví dụ: Đợt Tuyển Quân Mùa Thu 2026..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả và thông điệp *</label>
              <textarea
                rows={3}
                required
                value={campaignDesc}
                onChange={(e) => setCampaignDesc(e.target.value)}
                placeholder="Giới thiệu về mục tiêu, chỉ tiêu và quyền lợi khi tham gia..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chỉ tiêu (số lượng)</label>
                <input
                  type="number"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="font-bold text-slate-800 text-sm">Cấu hình câu hỏi biểu mẫu:</div>
              {questions.map((q, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Câu {idx + 1}: {q.questionText}</div>
                  <div className="text-[11px] text-slate-500">Loại: {q.questionType} • {q.isRequired ? 'Bắt buộc' : 'Không bắt buộc'}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={creatingCampaign}
                className="w-full py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {creatingCampaign ? 'Đang tạo...' : 'Công bố đợt tuyển ngay (OPEN)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT & XÉT DUYỆT HỒ SƠ — High density & clear separation */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-[#142B49] text-base sm:text-lg">
                  Xét Duyệt Đơn: {reviewingApp.user?.studentProfile?.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  MSSV: {reviewingApp.user?.studentProfile?.studentCode} • Khoa: {reviewingApp.user?.studentProfile?.faculty}
                </p>
              </div>
              <button 
                onClick={() => setReviewingApp(null)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Danh sách câu hỏi và câu trả lời của ứng viên */}
            <div className="space-y-4">
              <div className="font-bold text-slate-800 text-xs sm:text-sm">Nội dung câu trả lời của ứng viên:</div>
              {reviewingApp.answers?.map((ans) => (
                <div key={ans.id} className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1.5">
                  <div className="font-bold text-slate-700 text-xs">
                    {ans.questionTextSnapshot}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-900 whitespace-pre-line font-medium leading-relaxed">
                    {ans.answerValue}
                  </div>
                </div>
              ))}
            </div>

            {/* Ghi chú nội bộ BCN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú đánh giá nội bộ (Bảo mật - ứng viên không nhìn thấy):
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Nhận xét thái độ, điểm phỏng vấn, lý do duyệt..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
              />
            </div>

            {/* Lịch sử trạng thái xét duyệt */}
            {reviewingApp.histories && reviewingApp.histories.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
                <div className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <ClockCounterClockwise size={16} className="text-slate-500" />
                  <span>Lịch sử thay đổi trạng thái hồ sơ:</span>
                </div>
                <div className="space-y-1.5 divide-y divide-slate-100">
                  {reviewingApp.histories.map((h) => (
                    <div key={h.id} className="pt-1.5 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>
                        <span className="font-semibold text-slate-800">{h.fromStatus}</span> ➔ <span className="font-semibold text-[#167C66]">{h.toStatus}</span>
                        {h.notes && <span className="text-slate-500 italic ml-1">({h.notes})</span>}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(h.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewAction('REJECTED')}
                className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                Từ chối đơn (REJECTED)
              </button>
              <button
                type="button"
                disabled={reviewActionLoading}
                onClick={() => handleReviewAction('NEED_MORE_INFO')}
                className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                Yêu cầu bổ sung
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction('ACCEPTED')}
                disabled={reviewActionLoading}
                className="px-5 py-2 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check size={16} weight="bold" />
                <span>✓ Duyệt trúng tuyển (Tạo thành viên)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
