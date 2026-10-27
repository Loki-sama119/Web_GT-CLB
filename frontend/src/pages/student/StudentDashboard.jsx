import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  UsersThree, Clock, CheckCircle, XCircle, 
  WarningCircle, ArrowRight, PencilSimple, PaperPlaneTilt, Camera, CalendarDots, 
  MapPin, ClipboardText, Sparkle, X, CaretRight
} from '@phosphor-icons/react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ClubLogo from '../../components/ui/ClubLogo';

export default function StudentDashboard() {
  const { user, refreshMe } = useAuth();
  const [applications, setApplications] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Edit modal
  const [editingProfile, setEditingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.studentProfile?.fullName || '',
    phone: user?.studentProfile?.phone || '',
    bio: user?.studentProfile?.bio || '',
    skills: user?.studentProfile?.skills || ''
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh đại diện không được vượt quá 2MB!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploadingAvatar(true);
    try {
      await api.uploadAvatar(formData);
      setSuccessMsg('Cập nhật ảnh đại diện thành công!');
      refreshMe();
    } catch (err) {
      alert(err.message || 'Lỗi tải ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchMyData = async () => {
    try {
      const [resApps, resEvents] = await Promise.all([
        api.getMyApplications(),
        api.getMyEventRegistrations().catch(() => ({ data: { registrations: [] } }))
      ]);

      if (resApps.data?.applications) {
        setApplications(resApps.data.applications);
      }
      if (resEvents.data?.registrations) {
        setMyEvents(resEvents.data.registrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async (eventId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này?')) return;
    try {
      await api.cancelEventRegistration(eventId);
      setSuccessMsg('Đã hủy đăng ký sự kiện thành công.');
      fetchMyData();
    } catch (err) {
      alert(err.message || 'Lỗi khi hủy sự kiện');
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
      setSuccessMsg('Cập nhật thông tin hồ sơ thành công!');
      refreshMe();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật hồ sơ');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={14} weight="bold" />
            Đã nộp đơn
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} weight="bold" />
            Đang xét duyệt
          </span>
        );
      case 'NEED_MORE_INFO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <WarningCircle size={14} weight="bold" />
            Cần bổ sung thông tin
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={14} weight="fill" />
            Đã trúng tuyển
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={14} weight="fill" />
            Chưa phù hợp
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
            Đã rút đơn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  // Lọc các CLB sinh viên là hội viên chính thức
  const activeMemberships = user?.memberships || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Profile Greeting — Campus Engagement Identity */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            {user?.studentProfile?.avatarUrl ? (
              <img 
                src={user.studentProfile.avatarUrl} 
                alt="Avatar" 
                className="w-18 h-18 rounded-2xl object-cover shadow-xs border-2 border-white ring-2 ring-[#167C66]/30" 
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-[#142B49] text-white font-black text-2xl flex items-center justify-center shadow-xs">
                {user?.studentProfile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white cursor-pointer shadow-xs transition-all">
              <Camera size={14} weight="bold" />
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
                disabled={uploadingAvatar}
                onChange={handleAvatarChange} 
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#142B49]">
                {user?.studentProfile?.fullName || 'Sinh viên BAFU'}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {user?.studentProfile?.studentCode || 'Sinh viên'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {user?.studentProfile?.faculty || 'Trường Đại học Nông - Lâm Bắc Giang'} • {user?.email}
            </p>
            {user?.studentProfile?.bio && (
              <p className="text-xs text-slate-600 max-w-xl line-clamp-1 italic pt-0.5">
                "{user.studentProfile.bio}"
              </p>
            )}
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <PencilSimple size={16} weight="bold" />
          <span>Chỉnh sửa hồ sơ</span>
        </button>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">CLB Đang Tham Gia</div>
            <div className="text-2xl font-black text-[#142B49] mt-1">{activeMemberships.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#142B49]/5 text-[#142B49] flex items-center justify-center font-bold">
            <UsersThree size={22} weight="duotone" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Hồ Sơ Đã Nộp</div>
            <div className="text-2xl font-black text-[#167C66] mt-1">{applications.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#167C66]/10 text-[#167C66] flex items-center justify-center font-bold">
            <ClipboardText size={22} weight="duotone" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Sự Kiện Đã Đăng Ký</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{myEvents.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CalendarDots size={22} weight="duotone" />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#142B49] tracking-tight">Hồ Sơ Ứng Tuyển Của Bạn</h2>
                <p className="text-xs text-slate-500 mt-0.5">Theo dõi kết quả duyệt đơn trực tuyến từ Ban chủ nhiệm</p>
              </div>
              <Link
                to="/clubs?recruiting=true"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C66] hover:text-[#115E4D]"
              >
                <span>Ứng tuyển thêm</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Đang đồng bộ dữ liệu hồ sơ...</div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={ClipboardText}
                title="Bạn chưa nộp hồ sơ ứng tuyển nào"
                description="Khám phá các đợt tuyển thành viên đang mở và nộp đơn để trở thành hội viên chính thức."
                actionLabel="Khám phá đợt tuyển"
                onAction={() => window.location.href = '/clubs?recruiting=true'}
              />
            ) : (
              <div className="space-y-3.5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white hover:border-[#167C66]/40 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {app.campaign?.club?.name}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {app.campaign?.title}
                        </h4>
                      </div>
                      <div className="shrink-0">{getStatusBadge(app.status)}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>Nộp lúc: {new Date(app.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {['SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO'].includes(app.status) && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawingId === app.id}
                          className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {withdrawingId === app.id ? 'Đang rút...' : 'Rút hồ sơ'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sự kiện đã đăng ký */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#142B49] tracking-tight">Sự Kiện Bạn Đã Đăng Ký</h2>
                <p className="text-xs text-slate-500 mt-0.5">Lịch trình các hoạt động sắp tới của bạn tại trường BAFU</p>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C66] hover:text-[#115E4D]"
              >
                <CalendarDots size={16} />
                <span>Lịch sự kiện</span>
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <EmptyState
                icon={CalendarDots}
                title="Chưa đăng ký sự kiện nào"
                description="Xem danh sách các sự kiện văn nghệ, giải thể thao sắp tới để tham gia cổ vũ hoặc thi đấu."
                actionLabel="Xem lịch sự kiện"
                onAction={() => window.location.href = '/events'}
              />
            ) : (
              <div className="space-y-3">
                {myEvents.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {reg.event?.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-[#167C66] font-semibold">
                          <CalendarDots size={14} />
                          {new Date(reg.event?.startTime).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {reg.event?.location}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelEvent(reg.eventId)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer self-start sm:self-center"
                    >
                      Hủy tham gia
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Memberships (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>CLB Đang Tham Gia</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#167C66] border border-emerald-200">
                {activeMemberships.length}
              </span>
            </h3>

            {activeMemberships.length === 0 ? (
              <div className="text-center py-6 text-slate-400 space-y-2">
                <UsersThree size={32} weight="duotone" className="mx-auto text-slate-300" />
                <p className="text-xs">Bạn chưa là hội viên chính thức của câu lạc bộ nào.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMemberships.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ClubLogo
                        name={m.club?.name}
                        logoUrl={m.club?.logoUrl}
                        categorySlug={m.club?.category?.slug}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {m.club?.name}
                        </h4>
                        <div className="text-[11px] text-[#167C66] font-semibold">
                          {m.role === 'LEADER' ? 'Chủ nhiệm' : m.role === 'VICE_LEADER' ? 'Phó chủ nhiệm' : 'Hội viên chính thức'}
                        </div>
                      </div>
                    </div>

                    {m.club?.slug && (
                      <Link to={`/clubs/${m.club.slug}`} className="text-slate-400 hover:text-[#167C66] p-1">
                        <CaretRight size={16} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Hồ Sơ */}
      <Modal
        isOpen={editingProfile}
        onClose={() => setEditingProfile(false)}
        title="Chỉnh Sửa Hồ Sơ Cá Nhân"
        subtitle="Cập nhật thông tin liên hệ và giới thiệu bản thân"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Họ và tên sinh viên"
            required
            value={profileForm.fullName}
            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
          />

          <Input
            label="Số điện thoại Zalo / Liên hệ"
            type="tel"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="0988 888 888"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Giới thiệu ngắn (Bio)</label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Sở thích, định hướng nghề nghiệp, đam mê..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Kỹ năng / Năng khiếu</label>
            <input
              type="text"
              value={profileForm.skills}
              onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
              placeholder="VD: Lập trình Python, Guitar, Thiết kế Canva, Tổ chức sự kiện..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingProfile(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
