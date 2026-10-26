# UNIVERSITY CLUB PORTAL — KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN)

## 1. Lộ trình 5 giai đoạn

### Giai đoạn 1: Audit, Thiết kế kiến trúc & Khởi tạo khung dự án
- [x] Khảo sát môi trường và repository.
- [x] Lập đặc tả yêu cầu `REQUIREMENTS.md`.
- [x] Lập kiến trúc hệ thống `ARCHITECTURE.md`.
- [x] Thiết kế cơ sở dữ liệu và ERD `DATABASE_DESIGN.md`.
- [x] Xây dựng danh mục API `API_CONTRACT.md`.
- [x] Lập kế hoạch thực hiện `IMPLEMENTATION_PLAN.md`.
- [ ] Khởi tạo Monorepo (`backend`, `frontend`, `docker`, `.env.example`, `docker-compose.yml`, `README.md`).

### Giai đoạn 2: Core Backend & Database (PostgreSQL + Prisma)
- [ ] Khởi tạo Prisma Schema đầy đủ các Model và Enums.
- [ ] Thiết lập kết nối PostgreSQL và chạy Migration.
- [ ] Xây dựng Script Seed Data:
  - 1 Super Admin (`admin@bafu.edu.vn`)
  - 10+ Câu lạc bộ đa dạng (Bóng đá, Cầu lông, Bóng rổ, Tiếng Anh, Lập trình, Nhiếp ảnh, Tình nguyện...)
  - Tài khoản Club Admin cho các CLB
  - Tài khoản Sinh viên mẫu
  - Chiến dịch tuyển thành viên (`OPEN`, `CLOSED`, `DRAFT`) kèm form câu hỏi động
  - Đơn ứng tuyển mẫu ở các trạng thái
  - Sự kiện và tin tức mẫu
- [ ] Xây dựng Authentication & Profile API:
  - Register, Login (Cookie httpOnly + JWT), Logout, Me
  - Profile update
- [ ] Xây dựng Clubs & Categories API:
  - Danh sách, chi tiết theo slug, lọc, tìm kiếm
- [ ] Xây dựng Recruitment & Application Workflow API:
  - Tạo đợt tuyển & form câu hỏi động
  - Sinh viên nộp đơn (kiểm tra hạn, chống nộp trùng)
  - Ban chủ nhiệm duyệt/từ chối đơn
  - **Transaction atomic:** Chấp nhận đơn -> Tạo `ClubMembership` -> Ghi `AuditLog` -> Tạo `Notification`
- [ ] Viết bộ API Tests (Vitest + Supertest) xác minh TC01 - TC12.

### Giai đoạn 3: Core Frontend (React + Vite + Tailwind CSS)
- [ ] Cài đặt cấu trúc Frontend: React, Vite, Tailwind CSS, React Router, TanStack Query, Lucide Icons, Recharts.
- [ ] Xây dựng Design System & Layouts:
  - Navbar điều hướng, Banner sinh viên, Footer
  - Theme màu sắc trẻ trung, hiện đại, chuẩn SaaS
- [ ] Trang công khai:
  - Landing Page: Hero, Thống kê thật từ DB, Danh mục, CLB tiêu biểu, CLB đang tuyển, Sự kiện
  - Danh sách CLB: Bộ lọc lĩnh vực, trạng thái tuyển, ô tìm kiếm
  - Chi tiết CLB: Ảnh bìa, logo, thông tin BCN, lịch sinh hoạt, các đợt tuyển đang mở
- [ ] Chức năng Xác thực UI:
  - Trang Đăng ký (kèm thông tin sinh viên)
  - Trang Đăng nhập
  - Quản lý phiên qua AuthContext
- [ ] Form ứng tuyển động:
  - Render linh hoạt theo cấu hình câu hỏi của CLB
  - Client-side validation với React Hook Form & Zod
- [ ] Dashboards:
  - Student Dashboard: Xem hồ sơ, đơn đã nộp, trạng thái duyệt, CLB tham gia
  - Club Admin Dashboard: Quản lý hồ sơ ứng viên, đổi trạng thái (Duyệt/Từ chối), quản lý hội viên
  - Super Admin Dashboard: Thống kê tổng hợp, quản lý danh sách CLB và người dùng

### Giai đoạn 4: Hoàn thiện tính năng mở rộng (P1)
- [ ] Quản lý tin tức bài viết CLB
- [ ] Quản lý sự kiện và đăng ký sự kiện trực tuyến
- [ ] Trung tâm thông báo người dùng
- [ ] Audit log cho ban quản trị

### Giai đoạn 5: Kiểm thử, Docker & Triển khai
- [ ] Kiểm thử End-to-End các luồng chính
- [ ] Hoàn thiện Dockerfile frontend, Dockerfile backend, Nginx reverse proxy
- [ ] Kiểm tra Docker Compose chạy local mượt mà
- [ ] Soạn thảo README.md chi tiết hướng dẫn cài đặt và kịch bản demo
- [ ] Chuẩn bị Git commits và nhánh develop theo chuẩn Gitflow
