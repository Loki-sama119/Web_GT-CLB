import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Calendar, Clock, MapPin, Mail, Phone, Globe, Flame, 
  CheckCircle2, AlertCircle, Send, X, ArrowLeft, Shield, Image as ImageIcon, UploadCloud, Trash2
} from 'lucide-react';

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
  const [uploadingAlbum, setUploadingAlbum] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin câu lạc bộ...</p>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-slate-800">{error || 'Không tìm thấy câu lạc bộ'}</h2>
        <Link to="/clubs" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách câu lạc bộ
        </Link>
      </div>
    );
  }

  const leaders = club.memberships?.filter(m => ['LEADER', 'VICE_LEADER'].includes(m.role)) || [];
  const openCampaigns = club.campaigns || [];

  return (
    <div className="pb-16">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/clubs" className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Tất cả câu lạc bộ
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center shadow-2xl border-2 border-white/20 shrink-0">
              {club.name.charAt(4) || 'C'}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full border border-blue-400/20">
                  {club.category?.name}
                </span>
                {openCampaigns.length > 0 && (
                  <span className="text-xs font-bold bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" /> Đang tuyển thành viên
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{club.name}</h1>
              <p className="text-blue-100 text-sm max-w-2xl">{club.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Thông tin chính & Đợt tuyển (8 cột) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Đợt tuyển đang mở (Nổi bật) */}
            {openCampaigns.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                    <Flame className="w-4 h-4 fill-orange-500" /> Đợt tuyển đang diễn ra
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Hạn nộp: {new Date(openCampaigns[0].endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {openCampaigns[0].title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {openCampaigns[0].description}
                  </p>
                  {openCampaigns[0].requirements && (
                    <div className="mt-3 p-4 bg-white/80 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-800">Yêu cầu & Tiêu chí:</div>
                      <div className="whitespace-pre-line text-slate-600">{openCampaigns[0].requirements}</div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-amber-200/60">
                  <span className="text-xs font-semibold text-slate-600">
                    Chỉ tiêu: <strong className="text-slate-900">{openCampaigns[0].targetQuantity} bạn</strong>
                  </span>
                  <button
                    onClick={() => handleOpenApplyModal(openCampaigns[0])}
                    className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                  >
                    Ứng tuyển vào CLB ngay
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Giới thiệu chi tiết */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Giới Thiệu & Mục Tiêu Hoạt Động</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {club.description}
              </div>

              {club.meetingSchedule && (
                <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Lịch sinh hoạt thường kỳ</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{club.meetingSchedule}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ban Chủ Nhiệm */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">Ban Chủ Nhiệm Câu Lạc Bộ</h2>
              {leaders.length === 0 ? (
                <p className="text-sm text-slate-400">Đang cập nhật danh sách ban điều hành.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leaders.map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                        {m.user?.studentProfile?.fullName?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {m.user?.studentProfile?.fullName || 'Chủ nhiệm CLB'}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold">
                          {m.role === 'LEADER' ? 'Chủ nhiệm câu lạc bộ' : 'Phó chủ nhiệm'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {m.user?.studentProfile?.faculty || 'Trường ĐH Nông - Lâm Bắc Giang'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Album Hoạt Động & Khoảnh Khắc CLB */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" /> Album Hoạt Động & Khoảnh Khắc
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Những dấu ấn, sự kiện và khoảnh khắc đáng nhớ của câu lạc bộ.</p>
                </div>
              </div>

              {albumImages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <div className="text-3xl">📸</div>
                  <p className="text-xs font-semibold text-slate-600">Chưa có hình ảnh hoạt động nào được tải lên.</p>
                  <p className="text-[11px] text-slate-400">Hình ảnh các buổi sinh hoạt, dã ngoại và thi đấu sẽ sớm được ban chủ nhiệm cập nhật.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {albumImages.map((media) => (
                    <div 
                      key={media.id} 
                      onClick={() => setLightboxImage(media)}
                      className="group relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 hover:shadow-md transition-all"
                    >
                      <img 
                        src={media.url} 
                        alt={media.caption || club.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {media.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[11px] font-medium truncate">
                          {media.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Thông tin liên hệ & Thống kê (4 cột) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Thông Tin Liên Hệ</h3>
              <div className="space-y-3 text-xs text-slate-600">
                {club.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{club.email}</span>
                  </div>
                )}
                {club.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{club.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Trường Đại học Nông - Lâm Bắc Giang</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base">Thống Kê Hoạt Động</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-2xl font-black text-blue-600">
                    {club._count?.memberships || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Hội viên chính thức</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-2xl font-black text-slate-800">
                    {club._count?.events || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Sự kiện tổ chức</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Modal Ứng Tuyển Động (Dynamic Application Form Modal) */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  {selectedCampaign.form?.title || 'Đơn Ứng Tuyển Thành Viên'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{club.name}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-slate-900">Nộp Hồ Sơ Thành Công!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Ban chủ nhiệm CLB {club.name} đã nhận được hồ sơ của bạn. Bạn có thể theo dõi tiến độ xét duyệt trực tuyến tại Bảng điều khiển sinh viên.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    to="/student/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Đến trang theo dõi hồ sơ
                  </Link>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6 pt-6">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Render các câu hỏi động từ form */}
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
                    <div key={q.id} className="space-y-2">
                      <label className="block text-sm font-bold text-slate-800">
                        {q.questionText} {q.isRequired && <span className="text-red-500">*</span>}
                      </label>

                      {/* Loại SHORT_TEXT */}
                      {q.questionType === 'SHORT_TEXT' && (
                        <input
                          type="text"
                          required={q.isRequired}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Nhập câu trả lời của bạn..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {/* Loại LONG_TEXT */}
                      {q.questionType === 'LONG_TEXT' && (
                        <textarea
                          rows={4}
                          required={q.isRequired}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Nhập chi tiết câu trả lời..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {/* Loại SINGLE_CHOICE */}
                      {q.questionType === 'SINGLE_CHOICE' && (
                        <div className="space-y-2">
                          {options.map((opt, idx) => (
                            <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={formAnswers[q.id] === opt}
                                onChange={(e) => handleInputChange(q.id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Loại MULTIPLE_CHOICE */}
                      {q.questionType === 'MULTIPLE_CHOICE' && (
                        <div className="space-y-2">
                          {options.map((opt, idx) => {
                            const isChecked = Array.isArray(formAnswers[q.id]) && formAnswers[q.id].includes(opt);
                            return (
                              <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={opt}
                                  checked={isChecked}
                                  onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                                  className="w-4 h-4 text-blue-600 rounded-sm"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Loại URL */}
                      {q.questionType === 'URL' && (
                        <input
                          type="url"
                          required={q.isRequired}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                  >
                    {submitting ? 'Đang gửi hồ sơ...' : 'Gửi đơn ứng tuyển'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Lightbox Xem Ảnh Lớn */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption || club.name} 
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            {lightboxImage.caption && (
              <p className="text-white text-sm font-medium text-center bg-black/50 px-4 py-2 rounded-xl backdrop-blur-xs">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
