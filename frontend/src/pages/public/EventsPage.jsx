import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarDots, Clock, MapPin, UsersThree, CheckCircle, ArrowRight, Sparkle, X } from '@phosphor-icons/react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadEvents = async () => {
    try {
      const res = await api.getEvents({ limit: 20 });
      if (res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để đăng ký tham gia sự kiện!');
      return;
    }
    setRegisteringId(eventId);
    try {
      await api.registerEvent(eventId);
      setSuccessMsg('Đăng ký tham gia sự kiện thành công!');
      loadEvents();
    } catch (err) {
      alert(err.message || 'Lỗi khi đăng ký tham gia sự kiện');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#142B49] rounded-2xl p-8 sm:p-12 text-white shadow-xs space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
          <Sparkle size={14} weight="fill" className="text-[#F3B846]" />
          <span>Hoạt động phong trào sinh viên</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Lịch Sự Kiện & Hoạt Động BAFU
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Tham gia các giải thi đấu thể thao, workshop học thuật, đêm nhạc giao lưu và chiến dịch tình nguyện do các câu lạc bộ BAFU tổ chức.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDots}
          title="Chưa có sự kiện nào sắp diễn ra"
          description="Hiện tại các câu lạc bộ chưa công bố sự kiện mới. Vui lòng quay lại sau."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:border-[#167C66]/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#142B49]/10 text-[#142B49]">
                    {ev.club?.name}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {ev._count?.registrations || 0} đã đăng ký
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {ev.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDots size={16} weight="bold" className="text-[#167C66] shrink-0" />
                    <span>{new Date(ev.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} weight="bold" className="text-[#167C66] shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  disabled={registeringId === ev.id}
                  onClick={() => handleRegisterEvent(ev.id)}
                  className="w-full py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {registeringId === ev.id ? 'Đang đăng ký...' : 'Đăng ký tham gia'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
