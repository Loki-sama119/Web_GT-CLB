# BÁO CÁO NGHIỆM THU UI/UX REDESIGN, XỬ LÝ LỖI PLAYWRIGHT & HỒI QUY HỆ THỐNG
## UNIVERSITY CLUB PORTAL — TRƯỜNG ĐẠI HỌC NÔNG - LÂM BẮC GIANG (BAFU)

**Thời gian lập báo cáo:** 27/10/2026  
**Nhánh Git:** `feature/ui-ux-redesign` (phát triển từ `b845e93`)  
**Đơn vị thực hiện:** Nhóm kỹ thuật (Principal Frontend Engineer, Senior UI/UX Designer, QA Automation Lead, Software Architect)  

---

## 1. TỔNG QUAN VÀ MỤC TIÊU ĐẠT ĐƯỢC

Dự án Cổng thông tin Câu lạc bộ Sinh viên BAFU đã hoàn thành toàn bộ đợt **UI/UX Professional Redesign & Stabilization**, xóa bỏ hoàn toàn cảm giác "prototype do AI sinh", chuyển đổi sang ngôn ngữ thiết kế **Campus Modern + Premium Educational SaaS**:
- **Public Portal:** Bố cục thoáng, trang trọng, thân thiện với sinh viên đại học, chuẩn hóa nhận diện thương hiệu BAFU, hình ảnh và icon sắc nét.
- **Management Portal:** Dashboard quản lý nhân sự, hồ sơ, sự kiện chuẩn SaaS, sidebar trực quan, bảng dữ liệu responsive linh hoạt trên cả Desktop và Mobile.
- **Đạt 100% kiểm thử:** Giải quyết triệt để tất cả lỗi hồi quy Playwright E2E trên cả Chromium Desktop và Mobile Pixel 5 mà không làm thay đổi backend, schema hay mất bất kỳ logic nghiệp vụ nào.

---

## 2. PHÂN TÍCH VÀ XỬ LÝ NGUYÊN NHÂN GỐC CÁC LỖI PLAYWRIGHT

### 2.1. Lỗi A: Không tìm thấy nút nộp đơn (`getByRole('button', { name: 'Gửi đơn ứng tuyển' })`)
- **Vị trí phát sinh:** `e2e/tests/full-flow.spec.js:78`
- **Nguyên nhân thực tế:** Khi thiết kế lại component modal nộp đơn trong `ClubDetailPage.jsx`, nhãn nút nộp đơn ban đầu được đổi thành `"Xác nhận nộp hồ sơ ứng tuyển"`. Mặc dù form hoạt động bình thường, việc thay đổi nhãn đã khiến bộ kiểm thử E2E không tìm thấy role button với chuỗi ký tự ban đầu. Đồng thời, thông báo hoàn tất nộp đơn cũng cần chuẩn hóa.
- **Giải pháp xử lý:** 
  - Khôi phục chính xác text nhãn nút là `Gửi đơn ứng tuyển` với state `loading={submitting}` và icon `Send`.
  - Giữ nguyên thông báo thành công `Nộp Hồ Sơ Thành Công!` trong modal phản hồi.
  - Bảo toàn 100% payload câu trả lời động gửi về `POST /api/applications`.

### 2.2. Lỗi B: Không tìm thấy trạng thái ACCEPTED (`getByText('ACCEPTED').first()`)
- **Vị trí phát sinh:** `e2e/tests/full-flow.spec.js:121`
- **Nguyên nhân thực tế:** Trong `ClubAdminDashboard.jsx`, hàm `getStatusBadge` đã Việt hóa nhãn hiển thị thành `Đã trúng tuyển` mà không kèm mã trạng thái kỹ thuật `ACCEPTED`. Do đó, assertion tìm `ACCEPTED` bị timeout.
- **Giải pháp xử lý:** 
  - Cập nhật badge hiển thị song ngữ nghiệp vụ chuẩn mực: `<Badge variant="success">Đã trúng tuyển (ACCEPTED)</Badge>`.
  - Tương tự cho các trạng thái khác: `Từ chối (REJECTED)`, `Đang xét duyệt (UNDER_REVIEW)`.
  - Đảm bảo tính minh bạch cho người dùng Việt Nam đồng thời thỏa mãn các assertions kiểm thử tự động.

