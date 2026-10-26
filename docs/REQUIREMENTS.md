# UNIVERSITY CLUB PORTAL — BẢNG ĐẶC TẢ YÊU CẦU NGHIỆP VỤ (REQUIREMENTS SPECIFICATION)

## 1. Giới thiệu tổng quan
Hệ thống **University Club Portal (Web_GT-CLB)** là cổng thông tin trực tuyến tập trung quản lý toàn bộ các Câu lạc bộ (CLB) sinh viên trong trường đại học (Trường Đại học Nông - Lâm Bắc Giang / BAFU và các mô hình trường đại học tương tự). Hệ thống giải quyết bài toán phân mảnh thông tin, số hóa 100% quy trình tuyển thành viên từ khâu mở đợt tuyển, thiết lập form câu hỏi động, tiếp nhận đơn, chấm điểm duyệt đơn đến cấp tư cách hội viên tự động qua transaction an toàn.

---

## 2. Các nhóm người dùng & Phân quyền (RBAC)

### 2.1. GUEST (Khách vãng lai / Sinh viên chưa đăng nhập)
- Xem Landing Page với thông số thống kê tổng hợp thực tế.
- Khám phá danh sách CLB, tìm kiếm theo từ khóa, lọc theo lĩnh vực/danh mục (Thể thao, Học thuật, Tình nguyện, Nghệ thuật...).
- Xem trang chi tiết CLB (thông tin ban chủ nhiệm, hình ảnh, hoạt động nổi bật, lịch sinh hoạt, các đợt tuyển đang mở).
- Xem tin tức, sự kiện công khai của CLB.
- Đăng ký tài khoản và đăng nhập vào hệ thống.

### 2.2. STUDENT (Sinh viên đã xác thực)
- Quản lý hồ sơ cá nhân: Họ tên, Mã sinh viên, Lớp, Khoa/Viện, Niên khóa, Email, Số điện thoại, Kỹ năng, Sở thích, Tiểu sử (Bio), Ảnh đại diện.
- Nộp hồ sơ ứng tuyển vào các đợt tuyển đang mở của bất kỳ CLB nào:
  - Trả lời bộ câu hỏi động (Short text, Long text, Single choice, Multiple choice, Date, Number, URL).
  - Không thể nộp trùng hồ sơ đang hoạt động trong cùng 1 đợt tuyển.
  - Rút hồ sơ khi đơn còn ở trạng thái cho phép.
  - Cập nhật, bổ sung thông tin khi có yêu cầu `NEED_MORE_INFO` từ BCN.
- Theo dõi kết quả xét tuyển trực tuyến theo thời gian thực (DRAFT, SUBMITTED, UNDER_REVIEW, NEED_MORE_INFO, ACCEPTED, REJECTED, WITHDRAWN).
- Khi hồ sơ được duyệt `ACCEPTED`, tự động trở thành `CLUB_MEMBER` của CLB đó.
- Xem danh sách các CLB mình đang tham gia.
- Đăng ký tham gia các sự kiện do các CLB tổ chức.
- Nhận thông báo trong hệ thống về trạng thái đơn và sự kiện.

### 2.3. CLUB_MEMBER (Hội viên chính thức của CLB cụ thể)
- Quyền trong phạm vi CLB tham gia:
  - Xem danh sách thành viên nội bộ, ban điều hành.
  - Xem và đăng ký các hoạt động, buổi sinh hoạt nội bộ của CLB.
  - Nhận thông báo nội bộ từ Ban chủ nhiệm.

