# BẢNG KIỂM TRA PHÁT HÀNH HỆ THỐNG (RELEASE CHECKLIST)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Phiên bản:** Release Candidate Phase 4  
**Ngày đánh giá:** 26/10/2026  
**Trạng thái chung:** **ĐẠT TIÊU CHUẨN SẴN SÀNG TRIỂN KHAI (PRODUCTION READY)**  

---

## 1. DANH MỤC KIỂM TRA SẴN SÀNG PHÁT HÀNH

### 1.1. BẢO MẬT HỆ THỐNG (SECURITY HARDENING) — ĐẠT [x]
- [x] **Không có lỗ hổng Critical / High nguy hiểm:** Đã áp dụng `overrides` cho `tinypool` và `deepmerge-ts`, triệt tiêu 100% lỗ hổng Critical. Lệnh `npm audit --audit-level=critical` trả về 0 lỗ hổng.
- [x] **Không lộ Secrets:** Đã kiểm tra không có file `.env`, API key, connection string thật bị commit vào Git hoặc nhúng vào Docker image.
- [x] **Phân quyền RBAC nghiêm ngặt:** Đã kiểm thử cô lập truy cập đa người dùng, Club Admin không thể xem dữ liệu CLB khác (TC11 PASS).
- [x] **Mã hóa dữ liệu & Session:** Mật khẩu người dùng được băm bcrypt; JWT token có thời hạn hợp lý; cookie cờ HttpOnly/SameSite an toàn.
- [x] **Phòng vệ tầng mạng:** Đã bật Helmet headers, CORS whitelist, và Rate Limiting 2000 reqs/15m.
- [x] **Quyền tối thiểu Docker:** Container backend chạy dưới tài khoản `USER node` (non-root).

### 1.2. HẠ TẦNG VÀ DOCKER VẬN HÀNH (DEVOPS) — ĐẠT [x]
- [x] **Khởi chạy đồng bộ 4/4 container:** `postgres`, `backend`, `frontend`, `nginx` khởi chạy thành công, không gặp lỗi exit.
- [x] **Tối ưu Build Context:** Đã tạo `.dockerignore`, giảm dung lượng context từ ~500 MB xuống còn ~130 kB (giảm 99.9%).
- [x] **Xóa bỏ thuộc tính lỗi thời:** Đã loại bỏ `version: '3.8'` trong `docker-compose.yml`.
- [x] **Health Checks:** Postgres và Backend đều có healthcheck tự động định kỳ xác minh tình trạng hoạt động.
- [x] **SPA Routing:** Nginx frontend được cấu hình `try_files $uri /index.html;` xử lý các đường dẫn con không bị lỗi 404.
- [x] **Không xung đột cổng host:** Database ánh xạ ra cổng 5433 máy host, tránh xung đột với PostgreSQL có sẵn của máy host.

### 1.3. TOÀN VẸN CƠ SỞ DỮ LIỆU (DATABASE SAFETY) — ĐẠT [x]
- [x] **Chiến lược Migration có thể tái lập:** Đã baseline migration thành công tại `0_init/migration.sql`.
- [x] **Bảo toàn dữ liệu hiện tại:** Đã dùng `prisma migrate resolve --applied 0_init`, không chạy lệnh reset nào làm mất 20 tài khoản, 10 CLB, 3 đợt tuyển và 7 hồ sơ demo.
- [x] **Toàn vẹn quan hệ và Transaction:** Logic duyệt hồ sơ trúng tuyển tự động tạo membership trong Prisma `$transaction`, loại bỏ nguy cơ race condition hoặc tạo trùng lặp.
- [x] **Có kịch bản Backup & Restore:** Đã lập tài liệu hướng dẫn `pg_dump` và phục hồi bằng `psql`.

### 1.4. CHẤT LƯỢNG VÀ KIỂM THỬ PHẦN MỀM (QA AUTOMATION) — ĐẠT [x]
- [x] **Backend Integration Tests:** 11 / 11 test cases bằng Vitest đạt 100% PASS.
- [x] **Playwright E2E Tests (Desktop):** 9 / 9 kịch bản trên Chromium đạt 100% PASS.
- [x] **Playwright E2E Tests (Mobile):** 9 / 9 kịch bản trên Mobile Viewport Pixel 5 đạt 100% PASS.
- [x] **Toàn bộ 18 Test Cases (TC01 - TC18):** Đều được đối chiếu và xác nhận hoạt động thực tế trên trình duyệt thật.

### 1.5. GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX) — ĐẠT [x]
- [x] **Không dùng Mock Data trong Production:** Toàn bộ dữ liệu hiển thị đều được gọi từ PostgreSQL thông qua API.
- [x] **Kiểm thử trên các kích thước màn hình:** Đã kiểm thử responsive trên Desktop, Tablet và Mobile.
- [x] **Đầy đủ các trang chức năng cốt lõi:**
  - HomePage: Giới thiệu, banner, số liệu thống kê trường BAFU, danh mục lĩnh vực.
  - ClubsPage: Bộ lọc danh mục, tìm kiếm từ khóa, lọc đợt tuyển đang mở.
  - ClubDetailPage: Chi tiết lịch sinh hoạt, danh sách BCN, form nộp hồ sơ câu hỏi động.
  - LoginPage & RegisterPage: Form xác thực người dùng, validate lỗi trực quan.
  - StudentDashboard: Quản lý hồ sơ, rút đơn ứng tuyển, theo dõi CLB đã gia nhập.
  - ClubAdminDashboard: Duyệt đơn ứng tuyển, quản lý chiến dịch tuyển thành viên.
  - SuperAdminDashboard: Thống kê số liệu trường, quản lý phân quyền và Audit Logs.
  - EventsPage: Lịch sinh hoạt và sự kiện của các câu lạc bộ.

### 1.6. QUẢN LÝ MÃ NGUỒN VÀ CI/CD (GIT & CI) — ĐẠT [x]
- [x] **Quy trình Git:** Không force push, không push trực tiếp vào branch `main`.
- [x] **Nhánh phát triển:** Toàn bộ công việc Phase 4 được thực hiện trên nhánh `feature/phase4-security-hardening`.
- [x] **CI Pipeline:** Tệp `.github/workflows/ci.yml` được cấu hình tự động chạy audit check, `prisma migrate deploy`, seed, test và build frontend.

---

## 2. KẾT LUẬN CỦA HỘI ĐỒNG KỸ THUẬT
Dự án **University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU** đã hoàn thành xuất sắc tất cả các yêu cầu khắt khe của **Phase 4 — Security Hardening, Integration QA & Production Readiness**. Hệ thống đủ điều kiện bàn giao và đưa vào vận hành thử nghiệm chính thức.
