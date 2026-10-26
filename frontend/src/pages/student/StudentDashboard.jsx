import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  User, Shield, Users, Clock, CheckCircle, XCircle, 
  AlertCircle, ArrowRight, Award, LogOut, Edit3, Send
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, refreshMe } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Edit modal
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.studentProfile?.fullName || '',
    phone: user?.studentProfile?.phone || '',
    bio: user?.studentProfile?.bio || '',
    skills: user?.studentProfile?.skills || ''
  });

  const fetchMyData = async () => {
    try {
      const res = await api.getMyApplications();
      if (res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Bạn có chắc chắn muốn rút hồ sơ ứng tuyển này? Hành động này không thể hoàn tác.')) {
      return;
    }
    setWithdrawingId(appId);
    try {
      await api.withdrawApplication(appId);
      setSuccessMsg('Đã rút đơn ứng tuyển thành công.');
      fetchMyData();
    } catch (err) {
      alert(err.message || 'Lỗi khi rút hồ sơ');
    } finally {
      setWithdrawingId(null);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(profileForm);
      setEditingProfile(false);
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      refreshMe();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật hồ sơ');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Đã nộp đơn</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Đang xét duyệt</span>;
      case 'NEED_MORE_INFO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Cần bổ sung thông tin</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">🎉 Đã trúng tuyển</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">Chưa phù hợp</span>;
      case 'WITHDRAWN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Đã rút đơn</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Greeting */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            {user?.studentProfile?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {user?.studentProfile?.fullName || 'Sinh viên BAFU'}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {user?.studentProfile?.studentCode || 'Sinh viên'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.studentProfile?.faculty || 'Trường Đại học Nông - Lâm Bắc Giang'} • {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setProfileForm({
              fullName: user?.studentProfile?.fullName || '',
              phone: user?.studentProfile?.phone || '',
              bio: user?.studentProfile?.bio || '',
              skills: user?.studentProfile?.skills || ''
            });
            setEditingProfile(true);
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Chỉnh sửa hồ sơ
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Danh sách đơn ứng tuyển đã nộp (8 cột) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">Hồ Sơ Ứng Tuyển Của Bạn</h2>
                <p className="text-xs text-slate-500">Theo dõi tiến độ xét duyệt trực tuyến từ Ban chủ nhiệm CLB</p>
              </div>
              <Link
                to="/clubs?recruiting=true"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Ứng tuyển thêm CLB <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Đang tải hồ sơ...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="text-3xl">📄</div>
                <h3 className="font-bold text-slate-700 text-sm">Bạn chưa nộp hồ sơ nào</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy khám phá danh sách câu lạc bộ đang mở đợt tuyển và nộp đơn để gia nhập ngay hôm nay!
                </p>
                <Link
                  to="/clubs?recruiting=true"
                  className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Khám phá đợt tuyển
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {app.campaign?.club?.name}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">
                          {app.campaign?.title}
                        </h4>
                      </div>
                      <div className="shrink-0">{getStatusBadge(app.status)}</div>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>Nộp lúc: {new Date(app.submittedAt).toLocaleString('vi-VN')}</span>
                      
                      {['SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO'].includes(app.status) && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawingId === app.id}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                        >
                          {withdrawingId === app.id ? 'Đang rút...' : 'Rút đơn'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: CLB đã tham gia & Thông tin cá nhân (4 cột) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CLB đã tham gia */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> CLB Bạn Đang Tham Gia
            </h3>

            {(!user?.memberships || user.memberships.length === 0) ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Bạn chưa là thành viên chính thức của CLB nào. Hãy nộp đơn ứng tuyển để gia nhập!
              </div>
            ) : (
              <div className="space-y-3">
                {user.memberships.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{m.club?.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">
                        {m.role === 'LEADER' ? 'Chủ nhiệm' : m.role === 'VICE_LEADER' ? 'Phó chủ nhiệm' : 'Hội viên chính thức'}
                      </div>
                    </div>
                    <Link
                      to={`/clubs/${m.club?.slug}`}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600"
                    >
                      Vào CLB →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chi tiết thông tin sinh viên */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
            <h3 className="font-extrabold text-slate-900 text-base">Hồ Sơ Cá Nhân</h3>
            <div><strong>Mã SV:</strong> {user?.studentProfile?.studentCode || 'N/A'}</div>
            <div><strong>Khoa:</strong> {user?.studentProfile?.faculty || 'N/A'}</div>
            <div><strong>Số ĐT:</strong> {user?.studentProfile?.phone || 'Chưa cập nhật'}</div>
            {user?.studentProfile?.skills && (
              <div><strong>Kỹ năng:</strong> {user?.studentProfile?.skills}</div>
            )}
            {user?.studentProfile?.bio && (
              <div><strong>Tiểu sử:</strong> {user?.studentProfile?.bio}</div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Cập Nhật Hồ Sơ Sinh Viên</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kỹ năng (ví dụ: MC, Thiết kế, Guitar...)</label>
                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Giới thiệu ngắn (Bio)</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
