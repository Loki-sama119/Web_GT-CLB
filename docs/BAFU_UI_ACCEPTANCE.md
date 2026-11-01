# Báo Cáo Nghiệm Thu Giao Diện & Tính Năng Trang Chủ BAFU
*(BAFU UI/UX & Functional Acceptance Test Report)*

- **Dự án:** Cổng thông tin Câu lạc bộ Sinh viên BAFU (*Web_GT-CLB*)
- **Thời điểm nghiệm thu:** 01/11/2026
- **Môi trường:** Local Node.js v24.19.0, Vite 6.4.5, Playwright 1.64.1
- **Kết quả nghiệm thu:** **PASS 100% các tiêu chí kỹ thuật và thẩm mỹ**

---

## 1. Kết Quả Kiểm Tra Kỹ Thuật (Build & Lint)

### 1.1. Frontend Linter (`oxlint`)
- **Lệnh thực thi:** `npm run lint`
- **Kết quả:** **0 errors**, hoàn thành trong 218ms trên 42 tệp nguồn.
- Đã khắc phục lỗi `react-hooks/rules-of-hooks` tại `EditorialClubCard.jsx`.
- Đã dọn dẹp các biến và import không sử dụng (`Sparkle`, `Heart`, v.v.).

### 1.2. Frontend Production Build (`vite build`)
- **Lệnh thực thi:** `npx vite build`
- **Kết quả:** **Thành công (Exit Code 0)**, build hoàn tất trong 30.63s.
- Toàn bộ 4620 module được biên dịch chính xác thành các bundle production tối ưu tại `frontend/dist/`:
  - `dist/index.html` (1.53 kB)
  - `dist/assets/index-*.css` (90.66 kB)
  - `dist/assets/index-*.js` (512.22 kB)
  - Các dynamic import chunks cho Dashboard và modals.

### 1.3. Backend Unit & Policy Tests (`vitest run`)
- **Tệp kiểm thử:** `tests/data-policy.test.js`
- **Kết quả:** **6/6 tests PASS (100%)**.
- Xác nhận các hàm lọc và bảo vệ dữ liệu `verifiedWhere()`, `visibleUserWhere()`, `isPublicRecord()`, `approvedAsset()` hoạt động chính xác theo chính sách không để lộ dữ liệu chưa xác minh ra ngoài public API.

---

## 2. Bằng Chứng Hình Ảnh Kiểm Thử Đa Viewport (Playwright Screenshots)

Toàn bộ ảnh chụp thực tế bằng Playwright Chromium được lưu tại thư mục:
`Web_GT-CLB/screenshots/homepage-redesign/`

| Viewport | Tên tệp ảnh chụp | Kích thước | Mô tả nội dung kiểm chứng | Kết quả đánh giá |
|:---|:---|:---:|:---|:---:|
| **Desktop Full HD (1920px)** | `bafu_redesign_1920_desktop_fhd_hero.png` | 1920 × 1080 | Hero banner trải rộng 100% viewport, nền khuôn viên BAFU sắc nét, floating search cân đối, thanh số liệu 4 cột ngay ngắn. | **ĐẠT XUẤT SẮC** |
| **Desktop Full HD (1920px)** | `bafu_redesign_1920_desktop_fhd_fullpage.png` | 1920 × 4470 | Toàn bộ 8 section trên màn hình lớn, lưới 3 cột cân xứng, không có khoảng trắng thừa, không có scrollbar ngang. | **ĐẠT XUẤT SẮC** |
| **Desktop Standard (1440px)** | `bafu_redesign_1440_desktop_hero.png` | 1440 × 900 | Bố cục chuẩn mực desktop, chữ tiêu đề không bị vỡ dòng, thanh tìm kiếm nổi bật, màu sắc xanh - vàng hài hòa. | **ĐẠT XUẤT SẮC** |
| **Desktop Standard (1440px)** | `bafu_redesign_1440_desktop_fullpage.png` | 1440 × 4470 | Toàn cảnh trang chủ từ Navbar đến Footer: Gallery 4 ảnh tư liệu BAFU tải đầy đủ, video 16:9 sắc nét, dải CTA ấn tượng. | **ĐẠT XUẤT SẮC** |
| **Tablet (768px)** | `bafu_redesign_768_tablet_hero.png` | 768 × 1024 | Hero co giãn nhịp nhàng, thanh tìm kiếm tự động thu gọn padding, chip gợi ý xếp gọn 2 hàng. | **ĐẠT** |
| **Tablet (768px)** | `bafu_redesign_768_tablet_fullpage.png` | 768 × 5200 | Lưới thẻ chuyển thành 2 cột cân bằng, các khối thông tin video và sự kiện tự chuyển dọc không bị tràn lề. | **ĐẠT** |
| **Mobile (390px - iPhone)** | `bafu_redesign_390_mobile_hero.png` | 390 × 844 | Wordmark tự động ẩn subtitle tránh đè nút Đăng nhập; headline co giãn phù hợp, nút bấm dễ chạm ngón tay. | **ĐẠT** |
| **Mobile (390px - iPhone)** | `bafu_redesign_390_mobile_fullpage.png` | 390 × 6100 | Lưới 1 cột dọc mượt mà, gallery và video vừa vặn chiều ngang 100%, không bị tràn ngang dù chỉ 1px. | **ĐẠT** |
| **Interactive State** | `bafu_redesign_1440_lightbox_modal.png` | 1440 × 900 | Nhấp vào ảnh trong Section 04 kích hoạt Lightbox modal hiển thị ảnh lớn, chú thích và liên kết nguồn `bafu.edu.vn`. | **ĐẠT** |
| **Interactive State** | `bafu_redesign_390_mobile_menu_open.png` | 390 × 844 | Nhấp vào Hamburger menu mở drawer điều hướng mobile đầy đủ các liên kết Trang chủ, CLB, Hoạt động, Sự kiện. | **ĐẠT** |

