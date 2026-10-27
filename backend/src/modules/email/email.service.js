import nodemailer from 'nodemailer';
import { ENV } from '../../config/env.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        this.isConfigured = true;
      } catch (err) {
        console.warn('⚠️ Không thể khởi tạo SMTP transporter:', err.message);
      }
    } else {
      // Môi trường local hoặc test: Dùng logger fallback an toàn
      this.isConfigured = false;
    }
  }

  async sendMail({ to, subject, html, text }) {
    const from = process.env.SMTP_FROM || '"Cổng Thông Tin CLB Sinh Viên BAFU" <no-reply@bafu.edu.vn>';

    if (!this.isConfigured || !this.transporter || process.env.NODE_ENV === 'test') {
      // Safe fallback: Ghi log giả lập gửi email, không bao giờ ném lỗi làm hỏng transaction
      console.log(`📧 [MOCK EMAIL] Gửi tới: ${to} | Tiêu đề: "${subject}"`);
      return { success: true, mocked: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      // Bắt lỗi gửi email và log lại, không ném exception làm crash API request
      console.error(`❌ [EMAIL ERROR] Không thể gửi thư tới ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // 1. Email xác nhận nộp hồ sơ
  async sendApplicationSubmitted(to, applicantName, clubName, campaignTitle) {
    const subject = `[BAFU Club Portal] Xác nhận nộp hồ sơ thành công vào CLB ${clubName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">CỔNG THÔNG TIN CÂU LẠC BỘ BAFU</h2>
        </div>
        <div style="padding: 24px;">
          <p>Xin chào <strong>${applicantName}</strong>,</p>
          <p>Hồ sơ ứng tuyển của bạn vào câu lạc bộ <strong>${clubName}</strong> cho chiến dịch <em>"${campaignTitle}"</em> đã được ghi nhận thành công trên hệ thống.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">Trạng thái hồ sơ: <strong>ĐÃ NỘP (SUBMITTED)</strong></p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Ban chủ nhiệm câu lạc bộ sẽ tiến hành đánh giá và liên hệ với bạn trong thời gian sớm nhất.</p>
          </div>
          <p>Bạn có thể theo dõi tiến độ xét duyệt trực tiếp tại mục Hồ Sơ Ứng Tuyển trong Dashboard sinh viên.</p>
          <p style="margin-top: 24px;">Trân trọng,<br><strong>Ban Chủ Nhiệm ${clubName} & Đoàn Trường BAFU</strong></p>
        </div>
      </div>
    `;
    return this.sendMail({ to, subject, html, text: `Xin chào ${applicantName}, hồ sơ ứng tuyển vào CLB ${clubName} đã được nộp thành công.` });
  }

  // 2. Email thông báo trúng tuyển (ACCEPTED)
  async sendApplicationAccepted(to, applicantName, clubName) {
    const subject = `🎉 [CHÚC MỪNG] Bạn đã chính thức trúng tuyển vào CLB ${clubName}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">🎉 CHÚC MỪNG TÂN HỘI VIÊN BAFU</h2>
        </div>
        <div style="padding: 24px;">
          <p>Chào mừng <strong>${applicantName}</strong>,</p>
          <p>Ban Chủ Nhiệm câu lạc bộ <strong>${clubName}</strong> trân trọng thông báo bạn đã xuất sắc vượt qua các vòng xét duyệt và chính thức trở thành <strong>Hội viên của CLB</strong>.</p>
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>Tư cách thành viên: CHÍNH THỨC (ACTIVE)</strong></p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #047857;">Vui lòng kiểm tra lịch sinh hoạt định kỳ trên Cổng thông tin để tham gia buổi gặp mặt chào đón tân thành viên.</p>
          </div>
          <p>Hẹn gặp lại bạn tại các hoạt động bùng nổ sắp tới của câu lạc bộ!</p>
          <p style="margin-top: 24px;">Thân mến,<br><strong>Ban Chủ Nhiệm ${clubName}</strong></p>
        </div>
      </div>
    `;
    return this.sendMail({ to, subject, html, text: `Chúc mừng ${applicantName}! Bạn đã trúng tuyển vào CLB ${clubName}.` });
  }

  // 3. Email thông báo chưa phù hợp (REJECTED)
  async sendApplicationRejected(to, applicantName, clubName) {
    const subject = `[BAFU Club Portal] Thông báo kết quả ứng tuyển CLB ${clubName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #475569; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">THÔNG BÁO KẾT QUẢ XÉT TUYỂN</h2>
        </div>
        <div style="padding: 24px;">
          <p>Thân gửi <strong>${applicantName}</strong>,</p>
          <p>Ban Chủ Nhiệm câu lạc bộ <strong>${clubName}</strong> xin chân thành cảm ơn sự quan tâm và tình cảm bạn dành cho CLB.</p>
          <p>Do chỉ tiêu tuyển chọn có giới hạn, Ban Chủ Nhiệm rất tiếc chưa thể đồng hành cùng bạn trong đợt tuyển thành viên lần này. Hồ sơ của bạn sẽ được lưu giữ trong danh sách ứng viên tiềm năng cho các cơ hội tiếp theo.</p>
          <p>Chúc bạn luôn tràn đầy năng lượng và gặt hái nhiều thành công trong học tập và rèn luyện tại BAFU!</p>
          <p style="margin-top: 24px;">Trân trọng,<br><strong>Ban Chủ Nhiệm ${clubName}</strong></p>
        </div>
      </div>
    `;
    return this.sendMail({ to, subject, html, text: `Thân gửi ${applicantName}, cảm ơn bạn đã quan tâm ứng tuyển CLB ${clubName}.` });
  }

  // 4. Email yêu cầu bổ sung thông tin
  async sendApplicationNeedMoreInfo(to, applicantName, clubName) {
    const subject = `[BAFU Club Portal] Yêu cầu bổ sung thông tin hồ sơ CLB ${clubName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #7c3aed; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">YÊU CẦU BỔ SUNG HỒ SƠ</h2>
        </div>
        <div style="padding: 24px;">
          <p>Xin chào <strong>${applicantName}</strong>,</p>
          <p>Ban Chủ Nhiệm câu lạc bộ <strong>${clubName}</strong> đã xem xét hồ sơ của bạn và nhận thấy cần bổ sung thêm một số thông tin chi tiết.</p>
          <p>Vui lòng đăng nhập vào tài khoản sinh viên của bạn và cập nhật hồ sơ sớm nhất có thể để đợt xét duyệt không bị gián đoạn.</p>
          <p style="margin-top: 24px;">Trân trọng,<br><strong>Ban Chủ Nhiệm ${clubName}</strong></p>
        </div>
      </div>
    `;
    return this.sendMail({ to, subject, html, text: `Xin chào ${applicantName}, vui lòng bổ sung thông tin hồ sơ ứng tuyển CLB ${clubName}.` });
  }

  // 5. Email xác nhận đăng ký sự kiện
  async sendEventRegistrationConfirmed(to, studentName, eventTitle, clubName, location, startTime) {
    const subject = `[BAFU Club Portal] Xác nhận đăng ký tham gia sự kiện: ${eventTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">XÁC NHẬN THAM GIA SỰ KIỆN</h2>
        </div>
        <div style="padding: 24px;">
          <p>Xin chào <strong>${studentName}</strong>,</p>
          <p>Bạn đã đăng ký tham gia sự kiện <strong>${eventTitle}</strong> do câu lạc bộ <strong>${clubName}</strong> tổ chức.</p>
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Địa điểm:</strong> ${location}</p>
            <p style="margin: 4px 0 0; font-size: 14px;"><strong>Thời gian:</strong> ${new Date(startTime).toLocaleString('vi-VN')}</p>
          </div>
          <p>Vui lòng có mặt đúng giờ để check-in và nhận điểm rèn luyện.</p>
          <p style="margin-top: 24px;">Trân trọng,<br><strong>Ban Tổ Chức Sự Kiện</strong></p>
        </div>
      </div>
    `;
    return this.sendMail({ to, subject, html, text: `Xin chào ${studentName}, bạn đã đăng ký sự kiện ${eventTitle} thành công.` });
  }
}

export const emailService = new EmailService();
