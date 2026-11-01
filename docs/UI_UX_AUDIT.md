# BÁO CÁO KIỂM TOÁN GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX AUDIT)
## Dự án: University Club Portal — BAFU (Trường Đại học Nông - Lâm Bắc Giang)
**Ngày thực hiện:** 27/10/2026  
**Chuyên gia thực hiện:** Principal Product Designer, Senior UI/UX Designer & Accessibility Specialist  
**Mục tiêu:** Nhận diện toàn diện các điểm yếu về thẩm mỹ, bố cục, icon, khả năng tiếp cận và trải nghiệm người dùng hiện tại để xây dựng Design System và tái thiết kế chuyên nghiệp.

---

## 1. TỔNG QUAN HIỆN TRẠNG (EXECUTIVE SUMMARY)

Giao diện hệ thống hiện tại được xây dựng nhanh trong các giai đoạn ban đầu nhằm đáp ứng kiểm thử chức năng (Functional First). Mặc dù toàn bộ 35 API và 30 kịch bản E2E đã vận hành chính xác 100%, mặt giao diện (UI) và trải nghiệm người dùng (UX) còn mang nặng cảm giác của một "bản prototype sinh bởi AI":
- **Màu sắc đơn điệu:** Sử dụng màu xanh dương phổ thông (`#2563eb`) và gradient ngẫu nhiên, thiếu vắng bản sắc sinh viên và nhận diện giáo dục nông lâm hiện đại (Navy & Campus Green).
- **Lạm dụng Emoji làm biểu tượng:** Nhiều màn hình sử dụng emoji (`👑`, `⚡`, `🎓`, `📄`, `🔍`, `🎉`) thay cho vector icon chuẩn, gây cảm giác thiếu chuyên nghiệp trong môi trường đại học.
- **Bố cục trang thiếu phân cấp thị giác:** Khoảng trắng (whitespace) chưa đồng đều, container có kích thước cố định gây thô ráp trên màn hình rộng (> 1440px) và chật chội trên mobile.
- **Xử lý logo và ảnh câu lạc bộ sơ sài:** Fallback logo chỉ cắt lấy ký tự thứ 4 ngẫu nhiên (`club.name.charAt(4) || 'C'`), dẫn đến các chữ cái kỳ quặc hoặc lỗi hiển thị tiếng Việt có dấu.
- **Trải nghiệm bảng dữ liệu trên thiết bị di động:** Bảng dữ liệu tại Club Admin và Super Admin chỉ dùng `overflow-x-auto` đơn thuần, khiến sinh viên và cán bộ quản trị phải cuộn ngang dài trên smartphone, dễ bấm nhầm nút duyệt/từ chối.

---

## 2. CHI TIẾT CÁC ĐIỂM YẾU THEO TỪNG MÀN HÌNH (DETAILED FINDINGS)

### 2.1 Header & Navigation (`Navbar.jsx`)
- **Logo trường đại học:** Sử dụng hộp vuông màu xanh với ký tự đơn "B" chưa mang tính biểu tượng học thuật; thiếu liên kết sâu tới trang trường BAFU.
- **Menu điều hướng:** Chỉ có 3 liên kết cơ bản ("Trang chủ", "Khám phá CLB", "Sự kiện"), thiếu các liên kết hữu ích cho tân sinh viên như "Hướng dẫn nộp hồ sơ", "Về BAFU".
- **Dropdown tài khoản:** Menu mở ra chỉ có viền mỏng, thiếu phân khu rõ ràng giữa vai trò Sinh viên, Ban chủ nhiệm và Quản trị viên cấp trường.
- **Mobile Menu:** Chưa có drawer/hamburger hoàn chỉnh; thanh điều hướng bị co cụm trên màn hình nhỏ dưới 640px.

### 2.2 Trang chủ (`HomePage.jsx`)
- **Hero Section:** Sử dụng gradient xanh truyền thống `gradient-hero` với độ tương phản văn bản chưa tối ưu; phần mô tả tĩnh thiếu hình ảnh trực quan thể hiện đời sống câu lạc bộ sinh viên sôi nổi.
- **Thanh tìm kiếm:** Bị đẩy sâu xuống bên dưới hoặc không xuất hiện tại vị trí trọng tâm của Hero, làm giảm tốc độ tiếp cận của tân sinh viên.
- **Thẻ danh mục (Categories):** Icon danh mục dùng chung hoặc thiếu đa dạng; hover effect chỉ đổi màu đơn giản.
- **Quy trình 4 bước:** Các hộp số 1, 2, 3, 4 còn mang phong cách bài giảng lý thuyết, thiếu micro-animations và đường nối timeline chỉ dẫn trực quan.