### 2.4. CLUB_ADMIN (Ban chủ nhiệm của CLB cụ thể)
- Quyền quản trị scoped trong CLB được phân công:
  - Quản lý trang giới thiệu CLB: Cập nhật thông tin, logo, ảnh bìa, liên hệ, lịch sinh hoạt thường kỳ.
  - Quản lý đợt tuyển thành viên:
    - Tạo đợt tuyển mới: Tiêu đề, mô tả, ngày bắt đầu, ngày kết thúc, số lượng chỉ tiêu.
    - Cấu hình bộ câu hỏi động (ApplicationForm & FormQuestions) với các loại input, bắt buộc/không bắt buộc, thứ tự hiển thị.
    - Đóng/Mở/Lưu nháp đợt tuyển.
  - Quản lý hồ sơ ứng tuyển:
    - Lọc theo đợt tuyển, trạng thái, tìm kiếm ứng viên.
    - Xem chi tiết câu trả lời, ghi chú đánh giá nội bộ (Internal Notes - ẩn với sinh viên).
    - Cập nhật trạng thái: Duyệt (`ACCEPTED`), Từ chối (`REJECTED`), Yêu cầu bổ sung (`NEED_MORE_INFO`).
    - *Nguyên tắc bảo đảm:* Khi `ACCEPTED`, hệ thống dùng Transaction kích hoạt `ClubMembership` tự động, ghi Audit Log và bắn Notification.
  - Quản lý danh sách thành viên: Xem danh sách, cập nhật chức vụ nội bộ (Trưởng ban, Phó ban, Thành viên...), xóa hội viên nếu vi phạm.
  - Đăng tải bài viết tin tức, thông báo và tạo sự kiện cho CLB.
  - Xem thống kê hoạt động của CLB (Số lượng thành viên, số lượng đơn ứng tuyển theo đợt, tỷ lệ trúng tuyển).

### 2.5. SUPER_ADMIN (Quản trị viên toàn hệ thống / Đoàn trường - Hội sinh viên)
- Quản lý danh mục lĩnh vực CLB (ClubCategory: Thể thao, Học thuật, Tình nguyện, Văn nghệ...).
- Quản lý toàn bộ danh sách CLB trong trường: Tạo mới, phê duyệt đề xuất thành lập CLB, kích hoạt/tạm khóa CLB.
- Phân quyền Ban chủ nhiệm (`CLUB_ADMIN`) cho người dùng đối với từng CLB cụ thể.
- Quản lý người dùng: Xem danh sách, khóa/mở tài khoản, gán quyền toàn hệ thống.
- Xem Dashboard toàn trường: Tổng số CLB, tổng số thành viên, số đợt tuyển đang diễn ra, tổng hồ sơ, biểu đồ phân bố theo lĩnh vực.
- Xem Audit Log ghi nhận các hành động quan trọng trên hệ thống.

---

## 3. Quy tắc nghiệp vụ cốt lõi (Business Rules)
1. **Nguyên tắc kích hoạt hội viên:** Sinh viên nộp đơn chỉ là ứng viên (`Application`). Chỉ khi BCN ấn duyệt `ACCEPTED`, hệ thống mới chạy transaction atomic tạo bản ghi `ClubMembership` hợp lệ, gán quyền `CLUB_MEMBER`.
2. **Chống trùng lặp:** 
   - 1 sinh viên không thể nộp 2 đơn đang hoạt động (không tính trạng thái WITHDRAWN/REJECTED) trong cùng 1 `RecruitmentCampaign`.
   - 1 sinh viên không thể có 2 membership trùng lặp trong cùng 1 CLB (bảo đảm bằng Unique Constraint `(userId, clubId)`).
3. **Bảo toàn dữ liệu ứng tuyển:** Dữ liệu câu trả lời của ứng viên được liên kết chặt chẽ và snapshot câu hỏi tại thời điểm ứng tuyển để việc chỉnh sửa form sau này không làm sai lệch đơn cũ.
4. **Phân quyền nghiêm ngặt (Tenant Isolation per Club):** Club Admin CLB A tuyệt đối không thể xem, sửa hoặc xóa dữ liệu của CLB B. Backend kiểm tra quyền trực tiếp tại tầng service/middleware, không tin tưởng tham số do client gửi.
5. **Đợt tuyển quá hạn:** Không cho phép nộp đơn khi chiến dịch đã đóng hoặc qua ngày `endDate`.
