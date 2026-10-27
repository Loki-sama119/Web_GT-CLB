# BÁO CÁO THỰC THI KIỂM THỬ END-TO-END & BACKEND API (PHASE 6 E2E REPORT)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Thời điểm thực hiện:** 27/10/2026  
**Môi trường:** Docker Compose (WSL2), PostgreSQL 16 (Port 5433:5432), Nginx Reverse Proxy (Port 80)  
**Công cụ kiểm thử:** Vitest v3 + Supertest (Backend), Playwright v1.50 (Browser E2E)  

---

## 1. BẢNG TỔNG KẾT KẾT QUẢ KIỂM THỬ THỰC TẾ

| Nhóm Kiểm Thử | Tầng Kiểm Thử | Tổng Số Test | Kết Quả | Tỷ Lệ Đạt | Thời Gian Thực Thi |
|---|---|---|---|---|---|
| **Backend Integration Suite** | Node.js / Express / Prisma API | **35 / 35 tests** | **PASSED** | **100%** | ~1.3 giây |
| **Playwright Full-Flow E2E** | Desktop Chromium (1280x720) | **9 / 9 tests** | **PASSED** | **100%** | ~10.5 giây |
| **Playwright Full-Flow E2E** | Mobile Pixel 5 (Viewport 393x851) | **9 / 9 tests** | **PASSED** | **100%** | ~11.8 giây |
| **Playwright Phase 5/6 Deep-Dive** | Desktop Chromium | **6 / 6 tests** | **PASSED** | **100%** | ~5.3 giây |
| **Playwright Phase 5/6 Deep-Dive** | Mobile Pixel 5 | **6 / 6 tests** | **PASSED** | **100%** | ~6.1 giây |
| **TỔNG LƯỢT KIỂM THỬ HỆ THỐNG** | Toàn bộ các tầng | **65 / 65 lượt** | **PASSED** | **100%** | **0 lỗi (0 FAIL)** |

---

## 2. CHI TIẾT CÁC TEST CASES BACKEND API (TC01 – TC36)

