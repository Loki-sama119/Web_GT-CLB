# BAFU — BÁO CÁO XÁC MINH NHẬN DIỆN THƯƠNG HIỆU & OFFICIAL LOGO INTEGRATION

**Đại Học Nông - Lâm Bắc Giang (BAFU) — University Club Portal**  
**Ngày lập báo cáo:** 27/10/2026  
**Chuyên gia thực hiện:** Brand Assets Specialist, React Frontend Engineer & Database Reliability Engineer  
**Trạng thái tuân thủ:** Tuân thủ nghiêm ngặt nguyên tắc KHÔNG giả lập logo AI, bảo vệ bản quyền thương hiệu, phân quyền Club Admin tự chủ và bảo toàn tính toàn vẹn hệ thống.

---

## 1. TỔNG QUAN XÁC MINH & CHÍNH SÁCH BẢN QUYỀN

Theo yêu cầu chuẩn hóa nhận diện thương hiệu số cho hệ thống Cổng thông tin CLB BAFU:
1. **Không tự tạo logo AI:** Tuyệt đối không dùng mô tả văn bản để sinh ảnh AI rồi gán mác "Logo chính thức".
2. **Xác minh trực tiếp:** Kiểm tra hạ tầng kỹ thuật từ các đường dẫn Fanpage chính thức của các CLB BAFU.
3. **Quy tắc pháp lý & Bảo mật mạng xã hội:**
   - Facebook áp dụng cơ chế bảo vệ checkpoint / anti-scraping (`unsupportedBrowser` & yêu cầu đăng nhập đối với crawlers tải ảnh trực tiếp không có phiên).
   - Website tuân thủ quy tắc không dùng phương thức vượt rào trái phép (illegal scraping / unauthorized bypass).
   - Hệ thống ghi nhận trạng thái xác minh Fanpage là **VERIFIED**, trạng thái tệp logo gốc là **PENDING_OFFICIAL_ASSET (Chờ Ban Chủ Nhiệm bàn giao tệp vector/PNG độ nét cao)**.
4. **Cơ chế hiển thị thông minh:**
   - Khi có logo hợp lệ: Hiển thị ảnh logo chuẩn 1:1, giữ nền trong suốt nếu có.
   - Khi chưa có tệp hoặc tệp tải lỗi: Kích hoạt fallback **Monogram thông minh** (lấy 2 chữ cái đại diện, gradient màu sắc chuẩn theo lĩnh vực hoạt động, không dùng icon Phosphor thay logo).
   - **Tự chủ cho Ban Chủ Nhiệm:** Cung cấp tính năng tải ảnh logo trực tiếp tại `ClubAdminDashboard` với bảo mật RBAC, cho phép Club Admin tự cập nhật logo chính thức của CLB mình mà không ảnh hưởng tới CLB khác.

---

## 2. BẢNG CHI TIẾT XÁC MINH 3 CÂU LẠC BỘ ƯU TIÊN

### 2.1. CLB Tình Nguyện Xanh Sinh Viên BAFU

