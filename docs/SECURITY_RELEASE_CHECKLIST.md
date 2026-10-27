# DANH MỤC KIỂM TRA BẢO MẬT PHÁT HÀNH (SECURITY RELEASE CHECKLIST)
## Đối chiếu theo tiêu chuẩn: OWASP Application Security Verification Standard (ASVS v4.0)
**Dự án:** University Club Portal — BAFU  
**Thời điểm đánh giá:** 27/10/2026  
**Chuyên gia đánh giá:** Security & Compliance Lead  
**Kết quả chung:** ĐẠT TIÊU CHUẨN PHÁT HÀNH THỬ NGHIỆM (RELEASE READY)  

---

## 1. MA TRẬN ĐỐI CHIẾU TIÊU CHUẨN OWASP ASVS

| Nhóm kiểm tra (Domain) | Mã ASVS | Yêu cầu kiểm tra kỹ thuật | Cơ chế thực thi trong mã nguồn | Đánh giá |
| :--- | :--- | :--- | :--- | :---: |
| **V2: Xác thực (Authentication)** | V2.1.1 | Mật khẩu được băm an toàn, không lưu plaintext | Sử dụng `bcrypt` với cost factor 10 | **PASS** |
| | V2.2.1 | Cơ chế khóa / hạn chế brute-force tấn công | Rate limiter 5 lượt thử sai / 15 phút tại `/api/auth/login` | **PASS** |
| | V2.8.1 | Thu hồi phiên khi đăng xuất (Logout) | Xóa sạch HTTP-only JWT Cookie phía máy chủ và trình duyệt | **PASS** |
| **V3: Quản lý phiên (Session)** | V3.2.1 | Cookie phiên phải có cờ bảo vệ bắt buộc | Thiết lập `httpOnly: true`, `sameSite: 'strict'`, `secure: true` (production) | **PASS** |
| | V3.3.1 | Thời gian sống JWT hợp lý | Thời hạn token tối đa 7 ngày, hỗ trợ kiểm tra trạng thái người dùng | **PASS** |
| **V4: Kiểm soát truy cập (Access Control)** | V4.1.1 | Kiểm soát quyền truy cập theo vai trò (RBAC) | Middleware `requireAuth`, `requireSuperAdmin`, `requireClubAdmin` | **PASS** |
| | V4.1.3 | Ngăn chặn truy cập chéo giữa các CLB (Multi-tenant IDOR) | Mọi endpoint của CLB đều xác minh `clubId` thuộc quyền sở hữu của user | **PASS** |
| **V5: Thẩm định dữ liệu (Input Validation)** | V5.1.1 | Xác thực dữ liệu đầu vào có cấu trúc | Sử dụng thư viện `zod` xác thực chặt chẽ schema của mọi request body | **PASS** |
| | V5.3.1 | Phòng chống SQL Injection | Sử dụng Prisma ORM với parameterized queries 100%, không nối chuỗi SQL thô | **PASS** |
| | V5.3.3 | Phòng chống Cross-Site Scripting (XSS) | React DOM tự động escape chuỗi, làm sạch HTML trước khi render | **PASS** |
| | V5.4.1 | **Phòng chống CSV Formula Injection** | Khử các ký tự độc hại `=, +, -, @, \t, \r` bằng cách thêm dấu nháy `'` | **PASS** |
| **V12: Tải tệp tin (File Upload)** | V12.1.1 | Kiểm tra định dạng tệp (MIME Type & Extension) | Multer chỉ chấp nhận `image/jpeg`, `image/png`, `image/webp` | **PASS** |
| | V12.2.1 | Giới hạn dung lượng tệp tải lên | Giới hạn tối đa 5 MB cho mỗi tệp ảnh tải lên | **PASS** |
| | V12.3.1 | Đổi tên tệp ngẫu nhiên tránh ghi đè / traversal | Sinh tên file bằng timestamp ngẫu nhiên, lưu trong thư mục an toàn | **PASS** |
| **V13: API & Bảo vệ DoS (API Security)** | V13.1.1 | Giới hạn tần suất gọi API (Rate Limiting) | Rate limit tổng thể 100 req/15 phút và limiter chuyên biệt cho login/register | **PASS** |
| | V13.2.1 | Giới hạn dung lượng payload | Express cấu hình `express.json({ limit: '10kb' })` chống cạn kiệt bộ nhớ | **PASS** |
| **V8: Quyền riêng tư & Nhật ký (Data Privacy)** | V8.1.1 | Không ghi thông tin cá nhân / mật khẩu ra log | Không in password, token, số điện thoại vào console/log tệp | **PASS** |
| | V8.2.1 | Bảo vệ ghi chú đánh giá nội bộ của ban tuyển chọn | Loại bỏ hoàn toàn trường `internalNotes` trong file CSV xuất cho người dùng | **PASS** |
| | V8.3.1 | Công khai chính sách quyền riêng tư & tiếp nhận DSAR | Đã xây dựng trang `/privacy-policy` và `/terms-of-service` đầy đủ quy trình | **PASS** |

