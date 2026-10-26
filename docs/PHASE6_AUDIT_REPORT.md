# BÁO CÁO KIỂM TOÁN HỆ THỐNG & MÃ NGUỒN (PHASE 6 AUDIT REPORT)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Thời điểm thực hiện:** 27/10/2026  
**Đơn vị thực hiện:** QA Lead, Principal Engineer, Security Engineer & DevOps Engineer  
**Phiên bản nhánh:** `feature/phase6-release-readiness`  

---

## 1. TỔNG QUAN KIỂM TOÁN MÃ NGUỒN & GIT (SOURCE CODE & GIT AUDIT)

### 1.1 Lịch sử Commit & Phân nhánh
* **Base Branch xác minh:** `feature/phase5-club-experience` tại commit `29d475a`.
* **Nhánh mới triển khai:** `feature/phase6-release-readiness` được tách trực tiếp từ commit `29d475a`, kế thừa 100% các tính năng của toàn bộ các giai đoạn trước (Phase 1 đến Phase 5).
* **Quy trình Gitflow:**
  * Tuyệt đối không force push.
  * Không merge tự động vào `main` khi chưa có phê duyệt Pull Request chính thức.
  * Lịch sử Git sạch sẽ, mỗi commit đại diện cho một module/tính năng hoàn chỉnh với commit message chuẩn Conventional Commits.

### 1.2 Kiểm toán Secrets & Tệp tin nhạy cảm (.gitignore Audit)
* **Kiểm tra `.gitignore`:** Đã cấu hình chặn toàn diện:
  * Biến môi trường: `.env`, `.env.test`, `.env.local`, `.env.production.local`
  * Dữ liệu bản sao lưu: `backups/`, `*.sql`
  * Thư mục tệp tải lên: `backend/uploads/`
  * Thư mục báo cáo kiểm thử: `e2e/test-results/`, `playwright-report/`
* **Kiểm tra tệp tin đang được theo dõi (Tracked Files):** Xác minh qua lệnh `git ls-files` không có bất kỳ tệp mật khẩu, token, khóa bí mật hay bản sao lưu cơ sở dữ liệu nào bị đưa vào Git index. Chỉ có `.env.example` và các file migration SQL tiêu chuẩn.

---

## 2. KẾT QUẢ KIỂM TOÁN AN TOÀN BẢO MẬT (SECURITY AUDIT)

| Tiêu Chí Kiểm Toán | Tiêu Chuẩn Đối Chiếu | Kết Quả Thực Tế | Đánh Giá & Biện Pháp Xử Lý |
|---|---|---|---|
| **Lỗ hổng phụ thuộc (npm audit)** | OWASP Dependency-Check | 0 Critical, 1 High (Zod) | Zod GHSA-mrhx-c7xc-m3w5 (cần lên Zod v4). Đã giảm thiểu rủi ro ở tầng mạng bằng giới hạn `express.json({ limit: '10kb' })`. |
| **Xác thực & Quản lý phiên** | OWASP ASVS V2 & V3 | **ĐẠT (PASS)** | JWT ký bằng bí mật 64+ ký tự, lưu trữ Cookie `HttpOnly; SameSite=Lax`. Đăng xuất vô hiệu hóa token an toàn. |
| **Kiểm soát truy cập chéo (RBAC)** | OWASP ASVS V4 | **ĐẠT (PASS)** | Xác thực chặt chẽ quyền Club Admin theo từng `clubId`. Admin CLB A bị chặn HTTP 403 Forbidden khi truy cập dữ liệu CLB B. |
| **Bảo vệ chống CSV Injection** | OWASP ASVS V5 | **ĐẠT (PASS)** | Toàn bộ hàm xuất CSV (Hồ sơ ứng viên, Danh sách hội viên, Báo cáo CLB) đều escape các ký tự nguy hiểm (`=`, `+`, `-`, `@`, `\t`, `\r`) bằng dấu nháy đơn `'`. |
| **Giới hạn tần suất (Rate Limiting)** | OWASP ASVS V13 | **ĐẠT (PASS)** | `authLimiter` (100 req/15 phút), `applyLimiter` (20 req/15 phút), `uploadLimiter` (30 req/15 phút). Cấu hình `trust proxy: 1` chuẩn xác sau Nginx. |
| **Bảo vệ tải lên tệp tin (File Upload)** | OWASP ASVS V12 | **ĐẠT (PASS)** | Multer kiểm duyệt MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), chặn file thực thi (`.sh`, `.exe`, `.php`), dung lượng tối đa 5MB. |
| **Bảo vệ dữ liệu riêng tư ứng viên** | Nghị định 13/2023/NĐ-CP & ASVS | **ĐẠT (PASS)** | Điểm phỏng vấn và nhận xét nội bộ (`internalNotes`) bị ẩn hoàn toàn khỏi ứng viên và không bao giờ xuất hiện trong file CSV ứng viên. |

---

## 3. CHÍNH SÁCH QUYỀN RIÊNG TƯ & QUY TRÌNH DSAR
* **Trang chính sách:** Đã triển khai trang công khai tại `/privacy-policy` và `/terms-of-service`.
* **Quy trình DSAR (Data Subject Access Request):**
  * Sinh viên có quyền tra cứu thông tin cá nhân và lịch sử ứng tuyển qua Dashboard.
  * Sinh viên có quyền rút đơn ứng tuyển khi còn ở trạng thái nộp.
  * Tiếp nhận yêu cầu sửa đổi sai sót hoặc xóa vĩnh viễn dữ liệu cá nhân thông qua email chính thức của Phòng Công tác Sinh viên (`admin@bafu.edu.vn`) với thời hạn xử lý tối đa 03 ngày làm việc.

---

## 4. KẾT LUẬN
Toàn bộ mã nguồn, cấu hình Git, chính sách phân quyền và dữ liệu đã được kiểm toán nghiêm ngặt, đáp ứng các tiêu chuẩn kỹ thuật sẵn sàng bước vào giai đoạn kiểm thử chấp nhận (UAT) và triển khai thí điểm tại Trường Đại học Nông - Lâm Bắc Giang.
