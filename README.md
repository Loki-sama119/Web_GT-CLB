# UNIVERSITY CLUB PORTAL — CỔNG THÔNG TIN CÂU LẠC BỘ SINH VIÊN BAFU
> **Trường Đại học Nông - Lâm Bắc Giang (Bac Giang Agriculture and Forestry University)**  
> **Phiên bản:** Phase 6 — Release Hardening, UAT & BAFU Pilot (Branch: `feature/phase6-release-readiness`)  
> **Repository:** [https://github.com/Loki-sama119/Web_GT-CLB](https://github.com/Loki-sama119/Web_GT-CLB)

Hệ thống giới thiệu, đăng ký tuyển thành viên trực tuyến, quản lý sự kiện, media và số hóa hoạt động toàn diện cho các Câu lạc bộ (CLB) sinh viên Trường Đại học Nông - Lâm Bắc Giang.

---

## 1. Stack Công Nghệ & Kiến Trúc

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, TanStack Query, Lucide Icons, Recharts.
- **Backend:** Node.js (ES Modules), Express.js 5, Prisma ORM, PostgreSQL 16, Zod, bcryptjs, JWT & HTTP-Only Secure Cookies, Helmet, Express Rate Limit.
- **Testing:**
  - **Backend API:** Vitest, Supertest (**35/35 Tests PASS — 100%**).
  - **E2E Automation:** Playwright (**30/30 Tests PASS — 100%**, bao gồm Desktop Chromium & Mobile Pixel 5).
- **DevOps & Production:** Docker Compose V2, Nginx Reverse Proxy (TLS 1.2/1.3, OWASP Security Headers), Mailpit SMTP, Volume mount bền vững cho upload và Postgres.

---

## 2. Tài Khoản Thử Nghiệm Hệ Thống (Demo Accounts)

| Vai trò | Email đăng nhập | Mật khẩu mặc định | Ghi chú |
|---|---|---|---|
| **Super Admin** | `admin@bafu.edu.vn` | `AdminPassword@2026` | Quản trị viên cấp trường, Phê duyệt CLB, Báo cáo toàn trường |
| **Club Admin** | `it.leader@bafu.edu.vn` | `12345678` | Chủ nhiệm CLB Lập trình BAFU Tech |
| **Club Admin** | `caulong.leader@bafu.edu.vn` | `12345678` | Chủ nhiệm CLB Cầu Lông |
| **Sinh Viên** | `haidang.sv@bafu.edu.vn` | `12345678` | Sinh viên Nguyễn Hải Đăng (Đã có hồ sơ ứng tuyển) |
| **Sinh Viên** | `minhthu.sv@bafu.edu.vn` | `12345678` | Sinh viên Trần Minh Thư (Hội viên chính thức) |

*(Trên giao diện Đăng nhập có sẵn các nút bấm điền nhanh tài khoản demo để tiện nghiệm thu).*

---

## 3. Cấu Hình Cổng Mạng (Port Mapping & Environments)

Lưu ý quan trọng khi chạy trên Windows và WSL2:
- **PostgreSQL Container (`club_portal_postgres`):** Ánh xạ `5433:5432` ra máy tính chủ (Windows Host).
- **Backend chạy trên Windows Host:** Kết nối Database qua `localhost:5433` (để tránh xung đột với cổng Postgres 5432 mặc định của Windows).
- **Backend chạy trong Docker Container:** Kết nối Database qua mạng nội bộ `postgres:5432`.
- **Nginx Reverse Proxy:** Cổng `80` (HTTP) và `443` (HTTPS).
- **Mailpit Web UI (Kiểm tra email):** Cổng `8025` (`http://localhost:8025`).

---

## 4. Hướng Dẫn Cài Đặt & Vận Hành

### Cách 1: Vận hành toàn bộ bằng Docker Compose (Khuyến nghị)

```bash
# 1. Khởi chạy toàn bộ hệ thống (PostgreSQL, Backend, Frontend, Nginx, Mailpit)
docker compose up -d --build

# 2. Kiểm tra trạng thái 4 container
docker compose ps

# 3. Truy cập ứng dụng:
# - Cổng thông tin CLB: http://localhost
# - Giao diện kiểm tra Email (Mailpit): http://localhost:8025
```

### Cách 2: Vận hành thủ công cho Lập trình viên (Local Development)

#### Bước 1: Khởi động Database & Mailpit
```bash
docker compose up -d postgres mailpit
```

#### Bước 2: Chạy Backend
```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
# Backend chạy tại: http://localhost:5000
```

#### Bước 3: Chạy Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại: http://localhost:5173
```

---

## 5. Kiểm Thử Hệ Thống (Automated Test Execution)

### 5.1 Kiểm thử Backend API (35 Test Suites)
```bash
cd backend
npm test
```
*Kết quả:* **35/35 Passed**, bao gồm kiểm thử RBAC đa CLB, nộp đơn động, duyệt trúng tuyển, phân quyền phó chủ nhiệm, tải mẫu CSV, import CLB, duyệt trạng thái và phòng chống CSV Formula Injection.

### 5.2 Kiểm thử Playwright E2E (Desktop & Mobile - 30 Tests)
```bash
cd e2e
npm test
```
*Kết quả:* **30/30 Passed**, bao gồm:
- Luồng tuyển sinh trọn vẹn (Sinh viên nộp đơn -> Ban chủ nhiệm duyệt -> Kích hoạt hội viên).
- Đăng ký và hủy sự kiện, kiểm tra chặn đăng ký trùng.
- Quản lý hội viên, bổ nhiệm phó chủ nhiệm, xuất CSV.
- Quản lý media album ảnh CLB.
- Quản trị viên cấp trường: Phê duyệt trạng thái CLB, Tải mẫu CSV & Batch Import CLB.
- Điều khoản dịch vụ và Chính sách quyền riêng tư (OWASP ASVS / DSAR).
- Kiểm thử đa nền tảng: Desktop Chromium & Mobile Pixel 5.

### 5.3 Kiểm tra Build Production Frontend
```bash
cd frontend
npm run build
```
*Kết quả:* Build thành công 100% trong ~3 giây không có lỗi hoặc cảnh báo gãy bundle.

---

## 6. Điểm Mới trong Phase 6 (Release Hardening & Pilot Readiness)

1. **Bảo mật & Quyền riêng tư (OWASP ASVS v4.0):**
   - Triệt tiêu lỗ hổng **CSV Formula Injection** khi xuất dữ liệu người dùng (`sanitizeCsvField`).
   - Loại bỏ trường đánh giá nhạy cảm `internalNotes` khỏi file xuất của ứng viên.
   - Thêm trang [Chính sách Quyền riêng tư](/privacy-policy) với quy trình xử lý yêu cầu dữ liệu cá nhân (DSAR).
   - Thêm trang [Điều khoản Dịch vụ](/terms-of-service) cho sinh viên và Ban chủ nhiệm.
   - Áp dụng `trust proxy` và bảo vệ giới hạn tần suất gọi API (Rate Limiting) đằng sau Nginx.
2. **Quản trị Dữ liệu Thí điểm BAFU (Data Readiness):**
   - API & UI cho phép Quản trị viên cấp trường tải mẫu CSV (`/admin/clubs/template-csv`).
   - Hỗ trợ nhập danh sách CLB thật từ CSV (`/admin/clubs/import-csv`) với cơ chế kiểm tra trùng lặp tên/slug và phân công Chủ nhiệm.
   - Quản lý vòng đời trạng thái CLB (`PENDING`, `ACTIVE`, `INACTIVE`) giúp Ban Giám hiệu / Đoàn trường kiểm duyệt trước khi hiển thị công khai.
3. **Sao lưu & Phục hồi Độc lập (Disaster Recovery):**
   - Đã thực nghiệm phục hồi 100% bản sao lưu vào cơ sở dữ liệu độc lập `club_portal_restore_test` với độ khớp bản ghi tuyệt đối.
   - Cung cấp kịch bản sao lưu nén tự động hàng ngày qua Crontab.
4. **Cấu hình Sẵn sàng cho Môi trường Production:**
   - [docker-compose.prod.yml](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docker-compose.prod.yml): Mạng nội bộ riêng biệt, cô lập hoàn toàn cổng cơ sở dữ liệu với Internet, giới hạn xoay vòng log (10MB x 3).
   - [docker/nginx/nginx.prod.conf](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docker/nginx/nginx.prod.conf): Cấu hình SSL TLS 1.2/1.3, tự động chuyển hướng HTTP sang HTTPS và áp dụng các tiêu chuẩn an ninh HTTP Headers cao cấp.

---

## 7. Tài Liệu Nghiệm Thu & Vận Hành (Phase 6 Deliverables)

- [Báo cáo Audit Mã nguồn & Bảo mật](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/PHASE6_AUDIT_REPORT.md)
- [Báo cáo Kiểm thử Tự động E2E](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/PHASE6_E2E_REPORT.md)
- [Kế hoạch Kiểm thử Nghiệm thu Người dùng (UAT Test Plan)](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/UAT_TEST_PLAN.md)
- [Kế hoạch Triển khai Thí điểm tại BAFU (BAFU Pilot Plan)](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/BAFU_PILOT_PLAN.md)
- [Hướng dẫn Triển khai Vận hành Production](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/PRODUCTION_DEPLOYMENT.md)
- [Báo cáo & Hướng dẫn Sao lưu Phục hồi Dữ liệu](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/BACKUP_RESTORE_VERIFICATION.md)
- [Danh mục Kiểm tra Bảo mật Phát hành (Security Release Checklist)](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/SECURITY_RELEASE_CHECKLIST.md)