| Mã TC | Nội Dung Kịch Bản Kiểm Thử | Trạng Thái | Ghi Chú Kỹ Thuật |
|---|---|---|---|
| **TC01** | Người dùng đăng ký tài khoản sinh viên hợp lệ | **PASS** | Tự động sinh `StudentProfile`, hash password bằng bcrypt |
| **TC02** | Đăng nhập thất bại khi sai mật khẩu và thành công khi đúng mật khẩu | **PASS** | Báo lỗi HTTP 401 khi sai; trả JWT và Cookie khi đúng |
| **TC03** | Khách tìm kiếm, lọc danh mục và xem chi tiết CLB theo slug | **PASS** | Query tối ưu với Prisma include relations |
| **TC04** | Sinh viên nộp đơn ứng tuyển trực tuyến với đầy đủ câu hỏi | **PASS** | Lưu câu trả lời động vào `ApplicationAnswer` |
| **TC05** | Thiếu câu trả lời bắt buộc thì backend từ chối với HTTP 400 | **PASS** | Kiểm tra `isRequired` và ném lỗi cụ thể |
| **TC06** | Ngăn chặn nộp trùng hồ sơ đang xử lý trong cùng một đợt tuyển | **PASS** | Kiểm tra trạng thái hồ sơ trước khi lưu |
| **TC07** | Không thể nộp hồ sơ cho đợt tuyển có trạng thái CLOSED | **PASS** | Kiểm tra trạng thái chiến dịch |
| **TC08** | Duyệt hồ sơ ACCEPTED tự động kích hoạt membership duy nhất | **PASS** | Chạy trong `$transaction` atomic của Prisma |
| **TC10** | Sinh viên xem dòng trạng thái hồ sơ và `internalNotes` được ẩn an toàn | **PASS** | Loại trừ `internalNotes` khỏi response gửi cho ứng viên |
| **TC11** | Chặn Club Admin CLB này xem và can thiệp hồ sơ của CLB khác (RBAC) | **PASS** | Trả về HTTP 403 Forbidden |
| **TC12** | User vai trò STUDENT bị từ chối khi gọi API Super Admin | **PASS** | Middleware `requireSuperAdmin` chặn HTTP 403 |
| **TC13** | Sinh viên upload Avatar thành công và cập nhật profile | **PASS** | Lưu vào `/uploads/avatars/`, cập nhật `avatarUrl` |
| **TC14** | Club Admin upload ảnh vào Album hoạt động và lấy danh sách album | **PASS** | Lưu vào `/uploads/albums/`, ghi nhận vào `ClubMedia` |
| **TC15** | Chặn tệp tin độc hại hoặc không đúng định dạng hình ảnh | **PASS** | Multer fileFilter chặn tệp không phải ảnh |
| **TC16** | Club Admin xuất danh sách ứng viên CSV có UTF-8 BOM | **PASS** | File CSV mở trực tiếp trên Excel không lỗi font |
| **TC17** | Chặn Club Admin xuất danh sách ứng viên của CLB khác | **PASS** | RBAC 403 Forbidden |
| **TC18** | Hệ thống ghi nhận đầy đủ lịch sử thay đổi trạng thái ApplicationHistory | **PASS** | Ghi nhận Actor, FromStatus, ToStatus, Timestamp |
| **TC19** | Dịch vụ Email gửi thông báo nộp đơn và trúng tuyển an toàn | **PASS** | Nodemailer gửi mẫu HTML chuyên nghiệp |
| **TC20** | Lỗi dịch vụ Email không làm hỏng tiến trình xét duyệt hồ sơ | **PASS** | Khả năng phục hồi (Resilience) cao, fallback ghi log |
| **TC21** | BCN tạo sự kiện mới cho CLB thành công | **PASS** | Tạo sự kiện kèm địa điểm, sức chứa tối đa |
| **TC22** | Sinh viên đăng ký tham gia sự kiện và nhận email xác nhận | **PASS** | Tạo `EventRegistration` trạng thái REGISTERED |
| **TC23** | Chặn đăng ký trùng lặp vào cùng một sự kiện | **PASS** | Chặn HTTP 400 khi đã có đăng ký hoạt động |
| **TC24** | Sinh viên xem danh sách các sự kiện mình đã đăng ký | **PASS** | Endpoint `/events/my-registrations` trả về đầy đủ |
| **TC25** | Sinh viên hủy đăng ký sự kiện thành công | **PASS** | Chuyển trạng thái sang CANCELLED |
| **TC26** | Club Admin lấy danh sách thành viên CLB có tìm kiếm và lọc | **PASS** | Lọc theo họ tên, MSSV, vai trò |
| **TC27** | Club Admin xuất danh sách thành viên ra file CSV có UTF-8 BOM | **PASS** | Định dạng CSV chuẩn hóa |
| **TC28** | Cập nhật chức vụ hội viên thành VICE_LEADER thành công | **PASS** | Phân quyền Phó chủ nhiệm cho thành viên |
| **TC29** | Một sinh viên có thể tham gia nhiều câu lạc bộ trên cùng một tài khoản | **PASS** | Xác minh quan hệ 1-N đa CLB trong cơ sở dữ liệu |
| **TC30** | Super Admin truy cập báo cáo tổng hợp hoạt động CLB toàn trường | **PASS** | Endpoint `/admin/reports/clubs` trả về số liệu toàn trường |
| **TC31** | Super Admin xuất file CSV báo cáo toàn trường có UTF-8 BOM | **PASS** | Xuất báo cáo tổng quan CLB cho Excel |
| **TC32** | Chặn tài khoản Sinh viên truy cập báo cáo Super Admin (RBAC 403) | **PASS** | Bảo vệ route báo cáo quản trị |
| **TC33** | Super Admin tải file mẫu CSV nhập CLB BAFU có UTF-8 BOM | **PASS** | Trả về template CSV chuẩn kèm dòng mẫu |
| **TC34** | Super Admin nhập danh sách CLB bằng CSV với xử lý trùng tên | **PASS** | Phân tích cú pháp CSV, tạo CLB, bỏ qua trùng lặp |
| **TC35** | Super Admin phê duyệt và cập nhật trạng thái hoạt động CLB | **PASS** | Chuyển đổi trạng thái PENDING, ACTIVE, INACTIVE |
| **TC36** | Kiểm tra bảo vệ chống CSV Formula Injection (OWASP ASVS) | **PASS** | Khử các ký tự điều khiển formula `=`, `+`, `-`, `@` |

---

