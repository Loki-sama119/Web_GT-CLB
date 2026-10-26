import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Lịch Sự Kiện & Hoạt Động Sinh Viên BAFU
        </h1>
        <p className="text-blue-200 text-sm sm:text-base max-w-2xl leading-relaxed">
          Tham gia các giải thể thao tứ hùng, workshop kỹ năng, đêm nhạc giao lưu và hoạt động tình nguyện do các câu lạc bộ tổ chức.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Đang tải lịch sự kiện...</div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">Chưa có sự kiện nào sắp tới.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between card-hover space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {ev.club?.name}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
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
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{new Date(ev.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleRegisterEvent(ev.id)}
                  disabled={registeringId === ev.id}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
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
