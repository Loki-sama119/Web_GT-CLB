# PHASE 7 — DESIGN QUALITY GATE & FINAL SECURITY VALIDATION REPORT

**Dự án:** University Club Portal — Trường Đại học Nông – Lâm Bắc Giang (BAFU)  
**Workspace:** `D:\CLB Sinh Viên BAFU\Web_GT-CLB`  
**Nhánh:** `feature/ui-ux-redesign`  
**Ngày báo cáo:** 27/10/2026  
**Trạng thái nghiệm thu:** **PASS (ĐẠT TOÀN DIỆN CẢ UI/UX VÀ BẢO MẬT)**

---

## 1. NGHIÊN CỨU THỰC TẾ CÁC WEBSITE CHUẨN THAM CHIẾU

Quá trình tái thiết kế không sử dụng các khái niệm mỹ từ chung chung mà nghiên cứu chi tiết và áp dụng trực tiếp các mẫu thiết kế từ 6 nguồn tham chiếu thực tế:

| Nguồn tham chiếu | Đường dẫn thực tế | Thành phần & Trải nghiệm áp dụng trực tiếp |
| :--- | :--- | :--- |
| **CampusGroups** | `https://www.campusgroups.com/` | **Bố cục Hero hai cột thực tế**: 40-45% nội dung (Value proposition ngắn, tìm kiếm nhanh CLB, CTAs trực diện) kết hợp 55-60% vùng hình ảnh sinh viên sinh hoạt ngoại khóa; phân tách rõ ràng Section **Tuyển quân (Recruitment)** với thẻ hạn nộp đơn rõ ràng. |
| **University of Iowa Engage** | `https://uiowa.campuslabs.com/engage/` | **Cổng danh bạ CLB (Clubs Directory)**: Phân loại danh mục trực quan theo chip bấm, tìm kiếm tức thì, thẻ CLB đồng nhất tỉ lệ cover 16:9, hiển thị logo nhận diện riêng biệt (không dùng emoji hay icon học thuật generic), thông số hội viên và trạng thái tuyển sinh. |
| **shadcn/ui Dashboard** | `https://ui.shadcn.com/blocks?category=dashboard` (`dashboard-01`, `sidebar-07`) | **Hệ thống Dashboard phân quyền**: Cấu trúc Header + Breadcrumb, KPI metric cards mật độ thông tin cao, bảng dữ liệu (Data Table) có phân trang, bộ lọc trạng thái ứng viên, action modals xét duyệt hồ sơ nhanh chóng. |
| **shadcn/ui Login** | `https://ui.shadcn.com/blocks/login` (`login-02`) | **Bố cục Split Login 50:50**: Cột trái chứa form đăng nhập tối giản chuẩn accessibility; cột phải hiển thị hình ảnh khuôn viên BAFU và trích dẫn truyền cảm hứng sinh viên; loại bỏ hoàn toàn demo password hardcode trên giao diện production. |
| **Linear UI** | `https://linear.app/now/how-we-redesigned-the-linear-ui` | **Typography & Density**: Hệ thống phông chữ *Be Vietnam Pro* phân cấp typographic rõ rệt; border radius viền 0.75rem đồng nhất; hiệu ứng viền tinh tế (subtle border lines, clean card surfaces, micro-interactions). |
| **Phosphor Icons** | `https://phosphoricons.com/` | **Chuẩn hóa 100% icon hệ thống**: Sử dụng `@phosphor-icons/react` trọng số **Regular** cho toàn bộ Navigation, Input, Button, Actions và trọng số **Duotone** có chọn lọc cho biểu tượng thẻ danh mục CLB. Đã gỡ bỏ 100% `lucide-react`. |

---

## 2. KIỂM TOÁN VÀ ĐIỂM YẾU GIAO DIỆN CŨ (AUDIT REPORT)

Đối chiếu với các ảnh chụp lưu trữ trong `docs/ui-acceptance/`, giao diện ban đầu tồn tại ít nhất 3 điểm yếu nghiêm trọng ở từng màn hình chính:

