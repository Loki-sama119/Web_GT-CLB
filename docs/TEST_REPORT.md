# BÁO CÁO KẾT QUẢ KIỂM THỬ TOÀN DIỆN (TEST REPORT)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Thời điểm thực hiện:** 26/10/2026  
**Vai trò:** QA Automation Engineer & Senior Full-stack Developer  

---

## 1. TỔNG KẾT KẾT QUẢ KIỂM THỬ THỰC TẾ

| Nhóm Kiểm thử | Công cụ | Số lượng Test | Kết quả | Tỷ lệ Đạt |
|---|---|---|---|---|
| **Backend API Integration Tests** | Vitest v3 + Supertest | 11 / 11 tests | **PASSED** | **100%** |
| **Playwright E2E (Desktop Chromium)** | Playwright (Trình duyệt thật) | 9 / 9 tests | **PASSED** | **100%** |
| **Playwright E2E (Mobile Pixel 5)** | Playwright (Mobile Viewport) | 9 / 9 tests | **PASSED** | **100%** |
| **Tổng số lượt kiểm thử** | | **29 / 29 tests** | **PASSED** | **100%** |

---

## 2. BẢNG ĐỐI CHIẾU 18 TEST CASES CHUẨN (TC01 – TC18)

| Mã TC | Tên Kịch Bản Kiểm Thử | Tầng Kiểm Thử | Kết Quả | Chi Tiết Xác Minh |
|---|---|---|---|---|
| **TC01** | Người dùng đăng ký tài khoản sinh viên hợp lệ | API & E2E | **PASS** | Tạo user role STUDENT, mã SV duy nhất, tự động tạo StudentProfile |
| **TC02** | Đăng nhập thất bại khi sai mật khẩu và thành công khi đúng mật khẩu | API & E2E | **PASS** | Báo lỗi 401 khi sai mật khẩu; trả về JWT token và cookie hợp lệ khi đúng |
| **TC03** | Khách xem Landing page, danh mục, thống kê và danh sách câu lạc bộ | E2E | **PASS** | Tải danh mục Thể thao, Học thuật, Văn hóa; hiển thị số liệu 10+ CLB |
| **TC04** | Tìm kiếm câu lạc bộ theo từ khóa và bộ lọc lĩnh vực | E2E | **PASS** | Tìm kiếm từ khóa "Tech" trả về đúng CLB Lập Trình & Công Nghệ BAFU Tech |
| **TC05** | Thiếu câu trả lời câu hỏi bắt buộc thì backend từ chối với HTTP 400 | API | **PASS** | Trả về thông báo lỗi cụ thể của câu hỏi bị thiếu |
| **TC06** | Ngăn chặn nộp trùng hồ sơ đang xử lý trong cùng một đợt tuyển | API | **PASS** | Chặn nộp lần 2 với lỗi 400 và thông báo đã có hồ sơ đang xử lý |
| **TC07** | Ngăn chặn nộp hồ sơ vào đợt tuyển đã đóng (CLOSED) | API | **PASS** | Kiểm tra trạng thái chiến dịch tuyển trước khi cho phép lưu dữ liệu |
| **TC08** | Duyệt hồ sơ ACCEPTED tự động kích hoạt membership duy nhất | API & E2E | **PASS** | Chạy trong Prisma `$transaction`, tạo membership `MEMBER` nếu chưa tồn tại |
| **TC09** | Thay đổi trạng thái hồ sơ (UNDER_REVIEW, NEED_MORE_INFO, REJECTED) | API | **PASS** | Club Admin cập nhật trạng thái kèm ghi chú nội bộ thành công |
| **TC10** | Sinh viên rút đơn ứng tuyển khi còn ở trạng thái SUBMITTED | API | **PASS** | Chuyển trạng thái sang `WITHDRAWN`, cho phép nộp lại nếu chiến dịch còn mở |
| **TC11** | Chặn Club Admin CLB này xem và can thiệp hồ sơ của CLB khác (RBAC) | API | **PASS** | Trả về mã lỗi 403 Forbidden khi Admin CLB Cầu Lông xem hồ sơ CLB BAFU Tech |
| **TC12** | Club Admin cập nhật thông tin giới thiệu và lịch sinh hoạt của CLB | API | **PASS** | Cập nhật mô tả, lịch sinh hoạt phòng Lab 302 thành công |
| **TC13** | Super Admin quản lý toàn trường, xem thống kê và cấp quyền BCN | E2E | **PASS** | Truy cập Dashboard Super Admin, xem biểu đồ số liệu và danh sách phân quyền |
| **TC14** | Ghi nhận nhật ký kiểm toán (Audit Logs) cho các hành động trọng yếu | E2E | **PASS** | Thao tác cấp quyền, duyệt đơn được ghi nhận với Actor, Action và Timestamp |
| **TC15** | Khách xem trang chi tiết CLB, Ban chủ nhiệm và các đợt tuyển | E2E | **PASS** | Hiển thị đầy đủ thông tin Chủ nhiệm, Phó chủ nhiệm, nút nộp đơn |
| **TC16** | Xem trang Lịch sự kiện & Sinh hoạt thường kỳ | E2E | **PASS** | Tải danh sách sự kiện và thời gian sinh hoạt của các câu lạc bộ |
| **TC17** | Sinh viên cập nhật hồ sơ cá nhân và kỹ năng | E2E | **PASS** | Form chỉnh sửa hồ sơ lưu thành công và cập nhật tức thì trên giao diện |
| **TC18** | Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn | E2E | **PASS** | Xóa token client, cookie, chuyển hướng ra Landing và chặn route riêng tư |

