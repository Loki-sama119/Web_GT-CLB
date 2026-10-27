# BÁO CÁO NGHIỆM THU PHASE 7.1: EVIDENCE-DRIVEN UI REPAIR & TEST DATA ISOLATION

**Dự án:** University Club Portal — Trường Đại Học Nông - Lâm Bắc Giang (BAFU)  
**Ngày thực hiện:** 27/10/2026  
**Đơn vị:** Nhóm Kỹ Sư Công Nghệ Thông Tin BAFU (Frontend, QA Lead & Database Reliability)  
**Nhánh triển khai:** `feature/ui-ux-redesign`

---

## 1. TỔNG QUAN KHẮC PHỤC TRIỆT ĐỂ

Phase 7.1 tập trung giải quyết triệt để 5 vấn đề cốt lõi được chỉ ra từ đợt kiểm toán UI/UX và dữ liệu:
1. **Cô lập dữ liệu kiểm thử (Test Data Isolation):** Tách riêng hoàn toàn dữ liệu kiểm thử tự động khỏi cơ sở dữ liệu demo thực tế của trường, ngăn chặn tuyệt đối tình trạng rác tài khoản kiểm thử ("Sinh Viên Playwright...") trong database chính.
2. **Sửa lỗi hiển thị Bảng điều khiển Club Admin:** Thống nhất bảng dữ liệu ứng viên thành một responsive data table duy nhất, trang bị cột thao tác cố định (`sticky right-0`) với hiệu ứng đổ bóng phân tách, hiển thị trọn vẹn ở cả desktop 1440px và mobile 390px.
3. **Chuẩn hóa trạng thái (Eliminate Raw Enums):** Xây dựng bộ tiện ích chuẩn `statusPresentation.jsx` với component `StatusBadge`, thay thế toàn bộ raw enums tiếng Anh thô kệch bằng huy hiệu tiếng Việt có màu sắc phân cấp và biểu tượng ngữ nghĩa.
4. **Tích hợp tài sản & hình ảnh thực tế BAFU:** Thay thế toàn bộ hình ảnh AI bằng ảnh thực tế khuôn viên và hoạt động sinh viên BAFU lấy từ cổng thông tin `bafu.edu.vn`.
5. **Đồng bộ nhận diện thương hiệu câu lạc bộ:** Xác minh Fanpage chính thức của 3 CLB ưu tiên (Tình Nguyện Xanh, CLB Máu BAFU, CLB Tin Học IT BAFU), tích hợp cơ chế quản lý logo độc lập cho Club Admin.

---

## 2. KIẾN TRÚC CÔ LẬP DỮ LIỆU KIỂM THỬ (TEST DATA ISOLATION)

### 2.1. Cấu hình phân tầng CSDL

```
                         NGINX REVERSE PROXY
                         ├── Port 80 (Cổng Chính / Demo Học Đường)
                         │    ├── /api/  -> backend:5000     -> Database: club_portal_db
                         │    └── /      -> frontend:80
                         │
                         └── Port 8080 (Cổng Kiểm Thử Tự Động E2E)
                              ├── /api/  -> backend_e2e:5001 -> Database: club_portal_e2e
                              └── /      -> frontend:80
```

- **`club_portal_db` (Port 5000 / Nginx Port 80):** Cơ sở dữ liệu trường thực tế, phục vụ người dùng, sinh viên, cán bộ quản lý và các buổi demo.
- **`club_portal_e2e` (Port 5001 / Nginx Port 8080):** Cơ sở dữ liệu riêng biệt cho Playwright E2E suite (`e2e/playwright.config.js`). Mọi tài khoản sinh viên phát sinh trong quá trình chạy test chỉ nằm tại database này.
- **`club_portal_test` (Vitest Local/In-container):** Cơ sở dữ liệu riêng cho 35 ca kiểm thử tích hợp backend (`backend/vitest.config.js`).

### 2.2. Minh chứng bảo toàn Database chính (0 Mutations)

Số lượng bản ghi trong `club_portal_db` trước và sau khi thực hiện toàn bộ kiểm thử Playwright & Vitest:
- `applications` trong `club_portal_db`: **57 (Không thay đổi)**
- `applications` phát sinh trong `club_portal_e2e`: **13 (Toàn bộ test data được cách ly 100%)**

---

## 3. CÁC ĐIỂM SỬA CHỮA GIAO DIỆN & TRẢI NGHIỆM