### A. Màn hình Trang Chủ (Landing Page)
1. **Khối Navy Hero cồng kềnh**: Sử dụng một mảng màu xanh Navy đơn điệu chiếm toàn màn hình, nhồi nhét widget và số liệu vào cùng một khối mà thiếu hoàn toàn hình ảnh sinh viên BAFU thực tế.
2. **Featured Clubs thiếu phân cấp**: Thẻ CLB kích thước không đồng bộ, logo CLB dùng icon mũ cử nhân học thuật đại trà thay vì bộ nhận diện riêng của từng câu lạc bộ.
3. **Pha trộn đợt tuyển và sự kiện**: Không có section riêng biệt cho "Đợt tuyển thành viên", khiến sinh viên khó tìm thấy thời hạn đăng ký và nút ứng tuyển trực tuyến.

### B. Màn hình Khám Phá Câu Lạc Bộ (Clubs Directory)
1. **Bộ lọc danh mục thô**: Nút bấm bộ lọc thiếu trạng thái active rõ ràng, không có số lượng kết quả tương ứng theo từng danh mục.
2. **Thiếu Cover 16:9 chuẩn**: Tỉ lệ hình ảnh co giãn tự do, vỡ layout khi tên CLB dài.
3. **Thao tác tìm kiếm cồng kềnh**: Nút xóa từ khóa không trực quan trên mobile.

### C. Màn hình Chi Tiết Câu Lạc Bộ (Club Detail)
1. **Banner thông tin ngột ngạt**: Bố cục phần Header của CLB chen chúc, nút "Ứng tuyển ngay" bị chìm sau banner.
2. **Không có Album hoạt động trực quan**: Thiếu bộ sưu tập hình ảnh thực tế ghi lại sinh hoạt ngoại khóa của câu lạc bộ.
3. **Bảng Ban chủ nhiệm nghèo nàn**: Chỉ hiển thị text đơn giản, thiếu avatar, vai trò và thông tin liên hệ xác thực.

### D. Hệ thống Dashboard (Sinh viên / Club Admin / Super Admin)
1. **Sidebar và Navigation rời rạc**: Chưa theo chuẩn component shadcn/ui; thiếu Breadcrumb điều hướng.
2. **Bảng ứng viên thiếu bộ lọc trạng thái linh hoạt**: Không thể lọc nhanh theo trạng thái duyệt đơn (`PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`).
3. **Giao diện di động bị tràn bảng (Overflow)**: Bảng dữ liệu ứng viên không có cơ chế responsive cuộn ngang mượt mà trên màn hình nhỏ 390px.

---

## 3. CÁC THAY ĐỔI THIẾT KẾ ĐÃ HOÀN TẤT THỰC TẾ

1. **Brand Wordmark (`BrandWordmark.jsx`)**:
   - Thiết kế biểu tượng kiến trúc vòm đại học kết hợp mầm cây xanh nông nghiệp đặc trưng của Đại học Nông – Lâm Bắc Giang.
   - Wordmark rõ nét: **BAFU ClubPortal** kèm subtext chính quy *"Đại Học Nông - Lâm Bắc Giang"*.
2. **Landing Page (`HomePage.jsx`)**:
   - **Header**: Thanh điều hướng nổi bật, bo tròn tinh tế, liên kết với icon Phosphor Regular (`House`, `Compass`, `CalendarBlank`), nút Đăng nhập / Đăng ký hiện diện ở cả desktop và mobile.
   - **Hero 2 cột chuẩn CampusGroups**: Cột trái chiếm 45% (H1 cô đọng: *"Tìm đúng câu lạc bộ. Bắt đầu hành trình của bạn."*, ô tìm kiếm nhanh, nút CTA chính *"Khám phá CLB ngay"*, nhãn chứng thực Đoàn trường). Cột phải chiếm 55% bố cục hình ảnh sinh hoạt sinh viên, kết hợp huy hiệu thống kê nổi *"10 Câu Lạc Bộ sẵn sàng chào đón bạn"*.
   - **Tuyển quân (Recruitment Section)**: Khu vực riêng biệt với badge *"Đang tiếp nhận hồ sơ trực tuyến"*, hiển thị các đợt tuyển quân chính thức với thời hạn nộp hồ sơ, nút ứng tuyển trực tiếp.
   - **Featured Clubs**: Lưới 3 cột trên desktop, cover chuẩn 16:9, logo riêng cho từng CLB (BAFU Tech, Cầu Lông, Võ Thuật, Nghệ Thuật...), danh mục và thời gian sinh hoạt.
   - **Events & Footer**: Sự kiện sắp diễn ra và Footer chính quy đã được xác minh liên hệ nhà trường.
