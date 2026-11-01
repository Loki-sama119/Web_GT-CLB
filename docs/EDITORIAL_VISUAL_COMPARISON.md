# BAFU CAMPUS EDITORIAL — BÁO CÁO ĐỐI CHIẾU THỊ GIÁC (VISUAL COMPARISON)

**Dự án:** University Club Portal — Trường Đại học Nông – Lâm Bắc Giang (BAFU)  
**Thời điểm thực hiện:** 27/10/2026  
**Chuyên gia:** Creative Director, Editorial Web Designer, QA Systems Lead  
**Tập ảnh bằng chứng lưu trữ:** `docs/editorial-redesign/`  

---

## 1. BẢNG ĐỐI CHIẾU TỔNG THỂ KIẾN TRÚC GIAO DIỆN

| Tiêu chí phân tích | Giao diện cũ (Generic SaaS Style) | BAFU Campus Editorial (Swiss Typographic) | Đánh giá mức độ chuyển đổi |
| :--- | :--- | :--- | :--- |
| **Bố cục Hero** | Split 50:50 khuôn mẫu: 50% chữ bên trái, 50% ảnh bo góc tròn `rounded-3xl` trôi nổi kèm badge bóng mờ | **Asymmetric Editorial Masthead:** Cột trái 5/12 với Oswald typography khổng lồ, cột phải 7/12 chứa ảnh sinh viên BAFU khổ lớn và thanh số liệu Thụy Sĩ | **Thay đổi hoàn toàn kiến trúc** |
| **Typography Display** | Be Vietnam Pro thông thường, cỡ chữ tối đa 46px, thiếu độ dày và sức mạnh báo chí | **Oswald Bold (74px trên Desktop, 44px trên Mobile)**, chữ cô đọng (condensed), thẳng đứng, dứt khoát | **Khác biệt rõ rệt** |
| **Typography Body** | Be Vietnam Pro dùng chung cho toàn bộ giao diện | **Plus Jakarta Sans**, tối ưu độ thoáng, căn lề và tính chuyên biệt của dữ liệu | **Chuẩn hóa công thái học** |
| **Màu nền (Background Rhythm)**| Một màu xám nhạt `bg-[#F8FAFC]` trải dài suốt trang, xếp các card trắng lên trên | **Nhịp điệu nền:** Nền giấy ấm `paper (#F4F0E7)` -> Nền trắng `white (#FFFFFF)` -> Nền xanh rừng sâu `forest (#12674D)` -> Nền giấy ấm | **Tạo chiều sâu không gian** |
| **Hệ thống viền & phân cách** | Bo góc lớn `rounded-2xl`, `rounded-3xl`, lạm dụng đổ bóng mờ `shadow-xs`, `shadow-md` | **Đường kẻ viền sắc nét 1px (hairline border `#D8D5CD`)**, góc vuông dứt khoát hoặc `rounded-none`, loại bỏ hoàn toàn đổ bóng mờ ảo | **Loại bỏ SaaS visual noise** |
| **Bố cục danh bạ CLB** | 3 thẻ bo góc có gradient lặp lại, xếp đều 3 cột máy móc | **Modular Bento Grid:** 2 CLB dẫn đầu chiếm khổ lớn 6/12 cột (`FeatureClubTile`), các CLB còn lại hiển thị dạng 4/12 cột hoặc hàng danh bạ (`DirectoryRow`) | **Tôn vinh phân cấp thị giác** |
| **Khối Sự kiện** | Thẻ card lặp lại với icon nhỏ | **Event Poster Design:** Khối ngày tháng cỡ lớn font Oswald (`28 THÁNG 03`), ảnh áp phích và nút đăng ký tương phản cao | **Đậm chất poster sự kiện** |
| **Thanh tìm kiếm & Điều hướng** | Thanh pill bo tròn lớn, badge đính kèm icon | **Editorial Search Bar & Category Navigation:** Khung viền 1px dứt khoát, nút chữ nhật đen mực `#181C1B`, nhãn viết hoa có khoảng cách chữ rộng | **Tính năng sắc sảo, tinh gọn** |

---

## 2. DANH MỤC ẢNH CHỤP MINH CHỨNG TRƯỚC VÀ SAU (BEFORE & AFTER)

Tất cả 8 ảnh chụp màn hình được sinh tự động bằng Playwright Chromium tại cùng độ phân giải và cùng bộ dữ liệu:

### 2.1. Trang Chủ (Homepage)
1. **Desktop (1440px):**
   - *Trước (Before):* [current-home-desktop.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/current-home-desktop.png) — Bố cục SaaS 2 cột 50:50, card tròn, badge pill.
   - *Sau (After):* [prototype-home-desktop.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/prototype-home-desktop.png) — Masthead báo chí bất đối xứng, Oswald 74px, ảnh tư liệu sinh viên BAFU, ticker 3 ô số liệu.
2. **Mobile (390px):**
   - *Trước (Before):* [current-home-mobile.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/current-home-mobile.png) — Bố cục dọc dồn nén, card bo tròn dày.
   - *Sau (After):* [prototype-home-mobile.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/prototype-home-mobile.png) — Bố cục báo chí co giãn tự nhiên, typography sắc sảo, nút CTA màu cam san hô `#EF673F` nổi bật.

### 2.2. Danh Bạ Câu Lạc Bộ (Clubs Directory)
1. **Desktop (1440px):**
   - *Trước (Before):* [current-directory-desktop.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/current-directory-desktop.png) — Khung trắng bo tròn đơn điệu, các card có cấu trúc giống nhau.
   - *Sau (After):* [prototype-directory-desktop.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/prototype-directory-desktop.png) — Bố cục Modular Bento: 2 card dẫn đầu khổ rộng 6 cột, thanh lọc danh mục dạng báo chí, chuyển đổi chế độ xem Grid / Rows linh hoạt.
2. **Mobile (390px):**
   - *Trước (Before):* [current-directory-mobile.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/current-directory-mobile.png)
   - *Sau (After):* [prototype-directory-mobile.png](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docs/editorial-redesign/prototype-directory-mobile.png) — Thẻ phẳng sắc nét, danh mục xếp hàng ngang dễ thao tác ngón cái.

---

## 3. KẾT LUẬN GIAI ĐOẠN C

Prototype BAFU CAMPUS EDITORIAL đã **thực sự thay đổi ngôn ngữ thị giác**:
- Không còn cảm giác template SaaS đại trà.
- Thể hiện trọn vẹn tinh thần học thuật, sức sống thanh niên và tính kỷ luật bố cục của Swiss Typographic Style.
- Sẵn sàng chuyển tiếp sang **Giai đoạn D — Áp dụng toàn diện (Apply)** vào các trang chính của hệ thống.
