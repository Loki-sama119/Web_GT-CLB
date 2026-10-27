# BAFU CAMPUS EDITORIAL — DESIGN SYSTEM SPECIFICATION

**Dự án:** University Club Portal — Trường Đại học Nông – Lâm Bắc Giang (BAFU)  
**Tiêu chuẩn:** Swiss International Typographic Style + Contemporary Editorial Web Design  
**Bộ nhận diện:** `BAFU CAMPUS EDITORIAL`  

---

## 1. HỆ THỐNG MÀU SẮC (COLOR TOKENS)

| Token Name | Giá trị Hex | Ứng dụng cụ thể trong hệ thống | Tỉ lệ tương phản (Contrast) |
| :--- | :--- | :--- | :--- |
| `paper` | `#F4F0E7` | Nền trang chính, tạo cảm giác bề mặt trang in báo chí/tạp chí đại học | Nền chủ đạo |
| `ink` | `#181C1B` | Văn bản chính, tiêu đề H1/H2, nền dark sections và nút thao tác chính | 13.8:1 trên paper (AAA) |
| `forest` | `#12674D` | Màu thương hiệu Nông Lâm BAFU, link điều hướng active, icon điểm nhấn | 6.2:1 trên paper (AA) |
| `forest-hover`| `#0E523D` | Trạng thái hover cho các thành phần Forest | 8.1:1 trên paper (AAA) |
| `coral` | `#EF673F` | Màu điểm nhấn khẩn cấp, nhãn "Đang tuyển", CTA nổi bật | 3.5:1 (Headline/UI Component) |
| `coral-hover` | `#D9532B` | Trạng thái hover cho CTA Coral | 4.8:1 trên paper |
| `neutral-border`| `#D8D5CD` | Đường kẻ lưới Swiss grid (1px hairline border), viền phân cách modular | Phân chia cấu trúc |
| `card-bg` | `#FFFFFF` | Nền ô nội dung độc lập, thẻ bài viết, ô form nhập liệu | Sắc nét, sáng rõ |
| `paper-muted` | `#EBE6DB` | Nền thứ cấp cho các thẻ phụ hoặc thanh tìm kiếm | Êm dịu, chống chói |

---

## 2. HỆ THỐNG TYPOGRAPHY (TYPOGRAPHY SCALE)

### Font Display: `Oswald` (Google Fonts, hỗ trợ tiếng Việt đầy đủ)
*Dành riêng cho: Tiêu đề lớn (Display Heading), số thứ tự biên tập (`01`, `02`), và số liệu thống kê lớn.*
- **Desktop Hero H1:** `text-6xl` đến `text-7xl` (`72px - 84px`), font-weight 700 (Bold), `leading-[1.02]`, `tracking-[-0.02em]`.
- **Desktop Section H2:** `text-4xl` đến `text-5xl` (`44px - 52px`), font-weight 600 (SemiBold), `leading-[1.1]`.
- **Mobile Hero H1:** `text-4xl` (`40px - 44px`), font-weight 700.
- **Mobile Section H2:** `text-3xl` (`32px - 36px`), font-weight 600.
- **Editorial Index / Metric Numeral:** `text-5xl` đến `text-6xl`, font-weight 600, tabular figures.

### Font Nội Dung & Giao Diện: `Plus Jakarta Sans` (Google Fonts)
*Dành cho: Toàn bộ văn bản mô tả, tên thẻ CLB, thanh điều hướng, bảng dữ liệu, form biểu mẫu và dashboard.*
- **Card Title / Heading 3:** `text-xl` đến `text-2xl` (`20px - 24px`), font-weight 600, `leading-snug`.
- **Body Regular:** `text-[15px]` đến `text-base` (`16px`), font-weight 400, `leading-relaxed` (1.6).
- **Body Medium / Action:** `text-sm` (`14px`), font-weight 600.
- **Eyebrow / Category Tag:** `text-xs` (`12px`), font-weight 700, uppercase, `tracking-[0.08em]`.
- **Caption / Meta:** `text-xs` (`12px`), font-weight 500, text color muted.

---

## 3. HỆ LƯỚI & QUY TẮC BỐ CỤC (GRID & LAYOUT ARCHITECTURE)