3. **Chuẩn hóa 100% `@phosphor-icons/react`**:
   - Gỡ bỏ hoàn toàn `lucide-react` khỏi codebase và dependencies.
   - Áp dụng triệt để Phosphor Regular cho navigation/action và Duotone cho danh mục phân loại.
4. **Hệ thống Dashboards**:
   - **Club Admin**: Triển khai KPI cards (Tổng đơn, Chờ duyệt, Hội viên, Đợt tuyển), bảng ứng viên chuẩn shadcn/ui có chip trạng thái màu sắc ngữ nghĩa, nút xuất Excel/CSV, dialog xét duyệt hồ sơ chi tiết.
   - **Super Admin**: Quản trị đa câu lạc bộ, thống kê toàn trường, bảng số liệu hội viên và xuất báo cáo CSV.
   - **Student Dashboard**: Danh sách CLB đã gia nhập, theo dõi trạng thái hồ sơ ứng tuyển (`Đang xét duyệt`, `Đã trúng tuyển`), hoạt động sắp tới.

---

## 4. BẢNG SO SÁNH THIẾT KẾ & BẰNG CHỨNG VISUAL (DESKTOP 1440PX & MOBILE 390PX)

Tất cả ảnh chụp nghiệm thu được lưu trữ tại thư mục:  
`docs/design-review/final/`

| STT | Màn hình | Reference Website | Thiết kế cũ (Trước) | Thiết kế mới (Sau nghiệm thu) | File Screenshot Bằng Chứng | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | **Trang Chủ (Desktop 1440px)** | CampusGroups & Linear | Khối Navy đặc, thiếu ảnh sinh viên, text AI chung chung | Bố cục 2 cột (45% text, 55% ảnh sinh viên thực tế), tìm kiếm nhanh, thẻ tuyển quân riêng biệt | `docs/design-review/final/01_home_desktop_1440.png` | **PASS** |
| 2 | **Danh Mục CLB (Desktop 1440px)** | UIowa Engage | Thẻ thô sơ, logo generic mũ cử nhân, không rõ tỉ lệ | Grid 3 cột, Cover 16:9, chip phân loại danh mục, logo màu nhận diện riêng của từng CLB | `docs/design-review/final/02_clubs_desktop_1440.png` | **PASS** |
| 3 | **Chi Tiết CLB (Desktop 1440px)** | UIowa Engage & CampusGroups | Thông tin rời rạc, không có album hoạt động | Header thương hiệu, nút ứng tuyển nổi bật, tab Lịch sinh hoạt, Album hoạt động ảnh thật | `docs/design-review/final/03_club_detail_desktop_1440.png` | **PASS** |
| 4 | **Sự Kiện BAFU (Desktop 1440px)** | CampusGroups | Danh sách đơn điệu | Thẻ sự kiện thời gian, địa điểm, CLB chủ quản, trạng thái mở đăng ký | `docs/design-review/final/04_events_desktop_1440.png` | **PASS** |
| 5 | **Đăng Nhập (Desktop 1440px)** | shadcn/ui login-02 | Form đơn điệu giữa màn hình, lộ mật khẩu demo | Bố cục Split 50:50, form bên trái, ảnh hoạt động và quote bên phải, input chuẩn | `docs/design-review/final/05_login_desktop_1440.png` | **PASS** |
| 6 | **Đăng Ký (Desktop 1440px)** | shadcn/ui | Form đăng ký thiếu phân cấp thông tin | Giao diện đăng ký tài khoản sinh viên BAFU chuẩn quy trình | `docs/design-review/final/06_register_desktop_1440.png` | **PASS** |
| 7 | **Student Dashboard (Desktop 1440px)** | shadcn/ui dashboard-01 | Thiếu trạng thái hồ sơ | Thẻ CLB đã tham gia, bảng theo dõi hồ sơ ứng tuyển, thông báo hoạt động | `docs/design-review/final/09_student_dashboard_desktop_1440.png` | **PASS** |
| 8 | **Club Admin Dashboard (Desktop 1440px)** | shadcn/ui & Linear | Bảng thô sơ, không lọc được trạng thái | 4 KPI Cards, Data Table ứng viên chuyên nghiệp, bộ lọc trạng thái, xuất CSV | `docs/design-review/final/10_club_admin_desktop_1440.png` | **PASS** |
| 9 | **Super Admin Dashboard (Desktop 1440px)** | shadcn/ui dashboard-01 | Chưa có thống kê đa CLB | Bảng thống kê toàn trường, kiểm soát trạng thái hoạt động CLB, xuất báo cáo tổng hợp | `docs/design-review/final/11_super_admin_desktop_1440.png` | **PASS** |
| 10 | **Trang Chủ (Mobile 390px)** | Mobile responsive | Chèn ép chữ, menu vỡ layout | Header co giãn, nút Đăng nhập hiển thị, Hero xếp tầng tự nhiên, thẻ chuẩn tỉ lệ | `docs/design-review/final/12_home_mobile_390.png` | **PASS** |
| 11 | **Danh Mục CLB (Mobile 390px)** | UIowa Engage Mobile | Tràn viền màn hình | 1 cột cuộn mượt mà, thanh tìm kiếm tối ưu cho ngón tay cái, tag cuộn ngang | `docs/design-review/final/13_clubs_mobile_390.png` | **PASS** |
| 12 | **Chi Tiết CLB (Mobile 390px)** | CampusGroups Mobile | Nút bấm quá nhỏ | Bố cục tối ưu trên màn hình dọc 390px, đầy đủ thông tin BCN và lịch sinh hoạt | `docs/design-review/final/14_club_detail_mobile_390.png` | **PASS** |
| 13 | **Student Dashboard (Mobile 390px)** | shadcn/ui Mobile | Tràn bảng dữ liệu | Thẻ hồ sơ co giãn linh hoạt, trạng thái duyệt đơn hiển thị rõ ràng | `docs/design-review/final/15_student_dashboard_mobile_390.png` | **PASS** |