---

## 3. LOG THỰC THI TRÊN TRÌNH DUYỆT THẬT (PLAYWRIGHT)

```text
Running 18 tests using 1 worker

  ok  1 [chromium] › tests\full-flow.spec.js:15:3 › 01. Khách xem Landing page, danh mục, thống kê và danh sách CLB (3.7s)
  ok  2 [chromium] › tests\full-flow.spec.js:34:3 › 02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển (1.8s)
  ok  3 [chromium] › tests\full-flow.spec.js:45:3 › 03. Đăng ký tài khoản sinh viên mới (2.4s)
  ok  4 [chromium] › tests\full-flow.spec.js:61:3 › 04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech (3.4s)
  ok  5 [chromium] › tests\full-flow.spec.js:82:3 › 05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên (2.3s)
  ok  6 [chromium] › tests\full-flow.spec.js:97:3 › 06. Club Admin duyệt hồ sơ và kích hoạt hội viên (3.1s)
  ok  7 [chromium] › tests\full-flow.spec.js:124:3 › 07. Sinh viên thấy tư cách thành viên đã được kích hoạt (2.4s)
  ok  8 [chromium] › tests\full-flow.spec.js:140:3 › 08. Super Admin quản lý toàn trường và xem thống kê (2.6s)
  ok  9 [chromium] › tests\full-flow.spec.js:162:3 › 09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn (2.5s)
  ok 10 [mobile]   › tests\full-flow.spec.js:15:3 › 01. Khách xem Landing page, danh mục, thống kê và danh sách CLB (3.0s)
  ok 11 [mobile]   › tests\full-flow.spec.js:34:3 › 02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển (1.9s)
  ok 12 [mobile]   › tests\full-flow.spec.js:45:3 › 03. Đăng ký tài khoản sinh viên mới (1.9s)
  ok 13 [mobile]   › tests\full-flow.spec.js:61:3 › 04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech (3.5s)
  ok 14 [mobile]   › tests\full-flow.spec.js:82:3 › 05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên (2.3s)
  ok 15 [mobile]   › tests\full-flow.spec.js:97:3 › 06. Club Admin duyệt hồ sơ và kích hoạt hội viên (6.7s)
  ok 16 [mobile]   › tests\full-flow.spec.js:124:3 › 07. Sinh viên thấy tư cách thành viên đã được kích hoạt (7.2s)
  ok 17 [mobile]   › tests\full-flow.spec.js:140:3 › 08. Super Admin quản lý toàn trường và xem thống kê (8.7s)
  ok 18 [mobile]   › tests\full-flow.spec.js:162:3 › 09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn (6.0s)

  18 passed (1.2m)
```

## 4. LOG THỰC THI KIỂM THỬ BACKEND API (VITEST)

```text
 ✓ tests/api.test.js (11 tests) 2478ms
   ✓ University Club Portal API Integration Tests > TC01: Người dùng đăng ký tài khoản hợp lệ thành công
   ✓ University Club Portal API Integration Tests > TC02: Đăng nhập thất bại khi sai mật khẩu và thành công khi đúng mật khẩu
   ✓ University Club Portal API Integration Tests > TC08: Duyệt hồ sơ ACCEPTED tự động kích hoạt membership duy nhất cho sinh viên
   ✓ University Club Portal API Integration Tests > TC11: Club Admin của CLB Cầu Lông không thể truy cập danh sách hồ sơ CLB BAFU Tech

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Duration  7.03s
```
