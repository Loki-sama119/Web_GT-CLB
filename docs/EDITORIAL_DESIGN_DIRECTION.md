# BAFU CAMPUS EDITORIAL — DESIGN DIRECTION & AUDIT

**Dự án:** University Club Portal — Trường Đại học Nông – Lâm Bắc Giang (BAFU)  
**Tác giả:** Creative Director, Editorial Web Designer, Design Systems Engineer  
**Phong cách chủ đạo:** Swiss International Typographic Style + Contemporary Editorial Web Design  
**Tên định hướng:** `BAFU CAMPUS EDITORIAL`  
**Ngày phê duyệt:** 27/10/2026  

---

## 1. DESIGN AUDIT: NHẬN DIỆN CÁC MẪU THIẾT KẾ CŨ CẦN LOẠI BỎ

Qua đối chiếu mã nguồn và ảnh chụp giao diện các phiên bản trước, hệ thống đã lạm dụng các mẫu thiết kế của "Generic SaaS Landing Page":

1. **Hero Split 50:50 khuôn mẫu:** 
   - Khối văn bản chiếm 50% bên trái và một khối ảnh bo góc `rounded-3xl` trôi nổi bên phải.
   - Trông như landing page của một công ty khởi nghiệp phần mềm thay vì cổng thông tin học thuật - sinh viên của một trường đại học.
2. **Lạm dụng thẻ bo tròn (Rounded Card Syndrome):**
   - Hầu như mọi thông tin đều bị đóng gói trong các card bo góc lớn (`rounded-2xl`, `rounded-3xl`) với bóng mờ (`shadow-xs`, `shadow-md`).
   - Thiếu cấu trúc phân cách bằng đường kẻ lưới (hairline border) và khoảng trắng (whitespace) của phong cách Thụy Sĩ.
3. **Mặt phẳng trắng đơn điệu (White Surface Stacking):**
   - Xếp chồng các khối màu trắng liên tiếp trên nền xám nhạt `bg-[#F8FAFC]`.
   - Không có nhịp điệu thị giác (visual rhythm), thiếu sự biến chuyển tương phản giữa nền giấy ấm (`#F4F0E7`), nền trắng tinh khiết (`#FFFFFF`), và mảng màu nhấn sâu (`#12674D`, `#181C1B`).
4. **Lưới thẻ lặp lại máy móc (Repeated Identical Grids):**
   - 3 thẻ CLB, 3 thẻ sự kiện, 4 thẻ thống kê có kích thước và tỷ lệ hệt nhau được nhân bản từ đầu đến chân trang.
   - Không có phân cấp diện tích (modular hierarchy), không có card dẫn đầu (featured anchor) để dẫn dắt mắt người đọc.
5. **Huy hiệu dạng viên thuốc (Generic Pill Badges):**
   - Quá nhiều badge `rounded-full` kèm icon duotone Phosphor tạo cảm giác "giao diện đồ chơi", làm loãng tính tôn nghiêm và chiều sâu biên tập của một trường đại học công lập.
6. **Lạm dụng khối Navy đặc:**
   - Dùng thanh banner màu xanh navy tối bao trùm đầu mọi trang gây nặng nề và lặp lại.

---

## 2. TRIẾT LÝ THIẾT KẾ MỚI: BAFU CAMPUS EDITORIAL

Lấy cảm hứng từ các thiết kế xuất sắc của **RISD Identity**, **University of the Arts London (UAL)**, **Swiss Typographic Style** và bản cập nhật **Linear UI (March 2026)**:

### 2.1. Tôn vinh Typography biểu cảm (Expressive Typography)
- **Display Heading:** Sử dụng **Oswald** (Bold & SemiBold) — font chữ dạng cô đọng (condensed), thẳng đứng, dứt khoát, mang tinh thần báo chí và poster văn hóa châu Âu.
- **Body & Data:** Sử dụng **Plus Jakarta Sans** — font chữ hình học hiện đại, thoáng đãng, tối ưu cho khả năng đọc lướt, biểu mẫu và dữ liệu bảng.
- **Tỉ lệ phân cấp nghiêm ngặt:** Headline H1 từ 72–88px (desktop), tiêu đề chuyên mục 44–56px, tương phản mạnh mẽ với nội dung 15–17px và nhãn biên tập (eyebrow) 12–13px viết hoa có số thứ tự.

### 2.2. Hệ lưới 12 cột & Bố cục Modular Bento Grid
- Cấu trúc lưới 12 cột thực sự (Desktop max-width `1320px`, gap `24px`).
- Phân cách bằng **đường kẻ viền thanh lịch (hairline border `#D8D5CD`)**, không phụ thuộc vào đổ bóng mờ.
- **Asymmetrical Hierarchy:** Câu lạc bộ nổi bật chiếm 6/12 cột với ảnh lớn; các CLB tiếp theo chiếm 3 hoặc 4 cột, hoặc hiển thị dưới dạng hàng danh bạ (directory rows).

### 2.3. Nhịp điệu màu sắc giấy in & mực (Paper & Ink Palette)
- **Paper (`#F4F0E7`):** Nền giấy ấm tự nhiên, tạo cảm giác xúc giác của ấn phẩm tạp chí đại học.
- **Ink (`#181C1B`):** Màu mực đen sâu thẳm, thay thế màu đen kỹ thuật số thông thường, bảo đảm độ tương phản tối cao (WCAG AAA).
- **Forest (`#12674D`):** Sắc xanh rừng thẳm của Trường Nông – Lâm Bắc Giang, đại diện cho tri thức nông nghiệp sinh thái và sức sống thanh niên.
- **Coral (`#EF673F`):** Điểm nhấn cam san hô rực rỡ, sử dụng có chủ đích cho các hành động quan trọng (CTA) và trạng thái khẩn cấp/đang tuyển.
- **Neutral Border (`#D8D5CD`):** Đường kẻ viền chia ô sắc sảo theo chuẩn Swiss Design.

### 2.4. Phân định rõ ràng giữa Trang Khám Phá và Dashboard Quản Trị
- **Trang Công khai (Public Portal):** BAFU Campus Editorial (Oswald display, Modular Bento Grid, ảnh tư liệu sinh viên trường thật, số thứ tự chuyên mục `01 / 02 / 03`).
- **Trang Quản trị (Admin Dashboards):** Functional Minimalism (cảm hứng Linear UI — Sidebar gọn 240px, Topbar 56px, Plus Jakarta Sans, mật độ dữ liệu cao, thanh công cụ tìm kiếm lọc tập trung, bảng dữ liệu không có khoảng trống thừa, thao tác ghim cố định).