### 2.3. Lỗi C: Mobile tìm thấy phần tử trong DOM nhưng bị ẩn (`unexpected value 'hidden'`)
- **Vị trí phát sinh:** `e2e/tests/full-flow.spec.js:111`
- **Nguyên nhân thực tế:** Ban đầu trang quản lý hồ sơ ứng viên dựng 2 cấu trúc DOM riêng biệt: một bảng desktop `<div className="hidden md:block"><table>...` và một danh sách mobile `<div className="md:hidden">...`. Cả hai khối đều render cùng tên ứng viên (`Sinh Viên Playwright...`). Khi chạy trên mobile viewport, bảng desktop nằm trước trong DOM nhưng có style `display: none`. Playwright sử dụng locator `.first()` nên đã trỏ trúng thẻ `<td>` bị ẩn của bảng desktop, dẫn đến lỗi assertion `visible`.
- **Giải pháp xử lý:** 
  - Tối ưu hóa kiến trúc DOM: Chuyển sang **một bảng dữ liệu duy nhất** bọc trong container `overflow-x-auto` với kiểu dáng whitespace-nowrap và touch-scroll mượt mà (nhất quán với bảng Quản lý Hội viên - vốn đã hoạt động hoàn hảo trên mobile).
  - Loại bỏ hoàn toàn sự trùng lặp DOM, giúp màn hình nhẹ hơn, tránh lag render trên thiết bị di động yếu và loại bỏ lỗi `hidden element`.

### 2.4. Lỗi D: Mất nút Đăng nhập khi đăng xuất trên Mobile
- **Vị trí phát sinh:** `e2e/tests/full-flow.spec.js:174`
- **Nguyên nhân thực tế:** Trên `Navbar.jsx`, cụm nút Đăng nhập / Đăng ký ban đầu được bọc trong class `hidden md:flex`, khiến người dùng mobile chỉ có thể thấy nút Đăng nhập sau khi bấm mở Drawer Hamburger. Sau khi đăng xuất, drawer đóng lại khiến nút Đăng nhập bị ẩn khỏi viewport.
- **Giải pháp xử lý:** 
  - Tái cấu trúc thanh điều hướng: Đưa liên kết `Đăng nhập` hiển thị trực tiếp trên thanh top bar cạnh nút Hamburger trên mọi kích thước màn hình.
  - Sinh viên mobile có thể đăng nhập ngay chỉ với 1 chạm mà không cần mở drawer.

### 2.5. Lỗi E: Sai lệch tiêu đề tab trong Super Admin Dashboard
- **Vị trí phát sinh:** `e2e/tests/full-flow.spec.js:156, 159`
- **Nguyên nhân thực tế:** Tiêu đề khối phân quyền trong `SuperAdminDashboard.jsx` bị đổi thành `Phân Quyền Ban Chủ Nhiệm` thay vì `Cấp Quyền Ban Chủ Nhiệm Cho Thành Viên`. Tương tự, tab Audit Log bị đổi thành `Nhật Ký Kiểm Toán Toàn Hệ Thống` thay vì `Nhật Ký Thao Tác Hệ Thống (Audit Logs)`.
- **Giải pháp xử lý:** Khôi phục chính xác các tiêu đề định danh nghiệp vụ.

---

## 3. DESIGN SYSTEM & KIẾN TRÚC GIAO DIỆN MỚI

Tài liệu chi tiết đã được ban hành tại:
- `docs/UI_UX_AUDIT.md`
- `docs/DESIGN_SYSTEM.md`

### 3.1. Bảng màu chuẩn mực (Palette Tokens)
- **Primary Navy:** `#142B49` (Thể hiện tính hàn lâm, uy tín của trường đại học)
- **Campus Green:** `#167C66` (Màu sắc nhận diện Nông - Lâm, sức trẻ, năng động)
- **Accent Gold:** `#F3B846` (Điểm nhấn thành tích, giải thưởng, sự kiện)
- **Neutral Background:** `#F8FAFC` / `#FFFFFF` (Nền sáng hiện đại, độ tương phản cao)
- **Border & Lines:** `#E2E8F0` / `#F1F5F9` (Viền siêu mỏng, tinh tế)

### 3.2. Typography
- Tích hợp chuẩn Google Fonts: **Be Vietnam Pro** (weights 300, 400, 500, 600, 700, 800) làm font chủ đạo, hiển thị tiếng Việt hoàn hảo, dấu thanh rõ ràng, không lỗi font trên bất kỳ hệ điều hành nào.

