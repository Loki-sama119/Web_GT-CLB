import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UsersThree, Clock, MapPin, EnvelopeSimple, Phone, Flame, 
  CheckCircle, WarningCircle, PaperPlaneTilt, X, ArrowLeft, ShieldCheck, 
  Image as ImageIcon, Sparkle, ArrowRight, CalendarDots
} from '@phosphor-icons/react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-[#167C66] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-semibold text-sm">Đang tải thông tin câu lạc bộ...</p>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <WarningCircle size={28} weight="duotone" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error || 'Không tìm thấy câu lạc bộ'}</h2>
        <Link to="/clubs">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Quay lại danh sách câu lạc bộ
          </Button>
        </Link>
      </div>
    );
  }

  const leaders = club.memberships?.filter(m => ['LEADER', 'VICE_LEADER'].includes(m.role)) || [];
  const openCampaigns = club.campaigns || [];

  return (
    <div className="pb-20 space-y-8">
      {/* 1. Header Banner — Real Campus Organization Profile */}
      <div className="relative bg-[#142B49] text-white py-12 sm:py-16 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#167C66_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/clubs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> Danh sách câu lạc bộ
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ClubLogo
              name={club.name}
              logoUrl={club.logoUrl}
              categorySlug={club.category?.slug}
              size="xl"
              className="ring-4 ring-white/20 shadow-xl"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20">
                  {club.category?.name}
                </span>
                {openCampaigns.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F3B846] text-[#142B49]">
                    <Flame size={14} weight="fill" className="text-amber-700" />
                    Đang tuyển thành viên
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30">
                  <ShieldCheck size={14} weight="bold" />
                  Đoàn Thanh niên BAFU công nhận
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">{club.name}</h1>
              <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">{club.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Thông tin chính & Đợt tuyển (8 cột) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Đợt tuyển đang mở (Nổi bật) */}
            {openCampaigns.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/40 border border-amber-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Flame size={16} weight="fill" className="text-amber-600" /> Đợt tuyển đang diễn ra
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Hạn nộp: {new Date(openCampaigns[0].endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#142B49]">
                    {openCampaigns[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {openCampaigns[0].description}
                  </p>
                  {openCampaigns[0].requirements && (
                    <div className="mt-3 p-4 bg-white rounded-xl border border-amber-200/80 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900">Yêu cầu & Tiêu chí xét tuyển:</div>
                      <div className="whitespace-pre-line text-slate-600 leading-relaxed">{openCampaigns[0].requirements}</div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200/60">
                  <span className="text-xs font-semibold text-slate-600">
                    Chỉ tiêu tuyển sinh: <strong className="text-slate-900">{openCampaigns[0].targetQuantity} sinh viên</strong>
                  </span>
                  <button
                    onClick={() => handleOpenApplyModal(openCampaigns[0])}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Ứng tuyển vào CLB ngay</span>
                  </button>
                </div>
              </div>
            )}

            {/* Giới thiệu chi tiết */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#142B49] tracking-tight">Giới Thiệu & Mục Tiêu Hoạt Động</h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {club.description}
              </div>

              {club.meetingSchedule && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Clock size={20} weight="duotone" className="text-[#167C66] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Lịch sinh hoạt thường kỳ</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{club.meetingSchedule}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ban Chủ Nhiệm */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
              <h2 className="text-lg sm:text-xl font-bold text-[#142B49] tracking-tight">Ban Chủ Nhiệm Câu Lạc Bộ</h2>
              {leaders.length === 0 ? (
                <p className="text-xs text-slate-400">Đang cập nhật danh sách ban điều hành.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leaders.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#142B49] text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                        {m.user?.studentProfile?.fullName?.charAt(0) || 'L'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">
                          {m.user?.studentProfile?.fullName || 'Chủ nhiệm CLB'}
                        </div>
                        <div className="text-xs text-[#167C66] font-semibold">
                          {m.role === 'LEADER' ? 'Chủ nhiệm CLB' : 'Phó chủ nhiệm'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {m.user?.studentProfile?.faculty || 'ĐH Nông - Lâm Bắc Giang'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Album Hoạt Động & Khoảnh Khắc CLB */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#142B49] tracking-tight">
                    Album Hoạt Động & Khoảnh Khắc CLB
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Hình ảnh thực tế từ các chương trình, giải đấu và sự kiện thường niên</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  {albumImages.length} bức ảnh
                </span>
              </div>

              {albumImages.length === 0 ? (
                <div className="py-10 text-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 space-y-2">
                  <ImageIcon size={32} weight="duotone" className="mx-auto text-slate-300" />
                  <p className="text-xs">Chưa có hình ảnh nào trong album hoạt động.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {albumImages.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => setLightboxImage(media)}
                      className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 shadow-2xs"
                    >
                      <img
                        src={media.url}
                        alt={media.caption || club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] text-white font-medium line-clamp-1">
                          {media.caption || 'Xem ảnh lớn'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Thông tin liên hệ & Đăng ký nhanh (4 cột) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5 sticky top-24">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Thông Tin Câu Lạc Bộ
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Quy mô hội viên:</span>
                  <span className="font-bold text-slate-900">{club._count?.memberships || 0} thành viên</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Lĩnh vực:</span>
                  <span className="font-bold text-[#142B49]">{club.category?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đang hoạt động
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                {club.contactEmail && (
                  <div className="flex items-center gap-2.5">
                    <EnvelopeSimple size={16} weight="bold" className="text-[#167C66] shrink-0" />
                    <span className="truncate">{club.contactEmail}</span>
                  </div>
                )}
                {club.contactPhone && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} weight="bold" className="text-[#167C66] shrink-0" />
                    <span>{club.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} weight="bold" className="text-[#167C66] shrink-0 mt-0.5" />
                  <span>Khuôn viên Trường ĐH Nông - Lâm Bắc Giang</span>
                </div>
              </div>

              {openCampaigns.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenApplyModal(openCampaigns[0])}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>Nộp đơn ứng tuyển</span>
                  </button>
                </div>
              )}
            </div>
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Nộp Hồ Sơ Thành Công!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Đơn ứng tuyển của bạn đã được chuyển đến Ban chủ nhiệm {club.name}. Bạn có thể theo dõi tiến độ xét duyệt trực tuyến tại Bảng điều khiển sinh viên.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs"
                >
                  <span>Xem hồ sơ của tôi</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <WarningCircle size={16} weight="fill" className="shrink-0" />
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
                    <label className="block text-xs font-bold text-slate-800">
                      {q.questionText} {q.isRequired && <span className="text-rose-500">*</span>}
                    </label>

                    {q.questionType === 'SHORT_TEXT' && (
                      <input
                        type="text"
                        required={q.isRequired}
                        value={formAnswers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                      />
                    )}

                    {q.questionType === 'LONG_TEXT' && (
                      <textarea
                        rows={3}
                        required={q.isRequired}
                        value={formAnswers[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        placeholder="Nhập chi tiết câu trả lời..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                      />
                    )}

                    {q.questionType === 'SINGLE_CHOICE' && (
                      <div className="space-y-2 pt-1">
                        {options.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={formAnswers[q.id] === opt}
                              onChange={(e) => handleInputChange(q.id, e.target.value)}
                              className="w-4 h-4 text-[#167C66] focus:ring-[#167C66]"
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
                            <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                value={opt}
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                                className="w-4 h-4 text-[#167C66] rounded-sm focus:ring-[#167C66]"
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66]"
                      />
                    )}
                  </div>
                );
              })}

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
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
          className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Đóng ảnh"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || club.name}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            {lightboxImage.caption && (
              <p className="text-white text-xs font-semibold text-center bg-black/60 px-4 py-2 rounded-xl backdrop-blur-xs">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