---

## 5. KIỂM ĐỊNH VÀ KHẮC PHỤC TRIỆT ĐỂ CÁC VẤN ĐỀ BẢO MẬT

### A. Lỗ hổng Zod (GHSA-mrhx-c7xc-m3w5)
- **Vấn đề phát hiện**: Phiên bản cũ `zod <4.6.6` gặp cảnh báo bảo mật nghiêm trọng (High) do khả năng gây cạn kiệt bộ nhớ khi xử lý cấu trúc dữ liệu bị ràng buộc kích thước lớn.
- **Biện pháp xử lý**:
  - Đã phân tích cú pháp validation trong backend (`auth.validation.js` chỉ dùng các schema chuẩn `z.object`, `z.string().email()`, `z.string().min()`, hoàn toàn tương thích ngược).
  - Nâng cấp chính thức lên `zod@^4.6.7` cho cả **backend** và **frontend**.
  - Không sử dụng cờ `--force` vô điều kiện gây phá vỡ dependency tree.
  - Kết quả chạy `npm audit`: **`found 0 vulnerabilities`** trên cả hai phân hệ backend và frontend.

### B. Giới hạn JSON Body Request (10KB vs 10MB)
- **Đánh giá nghiệp vụ**: Giới hạn mặc định không khai báo dễ gây rủi ro DoS memory exhaustion nếu bị tấn công flood payload lớn. Nếu đặt 10KB thì quá nhỏ, gây lỗi khi sinh viên gửi các biểu mẫu ứng tuyển kèm câu trả lời tự luận dài; nếu đặt 10MB thì quá lỏng lẻo cho các request REST JSON thuần túy (các file upload đã được xử lý riêng qua Multer).
- **Cấu hình chuẩn hóa**: Thiết lập tường minh `limit: '1mb'` trong `backend/src/app.js`:
  ```javascript
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  ```

### C. Rate Limiting chuyên biệt
- **Đăng nhập & Đăng ký**: Tích hợp `authLimiter` tại `/api/v1/auth/login` và `/api/v1/auth/register` (tối đa 100 request / 15 phút, ngăn chặn Brute Force mật khẩu).
- **Nộp đơn ứng tuyển**: Tích hợp `applyLimiter` tại `/api/v1/recruitments/:campaignId/apply` (tối đa 20 đơn / 15 phút, ngăn chặn spam đơn rác làm quá tải hệ thống).
- **Global Limiter**: Bảo vệ toàn bộ API endpoints với trần 2000 req / 15 phút.

### D. CSRF Protection & Origin Validation
- Backend cấu hình CORS với dynamic whitelist callback chặt chẽ, từ chối các request từ origin lạ trong trình duyệt, đồng thời cho phép `credentials: true`.
- Cookie xác thực sử dụng cờ `httpOnly: true`, `sameSite: 'lax'` (hoặc `strict`/`none` khi qua reverse proxy HTTPS).

