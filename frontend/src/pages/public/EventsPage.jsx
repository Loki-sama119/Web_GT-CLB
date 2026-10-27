import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarDots, CheckCircle, X } from '@phosphor-icons/react';
import EditorialHeading from '../../components/editorial/EditorialHeading';
import EventPoster from '../../components/editorial/EventPoster';
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
    <div className="bg-[#F4F0E7] text-[#181C1B] min-h-screen py-12 lg:py-20 font-sans">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Header Banner */}
        <div className="border-b border-[#D8D5CD] pb-8">
          <EditorialHeading
            as="h1"
            index="01"
            eyebrow="Phong trào thanh niên & học thuật"
            title="Lịch Sự Kiện & Hoạt Động BAFU"
            subtitle="Tham gia các giải thi đấu thể thao, workshop học thuật, đêm nhạc giao lưu và chiến dịch tình nguyện do các câu lạc bộ BAFU tổ chức."
            size="default"
          />
        </div>

        {successMsg && (
          <div className="p-4 bg-white border border-[#12674D] text-xs font-bold text-[#12674D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-[#12674D] shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-[#575E5B] hover:text-[#181C1B] cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white border border-[#D8D5CD] animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-[#D8D5CD] p-12 text-center">
            <EmptyState
              icon={CalendarDots}
              title="Chưa có sự kiện nào sắp diễn ra"
              description="Hiện tại các câu lạc bộ chưa công bố sự kiện mới. Vui lòng quay lại sau."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            {events.map((ev, idx) => (
              <EventPoster
                key={ev.id}
                event={ev}
                featured={idx === 0}
                onRegister={handleRegisterEvent}
                registering={registeringId === ev.id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
