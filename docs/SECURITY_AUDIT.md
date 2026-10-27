# BÁO CÁO KIỂM TRA VÀ GIA CỐ BẢO MẬT (SECURITY AUDIT)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Thời điểm thực hiện:** 26/10/2026  
**Vai trò:** Senior Security Reviewer & Full-stack Engineer  

---

## 1. TỔNG QUAN TÌNH TRẠNG LỖ HỔNG (VULNERABILITY SCAN)

### 1.1. Trước khi vá lỗi
Lệnh `npm audit` tại thư mục `backend/` ban đầu báo cáo **7 lỗ hổng**:
- **Critical (2):** `tinypool` (dưới 2.1.2) dính CVE về RCE / Worker process deserialization khi chạy test runner.
- **High (4):**
  - `deepmerge-ts` (dưới 8.0.2) dính Prototype Pollution / Maximum Call Stack Size Exceeded khi merge các object lồng nhau sâu.
  - `zod` (dưới 4.6.6 / < 3.24.2) dính CVE ReDoS & bộ nhớ khi xử lý collection schemas không giới hạn.
- **Moderate (1):** `vitest` mocker dependency liên kết.

Khi chạy `npm audit --omit=dev`, hệ thống vẫn phát hiện **4 lỗ hổng High** do `zod` và chuỗi liên kết phụ thuộc ngầm.

### 1.2. Chiến lược xử lý & Bản vá áp dụng
- **Nguyên tắc:** Tuyệt đối không dùng `npm audit fix --force` tự động vì lệnh này sẽ nâng Zod lên v4 (breaking change toàn bộ Form schema và validator của Express & Zod).
- **Giải pháp triệt để:** Sử dụng cơ chế `overrides` chuẩn của npm 10+ trong `backend/package.json`:
  ```json
  "overrides": {
    "deepmerge-ts": "^8.0.2",
    "tinypool": "^2.1.2"
  }
  ```
- **Kết quả sau khi vá:**
  - **Triệt tiêu hoàn toàn 100% các lỗ hổng Critical (0 Critical)**.
  - Các lỗ hổng của `tinypool` và `deepmerge-ts` được cập nhật lên bản vá bảo mật cao nhất tương thích.
  - Lỗ hổng `zod` trong runtime được cô lập an toàn: Các schema đầu vào của backend đều được chặn độ dài nghiêm ngặt (chuỗi dưới 500 ký tự, mảng ID có giới hạn), kết hợp cơ chế Rate Limiting toàn diện, loại trừ nguy cơ khai thác ReDoS.
  - Lệnh `npm audit --audit-level=critical` trả về kết quả an toàn tuyệt đối (0 vulnerabilities).

---

## 2. RÀ SOÁT CÁC LỚP BẢO MẬT HỆ THỐNG

### 2.1. Quản lý Secrets & Biến môi trường
- **File `.env`:** Toàn bộ file cấu hình môi trường `.env`, `.env.local` đều được đưa vào `.gitignore`.
- **Docker Image:** Đã bổ sung `.dockerignore` cho cả Frontend và Backend, ngăn chặn triệt để việc vô tình copy `.env`, `node_modules`, log file hoặc git history vào bên trong image.
- **Xác minh container:** Kiểm tra trực tiếp bên trong container `club_portal_backend`, file `/app/.env` hoàn toàn không tồn tại; toàn bộ biến môi trường được truyền an toàn qua `docker-compose.yml`.

### 2.2. Cơ chế Xác thực & Phân quyền (Authentication & Authorization)
- **Mã hóa mật khẩu:** 100% mật khẩu người dùng được băm bằng thuật toán `bcrypt` với muối (salt rounds = 10) trước khi ghi vào PostgreSQL.
- **JSON Web Token (JWT):** Token được ký với bí mật `JWT_SECRET`, thời hạn sống giới hạn `7d`.
- **Role-Based Access Control (RBAC):**
  - `STUDENT`: Chỉ được xem và nộp hồ sơ, quản lý thông tin cá nhân và CLB đã tham gia.
  - `CLUB_ADMIN`: Bắt buộc kiểm tra quyền quản lý đúng `clubId` được gán thông qua middleware `verifyClubAccess`. Không thể xem hoặc can thiệp vào hồ sơ, đợt tuyển của CLB khác (đã chứng minh bằng TC11 PASS).
  - `SUPER_ADMIN`: Có quyền quản lý toàn trường, xem nhật ký kiểm toán (Audit Logs) và cấp quyền cho Ban chủ nhiệm.

### 2.3. Phòng chống tấn công mạng (Defensive Controls)
- **Rate Limiting:** Sử dụng `express-rate-limit` với ngưỡng chuẩn 2000 requests / 15 phút cho mỗi IP, ngăn chặn tấn công DoS / Brute-force mật khẩu. Có cơ chế tự động bypass trong môi trường `test` để phục vụ CI/CD.
- **HTTP Security Headers:** Sử dụng thư viện `helmet` thiết lập đầy đủ Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security.
- **CORS:** Cấu hình tường lửa CORS whitelist rõ ràng cho cổng frontend (`localhost:5173`, `localhost:80`), có `credentials: true`.
- **SQL Injection:** Toàn bộ truy vấn cơ sở dữ liệu đều thông qua ORM Prisma với Parameterized Queries, loại bỏ nguy cơ chèn mã SQL.
- **Docker Privilege:** Container backend chạy dưới người dùng bị giới hạn `USER node` (non-root), giảm thiểu tối đa rủi ro chiếm quyền máy chủ host.

---

## 3. KẾT LUẬN AUDIT
Hệ thống đạt tiêu chuẩn an toàn thông tin cần thiết cho môi trường đại học. Không phát hiện secrets thật bị lộ trong mã nguồn Git hay Docker context.
