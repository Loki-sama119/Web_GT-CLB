# KẾ HOẠCH KIỂM THỬ NGHIỆM THU NGƯỜI DÙNG (UAT TEST PLAN)
## Dự án: University Club Portal — BAFU (Trường Đại học Nông Lâm Bắc Giang)
**Mã tài liệu:** BAFU-UAT-PHASE6  
**Phiên bản:** 1.0.0  
**Ngày ban hành:** 27/10/2026  
**Trạng thái:** Sẵn sàng cho đợt kiểm thử thí điểm  
**Phê duyệt bởi:** QA Lead & Product Owner  

---

## 1. MỤC TIÊU VÀ PHẠM VI (OBJECTIVES & SCOPE)

### 1.1 Mục tiêu
1. Xác nhận hệ thống Cổng thông tin CLB Sinh viên BAFU đáp ứng đầy đủ yêu cầu nghiệp vụ thực tế của sinh viên, Ban Chủ nhiệm CLB và Đoàn Thanh niên / Quản trị viên Nhà trường.
2. Đánh giá tính trực quan, độ trễ phản hồi, tính khả dụng trên đa thiết bị (Desktop, Tablet, Mobile).
3. Thu thập lỗi phát sinh (Defect), góp ý cải tiến (Enhancement requests) từ đối tượng người dùng thật trước khi phát hành chính thức toàn trường.

### 1.2 Phạm vi kiểm thử
- **Môi trường:** Staging / UAT Environment (Mạng nội bộ hoặc máy chủ thử nghiệm BAFU).
- **Phân hệ bao gồm:**
  - Cổng thông tin công khai (Landing Page, Danh bạ CLB, Lịch sự kiện, Điều khoản & Quyền riêng tư).
  - Phân hệ Sinh viên (Đăng ký, Đăng nhập, Hồ sơ cá nhân, Ứng tuyển form động, Theo dõi kết quả, Đăng ký sự kiện).
  - Phân hệ Ban Chủ nhiệm (Dashboard CLB, Quản lý sự kiện, Quản lý đợt tuyển & hồ sơ ứng viên, Quản trị hội viên, Quản lý album ảnh media).
  - Phân hệ Ban Quản trị cấp trường (Duyệt CLB mới, Phân quyền Admin, Nhập danh sách CLB từ CSV, Báo cáo & Thống kê toàn trường).

---

## 2. ĐỐI TƯỢNG VÀ VAI TRÒ THAM GIA (ROLES & STAKEHOLDERS)

| Vai trò | Số lượng dự kiến | Tiêu chí lựa chọn | Nhiệm vụ chính |
| :--- | :---: | :--- | :--- |
| **Sinh viên (Student Tester)** | 15 - 20 sinh viên | Đại diện các khóa (K18, K19, K20, K21), đa dạng ngành học | Duyệt danh bạ, ứng tuyển thử nghiệm, đăng ký sự kiện, kiểm tra trên điện thoại di động |
| **Ban Chủ nhiệm CLB (Club Admin)** | 6 - 8 đại diện CLB | Chủ nhiệm / Phó Chủ nhiệm từ 3 khối (Học thuật, Tình nguyện, Thể thao) | Cập nhật hồ sơ CLB, tạo đợt tuyển, duyệt ứng viên, xuất file CSV hội viên, upload ảnh |
| **Quản trị viên (Super Admin)** | 2 - 3 cán bộ | Cán bộ Văn phòng Đoàn trường, Phụ trách CNTT | Phê duyệt CLB từ trạng thái PENDING, nhập CLB bằng CSV, kiểm tra báo cáo toàn trường |

---

## 3. KỊCH BẢN KIỂM THỬ NGHIỆM THU (TEST SCENARIOS)

### 3.1 Nhóm kịch bản Sinh viên (Role: Student)