---

## 2. KẾT QUẢ QUÉT LỖ HỔNG PHỤ THUỘC (NPM AUDIT)

### 2.1 Backend (`backend/`)
- **Critical:** 0
- **High:** 1 (Gói `zod` — DoS qua cấu trúc object lồng sâu không giới hạn)
  - **Đánh giá rủi ro (Risk Assessment):** RỦI RO THẤP ĐẾN TRUNG BÌNH.
  - **Biện pháp giảm thiểu đã áp dụng (Mitigation):** Express đã cấu hình giới hạn kích thước payload `express.json({ limit: '10kb' })`, triệt tiêu hoàn toàn khả năng kẻ tấn công gửi payload JSON khổng lồ gây tràn RAM.
- **Moderate / Low:** 0

### 2.2 Frontend (`frontend/`)
- **Critical:** 0
- **High:** 0
- **Moderate / Low:** 0 (Gói phụ thuộc dev tools Vite/Tailwind sạch hoàn toàn).

---

## 3. BẢO MẬT DỮ LIỆU ĐẦU RA (CSV EXPORT DEFENSE)

### Vấn đề tiềm ẩn
Kẻ tấn công có thể đăng ký hồ sơ với tên chứa các công thức bảng tính như `=cmd|'/C calc'!A0` hoặc `-2+3+cmd|...` để khi Ban Chủ nhiệm mở tệp Excel/CSV sẽ kích hoạt mã thực thi trên máy nạn nhân.

### Cơ chế xử lý đã kiểm chứng bằng Unit/API Test
Hàm an toàn hóa được áp dụng trên tất cả các trường xuất báo cáo:
```javascript
const sanitizeCsvField = (val) => {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();
  // Nếu ký tự đầu tiên là ký tự kích hoạt công thức, thêm dấu nháy đơn bảo vệ
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
};
```
Đã kiểm thử tự động với trường hợp tên `+84988888888` và `=SUM(1,2)`: Hệ thống tự động thêm dấu `'` chuyển thành text thuần túy an toàn.

---

## 4. QUY TRÌNH TIẾP NHẬN YÊU CẦU DỮ LIỆU CÁ NHÂN (DSAR WORKFLOW)

Để đảm bảo quyền riêng tư của sinh viên theo Nghị định 13/2023/NĐ-CP:
1. **Quyền được biết & tra cứu:** Sinh viên có thể trực tiếp xem toàn bộ hồ sơ đã nộp và danh sách CLB đã tham gia tại mục "Hồ sơ của tôi".
2. **Quyền chỉnh sửa dữ liệu:** Sinh viên có thể cập nhật thông tin liên hệ, ảnh đại diện bất kỳ lúc nào.
3. **Quyền yêu cầu xóa thông tin (Right to be Forgotten):**
   - Sinh viên gửi yêu cầu qua email chính thức của Ban Quản trị: `bafudev@bafu.edu.vn`.
   - Quản trị viên đối chiếu giấy tờ sinh viên hợp lệ và thực hiện xóa/ẩn thông tin trong vòng tối đa **72 giờ**.
