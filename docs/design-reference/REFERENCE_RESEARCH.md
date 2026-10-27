# NGHIÊN CỨU THIẾT KẾ THỰC TẾ (REAL-WORLD REFERENCE RESEARCH)
**Dự án:** Cổng Thông Tin Câu Lạc Bộ Sinh Viên — Đại Học Nông - Lâm Bắc Giang (BAFU Club Portal)  
**Tác giả:** Principal UI/UX Designer & Senior React Frontend Engineer  
**Ngày thực hiện:** 27/10/2026  

---

## 1. REFERENCE A — CAMPUSGROUPS (Ready Education)
- **URL nghiên cứu:** `https://www.campusgroups.com/`
- **Mục đích:** Nghiên cứu hệ thống gắn kết sinh viên (Student Engagement Platform), cấu trúc gắn kết cộng đồng học đường, hành trình tham gia câu lạc bộ và quản lý sự kiện.
- **Những màn hình/module ghi nhận được:**
  - Trang chủ giới thiệu giải pháp Campus Life & Student Journeys.
  - Phân hệ Clubs & Groups Management (quản lý tổ chức sinh viên).
  - Module Event Management & Check-in (lịch sinh hoạt, sự kiện trường).
  - Integrated Student Dashboard (trung tâm điều khiển tích hợp cho người học).
- **Pattern cụ thể cần học:**
  - **Student-First Information Hierarchy:** Đặt sinh viên làm trung tâm. Màn hình khám phá hướng thẳng tới câu hỏi: "Tôi có thể tham gia những gì hôm nay?" thay vì biến trang chủ thành một bảng số liệu quản trị khô khan.
  - **Activity & Journey Badges:** Sử dụng nhãn trạng thái sinh hoạt và huy hiệu theo từng mốc (Đang mở tuyển, Đã tham gia, Ban chủ nhiệm).
  - **Campus Event Cards:** Thẻ sự kiện phân rõ thời gian, địa điểm, CLB chủ trì và hình thức tham gia.
- **Pattern không phù hợp cần bỏ qua:**
  - Các khối quảng cáo B2B dành cho phòng quản lý sinh viên của các trường đại học quốc tế (Enterprise sales pitches, ROI statistics).
  - Bố cục giới thiệu phần mềm SaaS bán hàng.
- **Cách áp dụng riêng cho BAFU:**
  - Áp dụng vào **HomePage**: Hero mang phong cách Campus Editorial kết hợp ảnh hoạt động thực tế của sinh viên nông - lâm, tách biệt riêng khối đợt tuyển sinh hoạt và dải danh mục.
  - Áp dụng vào **StudentDashboard**: Bố cục "My Campus Journey" với thẻ thành viên CLB, lịch sinh hoạt sắp tới và tiến trình xét duyệt hồ sơ.

---

## 2. REFERENCE B — UNIVERSITY OF IOWA ENGAGE (Campus Labs Engage)
- **URL nghiên cứu:** `https://uiowa.campuslabs.com/engage/`
- **Mục đích:** Nghiên cứu giao diện tìm kiếm tổ chức sinh viên thực tế tại một trường đại học công lập quy mô lớn.
- **Những màn hình/module ghi nhận được:**
  - Discovery Bar: Thanh tìm kiếm tổ chức sinh viên toàn trường kết hợp bộ lọc danh mục.
  - Organization Directory: Lưới tổ chức sinh viên với ảnh bìa (cover photo), logo avatar và mô tả súc tích.
  - Organization Detail View: Trang thông tin tổ chức với cover banner, BCN, lịch họp định kỳ, quy trình đăng ký tham gia (Join Organization / Apply).