| Tiêu chí | Chi tiết ghi nhận |
| :--- | :--- |
| **Tên CLB trong hệ thống** | CLB Tình Nguyện Xanh Sinh Viên BAFU |
| **Mã định danh (Slug)** | `clb-tinh-nguyen-xanh` |
| **Fanpage chính thức** | [Facebook Fanpage CLB Tình Nguyện Xanh](https://www.facebook.com/p/CLB-T%C3%ACnh-Nguy%E1%BB%87n-Xanh-Tr%C6%B0%E1%BB%9Dng-%C4%90%E1%BA%A1i-h%E1%BB%8Dc-N%C3%B4ng-L%C3%A2m-B%E1%BA%AFc-Giang-61552769437618/) |
| **Mô tả nhận diện tham khảo** | Mầm cây xanh, dải ruy băng và biểu trưng hoạt động thanh niên tình nguyện BAFU |
| **Trạng thái Fanpage** | **VERIFIED (HTTP 200)** — Title: `CLB Tình Nguyện Xanh Trường Đại học Nông - Lâm Bắc Giang \| Bac Giang` |
| **Trạng thái xác minh Logo** | **PENDING_OFFICIAL_ASSET** — Đã ghi nhận đường dẫn Fanpage vào Database; chờ Ban Chủ Nhiệm CLB cung cấp file PNG/SVG chính thức chất lượng cao |
| **Trạng thái quyền sử dụng** | **PENDING_CONFIRMATION** — Cần Ban Chủ Nhiệm xác nhận bản quyền nội bộ khi bàn giao file |
| **Tên tệp chuẩn hóa quy hoạch** | `frontend/public/images/clubs/tinh-nguyen-xanh-logo.png` |
| **Cơ chế hiển thị hiện tại** | Monogram `TX` trên gradient xanh lục tình nguyện (`from-[#167C66] to-[#259A80]`), viền border sắc nét, không bị méo |
| **Vị trí hiển thị** | `HomePage.jsx` (Cards), `ClubsPage.jsx` (Directory), `ClubDetailPage.jsx` (Header & Sidebar), `ClubAdminDashboard.jsx`, `SuperAdminDashboard.jsx` |

---

### 2.2. CLB Máu Nông Lâm Bắc Giang (CLB Hiến Máu Tình Nguyện BAFU)

| Tiêu chí | Chi tiết ghi nhận |
| :--- | :--- |
| **Tên CLB trong hệ thống** | CLB Hiến Máu Tình Nguyện BAFU |
| **Mã định danh (Slug)** | `clb-hien-mau-tinh-nguyen` |
| **Xác minh đối chiếu thực thể** | **KHẲNG ĐỊNH CÙNG MỘ TỔ CHỨC:** Bản ghi "CLB Hiến Máu Tình Nguyện BAFU" trong database chính là CLB Máu Nông Lâm Bắc Giang (`@maubafu`). Hệ thống không tạo bản ghi trùng lặp, bảo toàn toàn bộ dữ liệu hiện có |
| **Fanpage chính thức** | [https://www.facebook.com/maubafu/](https://www.facebook.com/maubafu/) |
| **Mô tả nhận diện tham khảo** | Lá xanh kết hợp trái tim đỏ nhân đạo và chữ LIFE |
| **Trạng thái Fanpage** | **VERIFIED (HTTP 200)** — Title: `CLB Máu Nông Lâm Bắc Giang` |
| **Trạng thái xác minh Logo** | **PENDING_OFFICIAL_ASSET** — Đã liên kết fanpageUrl vào CSDL; chờ BCN gửi tệp logo gốc chuẩn không viền khung avatar sự kiện |
| **Trạng thái quyền sử dụng** | **PENDING_CONFIRMATION** — Chờ văn bản/tin nhắn xác nhận bàn giao nhận diện từ Ban Chủ Nhiệm CLB Máu |
| **Tên tệp chuẩn hóa quy hoạch** | `frontend/public/images/clubs/mau-bafu-logo.png` |
| **Cơ chế hiển thị hiện tại** | Monogram `HM` trên nền gradient nhận diện tình nguyện xã hội, tự động kích hoạt logo PNG khi BCN upload |
| **Vị trí hiển thị** | `HomePage.jsx`, `ClubsPage.jsx`, `ClubDetailPage.jsx`, `ClubAdminDashboard.jsx`, `SuperAdminDashboard.jsx` |

---

### 2.3. CLB Tin Học IT BAFU (CLB Lập Trình & Công Nghệ BAFU Tech)

| Tiêu chí | Chi tiết ghi nhận |
| :--- | :--- |
| **Tên CLB trong hệ thống** | CLB Lập Trình & Công Nghệ BAFU Tech |
| **Mã định danh (Slug)** | `clb-lap-trinh-bafu-tech` |
| **Xác minh đối chiếu thực thể** | CLB Tin Học IT BAFU hoạt động với tư cách đơn vị công nghệ nòng cốt BAFU Tech, đồng bộ trang Fanpage IT BAFU chính thức |
| **Fanpage chính thức** | [https://www.facebook.com/Clbtinhocitbafu/](https://www.facebook.com/Clbtinhocitbafu/) |
| **Mô tả nhận diện tham khảo** | Biểu tượng robot công nghệ, kiểu dáng huy hiệu tròn, thông điệp Code The Future |
| **Trạng thái Fanpage** | **VERIFIED (HTTP 200)** — Title: `CLB Tin Học - Nông Lâm Bắc Giang` |
| **Trạng thái xác minh Logo** | **PENDING_OFFICIAL_ASSET** — Sẵn sàng tích hợp file `it-bafu-logo.png`; đã trang bị tính năng cho Club Admin tự upload logo trực tiếp qua giao diện quản trị |
| **Trạng thái quyền sử dụng** | **PENDING_CONFIRMATION** — Chờ Ban Chủ Nhiệm IT BAFU bàn giao file vector nguồn |
| **Tên tệp chuẩn hóa quy hoạch** | `frontend/public/images/clubs/it-bafu-logo.png` |
| **Cơ chế hiển thị hiện tại** | Monogram `LT` trên gradient học thuật công nghệ (`from-[#142B49] to-[#1E4B7A]`), hiển thị hoàn hảo ở mọi độ phân giải |
| **Vị trí hiển thị** | `HomePage.jsx`, `ClubsPage.jsx`, `ClubDetailPage.jsx`, `ClubAdminDashboard.jsx`, `SuperAdminDashboard.jsx` |

---

## 3. TÍCH HỢP HỆ THỐNG & ĐỒNG BỘ CSDL POSTGRESQL

1. **Bảo tồn CSDL:**
   - Không chạy seed phá hủy, không drop table hoặc reset database.
   - Trường `fanpageUrl` đã được đồng bộ chính xác trên cả 2 cơ sở dữ liệu `club_portal_db` (dữ liệu demo thực tế) và `club_portal_e2e` (môi trường kiểm thử tự động).
   - Kiểm tra API Backend: Route `POST /api/v1/clubs/:clubId/logo` và `POST /api/v1/clubs/:clubId/cover` đã hoạt động hoàn chỉnh, có xác thực JWT, RBAC phân quyền `requireClubAdmin(req => req.params.clubId)` và giới hạn dung lượng upload 2MB.

2. **Frontend UI Integration:**
   - **`ClubLogo.jsx`**: Nâng cấp với `useState` và `onError` reactive handler. Nếu có `logoUrl`, hiển thị ảnh thật với tỉ lệ 1:1, `object-cover`. Nếu ảnh bị lỗi 404 hoặc mạng hỏng, tự động chuyển về monogram fallback mềm mại mà không làm vỡ layout.
   - **`ClubDetailPage.jsx`**: Bổ sung hiển thị nút liên kết Fanpage Facebook chính thức có icon `FacebookLogo` màu xanh thương hiệu, mở tab mới an toàn với `rel="noopener noreferrer"`.
   - **`ClubAdminDashboard.jsx`**: Tích hợp khối hiển thị logo CLB kèm nút tải ảnh nhanh (camera icon) cho phép Club Admin tải lên logo mới của CLB mình bất cứ lúc nào.
   - **`SuperAdminDashboard.jsx`**: Bổ sung cột logo nhỏ (`size="sm"`) bên cạnh tên câu lạc bộ trong bảng Quản lý & Phê duyệt CLB toàn trường.

---

## 4. KẾT QUẢ KIỂM THỬ HỆ THỐNG

| Hạng mục kiểm thử | Công cụ | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Backend Unit & API Integration** | Vitest (35 Test Cases) | **35/35 PASS (100%)** | Chạy trên DB cô lập `club_portal_test` |
| **End-to-End Regression Suite** | Playwright (30 Test Cases) | **30/30 PASS (100%)** | Chạy trên cổng độc lập 8080 (`club_portal_e2e`) |
| **Desktop 1440px Bố cục Card & Logo** | Playwright Chromium | **PASS** | Không có lỗi 404, không tràn viền |
| **Mobile 390px Responsive Viewport** | Playwright Mobile Safari/Pixel | **PASS** | Bảng cuộn ngang mượt mà, sticky action column chuẩn |
| **Frontend Production Build** | Vite v6.4.5 | **PASS (0 errors)** | Bundle JS và CSS tối ưu |

---

## 5. QUY TRÌNH TIẾP NHẬN LOGO CHÍNH THỨC TỪ BAN CHỦ NHIỆM

Khi Ban Chủ Nhiệm các CLB bàn giao tệp logo chính thức:
1. Định dạng ưu tiên: PNG nền trong suốt (transparent) hoặc SVG vector, độ phân giải tối thiểu 512x512px.
2. Phương thức 1 (Tự động): Club Admin đăng nhập hệ thống -> vào Bảng Điều Khiển Ban Chủ Nhiệm (`/club-admin`) -> nhấn vào biểu tượng máy ảnh trên Logo -> chọn tệp và hoàn tất trong 3 giây.
3. Phương thức 2 (Triển khai kỹ thuật): Đặt tệp chuẩn vào `frontend/public/images/clubs/` theo đúng tên đã quy hoạch (`tinh-nguyen-xanh-logo.png`, `mau-bafu-logo.png`, `it-bafu-logo.png`), sau đó cập nhật `logoUrl` qua PostgreSQL.