## 3. LOG PLAYWRIGHT E2E THỰC THI THỰC TẾ
```text
Running 30 tests using 1 worker

  ok  1 [chromium] › tests\full-flow.spec.js:15:3 › 01. Khách xem Landing page, danh mục, thống kê và danh sách CLB (1.3s)
  ok  2 [chromium] › tests\full-flow.spec.js:34:3 › 02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển (868ms)
  ok  3 [chromium] › tests\full-flow.spec.js:45:3 › 03. Đăng ký tài khoản sinh viên mới (877ms)
  ok  4 [chromium] › tests\full-flow.spec.js:61:3 › 04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech (1.4s)
  ok  5 [chromium] › tests\full-flow.spec.js:82:3 › 05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên (952ms)
  ok  6 [chromium] › tests\full-flow.spec.js:97:3 › 06. Club Admin duyệt hồ sơ và kích hoạt hội viên (1.5s)
  ok  7 [chromium] › tests\full-flow.spec.js:124:3 › 07. Sinh viên thấy tư cách thành viên đã được kích hoạt (1.2s)
  ok  8 [chromium] › tests\full-flow.spec.js:140:3 › 08. Super Admin quản lý toàn trường và xem thống kê (1.1s)
  ok  9 [chromium] › tests\full-flow.spec.js:162:3 › 09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn (1.1s)
  ok 10 [chromium] › tests\phase5-deep-dive.spec.js:5:3 › 01. Kiểm tra trang Sự kiện cộng đồng BAFU và bộ lọc (751ms)
  ok 11 [chromium] › tests\phase5-deep-dive.spec.js:15:3 › 02. Kiểm tra Album Hoạt Động tại trang Chi Tiết Câu Lạc Bộ (735ms)
  ok 12 [chromium] › tests\phase5-deep-dive.spec.js:23:3 › 03. Club Admin quản lý hội viên, tìm kiếm và nút xuất CSV hội viên (1.0s)
  ok 13 [chromium] › tests\phase5-deep-dive.spec.js:43:3 › 04. Super Admin kiểm tra Báo Cáo CLB Toàn Trường và bảng số liệu (1.2s)
  ok 14 [chromium] › tests\phase5-deep-dive.spec.js:72:3 › 06. Khách kiểm tra trang Chính Sách Quyền Riêng Tư (Privacy Policy) và DSAR (543ms)
  ok 15 [chromium] › tests\phase5-deep-dive.spec.js:80:3 › 07. Khách kiểm tra trang Điều Khoản Sử Dụng (Terms of Service) (530ms)
  ok 16 [mobile]   › tests\full-flow.spec.js:15:3 › 01. Khách xem Landing page, danh mục, thống kê và danh sách CLB (1.1s)
  ok 17 [mobile]   › tests\full-flow.spec.js:34:3 › 02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển (1.1s)
  ok 18 [mobile]   › tests\full-flow.spec.js:45:3 › 03. Đăng ký tài khoản sinh viên mới (932ms)
  ok 19 [mobile]   › tests\full-flow.spec.js:61:3 › 04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech (2.0s)
  ok 20 [mobile]   › tests\full-flow.spec.js:82:3 › 05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên (1.1s)
  ok 21 [mobile]   › tests\full-flow.spec.js:97:3 › 06. Club Admin duyệt hồ sơ và kích hoạt hội viên (1.5s)
  ok 22 [mobile]   › tests\full-flow.spec.js:124:3 › 07. Sinh viên thấy tư cách thành viên đã được kích hoạt (1.1s)
  ok 23 [mobile]   › tests\full-flow.spec.js:140:3 › 08. Super Admin quản lý toàn trường và xem thống kê (1.3s)
  ok 24 [mobile]   › tests\full-flow.spec.js:162:3 › 09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn (1.1s)
  ok 25 [mobile]   › tests\phase5-deep-dive.spec.js:5:3 › 01. Kiểm tra trang Sự kiện cộng đồng BAFU và bộ lọc (793ms)
  ok 26 [mobile]   › tests\phase5-deep-dive.spec.js:15:3 › 02. Kiểm tra Album Hoạt Động tại trang Chi Tiết Câu Lạc Bộ (977ms)
  ok 27 [mobile]   › tests\phase5-deep-dive.spec.js:23:3 › 03. Club Admin quản lý hội viên, tìm kiếm và nút xuất CSV hội viên (1.1s)
  ok 28 [mobile]   › tests\phase5-deep-dive.spec.js:43:3 › 04. Super Admin kiểm tra Báo Cáo CLB Toàn Trường và bảng số liệu (1.2s)
  ok 29 [mobile]   › tests\phase5-deep-dive.spec.js:72:3 › 06. Khách kiểm tra trang Chính Sách Quyền Riêng Tư (Privacy Policy) và DSAR (673ms)
  ok 30 [mobile]   › tests\phase5-deep-dive.spec.js:80:3 › 07. Khách kiểm tra trang Điều Khoản Sử Dụng (Terms of Service) (570ms)

  30 passed (33.8s)
```
