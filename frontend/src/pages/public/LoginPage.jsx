import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  SignIn,
  WarningCircle,
  Eye,
  EyeSlash,
  EnvelopeSimple,
  Lock,
  Sparkle,
  Compass,
  ArrowRight,
  CheckCircle,
  Key,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import BrandWordmark from "../../components/ui/BrandWordmark";
import Modal from "../../components/ui/Modal";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal Quên mật khẩu & OTP
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & mật khẩu mới
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [debugOtpNotice, setDebugOtpNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setForgotEmail(email || "");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setForgotError("");
    setForgotSuccess("");
    setDebugOtpNotice("");
    setForgotStep(1);
    setShowForgotModal(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (forgotLoading) return;
    setForgotError("");
    setForgotSuccess("");
    setDebugOtpNotice("");

    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotSuccess(res.message || "Mã xác thực OTP đã được gửi đến email.");
      if (res.data?.debugOtp) {
        setDebugOtpNotice(`Mã OTP thử nghiệm: ${res.data.debugOtp}`);
      }
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || "Không thể gửi mã xác thực. Vui lòng kiểm tra lại email.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (forgotLoading) return;
    setForgotError("");
    setForgotSuccess("");

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setForgotError("Mã xác thực OTP phải gồm 6 chữ số.");
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Xác nhận lại mật khẩu mới không khớp.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.resetPassword({
        email: forgotEmail,
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });
      setForgotSuccess(res.message || "Đặt lại mật khẩu thành công!");
      setEmail(forgotEmail);
      setPassword("");
      setTimeout(() => {
        setShowForgotModal(false);
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Đặt lại mật khẩu không thành công. Vui lòng kiểm tra lại mã OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.75rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F7FA]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* ================= CỘT TRÁI: NHẬN DIỆN & BRANDING (DESKTOP) ================= */}
        <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between p-10 bg-[#142B49] text-white">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#167C66]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F3B846]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Wordmark */}
          <div className="relative z-10">
            <BrandWordmark variant="dark" />
          </div>

          {/* Center Pitch Content */}
          <div className="relative z-10 space-y-5 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F3B846] text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkle size={14} weight="fill" />
              <span>Nền tảng hoạt động sinh viên</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Khám phá đam mê.
              <br />
              <span className="text-[#F3B846]">Kết nối cộng đồng.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dự án cổng thông tin sinh viên BAFU. Tìm hiểu câu lạc bộ, theo dõi
              hồ sơ ứng tuyển và quản lý hoạt động trong cùng một nơi.
            </p>

            <p className="text-xs text-slate-300 border-t border-white/20 pt-4">
              Bản thí điểm · Chưa phải website chính thức được nhà trường phê
              duyệt.
            </p>
          </div>

          {/* Bottom Link */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>BAFU Campus Clubs · Dự án sinh viên</span>
            <Link
              to="/clubs"
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Khám phá CLB</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

        {/* ================= CỘT PHẢI: FORM ĐĂNG NHẬP (DESKTOP & MOBILE) ================= */}
        <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Header Mobile Brand & Title */}
          <div className="space-y-2">
            <div className="lg:hidden mb-4">
              <BrandWordmark variant="light" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167C66] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#167C66]" />
              Xác Thực Tài Khoản
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B49] tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Vui lòng nhập email nhà trường hoặc tài khoản sinh viên để tiếp
              tục
            </p>
          </div>

          {/* Thông báo lỗi an toàn */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <WarningCircle
                size={16}
                weight="fill"
                className="shrink-0 mt-0.5 text-rose-600"
              />
              <div className="leading-relaxed font-semibold">{error}</div>
            </div>
          )}

          {/* Form Đăng Nhập */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email tài khoản
              </label>
              <div className="relative">
                <EnvelopeSimple
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten@bafu.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs font-semibold text-[#167C66] hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] transition-all bg-slate-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-md"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <SignIn size={18} weight="bold" />
              <span>{loading ? "Đang xác thực..." : "Đăng nhập"}</span>
            </button>
          </form>

          {/* Links Đăng ký & Khám phá CLB */}
          <div className="space-y-3 pt-2 text-center text-xs text-slate-500">
            <div>
              Chưa có tài khoản sinh viên?{" "}
              <Link
                to="/register"
                className="text-[#167C66] font-bold hover:underline"
              >
                Đăng ký tài khoản mới
              </Link>
            </div>
            <div>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                <Compass size={16} className="text-[#167C66]" />
                <span>Quay về xem danh sách CLB</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL QUÊN MẬT KHẨU / OTP RESET ================= */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title={forgotStep === 1 ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu Mới"}
        subtitle={
          forgotStep === 1
            ? "Nhập email của bạn để nhận mã xác thực OTP 6 số qua hòm thư"
            : `Nhập mã OTP vừa nhận và mật khẩu mới cho ${forgotEmail}`
        }
        maxWidth="max-w-md"
      >
        <div className="pt-2">
          {forgotError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed font-semibold">{forgotError}</div>
            </div>
          )}

          {forgotSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle size={16} weight="fill" className="shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-relaxed font-semibold">{forgotSuccess}</div>
            </div>
          )}

          {debugOtpNotice && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-mono">
              💡 {debugOtpNotice}
            </div>
          )}

          {/* BƯỚC 1: Nhập email gửi OTP */}
          {forgotStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email tài khoản BAFU <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="ví dụ: admin@bafu.edu.vn hoặc ten@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Mã xác thực 6 số sẽ được gửi tới địa chỉ hòm thư này và có giá trị trong 15 phút.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#16845A] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                  <span>{forgotLoading ? "Đang gửi OTP..." : "Gửi mã xác thực"}</span>
                </button>
              </div>
            </form>
          )}

          {/* BƯỚC 2: Nhập OTP và mật khẩu mới */}
          {forgotStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Mã OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Mã xác thực OTP (6 chữ số) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotError("");
                      setForgotSuccess("");
                    }}
                    className="text-xs text-[#167C66] hover:underline font-semibold cursor-pointer"
                  >
                    Đổi email khác
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center text-xl font-bold tracking-widest py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu mới (tối thiểu 6 ký tự) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showForgotNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showForgotNewPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Xác nhận lại mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showForgotConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showForgotConfirmPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={forgotLoading}
                  className="text-xs text-slate-500 hover:text-[#167C66] font-semibold cursor-pointer underline"
                >
                  Gửi lại mã OTP
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#16845A] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