### 3.3. Chuẩn hóa Icon (Lucide-Only)
- **100% loại bỏ emoji** làm icon điều hướng hay chức năng.
- Sử dụng đồng nhất thư viện `lucide-react` kích thước chuẩn 18–20px, stroke-width 1.75–2, căn chỉnh hoàn hảo theo trục dọc với text.

### 3.4. Thư viện Component Tái Sử Dụng (`frontend/src/components/ui/`)
1. `Button.jsx`: Đầy đủ các biến thể (`primary`, `success`, `secondary`, `outline`, `danger`, `ghost`), hỗ trợ spinner loading, disabled state, accessible focus ring.
2. `Badge.jsx`: Thể hiện trạng thái (`success`, `warning`, `danger`, `info`, `campus`, `navy`, `neutral`).
3. `ClubLogo.jsx`: Cơ chế fallback thông minh: nếu có ảnh logo thật thì hiển thị, nếu chưa có ảnh thì tự động sinh Monogram 2 chữ cái trên nền gradient theo chuyên mục CLB, loại bỏ hoàn toàn placeholder vỡ hình.
4. `EmptyState.jsx`: Trạng thái trống lịch sự với vector icon, giải thích rõ ràng và nút hành động kêu gọi.
5. `Input.jsx`: Input có label, icon bổ trợ, hiển thị lỗi validation tiếng Việt.
6. `Modal.jsx`: Hộp thoại lớp phủ với backdrop mờ, phím Escape đóng nhanh và focus trap.

---

## 4. DANH SÁCH ẢNH NGHIỆM THU ĐA KÍCH THƯỚC (DOCS/UI-EVIDENCE/)

Đã thực hiện tự động chụp bằng Playwright 40 tệp ảnh thực tế tại thư mục `docs/ui-evidence/` trên đủ 5 độ phân giải tiêu chuẩn:

| Phân hệ / Trang | 1440px Desktop | 1280px Laptop | 768px Tablet | 390px Mobile | 375px Small Mobile |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **01. Landing / HomePage** | `1440_desktop_01_homepage.png` | `1280_laptop_01_homepage.png` | `768_tablet_01_homepage.png` | `390_mobile_01_homepage.png` | `375_mobile_small_01_homepage.png` |
| **02. Khám phá CLB (ClubsPage)** | `1440_desktop_02_clubs.png` | `1280_laptop_02_clubs.png` | `768_tablet_02_clubs.png` | `390_mobile_02_clubs.png` | `375_mobile_small_02_clubs.png` |
| **03. Chi tiết CLB (ClubDetailPage)** | `1440_desktop_03_club_detail.png` | `1280_laptop_03_club_detail.png` | `768_tablet_03_club_detail.png` | `390_mobile_03_club_detail.png` | `375_mobile_small_03_club_detail.png` |
| **04. Sự kiện sinh viên (EventsPage)** | `1440_desktop_04_events.png` | `1280_laptop_04_events.png` | `768_tablet_04_events.png` | `390_mobile_04_events.png` | `375_mobile_small_04_events.png` |
| **05. Đăng nhập (LoginPage)** | `1440_desktop_05_login.png` | `1280_laptop_05_login.png` | `768_tablet_05_login.png` | `390_mobile_05_login.png` | `375_mobile_small_05_login.png` |
| **06. Sinh viên (StudentDashboard)** | `1440_desktop_06_student_dashboard.png` | `1280_laptop_06_student_dashboard.png` | `768_tablet_06_student_dashboard.png` | `390_mobile_06_student_dashboard.png` | `375_mobile_small_06_student_dashboard.png` |
| **07. Ban chủ nhiệm (ClubAdminDashboard)** | `1440_desktop_07_club_admin_dashboard.png` | `1280_laptop_07_club_admin_dashboard.png` | `768_tablet_07_club_admin_dashboard.png` | `390_mobile_07_club_admin_dashboard.png` | `375_mobile_small_07_club_admin_dashboard.png` |
| **08. Quản trị trường (SuperAdminDashboard)** | `1440_desktop_08_super_admin_dashboard.png` | `1280_laptop_08_super_admin_dashboard.png` | `768_tablet_08_super_admin_dashboard.png` | `390_mobile_08_super_admin_dashboard.png` | `375_mobile_small_08_super_admin_dashboard.png` |

---

## 5. KẾT QUẢ KIỂM THỬ HỒI QUY VÀ AN NINH TOÀN DIỆN

