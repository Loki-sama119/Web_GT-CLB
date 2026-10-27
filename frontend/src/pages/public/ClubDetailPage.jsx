import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UsersThree, Clock, MapPin, EnvelopeSimple, Phone, 
  CheckCircle, WarningCircle, PaperPlaneTilt, X, ArrowLeft, ShieldCheck, 
  Image as ImageIcon, FacebookLogo, ArrowRight
} from '@phosphor-icons/react';
import ClubLogo from '../../components/ui/ClubLogo';
import Modal from '../../components/ui/Modal';

export default function ClubDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal nộp đơn ứng tuyển động
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formAnswers, setFormAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Album hoạt động CLB
  const [albumImages, setAlbumImages] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function fetchClub() {
      setLoading(true);
      try {
        const res = await api.getClubBySlug(slug);
        if (res.data?.club) {
          setClub(res.data.club);
          try {
            const albumRes = await api.getClubAlbum(res.data.club.id);
            if (albumRes.data?.medias) {
              setAlbumImages(albumRes.data.medias);
            }
          } catch (albumErr) {
            console.error('Lỗi tải album:', albumErr);
          }
        }
      } catch (err) {
        setError(err.message || 'Không tìm thấy câu lạc bộ');
      } finally {
        setLoading(false);
      }
    }
    fetchClub();
  }, [slug]);

  const handleOpenApplyModal = (campaign) => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setSelectedCampaign(campaign);
    setFormAnswers({});
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const handleInputChange = (questionId, value) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId, optionValue, isChecked) => {
    const currentList = Array.isArray(formAnswers[questionId]) ? formAnswers[questionId] : [];
    let updated;
    if (isChecked) {
      updated = [...currentList, optionValue];
    } else {
      updated = currentList.filter(item => item !== optionValue);
    }
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: updated
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const answersPayload = Object.entries(formAnswers).map(([questionId, answerValue]) => ({
        questionId,
        answerValue
      }));

      await api.applyRecruitment(selectedCampaign.id, answersPayload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Lỗi khi nộp hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F4F0E7] min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#181C1B] border-t-transparent animate-spin mx-auto" />
          <p className="text-[#575E5B] font-semibold text-xs uppercase tracking-wider">Đang tải hồ sơ câu lạc bộ...</p>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="bg-[#F4F0E7] min-h-screen py-20 px-4">
        <div className="max-w-xl mx-auto bg-white border border-[#D8D5CD] p-10 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <WarningCircle size={28} />
          </div>
          <h2 className="font-display font-bold text-2xl uppercase text-[#181C1B]">{error || 'Không tìm thấy câu lạc bộ'}</h2>
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#181C1B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#12674D] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Quay lại danh sách câu lạc bộ</span>
          </Link>
        </div>
      </div>
    );
  }

  const leaders = club.memberships?.filter(m => ['LEADER', 'VICE_LEADER'].includes(m.role)) || [];
  const openCampaigns = club.campaigns || [];

  return (
    <div className="bg-[#F4F0E7] text-[#181C1B] min-h-screen font-sans pb-24">
      {/* 1. EDITORIAL PROFILE HEADER */}
      <div className="bg-[#181C1B] text-white border-b border-[#2A2F2D] relative overflow-hidden">
        {club.coverUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={club.coverUrl}
              alt={club.name}
              className="w-full h-full object-cover grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181C1B] via-[#181C1B]/80 to-transparent" />
          </div>
        )}

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 space-y-6">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#D8D5CD] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Thư mục câu lạc bộ BAFU</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
            <ClubLogo
              name={club.name}
              logoUrl={club.logoUrl}
              categorySlug={club.category?.slug}
              size="xl"
              className="rounded-none border-2 border-white/20 shrink-0 shadow-none"
            />

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 bg-[#12674D] text-white font-bold uppercase tracking-wider">
                  {club.category?.name || 'Tổ chức BAFU'}
                </span>
                {openCampaigns.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EF673F] text-white font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-white animate-pulse" />
                    Đang tuyển thành viên
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-white/10 text-[#D8D5CD] uppercase tracking-wider font-semibold border border-white/20">
                  {club.status === 'ACTIVE' ? 'CLB Chính Thức' : 'Chờ Phê Duyệt'}
                </span>
              </div>

              <h1 className="font-display font-bold uppercase text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
                {club.name}
              </h1>

              {club.shortDescription && (
                <p className="text-sm sm:text-base text-[#D8D5CD] max-w-3xl leading-relaxed">
                  {club.shortDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL CONTENT (12-COLUMN ASYMMETRICAL GRID) */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái (8/12 cột): Đợt tuyển, Giới thiệu, BCN, Album */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Đợt tuyển đang mở (Nổi bật) */}
            {openCampaigns.length > 0 && (
              <section className="bg-white border border-[#D8D5CD] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8D5CD]">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF673F]">
                    <span className="w-2 h-2 bg-[#EF673F] animate-pulse" />
                    <span>Đợt tuyển quân đang diễn ra</span>
                  </div>
                  <span className="text-xs text-[#575E5B] font-semibold">
                    Hạn chót: {new Date(openCampaigns[0].endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase text-[#181C1B]">
                    {openCampaigns[0].title}
                  </h3>
                  <p className="text-sm text-[#575E5B] leading-relaxed">
                    {openCampaigns[0].description}
                  </p>
                  {openCampaigns[0].requirements && (
                    <div className="p-4 bg-[#F4F0E7] border border-[#D8D5CD] text-xs text-[#181C1B] space-y-1">
                      <div className="font-bold uppercase tracking-wider">Yêu cầu & Tiêu chí xét tuyển:</div>
                      <div className="whitespace-pre-line text-[#575E5B] leading-relaxed">
                        {openCampaigns[0].requirements}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#D8D5CD] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#575E5B]">
                    Chỉ tiêu tuyển sinh: <strong className="text-[#181C1B] font-bold">{openCampaigns[0].targetQuantity} sinh viên</strong>
                  </span>
                  <button
                    onClick={() => handleOpenApplyModal(openCampaigns[0])}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF673F] hover:bg-[#D9532B] text-white text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Ứng tuyển vào CLB ngay</span>
                  </button>
                </div>
              </section>
            )}

            {/* Giới thiệu chi tiết */}
            <section className="bg-white border border-[#D8D5CD] p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-[#181C1B] pb-3 border-b border-[#D8D5CD]">
                Giới Thiệu & Mục Tiêu Hoạt Động
              </h2>
              <div className="text-sm text-[#575E5B] leading-relaxed whitespace-pre-line">
                {club.description}
              </div>

              {club.meetingSchedule && (
                <div className="mt-6 p-4 bg-[#F4F0E7] border border-[#D8D5CD] flex items-start gap-3">
                  <Clock size={20} className="text-[#12674D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#181C1B]">Lịch sinh hoạt thường kỳ</h4>
                    <p className="text-xs text-[#575E5B] mt-0.5">{club.meetingSchedule}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Ban Chủ Nhiệm Câu Lạc Bộ */}
            <section className="bg-white border border-[#D8D5CD] p-6 sm:p-8 space-y-5">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-[#181C1B] pb-3 border-b border-[#D8D5CD]">
                Ban Chủ Nhiệm Câu Lạc Bộ
              </h2>
              {leaders.length === 0 ? (
                <p className="text-xs text-[#7A827F]">Đang cập nhật danh sách ban điều hành.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leaders.map((m) => (
                    <div key={m.id} className="p-4 border border-[#D8D5CD] bg-[#F4F0E7] flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-[#181C1B] text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {m.user?.studentProfile?.fullName?.charAt(0) || 'L'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#181C1B] text-sm truncate">
                          {m.user?.studentProfile?.fullName || 'Chủ nhiệm CLB'}
                        </div>
                        <div className="text-xs text-[#12674D] font-bold uppercase tracking-wider">
                          {m.role === 'LEADER' ? 'Chủ nhiệm CLB' : 'Phó chủ nhiệm'}
                        </div>
                        <div className="text-[11px] text-[#575E5B] truncate">
                          {m.user?.studentProfile?.faculty || 'ĐH Nông - Lâm Bắc Giang'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Album Hoạt Động & Khoảnh Khắc CLB */}
            <section className="bg-white border border-[#D8D5CD] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D5CD]">
                <div>
                  <h2 className="font-display font-bold text-xl uppercase tracking-wider text-[#181C1B]">
                    Album Hoạt Động
                  </h2>
                  <p className="text-xs text-[#575E5B] mt-0.5">Hình ảnh thực tế từ các chương trình, giải đấu và sự kiện thường niên</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#F4F0E7] border border-[#D8D5CD] text-[#181C1B]">
                  {albumImages.length} bức ảnh
                </span>
              </div>

              {albumImages.length === 0 ? (
                <div className="py-12 text-center border border-[#D8D5CD] bg-[#F4F0E7] text-[#7A827F] space-y-2">
                  <ImageIcon size={32} className="mx-auto text-[#7A827F]" />
                  <p className="text-xs">Chưa có hình ảnh nào trong bộ sưu tập này.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {albumImages.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => setLightboxImage(media)}
                      className="group relative aspect-4/3 overflow-hidden bg-[#181C1B] cursor-pointer border border-[#D8D5CD]"
                    >
                      <img
                        src={media.url}
                        alt={media.caption || club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] text-white font-medium line-clamp-1">
                          {media.caption || 'Xem ảnh lớn'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Cột phải (4/12 cột): Thông tin CLB & Sidebar đăng ký */}
          <div className="lg:col-span-4 space-y-6">
            <aside className="bg-white border border-[#D8D5CD] p-6 space-y-5 sticky top-24">
              <h3 className="font-display font-bold text-base uppercase tracking-wider text-[#181C1B] pb-3 border-b border-[#D8D5CD]">
                Thông Tin Câu Lạc Bộ
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#575E5B]">Quy mô hội viên:</span>
                  <span className="font-bold text-[#181C1B]">{club._count?.memberships || 0} thành viên</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#575E5B]">Lĩnh vực:</span>
                  <span className="font-bold text-[#12674D] uppercase tracking-wider">{club.category?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#575E5B]">Trạng thái:</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#12674D]/10 text-[#12674D]">
                    Đang hoạt động
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8D5CD] space-y-2.5 text-xs text-[#575E5B]">
                {club.fanpageUrl && (
                  <div className="flex items-center gap-2.5">
                    <FacebookLogo size={16} weight="fill" className="text-[#1877F2] shrink-0" />
                    <a
                      href={club.fanpageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[#1877F2] hover:underline font-semibold"
                    >
                      Fanpage Facebook chính thức
                    </a>
                  </div>
                )}
                {(club.email || club.contactEmail) && (
                  <div className="flex items-center gap-2.5">
                    <EnvelopeSimple size={16} className="text-[#181C1B] shrink-0" />
                    <span className="truncate">{club.email || club.contactEmail}</span>
                  </div>
                )}
                {(club.phone || club.contactPhone) && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-[#181C1B] shrink-0" />
                    <span>{club.phone || club.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#EF673F] shrink-0 mt-0.5" />
                  <span>Khuôn viên Trường ĐH Nông – Lâm Bắc Giang</span>
                </div>
              </div>

              {openCampaigns.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenApplyModal(openCampaigns[0])}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#EF673F] hover:bg-[#D9532B] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Nộp đơn ứng tuyển</span>
                  </button>
                </div>
              )}
            </aside>
          </div>

        </div>
      </div>

      {/* Modal Nộp Hồ Sơ Động */}
      {selectedCampaign && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCampaign(null)}
          title={`Ứng Tuyển: ${selectedCampaign.title}`}
          subtitle={`Câu lạc bộ: ${club.name}`}
          maxWidth="max-w-2xl"
        >
          {submitSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-[#12674D]/10 text-[#12674D] flex items-center justify-center mx-auto">
                <CheckCircle size={32} weight="fill" />
              </div>
              <h4 className="font-display font-bold text-xl uppercase text-[#181C1B]">Nộp Hồ Sơ Thành Công!</h4>
              <p className="text-xs text-[#575E5B] max-w-md mx-auto leading-relaxed">
                Đơn ứng tuyển của bạn đã được chuyển đến Ban chủ nhiệm {club.name}. Bạn có thể theo dõi tiến độ xét duyệt trực tuyến tại Bảng điều khiển sinh viên.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-5 py-2 border border-[#D8D5CD] text-[#181C1B] hover:bg-[#F4F0E7] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Đóng
                </button>
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#181C1B] hover:bg-[#12674D] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Xem hồ sơ của tôi</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-5">
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <WarningCircle size={16} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {selectedCampaign.form?.questions?.map((q) => {
                let options = [];
                if (q.options) {
                  try {
                    options = JSON.parse(q.options);
                  } catch (e) {
                    options = [];
                  }
                }

                return (
                  <div key={q.id} className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#181C1B]">
                      {q.questionText} {q.isRequired && <span className="text-rose-500">*</span>}
                    </label>

                    {q.questionType === 'SHORT_TEXT' && (
                      <input
                        type="text"
                        required={q.isRequired}
                        value={formAnswers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="w-full px-3.5 py-2.5 border border-[#D8D5CD] text-xs focus:outline-hidden focus:border-[#181C1B] bg-white"
                      />
                    )}

                    {q.questionType === 'LONG_TEXT' && (
                      <textarea
                        rows={3}
                        required={q.isRequired}
                        value={formAnswers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Nhập chi tiết câu trả lời..."
                        className="w-full px-3.5 py-2.5 border border-[#D8D5CD] text-xs focus:outline-hidden focus:border-[#181C1B] bg-white"
                      />
                    )}

                    {q.questionType === 'SINGLE_CHOICE' && (
                      <div className="space-y-2 pt-1">
                        {options.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2.5 text-xs text-[#181C1B] cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={formAnswers[q.id] === opt}
                              onChange={(e) => handleInputChange(q.id, e.target.value)}
                              className="w-4 h-4 text-[#181C1B] focus:ring-[#181C1B]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.questionType === 'MULTIPLE_CHOICE' && (
                      <div className="space-y-2 pt-1">
                        {options.map((opt, idx) => {
                          const isChecked = Array.isArray(formAnswers[q.id]) && formAnswers[q.id].includes(opt);
                          return (
                            <label key={idx} className="flex items-center gap-2.5 text-xs text-[#181C1B] cursor-pointer">
                              <input
                                type="checkbox"
                                value={opt}
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                                className="w-4 h-4 text-[#181C1B] rounded-none focus:ring-[#181C1B]"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {q.questionType === 'URL' && (
                      <input
                        type="url"
                        required={q.isRequired}
                        value={formAnswers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 border border-[#D8D5CD] text-xs focus:outline-hidden focus:border-[#181C1B] bg-white"
                      />
                    )}
                  </div>
                );
              })}

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#D8D5CD]">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 border border-[#D8D5CD] text-[#575E5B] hover:text-[#181C1B] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#181C1B] hover:bg-[#12674D] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                  <span>{submitting ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}</span>
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Lightbox Modal Xem Ảnh Lớn */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#181C1B]/95 flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng ảnh"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || club.name}
              className="max-h-[75vh] w-auto max-w-full object-contain border border-white/20"
            />
            {lightboxImage.caption && (
              <p className="text-white text-xs font-semibold text-center bg-black/60 px-4 py-2 border border-white/10">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