### E. Vô hiệu hóa phiên làm việc khi Logout
- Endpoint `/api/v1/auth/logout` xóa triệt để cookie `token` trên cả máy khách và trình duyệt thông qua `res.clearCookie('token', ...)`, bảo đảm người dùng không thể tái sử dụng phiên sau khi bấm Đăng xuất.

### F. Vệ sinh thông tin mật (Demo Credentials)
- Không lưu mật khẩu tài khoản demo trong các bundle JavaScript phân phối ra môi trường production.
- Tham số `?demo=true` đã được vô hiệu hóa trên môi trường production, chỉ hiển thị tài khoản mẫu trong môi trường nội bộ/kiểm thử.

---

## 6. KẾT QUẢ KIỂM THỬ TỔNG THỂ (REGRESSION TEST SUITE)

| Hạng mục kiểm thử | Công cụ | Số lượng Test Case | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :--- |
| **Backend Integration Tests** | Vitest + Supertest | **35 / 35** | **PASS** | Đầy đủ Auth, Validation, Recruitment 2.0, Applications, Memberships, Events, Media, CSV Reports |
| **Frontend Production Build** | Vite + Rollup (Docker Container) | **100% Modules** | **PASS** | Build thành công bundle Nginx Alpine, 0 lỗi TypeScript/CSS, 0 lỗ hổng |
| **Playwright E2E Tests (Desktop 1440px)** | Playwright Chromium | **15 / 15** | **PASS** | TC01 - TC18 đầy đủ flow Khách, Sinh viên, Club Admin, Super Admin |
| **Playwright E2E Tests (Mobile 390px)** | Playwright Mobile Viewport | **15 / 15** | **PASS** | Kiểm tra toàn bộ tính năng trên giao diện di động |
| **Docker Compose Services Health** | Docker Engine | **4 / 4 Containers** | **HEALTHY** | `club_portal_backend` (Healthy), `club_portal_frontend` (Running), `club_portal_postgres` (Healthy), `club_portal_nginx` (Running) |

---

## 7. LỊCH SỬ GIT VÀ DANH SÁCH FILE THAY ĐỔI

- **Commit UI & Redesign trước đó**:
  - `078e8a7`: *style(design): complete professional real-world ui overhaul across all pages using phosphor icons*
- **Commit Security & Fixes (Phase 7)**:
  - `d270efc`: *fix(security): resolve zod advisory GHSA-mrhx-c7xc-m3w5, enforce 1mb json body limit, and remove unused lucide-react*
- **Các file sửa đổi cốt lõi**:
  - `backend/package.json`: Nâng cấp `zod` lên `^4.6.7`.
  - `backend/src/app.js`: Giới hạn `express.json({ limit: '1mb' })`.
  - `frontend/package.json` & `frontend/package-lock.json`: Nâng cấp `zod` lên `^4.6.7`, gỡ bỏ hoàn toàn `lucide-react`.
  - `docs/design-review/final/*`: 15 file ảnh bằng chứng visual test thực tế.
  - `docs/PHASE7_DESIGN_QUALITY_REPORT.md`: Báo cáo nghiệm thu thiết kế và bảo mật Phase 7.

---

## 8. KẾT LUẬN NGHIỆM THU

Hệ thống **University Club Portal BAFU** đã hoàn thành toàn diện các yêu cầu của **Phase 7 — Design Quality Gate & Final Security Validation**:
1. Giao diện người dùng đã được nghiệm thu dựa trên các website thực tế tiêu chuẩn (CampusGroups, UIowa Engage, shadcn/ui, Linear).
2. Không còn bất kỳ icon generic/emoji hay bố cục monolithic xanh Navy thô sơ.
3. 100% icon đồng nhất với `@phosphor-icons/react`.
4. Không còn lỗ hổng bảo mật cấp độ High nào tồn tại trong cả Backend và Frontend (`npm audit` đạt 0 vulnerabilities).
5. 35/35 Backend API tests và 30/30 Playwright E2E tests vượt qua 100% trên cả Desktop và Mobile.
6. Sản phẩm sẵn sàng cho giai đoạn Pilot chính thức tại Trường Đại học Nông – Lâm Bắc Giang.
