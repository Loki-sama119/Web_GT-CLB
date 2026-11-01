import bcrypt from "bcryptjs";
import { isIsolatedTest } from "../../utils/dataPolicy.js";
import prisma from "../../config/db.js";
import { generateToken } from "../../utils/jwt.js";
import { emailService } from "../email/email.service.js";

// Bộ nhớ đệm lưu trữ mã OTP đặt lại mật khẩu (Key: email, Value: { otp, expiresAt, attempts, userId })
const passwordResetOtpStore = new Map();

export class AuthService {
  static async register({
    email,
    password,
    fullName,
    studentCode,
    faculty,
    phone,
  }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err = new Error("Email này đã được sử dụng trên hệ thống");
      err.statusCode = 400;
      throw err;
    }

    const existingCode = await prisma.studentProfile.findUnique({
      where: { studentCode },
    });
    if (existingCode) {
      const err = new Error("Mã sinh viên này đã được đăng ký");
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        dataClassification: isIsolatedTest() ? "E2E_TEST" : "UNKNOWN",
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            fullName,
            studentCode,
            faculty: faculty || "",
            phone: phone || "",
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        memberships: {
          include: {
            club: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!user) {
      const err = new Error("Email hoặc mật khẩu không chính xác");
      err.statusCode = 401;
      throw err;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const err = new Error("Email hoặc mật khẩu không chính xác");
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error(
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên",
      );
      err.statusCode = 403;
      throw err;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        memberships: {
          include: {
            club: {
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
          },
        },
      },
    });

    if (!user) {
      const err = new Error("Không tìm thấy người dùng");
      err.statusCode = 404;
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // Quên mật khẩu: Gửi OTP xác thực qua email
  static async forgotPassword(rawEmail) {
    const email = (rawEmail || "").toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true },
    });

    if (!user) {
      // Chống thăm dò danh tính: Vẫn trả thông báo an toàn
      return {
        message:
          "Nếu địa chỉ email tồn tại trên hệ thống, mã xác thực OTP 6 số đã được gửi đến hòm thư của bạn.",
      };
    }

    if (!user.isActive) {
      const err = new Error(
        "Tài khoản này đang bị khóa. Vui lòng liên hệ quản trị viên",
      );
      err.statusCode = 403;
      throw err;
    }

    // Sinh mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 phút

    passwordResetOtpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0,
      userId: user.id,
    });

    const displayName =
      user.studentProfile?.fullName || user.email.split("@")[0];
    await emailService.sendPasswordResetOtp(user.email, displayName, otp);

    return {
      message:
        "Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác (Spam).",
      ...(process.env.NODE_ENV === "test" || !emailService.isConfigured
        ? { debugOtp: otp }
        : {}),
    };
  }

  // Đặt lại mật khẩu với mã OTP
  static async resetPassword({ email: rawEmail, otp, newPassword }) {
    const email = (rawEmail || "").toLowerCase().trim();
    const record = passwordResetOtpStore.get(email);

    if (!record) {
      const err = new Error(
        "Yêu cầu đặt lại mật khẩu không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã OTP mới.",
      );
      err.statusCode = 400;
      throw err;
    }

    if (Date.now() > record.expiresAt) {
      passwordResetOtpStore.delete(email);
      const err = new Error(
        "Mã xác thực OTP đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng yêu cầu mã mới.",
      );
      err.statusCode = 400;
      throw err;
    }

    if (record.attempts >= 5) {
      passwordResetOtpStore.delete(email);
      const err = new Error(
        "Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng yêu cầu gửi lại mã mới.",
      );
      err.statusCode = 400;
      throw err;
    }

    if (record.otp !== String(otp).trim()) {
      record.attempts += 1;
      const remaining = 5 - record.attempts;
      const err = new Error(
        `Mã xác thực OTP không chính xác. Bạn còn ${remaining} lần thử.`,
      );
      err.statusCode = 400;
      throw err;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true },
    });

    if (!user) {
      passwordResetOtpStore.delete(email);
      const err = new Error("Tài khoản không tồn tại trên hệ thống");
      err.statusCode = 404;
      throw err;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Xóa OTP đã sử dụng
    passwordResetOtpStore.delete(email);

    // Gửi email thông báo mật khẩu đã thay đổi
    const displayName =
      user.studentProfile?.fullName || user.email.split("@")[0];
    emailService
      .sendPasswordChangedNotification(user.email, displayName)
      .catch(() => {});

    return {
      message:
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.",
    };
  }

  // Đổi mật khẩu cho người dùng đang đăng nhập
  static async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      const err = new Error("Không tìm thấy tài khoản người dùng");
      err.statusCode = 404;
      throw err;
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      const err = new Error("Mật khẩu hiện tại không chính xác");
      err.statusCode = 400;
      throw err;
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.passwordHash,
    );
    if (isSamePassword) {
      const err = new Error(
        "Mật khẩu mới không được trùng với mật khẩu hiện tại",
      );
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    const displayName =
      user.studentProfile?.fullName || user.email.split("@")[0];
    emailService
      .sendPasswordChangedNotification(user.email, displayName)
      .catch(() => {});

    return {
      message: "Đổi mật khẩu thành công! Mật khẩu mới của bạn đã có hiệu lực.",
    };
  }
}