### 2.3 Trang danh sách & Chi tiết CLB (`ClubsPage.jsx` & `ClubDetailPage.jsx`)
- **Bộ lọc (Filter Bar):** Nút chọn chuyên mục nằm ngang dễ bị tràn; thiếu chỉ số đếm số lượng CLB theo từng phân loại (ví dụ: Học thuật (3), Thể thao (2)).
- **Empty State:** Dùng emoji kính lúp `🔍` thô sơ trong trang `ClubsPage.jsx`.
- **Card CLB:** Tỷ lệ ảnh cover chưa chuẩn 16:9; logo đè lên tiêu đề; thiếu thông tin phân biệt giữa CLB đã duyệt chính thức và CLB thử nghiệm.
- **Form ứng tuyển động:** Form dài một trang không có thanh tiến trình (progress indicator), thiếu hiển thị preview tệp đã đính kèm, thông báo lỗi trường bắt buộc chưa đủ nổi bật.

### 2.4 Cổng sinh viên (`StudentDashboard.jsx`)
- **Header người dùng:** Avatar fallback chỉ có một ký tự; thiếu các thống kê nhanh: "Số CLB đã gia nhập", "Số đơn đang chờ", "Số sự kiện sắp tới".
- **Trạng thái xét duyệt:** Dùng chuỗi văn bản đơn giản kèm emoji `🎉 Đã trúng tuyển`, chưa có timeline trực quan (Nộp đơn ➔ Phỏng vấn ➔ Quyết định).
- **Tab sự kiện:** Danh sách sự kiện đã đăng ký nằm chung khiến trang bị dài, thiếu nút đồng bộ lịch (Add to Calendar) hoặc thông tin phòng/hội trường chi tiết.

### 2.5 Bảng điều khiển Ban Chủ nhiệm (`ClubAdminDashboard.jsx`)
- **Điều hướng Tabs:** Sử dụng tab gạch chân đơn điệu; khi chuyển qua lại giữa Xét duyệt, Hội viên, Mở đợt tuyển và Sự kiện không có cảm giác một Dashboard SaaS chuyên nghiệp.
- **Bảng ứng viên:** Thiếu thao tác hàng loạt (Batch actions); bảng không responsive trên mobile.
- **Bộ lọc trạng thái:** Dropdown mặc định của trình duyệt chưa phong cách hóa, khó thao tác trên màn hình cảm ứng.

### 2.6 Bảng điều khiển Quản trị cấp trường (`SuperAdminDashboard.jsx`)
- **Chức năng nhập CSV:** Giao diện tải file và duyệt trạng thái CLB nằm dàn trải, thiếu khu vực Drag-and-drop trực quan cho tệp CSV.
- **KPI Cards:** Các chỉ số toàn trường (Tổng CLB, Tổng đơn, Tổng hội viên) còn đơn giản, thiếu tỷ lệ tăng trưởng và biểu đồ xu hướng.

### 2.7 Màn hình Đăng nhập & Đăng ký (`LoginPage.jsx` & `RegisterPage.jsx`)
- **Tài khoản chạy thử:** Khối "Tài khoản mẫu" với các emoji `👑`, `⚡`, `🎓` chiếm diện tích lớn, gây nhầm lẫn là giao diện đồ chơi/demo thay vì cổng thông tin chính thức của nhà trường.
- **Password Visibility:** Chưa có nút bấm ẩn/hiện mật khẩu (Eye / EyeOff).
- **Validation:** Báo lỗi dưới dạng alert đỏ toàn bộ mà chưa chỉ rõ từng input bị sai.

---

## 3. ĐỊNH HƯỚNG GIẢI PHÁP TÁI THIẾT KẾ (REDESIGN ROADMAP)

1. **Chuẩn hóa Design Tokens (Campus Modern + Premium SaaS):**
   - Bộ màu thương hiệu giáo dục hiện đại: **Deep Navy (`#142B49`)**, **Campus Green (`#167C66`)**, **Warm Amber (`#F3B846`)**, nền sáng tự nhiên **`#F8FAFC`**, viền sắc nét **`#E2E8F0`**.
   - Phông chữ chuẩn Quốc tế & Tiếng Việt: **Be Vietnam Pro** với đầy đủ phân cấp H1 -> H6, Body, Caption.
2. **Loại bỏ 100% Emoji chức năng:** Thay thế bằng trọn bộ **Lucide Icons** chuẩn SVG (stroke-width 1.75 - 2, kích thước 16 - 20px).
3. **Xây dựng Thư viện Reusable Components (`frontend/src/components/ui/`):**
   - `Button`, `Input`, `Card`, `Badge`, `Modal`, `Tabs`, `Table`, `Skeleton`, `EmptyState`, `ClubLogo`.
4. **Tối ưu trải nghiệm Mobile-First:**
   - Chuyển đổi bảng dữ liệu ứng viên sang dạng Thẻ thông tin rút gọn (Candidate Card) trên màn hình dưới 768px.
   - Thêm Drawer Menu cho thanh điều hướng di động.
5. **Cải thiện tính minh bạch & Tương tác:**
   - Visual timeline cho quy trình xét duyệt hồ sơ.
   - Micro-interactions mượt mà trên hover và active states.
