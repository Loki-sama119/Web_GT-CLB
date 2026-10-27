# UNIVERSITY CLUB PORTAL — CỔNG THÔNG TIN CÂU LẠC BỘ SINH VIÊN

Hệ thống giới thiệu, đăng ký tuyển thành viên trực tuyến và quản lý hoạt động toàn diện cho các Câu lạc bộ (CLB) sinh viên Trường Đại học Nông - Lâm Bắc Giang (BAFU).

---

## 1. Stack Công Nghệ

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, TanStack Query, Lucide Icons, Recharts.
- **Backend:** Node.js (ES Modules), Express.js 5, Prisma ORM, PostgreSQL 16, Zod, bcryptjs, JWT & Cookie an toàn, Helmet, CORS, Express Rate Limit.
- **Testing:** Vitest, Supertest (11 Integration Tests kiểm thử phân quyền, nghiệp vụ tuyển sinh, transaction và RBAC).
- **DevOps:** Docker, Docker Compose, Nginx Reverse Proxy, GitHub Actions CI.

---

## 2. Tài Khoản Demo Hệ Thống

| Vai trò | Email đăng nhập | Mật khẩu mặc định | Ghi chú |
|---|---|---|---|
| **Super Admin** | `admin@bafu.edu.vn` | `AdminPassword@2026` | Quản trị toàn trường, Đoàn trường - Hội sinh viên |
| **Club Admin** | `it.leader@bafu.edu.vn` | `12345678` | Chủ nhiệm CLB Lập trình BAFU Tech |
| **Club Admin** | `caulong.leader@bafu.edu.vn` | `12345678` | Chủ nhiệm CLB Cầu Lông |
| **Sinh Viên** | `haidang.sv@bafu.edu.vn` | `12345678` | Sinh viên Nguyễn Hải Đăng (Đã có đơn ứng tuyển) |
| **Sinh Viên** | `minhthu.sv@bafu.edu.vn` | `12345678` | Sinh viên Trần Minh Thư (Hội viên chính thức) |

*(Trên giao diện Đăng nhập có sẵn các nút bấm điền nhanh tài khoản demo).*

---

## 3. Hướng Dẫn Cài Đặt & Chạy Hệ Thống

### Cách 1: Chạy trực tiếp (Local Development)

#### Bước 1: Khởi động Database PostgreSQL qua Docker
```bash
docker compose up -d postgres
```
*(Container Postgres sẽ chạy trên cổng `5433` để tránh xung đột với Postgres mặc định của máy).*

#### Bước 2: Cài đặt và chạy Backend
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
Backend API sẽ hoạt động tại: `http://localhost:5000` (Endpoints: `/api/v1`).

#### Bước 3: Cài đặt và chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend Web App sẽ hoạt động tại: `http://localhost:5173`.

---

### Cách 2: Chạy toàn bộ bằng Docker Compose

```bash
docker compose up -d --build
```
Hệ thống sẽ chạy thông qua Nginx Reverse Proxy tại cổng `80` (`http://localhost`).

---

## 4. Chạy Kiểm Thử (Tests Verification)

Để chạy bộ kiểm thử tự động 11 kịch bản tích hợp cốt lõi (TC01 -> TC12):
```bash
cd backend
npm test
```

Để kiểm tra build production của Frontend:
```bash
cd frontend
npm run build
```

---

## 5. Kịch Bản Demo End-to-End Nghiệp Vụ Tuyển Sinh

1. **Khám phá CLB:** Truy cập trang chủ `http://localhost:5173/`, xem các thống kê thật từ database (10+ CLB, 240+ hội viên, đợt tuyển đang mở). Vào trang `/clubs`, lọc theo lĩnh vực "Học thuật & Công nghệ" hoặc bật "Chỉ xem CLB đang mở tuyển".
2. **Xem chi tiết CLB:** Bấm vào **CLB Lập Trình & Công Nghệ BAFU Tech**, xem thông tin Ban chủ nhiệm, lịch sinh hoạt tối thứ Tư và đợt tuyển Gen 5 đang mở.
3. **Đăng ký tài khoản sinh viên:** Bấm "Đăng ký", điền thông tin sinh viên mới và mã sinh viên, hệ thống tự động khởi tạo hồ sơ và đăng nhập.
4. **Nộp hồ sơ ứng tuyển trực tuyến:** Tại trang chi tiết BAFU Tech, bấm "Ứng tuyển vào CLB ngay", trả lời các câu hỏi động (chọn ban, tick ngôn ngữ lập trình, điền mục tiêu). Bấm gửi đơn -> Hồ sơ chuyển sang trạng thái `SUBMITTED`.
5. **Kiểm tra chống nộp trùng:** Thử nộp lại một lần nữa vào cùng đợt tuyển -> Hệ thống báo lỗi từ chối ngay lập tức.
6. **Ban chủ nhiệm xét duyệt:** Đăng xuất, đăng nhập bằng tài khoản BCN BAFU Tech (`it.leader@bafu.edu.vn` / `12345678`). Vào menu **Quản lý CLB (Ban chủ nhiệm)** -> Xem danh sách hồ sơ ứng tuyển, bấm "Xem & Xét duyệt", đọc câu trả lời của ứng viên, nhập ghi chú nội bộ, bấm **✓ Duyệt trúng tuyển (Tạo thành viên)**.
7. **Kích hoạt hội viên tự động:** Hệ thống chạy database transaction: cập nhật trạng thái đơn thành `ACCEPTED`, tự động tạo bản ghi `ClubMembership`, gán tư cách thành viên chính thức, ghi Audit Log và gửi thông báo.
8. **Xác minh phân quyền đa CLB:** Đăng nhập tài khoản BCN Cầu Lông (`caulong.leader@bafu.edu.vn`) và thử truy cập tài nguyên của BAFU Tech -> Hệ thống chặn lỗi 403 Forbidden.
9. **Quản trị toàn trường (Super Admin):** Đăng nhập `admin@bafu.edu.vn` / `AdminPassword@2026`, vào **Quản trị toàn trường** xem số liệu tổng hợp toàn trường, danh sách người dùng, cấp quyền Chủ nhiệm CLB mới và xem nhật ký Audit Logs.