---

## 3. Bảng Đối Chiếu Các Tiêu Chí Nghiệm Thu Bắt Buộc

| STT | Yêu cầu nghiệp vụ | Hiện trạng xử lý | Đánh giá |
|:---:|:---|:---|:---:|
| 1 | Loại bỏ toàn bộ ảnh galaxy (`bg_galaxy_*`) | Đã xóa 100% trong mã nguồn frontend và thay bằng CSS gradient | **HOÀN THÀNH** |
| 2 | Loại bỏ logo chưa xác minh / fanpage không rõ | Đã loại bỏ và thay bằng fallback an toàn có nhãn "Chờ logo" | **HOÀN THÀNH** |
| 3 | Hero Banner tràn màn hình (full-width) | Chiều rộng 100% viewport, chiều cao 760px desktop, nền ảnh BAFU thật | **HOÀN THÀNH** |
| 4 | Nội dung headline & CTA theo đề xuất | "KHÁM PHÁ CỘNG ĐỒNG SINH VIÊN BAFU", dual CTA và floating search bar | **HOÀN THÀNH** |
| 5 | Visual Grid câu lạc bộ 3 cột | Grid 3 cột cho 5 CLB đã xác minh, mỗi thẻ có nhãn trạng thái và nguồn rõ ràng | **HOÀN THÀNH** |
| 6 | Gallery bất đối xứng có nguồn trường | 1 visual chính (Gala chào tân sinh viên) + 3 visual phụ (Bóng đá, Lab, Tốt nghiệp) | **HOÀN THÀNH** |
| 7 | Video khung 16:9 đúng nguồn trường | Nhúng video phóng sự trường từ YouTube chính thức `@dhnlbg`, không gán sai cho CLB | **HOÀN THÀNH** |
| 8 | Phân định Lịch sự kiện vs Tư liệu lịch sử | Tách riêng 2 tab: Tab tư liệu (2 sự kiện có ngày gốc) và Tab sắp tới (empty state trung thực) | **HOÀN THÀNH** |
| 9 | Footer minh bạch dữ liệu | Ghi rõ là cổng thí điểm, đối chiếu theo `bafu.edu.vn`, không nhận vơ chính thức | **HOÀN THÀNH** |
| 10 | Không lỗi scrollbar ngang (No overflow) | Kiểm tra tại 1920px, 1440px, 768px và 390px hoàn toàn không bị tràn lề | **HOÀN THÀNH** |

---

## 4. Các Vấn Đề Còn Chờ Ban Quản Lý Trường Bàn Giao

1. **Logo chính thức dạng vector (SVG/PNG trong suốt):** Cần văn phòng Đoàn hoặc Ban truyền thông trường cung cấp tệp gốc để tích hợp thay thế nhãn "Chờ logo".
2. **Ảnh hoạt động riêng của từng câu lạc bộ:** Khi các Ban chủ nhiệm CLB cung cấp bộ ảnh tư liệu của các đợt hoạt động có xác nhận, quản trị viên có thể tải lên qua khu vực Quản trị Admin.
3. **Phê duyệt vận hành chính thức:** Dự án hiện tại đang duy trì nhãn "Cổng thông tin thí điểm" cho tới khi có quyết định chính thức từ Ban Giám hiệu Nhà trường.