1. **Lưới 12 cột chuẩn Thụy Sĩ (Swiss 12-Column Grid):**
   - Chiều rộng tối đa (Max Content Width): `1320px` căn giữa màn hình.
   - Số cột (Columns): 12 cột đều trên Desktop, 6–8 cột trên Tablet, 4 cột trên Mobile.
   - Khoảng cách cột (Grid Gap): `24px` cố định.
   - Khoảng cách các chuyên mục (Section Spacing): `88px - 112px` trên Desktop, `48px - 64px` trên Mobile.
2. **Cấu trúc phân tách ô (Modular Border Separators):**
   - Loại bỏ các khối bo tròn lớn trôi nổi và hiệu ứng đổ bóng mờ ảo.
   - Thay thế bằng **đường kẻ viền sắc nét 1px (`border-[#D8D5CD]`)**.
   - Các góc bo chuyển từ `rounded-3xl` (bo quá tròn) sang các cạnh dứt khoát hoặc góc bo tối giản `rounded-none` đến `rounded-md` theo tinh thần kiến trúc hiện đại.
3. **Nhịp điệu nền theo chuyên mục (Visual Rhythm):**
   - `Section 01 (Hero & Masthead)`: Nền giấy ấm `bg-[#F4F0E7]` kết hợp ảnh tư liệu sinh viên khổ lớn tràn 7 cột.
   - `Section 02 (CLB Đang Tuyển)`: Nền trắng tinh khiết `bg-[#FFFFFF]` viền kẻ lưới 12 cột.
   - `Section 03 (Sự Kiện Poster)`: Nền xanh rừng sâu `bg-[#12674D]` hoặc đen mực `bg-[#181C1B]` tạo điểm nhấn tương phản.
   - `Section 04 (Danh Bạ & Thống Kê)`: Nền giấy ấm `bg-[#F4F0E7]`.

---

## 4. DANH MỤC CÁC COMPONENT TÙY BIẾN ĐẶC THÙ (CUSTOM COMPONENTS)

1. **`EditorialHeading`:** Hiển thị tiêu đề lớn bằng font Oswald, hỗ trợ nhãn số thứ tự biên tập (`01 /`, `02 /`), nhãn phân loại (eyebrow) và phụ đề tương phản.
2. **`SectionIndex`:** Dấu chỉ mục chuyên mục dạng báo chí cao cấp (ví dụ: `01 / KHÁM PHÁ CỘNG ĐỒNG`).
3. **`CampusMasthead`:** Bố cục phần đầu trang bất đối xứng (Asymmetrical Masthead), tích hợp tiêu đề typography khổng lồ, thanh điều hướng tìm kiếm phẳng sắc sảo và khối ảnh hoạt động sinh viên trường BAFU thật.
4. **`EditorialClubCard`:** Thẻ câu lạc bộ kích thước vừa (span 4/12 hoặc 3/12), hiển thị logo thật, ảnh hoạt động, tên CLB font Plus Jakarta Sans, nhãn chuyên môn và trạng thái tuyển.
5. **`FeatureClubTile`:** Thẻ câu lạc bộ dẫn đầu khổ lớn (span 6/12), dành riêng cho 2 CLB nổi bật hàng đầu danh sách với ảnh cover lớn và trích đoạn giới thiệu sâu sắc.
6. **`EventPoster`:** Bố cục thẻ sự kiện dạng áp phích (poster) có khối ngày tháng cỡ lớn font Oswald, ảnh minh họa, địa điểm rõ ràng và CTA tham gia.
7. **`DirectoryRow`:** Dạng hiển thị dòng danh bạ tinh gọn, phù hợp cho việc tra cứu nhanh nhiều CLB mà không chiếm diện tích trang.
8. **`AdminShell`:** Khung giao diện quản trị theo phong cách Functional Minimalism (Linear-inspired), tối ưu hóa diện tích hiển thị và tập trung vào dữ liệu tác vụ.
9. **`DashboardDataTable`:** Bảng dữ liệu quản trị chuẩn mật độ cao, có thanh công cụ lọc tìm kiếm, phân trang và cột hành động luôn ghim cố định.