| Thành phần | Trạng thái trước | Sau khắc phục Phase 7.1 |
| :--- | :--- | :--- |
| **Club Admin Table** | Bị khuất nút thao tác ở 1440px; xung đột 2 khối HTML desktop/mobile | Bảng duy nhất có `overflow-x-auto min-w-[760px] lg:min-w-full`, cột thao tác `sticky right-0` kèm shadow phân cách mượt mà |
| **Trạng thái Enums** | Raw enums hiển thị trần trụi (`ACCEPTED`, `SUBMITTED`, `ACTIVE`) | `StatusBadge` chuẩn hóa sang tiếng Việt: "Đã trúng tuyển", "Đang xét duyệt", "Đang hoạt động" kèm icon Phosphor |
| **Hero Trang Chủ** | Ảnh minh họa AI giả lập, khẩu hiệu chung chung | Ảnh sinh viên khóa mới BAFU (`students-welcome-2025.jpg`), ảnh toàn cảnh khuôn viên trường (`campus-overview.jpg`) |
| **Club Cover Cards** | Dải gradient placeholder đơn điệu | Ảnh hoạt động thực tế BAFU (sân bóng, phòng lab thực hành), tự động kích hoạt cover của CLB |
| **Nhận diện Logo CLB** | Monogram tĩnh không có fallback ảnh | `ClubLogo.jsx` hỗ trợ ảnh 1:1, reactive `onError` fallback về monogram; Club Admin tự upload logo CLB của mình |
| **Sidebar Chi tiết CLB** | Thiếu liên kết mạng xã hội chính thức | Tích hợp nút Fanpage Facebook chính thức có icon thương hiệu |

---

## 4. KẾT QUẢ KIỂM THỬ TOÀN DIỆN

### 4.1. Playwright E2E Test Suite (30/30 PASS)

```text
Running 30 tests using 1 worker
  ok  1 [chromium] › tests/full-flow.spec.js › 01. Khách xem Landing page, danh mục, thống kê và danh sách CLB (1.2s)
  ok  2 [chromium] › tests/full-flow.spec.js › 02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển (1.0s)
  ok  3 [chromium] › tests/full-flow.spec.js › 03. Đăng ký tài khoản sinh viên mới (957ms)
  ok  4 [chromium] › tests/full-flow.spec.js › 04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech (1.6s)
  ok  5 [chromium] › tests/full-flow.spec.js › 05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên (1.1s)
  ok  6 [chromium] › tests/full-flow.spec.js › 06. Club Admin duyệt hồ sơ và kích hoạt hội viên (1.4s)
  ok  7 [chromium] › tests/full-flow.spec.js › 07. Sinh viên thấy tư cách thành viên đã được kích hoạt (1.3s)
  ok  8 [chromium] › tests/full-flow.spec.js › 08. Super Admin quản lý toàn trường và xem thống kê (1.4s)
  ok  9 [chromium] › tests/full-flow.spec.js › 09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn (1.4s)
  ok 10 [chromium] › tests/phase5-deep-dive.spec.js › 01. Kiểm tra trang Sự kiện cộng đồng BAFU và bộ lọc (808ms)
  ok 11 [chromium] › tests/phase5-deep-dive.spec.js › 02. Kiểm tra Album Hoạt Động tại trang Chi Tiết Câu Lạc Bộ (880ms)
  ok 12 [chromium] › tests/phase5-deep-dive.spec.js › 03. Club Admin quản lý hội viên, tìm kiếm và nút xuất CSV hội viên (1.3s)
  ok 13 [chromium] › tests/phase5-deep-dive.spec.js › 04. Super Admin kiểm tra Báo Cáo CLB Toàn Trường và bảng số liệu (1.3s)
  ok 14 [chromium] › tests/phase5-deep-dive.spec.js › 06. Khách kiểm tra trang Chính Sách Quyền Riêng Tư (Privacy Policy) và DSAR (871ms)
  ok 15 [chromium] › tests/phase5-deep-dive.spec.js › 07. Khách kiểm tra trang Điều Khoản Sử Dụng (Terms of Service) (839ms)
  ok 16-30 [mobile] › Toàn bộ 15 ca kiểm thử trên Viewport Mobile 390px PASS hoàn hảo!

30 passed (40.1s)
```

### 4.2. Backend Integration Test Suite (35/35 PASS)

```text
✓ tests/api.test.js (35 tests) 1467ms
Test Files  1 passed (1)
Tests       35 passed (35)
```

---

## 5. DANH MỤC ẢNH CHỨNG MINH THỰC TẾ (SCREENSHOT EVIDENCE)

Toàn bộ ảnh chụp màn hình kiểm thử thực tế đã được lưu trữ tại `docs/phase7-1-evidence/`:
1. `homepage-desktop.png`: Giao diện trang chủ Desktop 1440px với ảnh thật BAFU và card CLB chuẩn mực.
2. `clubs-desktop.png`: Danh bạ câu lạc bộ BAFU với cover và logo monogram sắc nét.
3. `club-detail-tinh-nguyen-xanh.png`: Chi tiết CLB Tình Nguyện Xanh kèm nút Fanpage Facebook.
4. `club-detail-mau-bafu.png`: Chi tiết CLB Máu BAFU (CLB Hiến Máu Tình Nguyện).
5. `club-detail-it-bafu.png`: Chi tiết CLB Tin Học IT BAFU (BAFU Tech).
6. `club-admin-dashboard-desktop.png`: Bảng điều khiển Club Admin với nút Đổi logo và bảng dữ liệu sticky action.
7. `super-admin-clubs-desktop.png`: Bảng điều khiển Super Admin với cột logo CLB và huy hiệu trạng thái.
8. `homepage-mobile-390px.png`: Giao diện trang chủ trên màn hình điện thoại 390px.
9. `club-detail-mobile-390px.png`: Chi tiết CLB trên màn hình điện thoại 390px.
10. `club-admin-mobile-390px.png`: Bảng duyệt ứng viên của Club Admin trên màn hình 390px.