- **Pattern cụ thể cần học:**
  - **Tìm kiếm trực diện:** Thanh search lớn với placeholder trực quan ("Tìm kiếm câu lạc bộ theo tên, lĩnh vực hoặc từ khóa...").
  - **Thẻ tổ chức sinh động:** Ảnh cover tỷ lệ 16:9 sắc nét, logo avatar nổi trên ranh giới cover/body, phân loại lĩnh vực rõ ràng (Học thuật, Thể thao, Văn nghệ...).
  - **Tab điều hướng trang chi tiết:** Giới thiệu tổng quan, Ban chủ nhiệm, Lịch sinh hoạt định kỳ, Đợt tuyển thành viên và Thư viện hoạt động.
- **Pattern không phù hợp cần bỏ qua:**
  - Bố cục font chữ quá cũ của hệ thống Campus Labs cũ (Font Awesome 4.7, giao diện kiểu web 2015).
  - Không gian trắng quá thưa thớt, thiếu micro-interactions hiện đại.
- **Cách áp dụng riêng cho BAFU:**
  - Áp dụng vào **ClubsPage**: Lưới thẻ CLB 3 cột desktop / 2 cột tablet / 1 cột mobile với search bar dài, bộ lọc danh mục tương tác nhanh và toggle "Chỉ xem CLB đang mở tuyển".
  - Áp dụng vào **ClubDetailPage**: Banner nhận diện, card đợt tuyển nổi bật với chỉ tiêu, hạn nộp và nút ứng tuyển trực tiếp.

---

## 3. REFERENCE C — SHADCN/UI DASHBOARD (dashboard-01, sidebar-07)
- **URL nghiên cứu:** `https://ui.shadcn.com/blocks?category=dashboard`
- **Mục đích:** Nghiên cứu cấu trúc dashboard quản trị chuẩn công nghiệp hiện đại, sạch sẽ và nhất quán.
- **Những component & pattern cụ thể cần học:**
  - **Collapsible Sidebar (sidebar-07):** Phân cấp điều hướng rõ ràng, icon nhất quán (20px), active state tinh tế với nền subtle accent, footer hiển thị user avatar & menu popup.
  - **Sticky Header & Breadcrumbs:** Header mỏng (64px) cố định, breadcrumb thể hiện vị trí phân cấp rõ ràng, nút thao tác nhanh (Quick actions).
  - **KPI Cards:** Tối đa 4 chỉ số quan trọng ở hàng trên cùng (Tổng đơn, Chờ duyệt, Hội viên, Đợt tuyển), số liệu lớn tương phản cao kết hợp icon biểu thị ngữ nghĩa.
  - **Structured Data Tables:** Bảng dữ liệu có header tinh giản, khoảng cách dòng hợp lý, trạng thái badge màu trung tính trang nhã (không lòe loẹt), hành động theo từng dòng (Row actions menu).
- **Pattern không phù hợp cần bỏ qua:**
  - Phong cách Dark mode đen tuyệt đối (pure black `#09090b`) vốn chỉ phù hợp với developer tools, không phù hợp với không gian giáo dục đại học.
  - Bảng số liệu tài chính / MRR / Revenue không liên quan đến sinh viên.
- **Cách áp dụng riêng cho BAFU:**
  - Áp dụng vào **ClubAdminDashboard** và **SuperAdminDashboard**: Giữ nguyên triết lý spacing 4/8px, sidebar phân cấp rõ ràng (Tổng quan, Hồ sơ, Hội viên, Đợt tuyển, Sự kiện, Thư viện ảnh, Báo cáo), bảng dữ liệu ứng viên có sheet xét duyệt chi tiết.

---

## 4. REFERENCE D — SHADCN/UI AUTHENTICATION (login-02)
- **URL nghiên cứu:** `https://ui.shadcn.com/blocks/login`
- **Mục đích:** Nghiên cứu cấu trúc trang đăng nhập 2 cột hiện đại.
- **Pattern cụ thể cần học:**
  - **Split-Screen Layout (50/50 hoặc 45/55):**
    - Cột 1 (Brand Storytelling): Nền màu thương hiệu đậm (Navy `#142B49`), wordmark nhận diện trường, thông điệp truyền cảm hứng, trích dẫn hoặc số liệu nổi bật.
    - Cột 2 (Auth Form): Form màu trắng tối giản, nhãn rõ ràng, input field có icon hỗ trợ (Mail, Lock), nút primary action kích thước chuẩn, link đăng ký và điều hướng phụ.
  - **Mobile Responsive:** Trên màn hình di động (`<= 768px`), tự động ẩn cột thương hiệu phụ, giữ lại form đăng nhập tinh giản, căn giữa, không có khoảng trắng thừa.