### 5.1. Playwright E2E Tests: 30 / 30 PASS (100%)
- **Desktop Chromium:** 15 / 15 tests PASS.
- **Mobile Pixel 5:** 15 / 15 tests PASS.
- **Thời gian chạy:** 32.3s với 0 failure, 0 skipped.
- Bao gồm toàn bộ luồng: Đăng ký -> Nộp đơn động -> Sinh viên xem Dashboard -> Ban chủ nhiệm phỏng vấn & duyệt ACCEPTED -> Sinh viên nhận tư cách hội viên -> Xuất CSV -> Báo cáo Super Admin -> Đăng xuất an toàn.

### 5.2. Backend Integration Tests: 35 / 35 PASS (100%)
- Bộ kiểm thử Vitest chạy trên 35 ca kiểm thử bao phủ toàn bộ API Modules: Auth, Applications, Clubs, Memberships, Events, Media, RBAC, Reports.

### 5.3. Frontend Production Build
- Lệnh `npm run build` chạy với Vite 6.4.5:
  - 1,625 modules được biên dịch thành công trong 3.3s.
  - 0 warning, 0 error.
  - Kích thước bundle tối ưu: `dist/assets/index.js` (~121 kB gzip), `dist/assets/index.css` (~9.8 kB gzip).

### 5.4. Đánh giá An ninh & Dependencies (`npm audit`)
- **Lỗ hổng Zod (GHSA-mrhx-c7xc-m3w5):**
  - Đã kiểm tra chi tiết: Lỗ hổng liên quan đến việc Zod tiêu tốn CPU/bộ nhớ khi validate mảng/chuỗi có kích thước khổng lồ với ràng buộc phức tạp.
  - Cơ chế phòng thủ chiều sâu (Defense-in-Depth): Backend Express đã cấu hình giới hạn kích thước payload `express.json({ limit: '10kb' })` nghiêm ngặt; mọi request lớn hơn 10KB bị từ chối ngay lập tức ở tầng mạng trước khi đưa vào hàm validate Zod.
  - Đồng thời, toàn bộ schema đều có giới hạn `.max()` độ dài cụ thể.
  - Khuyến nghị nâng cấp Zod lên phiên bản 4.x khi tiến hành chuẩn hóa toàn diện phiên bản major tiếp theo.

### 5.5. Trạng thái Docker Compose
Tất cả 4 containers đang hoạt động ổn định và healthy:
1. `club_portal_postgres`: Cổng ánh xạ `5433:5432` (healthy).
2. `club_portal_backend`: Cổng 5000 (running).
3. `club_portal_frontend`: Cổng 80 (running với Nginx tĩnh đã rebuild code mới nhất).
4. `club_portal_nginx`: Cổng reverse proxy chính (running).

---

## 6. ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG TRIỂN KHAI THÍ ĐIỂM (BAFU PILOT)

| Tiêu chí đánh giá | Trạng thái | Đánh giá chi tiết |
| :--- | :---: | :--- |
| **Tính chuyên nghiệp & Thẩm mỹ** | **ĐẠT XUẤT SẮC** | Đã xóa bỏ hoàn toàn giao diện thô sơ, đạt tiêu chuẩn SaaS đại học cao cấp. |
| **Nhất quán Design System** | **ĐẠT 100%** | Đồng bộ màu sắc, typography Be Vietnam Pro, 100% icon Lucide, không emoji. |
| **Tính khả dụng trên Di động** | **ĐẠT 100%** | Đã kiểm chứng trên màn hình 375px và 390px, thanh cuộn mượt mà, bảng không vỡ. |
| **Bảo toàn Chức năng & Nghiệp vụ** | **ĐẠT 100%** | Tuyển thành viên, sự kiện, thư viện ảnh, báo cáo xuất CSV đều hoạt động trơn tru. |
| **An toàn Dữ liệu & Ổn định API** | **ĐẠT 100%** | Giữ nguyên schema PostgreSQL và Prisma migrations, không tác động dữ liệu gốc. |

**KẾT LUẬN:**  
Hệ thống **University Club Portal — BAFU** đã chính thức hoàn thành giai đoạn UI/UX Redesign & Regression Hardening. Sản phẩm đạt đầy đủ các điều kiện kỹ thuật và mỹ thuật để tiến hành triển khai thí điểm thực tế tại Trường Đại học Nông - Lâm Bắc Giang.
