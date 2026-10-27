import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Users, CheckCircle2, XCircle, AlertCircle, FileText, 
  Plus, Edit, Trash2, Search, Filter, Shield, Send, ArrowRight
} from 'lucide-react';

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

  // Members
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

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
      if (user?.role === 'SUPER_ADMIN') {
        const res = await api.getClubs({ limit: 50 });
        if (res.data?.clubs) {
          setManagedClubs(res.data.clubs);
          if (res.data.clubs.length > 0) setSelectedClubId(res.data.clubs[0].id);
        }
      } else {
        const leaderMemberships = user?.memberships?.filter(m => ['LEADER', 'VICE_LEADER'].includes(m.role)) || [];
        const clubs = leaderMemberships.map(m => m.club);
        setManagedClubs(clubs);
        if (clubs.length > 0) setSelectedClubId(clubs[0].id);
      }
    }
    loadManagedClubs();
  }, [user]);

  // Tải danh sách hồ sơ khi đổi CLB hoặc filter
  const fetchApplications = async () => {
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

  // Tải danh sách thành viên khi đổi sang tab members
  const fetchMembers = async () => {
    if (!selectedClubId) return;
    setLoadingMembers(true);
    try {
      const res = await api.getClubMembers(selectedClubId);
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
    if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'members') {
      fetchMembers();
    }
  }, [selectedClubId, activeTab, statusFilter]);

  // Hành động xét duyệt hồ sơ
  const handleReviewAction = async (newStatus) => {
    if (!reviewingApp) return;
    setReviewActionLoading(true);
    try {
      await api.reviewApplication(reviewingApp.id, {
        status: newStatus,
        internalNotes
      });
      setReviewingApp(null);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Lỗi khi xét duyệt hồ sơ');
    } finally {
      setReviewActionLoading(false);
    }
  };

  // Cập nhật role thành viên
  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await api.updateMemberRole(selectedClubId, memberId, newRole);
      fetchMembers();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật chức vụ');
    }
  };

  // Xóa thành viên
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Bạn có chắc muốn xóa thành viên này khỏi câu lạc bộ?')) return;
    try {
      await api.removeMember(selectedClubId, memberId);
      fetchMembers();
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa thành viên');
    }
  };

  // Tạo đợt tuyển mới
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCreatingCampaign(true);
    try {
      await api.createRecruitment(selectedClubId, {
        title: campaignTitle,
        description: campaignDesc,
        targetQuantity: Number(targetQuantity),
        startDate,
        endDate,
        status: 'OPEN',
        questions
      });
      alert('Tạo đợt tuyển thành viên thành công!');
      setCampaignTitle('');
      setCampaignDesc('');
      setActiveTab('applications');
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo đợt tuyển');
    } finally {
      setCreatingCampaign(false);
    }
  };

  const currentClub = managedClubs.find(c => c.id === selectedClubId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar: Selector CLB & Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-amber-500" /> Bảng Quản Trị Ban Chủ Nhiệm CLB
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản Lý: {currentClub?.name || 'Chọn câu lạc bộ'}
          </h1>
        </div>

        {managedClubs.length > 1 && (
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-bold text-slate-500 mb-1">Đổi câu lạc bộ quản lý:</label>
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white"
            >
              {managedClubs.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Xét Duyệt Hồ Sơ Ứng Tuyển
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'members'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Danh Sách Hội Viên
        </button>
        <button
          onClick={() => setActiveTab('create-campaign')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'create-campaign'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus className="w-4 h-4" /> Mở Đợt Tuyển Mới
        </button>
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm ứng viên theo họ tên, MSSV, khoa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SUBMITTED">Đã nộp (Chờ duyệt)</option>
              <option value="UNDER_REVIEW">Đang phỏng vấn/xét duyệt</option>
              <option value="NEED_MORE_INFO">Yêu cầu bổ sung</option>
              <option value="ACCEPTED">Đã duyệt trúng tuyển</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingApps ? (
              <div className="py-12 text-center text-xs text-slate-400">Đang tải hồ sơ...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Chưa có hồ sơ ứng tuyển nào theo bộ lọc này.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
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
                        <td className="p-4 text-slate-600">
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
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' :
                            app.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                            app.status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setReviewingApp(app);
                              setInternalNotes(app.internalNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold transition-colors"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Danh Sách Hội Viên Chính Thức</h3>
              <p className="text-xs text-slate-500">Quản lý phân quyền chức vụ và nhân sự nội bộ CLB</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {members.length} thành viên
            </span>
          </div>

          {loadingMembers ? (
            <div className="py-8 text-center text-xs text-slate-400">Đang tải danh sách thành viên...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className="p-4">Họ và tên</th>
                    <th className="p-4">Mã sinh viên</th>
                    <th className="p-4">Khoa</th>
                    <th className="p-4">Chức vụ nội bộ</th>
                    <th className="p-4">Ngày tham gia</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {m.user?.studentProfile?.fullName || m.user?.email}
                      </td>
                      <td className="p-4 text-slate-600">{m.user?.studentProfile?.studentCode || 'N/A'}</td>
                      <td className="p-4 text-slate-600">{m.user?.studentProfile?.faculty || 'N/A'}</td>
                      <td className="p-4">
                        <select
                          value={m.role}
                          onChange={(e) => handleUpdateRole(m.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
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
                          className="text-red-500 hover:text-red-700 font-bold p-1 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg">Mở Đợt Tuyển & Biểu Mẫu Câu Hỏi Động</h3>
            <p className="text-xs text-slate-500">Thiết lập thông tin đợt tuyển và bộ câu hỏi cho ứng viên</p>
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả và thông điệp *</label>
              <textarea
                rows={3}
                required
                value={campaignDesc}
                onChange={(e) => setCampaignDesc(e.target.value)}
                placeholder="Giới thiệu về đợt tuyển..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chỉ tiêu (số lượng)</label>
                <input
                  type="number"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="font-bold text-slate-800 text-sm">Cấu hình câu hỏi biểu mẫu:</div>
              {questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Câu {idx + 1}: {q.questionText}</div>
                  <div className="text-[11px] text-slate-500">Loại: {q.questionType} • {q.isRequired ? 'Bắt buộc' : 'Không bắt buộc'}</div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={creatingCampaign}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
            >
              {creatingCampaign ? 'Đang tạo đợt tuyển...' : 'Công bố đợt tuyển ngay (OPEN)'}
            </button>
          </form>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT & XÉT DUYỆT HỒ SƠ */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Xét Duyệt Đơn: {reviewingApp.user?.studentProfile?.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  MSSV: {reviewingApp.user?.studentProfile?.studentCode} • Khoa: {reviewingApp.user?.studentProfile?.faculty}
                </p>
              </div>
              <button onClick={() => setReviewingApp(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            {/* Danh sách câu hỏi và câu trả lời của ứng viên */}
            <div className="space-y-4">
              <div className="font-bold text-slate-800 text-sm">Nội dung câu trả lời của ứng viên:</div>
              {reviewingApp.answers?.map((ans) => (
                <div key={ans.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-700 text-xs">
                    {ans.questionTextSnapshot}
                  </div>
                  <div className="text-sm text-slate-900 whitespace-pre-line font-medium">
                    {ans.answerValue}
                  </div>
                </div>
              ))}
            </div>

            {/* Ghi chú nội bộ BCN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú đánh giá nội bộ (Bảo mật - sinh viên không xem được):
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Nhận xét thái độ, điểm phỏng vấn, lý do duyệt..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleReviewAction('REJECTED')}
                disabled={reviewActionLoading}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs"
              >
                Từ chối đơn (REJECTED)
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction('NEED_MORE_INFO')}
                disabled={reviewActionLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold text-xs"
              >
                Yêu cầu bổ sung
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction('ACCEPTED')}
                disabled={reviewActionLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                ✓ Duyệt trúng tuyển (Tạo thành viên)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