- **Pattern không phù hợp cần bỏ qua:**
  - Giữ nguyên placeholder "Acme Inc." hoặc các thành phần demo của shadcn.
- **Cách áp dụng riêng cho BAFU:**
  - Đã triển khai vào **LoginPage**: Sử dụng nhận diện BAFU Club Portal, màu Navy `#142B49` kết hợp điểm nhấn vàng hổ phách `#F3B846`, bảo đảm zero demo credentials trong production bundle.

---

## 5. REFERENCE E — LINEAR UI REDESIGN
- **URL nghiên cứu:** `https://linear.app/now/how-we-redesigned-the-linear-ui`
- **Mục đích:** Nghiên cứu triết lý giảm thiểu visual noise, tối ưu mật độ thông tin (information density) và nâng cao khả năng thao tác trên dữ liệu.
- **Pattern cụ thể cần học:**
  - **Giảm Visual Noise:** Loại bỏ các đường viền dày và đổ bóng nặng hạt; sử dụng ranh giới tinh tế (`border-slate-200 / border-[#E2E8F0]`).
  - **Tab Navigation & Density:** Tab phẳng có gạch chân active mỏng (`h-0.5`), khoảng cách đệm chuẩn xác, không dùng các nút bấm dạng pill cồng kềnh trong dashboard.
  - **Direct Data Action:** Thao tác đổi trạng thái (chức vụ hội viên, duyệt đơn) có phản hồi tức thì với feedback rõ ràng.
- **Pattern không phù hợp cần bỏ qua:**
  - Phím tắt bàn phím nâng cao dành riêng cho lập trình viên (Vim-like navigation), không thực tế với đối tượng người dùng sinh viên đại trà.
- **Cách áp dụng riêng cho BAFU:**
  - Áp dụng vào bảng danh sách ứng viên và bảng hội viên của **Club Admin**: Trình bày thông tin tinh gọn, trạng thái rõ ràng, thao tác duyệt đơn / đổi chức vụ thuận tiện.

---

## 6. TỔNG HỢP NGUYÊN TẮC THIẾT KẾ CHO BAFU CLUB PORTAL

1. **Bảng màu chủ đạo (Campus Palette):**
   - **Navy:** `#142B49` (Màu chính của thương hiệu BAFU, tạo cảm giác tin cậy, vững chãi).
   - **Emerald Green:** `#167C66` (Màu đại diện cho nông nghiệp, sinh thái, tuổi trẻ sinh viên).
   - **Amber Gold:** `#F3B846` (Màu điểm nhấn cho các đợt tuyển và thành tựu).
   - **Canvas Background:** `#F8FAFC` (Nền sáng nhẹ dịu mắt).
   - **Surface Card:** `#FFFFFF` (Bề mặt thẻ trắng sạch sẽ).
   - **Border:** `#E2E8F0` (Đường viền mảnh, không lem màu).

2. **Hệ thống Icon duy nhất: Phosphor Icons (`@phosphor-icons/react`):**
   - Không sử dụng emoji trong UI.
   - Thống nhất các biến thể: `weight="regular"` cho thao tác/menu, `weight="duotone"` cho danh mục/minh họa, `weight="fill"` cho trạng thái kích hoạt.

3. **Typography: Be Vietnam Pro:**
   - Hỗ trợ tiếng Việt toàn diện, dấu thanh chuẩn mực, font-weight từ 400 đến 700.