| Mã test | Kịch bản kiểm thử | Dữ liệu đầu vào / Thao tác | Kết quả kỳ vọng | Tiêu chí đạt (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- |
| **UAT-STU-01** | Đăng ký & Kích hoạt tài khoản | Điền họ tên, mã sinh viên, email, mật khẩu hợp lệ | Đăng ký thành công, tự động đăng nhập hoặc chuyển hướng đến trang Đăng nhập | [ ] Pass / [ ] Fail |
| **UAT-STU-02** | Khám phá & Lọc danh mục CLB | Sử dụng ô tìm kiếm và bộ lọc theo Phân loại CLB tại Trang chủ | Danh sách lọc phản hồi nhanh (< 500ms), hiển thị đúng thẻ trạng thái, logo và mô tả ngắn | [ ] Pass / [ ] Fail |
| **UAT-STU-03** | Ứng tuyển vào CLB (Dynamic Form) | Chọn đợt tuyển mở, điền form câu hỏi động (Text, Checkbox, Dropdown) | Ứng tuyển thành công, nhận thông báo xác nhận, xuất hiện trong trang "Hồ sơ của tôi" | [ ] Pass / [ ] Fail |
| **UAT-STU-04** | Theo dõi trạng thái hồ sơ | Đăng nhập tài khoản sinh viên, xem trang Danh sách hồ sơ đã nộp | Trạng thái hiển thị rõ ràng (Chờ duyệt, Phỏng vấn, Trúng tuyển...). **Không thấy ghi chú nội bộ của BCN** | [ ] Pass / [ ] Fail |
| **UAT-STU-05** | Đăng ký tham gia sự kiện | Chọn sự kiện mở, nhấn "Đăng ký tham gia" | Đăng ký thành công; nếu nhấn đăng ký lại hệ thống báo đã đăng ký; hủy đăng ký hoạt động bình thường | [ ] Pass / [ ] Fail |
| **UAT-STU-06** | Trải nghiệm giao diện Mobile | Mở hệ thống trên trình duyệt Safari/Chrome trên Smartphone | Giao diện co giãn chuẩn (Responsive), menu navigation mượt mà, không vỡ layout | [ ] Pass / [ ] Fail |

---

### 3.2 Nhóm kịch bản Ban Chủ nhiệm CLB (Role: Club Admin)

| Mã test | Kịch bản kiểm thử | Dữ liệu đầu vào / Thao tác | Kết quả kỳ vọng | Tiêu chí đạt (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- |
| **UAT-ADM-01** | Cập nhật thông tin & ảnh CLB | Thay đổi giới thiệu, số điện thoại, upload Logo và Ảnh bìa mới | Ảnh cập nhật tức thì, hiển thị đúng tỷ lệ, không bị méo | [ ] Pass / [ ] Fail |
| **UAT-ADM-02** | Tạo đợt tuyển thành viên mới | Thiết lập đợt tuyển, tạo 3 câu hỏi tùy chỉnh (Text, Select) | Đợt tuyển chuyển sang trạng thái "Đang mở", sinh viên nhìn thấy trên trang công khai | [ ] Pass / [ ] Fail |
| **UAT-ADM-03** | Duyệt hồ sơ & Chấm điểm ứng viên | Xem chi tiết ứng viên, ghi chú nội bộ, đổi trạng thái sang "Đã duyệt" | Trạng thái cập nhật tức thì; hệ thống gửi thông báo/email tới ứng viên nếu có cấu hình | [ ] Pass / [ ] Fail |
| **UAT-ADM-04** | Xuất dữ liệu ứng viên & Hội viên | Nhấn nút "Xuất CSV" trong Quản lý tuyển dụng và Quản lý hội viên | Tải về file `.csv` định dạng UTF-8; **không bị lỗi font Tiếng Việt**; các công thức nguy hiểm được xử lý an toàn | [ ] Pass / [ ] Fail |
| **UAT-ADM-05** | Quản lý Sự kiện CLB | Tạo sự kiện có giới hạn 50 người tham gia, đính kèm ảnh bìa | Sự kiện hiển thị trên lịch chung; danh sách người tham gia đếm chuẩn xác | [ ] Pass / [ ] Fail |
| **UAT-ADM-06** | Kiểm tra phân quyền liên CLB | Admin CLB A thử truy cập Dashboard hoặc API của CLB B | Hệ thống chặn hoàn toàn với lỗi `403 Forbidden` / Chuyển hướng cảnh báo | [ ] Pass / [ ] Fail |

---

### 3.3 Nhóm kịch bản Ban Quản trị cấp trường (Role: Super Admin)

| Mã test | Kịch bản kiểm thử | Dữ liệu đầu vào / Thao tác | Kết quả kỳ vọng | Tiêu chí đạt (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- |
| **UAT-SA-01** | Nhập danh sách CLB bằng CSV | Tải file mẫu CSV, điền 3 CLB mới, thực hiện Import | Hệ thống thông báo nhập thành công, tạo mới CLB và gán đúng danh mục | [ ] Pass / [ ] Fail |
| **UAT-SA-02** | Phê duyệt trạng thái CLB | Chuyển đổi trạng thái CLB từ `PENDING` sang `ACTIVE` hoặc `INACTIVE` | CLB `ACTIVE` xuất hiện trên trang chủ; CLB `PENDING` / `INACTIVE` bị ẩn khỏi người dùng vãng lai | [ ] Pass / [ ] Fail |
| **UAT-SA-03** | Phân quyền Ban Chủ nhiệm | Chỉ định tài khoản sinh viên X làm `CLUB_ADMIN` cho CLB Y | Tài khoản sinh viên X ngay lập tức có quyền truy cập Dashboard CLB Y | [ ] Pass / [ ] Fail |
| **UAT-SA-04** | Báo cáo & Thống kê toàn trường | Truy cập Dashboard Quản trị, xem tổng số CLB, hội viên, sự kiện | Số liệu thống kê chính xác, biểu đồ trực quan, hỗ trợ trích xuất số liệu phục vụ báo cáo | [ ] Pass / [ ] Fail |

---

## 4. QUY TRÌNH TIẾP NHẬN VÀ XỬ LÝ LỖI (DEFECT TRIAGE)

1. **Phân loại mức độ nghiêm trọng (Severity):**
   - **Critical (P0):** Hệ thống ngừng hoạt động, rò rỉ dữ liệu, lỗi phân quyền truy cập chéo giữa các CLB, không thể đăng nhập/ứng tuyển. Khắc phục trong vòng **4 giờ**.
   - **High (P1):** Chức năng chính hoạt động không đúng, lỗi xuất file CSV, lỗi upload ảnh. Khắc phục trong vòng **24 giờ**.
   - **Medium (P2):** Lỗi giao diện nhỏ, thông báo Tiếng Việt chưa mượt, lỗi hiển thị trên một số kích thước màn hình đặc biệt. Khắc phục trong đợt phát hành tiếp theo.
   - **Low (P3):** Góp ý thẩm mỹ, đề xuất tính năng mới tiện ích hơn. Ghi nhận vào Backlog phiên bản sau.

2. **Kênh tiếp nhận phản hồi:**
   - Phiếu phản hồi điện tử (Google Form / Microsoft Form nội bộ).
   - Nhóm Zalo thử nghiệm UAT do Ban Quản trị dự án trực tiếp hỗ trợ 24/7.

---

## 5. BIỂU MẪU ĐÁNH GIÁ NGHIỆM THU (UAT SIGN-OFF FORM)

```
ĐƠN VỊ THỰC HIỆN KIỂM THỬ: ....................................................
HỌ TÊN NGƯỜI ĐÁNH GIÁ:   ....................................................
VAI TRÒ THỬ NGHIỆM:      [ ] Sinh viên   [ ] Ban Chủ nhiệm CLB   [ ] Quản trị viên
THIẾT BỊ SỬ DỤNG:        [ ] Máy tính (Windows/Mac)  [ ] Điện thoại (iOS/Android)
TRÌNH DUYỆT:             [ ] Chrome      [ ] Safari     [ ] Edge    [ ] Cốc Cốc

KẾT QUẢ ĐÁNH GIÁ CHUNG:
1. Giao diện trực quan, dễ sử dụng:           [ ] Xuất sắc   [ ] Tốt   [ ] Đạt   [ ] Chưa đạt
2. Tốc độ tải trang và phản hồi:              [ ] Nhanh      [ ] Ổn định       [ ] Chậm
3. Mức độ đáp ứng nghiệp vụ CLB tại BAFU:     [ ] Hoàn toàn đáp ứng  [ ] Cần chỉnh sửa thêm
4. Ý kiến đóng góp chi tiết:
   .......................................................................................
   .......................................................................................

KẾT LUẬN NGHIỆM THU:
[ ] ĐỒNG Ý CHO PHÉP TRIỂN KHAI THỬ NGHIỆM (PILOT)
[ ] YÊU CẦU BỔ SUNG / KHẮC PHỤC TRƯỚC KHI TRIỂN KHAI

Chữ ký người kiểm thử: ....................................... Ngày: ...../...../2026
```
