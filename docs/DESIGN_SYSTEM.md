# HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM SPECIFICATION)
## Dự án: University Club Portal — BAFU (Trường Đại học Nông - Lâm Bắc Giang)
**Phong cách chủ đạo:** Campus Modern + Premium Educational SaaS  
**Phiên bản:** 2.0.0  
**Tác giả:** Design System Architect & Senior UI/UX Specialist  

---

## 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (DESIGN PRINCIPLES)

1. **Bản sắc Đại học Hiện đại (Campus Identity):** Thể hiện sự trang trọng của cơ sở giáo dục đại học lâu năm kết hợp cùng sức sống, nhiệt huyết của thế hệ sinh viên Gen Z.
2. **Hiệu năng & Tinh giản (Content First, Zero Fluff):** Loại bỏ các hiệu ứng trang trí thừa thãi (glassmorphism dày đặc, gradient tím neon gây nhức mắt). Ưu tiên tốc độ quét thông tin, tỷ lệ tương phản cao và phân cấp nội dung mạch lạc.
3. **Thao tác Dễ dàng trên Di động (Mobile Optimization):** Thiết kế mọi tương tác form, nút bấm và bảng dữ liệu theo chuẩn chạm tối thiểu 44x44px. Bảng dữ liệu tự động thích ứng sang dạng Card trên màn hình cảm ứng.
4. **Tiêu chuẩn Khả năng Tiếp cận (WCAG 2.1 AA):** Độ tương phản màu sắc văn bản đạt tối thiểu 4.5:1 với body text và 3:1 với tiêu đề lớn. Mọi icon mang tính chức năng đều có nhãn accessibility (aria-label).

---

## 2. BẢNG MÀU THIẾT KẾ (COLOR PALETTE)

```
┌────────────────────────────────────────────────────────┐
│  Primary Navy:   #142B49   (Nhận diện tri thức & chiều sâu)  │
│  Campus Green:   #167C66   (Nông lâm, thanh xuân & tăng trưởng)│
│  Accent Gold:    #F3B846   (Năng lượng, điểm nhấn & thành tích)│
│  Background:     #F8FAFC   (Nền trung tính sáng, dịu mắt)     │
│  Surface:        #FFFFFF   (Nền thẻ trắng tinh khiết)         │
│  Text Primary:   #1F2937   (Đọc nội dung chính sắc nét)       │
│  Text Secondary: #64748B   (Ghi chú, phụ đề, thời gian)       │
│  Border:         #E2E8F0   (Đường viền ngăn cách tinh tế)     │
└────────────────────────────────────────────────────────┘
```

### 2.1 Chi tiết bảng mã màu CSS Variables
| Token Name | Hex Code | Ứng dụng cụ thể |
| :--- | :---: | :--- |
| `--brand-navy` | `#142B49` | Header, Sidebar điều hướng, Tiêu đề chính H1/H2, Nút chính Public |
| `--brand-navy-hover` | `#0E1F35` | Trạng thái hover của nút Navy |
| `--brand-green` | `#167C66` | Trạng thái thành công, Nút nộp đơn, Nhãn CLB Tình nguyện/Môi trường |
| `--brand-green-hover` | `#115E4D` | Hover nút Campus Green |
| `--brand-gold` | `#F3B846` | Huy hiệu nổi bật, Đợt tuyển đang mở, Xếp hạng sao, Cảnh báo |
| `--surface-bg` | `#F8FAFC` | Nền chung toàn trang (Slate-50 sáng tự nhiên) |
| `--surface-card` | `#FFFFFF` | Nền Card, Dialog, Bảng dữ liệu, Dropdown |
| `--border-subtle` | `#E2E8F0` | Đường kẻ khung thẻ, phân cách dòng bảng, input border |
| `--text-primary` | `#1F2937` | Tiêu đề bài viết, tên sinh viên, tên CLB |
| `--text-secondary` | `#64748B` | Mô tả ngắn, ngày tạo, số lượng thành viên, breadcrumbs |

---

## 3. NGHỆ THUẬT CHỮ & TYPOGRAPHY SCALE

- **Font chữ chính:** `Be Vietnam Pro` (Fallback: `Plus Jakarta Sans`, `Inter`, sans-serif).
- **Hỗ trợ Tiếng Việt:** 100% hiển thị hoàn hảo các ký tự có dấu, không bị lệch baseline hay gãy chữ.

| Cấp bậc (Hierarchy) | Kích thước (Size) | Line Height | Font Weight | Áp dụng cho |
| :--- | :---: | :---: | :---: | :--- |
| **Hero Display** | 48px - 56px | 1.15 | 800 (ExtraBold) | Tiêu đề lớn Trang chủ |
| **Heading 1 (H1)** | 32px - 36px | 1.25 | 700 (Bold) | Tiêu đề trang, Tên chi tiết CLB |
| **Heading 2 (H2)** | 24px - 28px | 1.3 | 700 (Bold) | Tiêu đề phân khu, Tên Tab chức năng |
| **Heading 3 (H3)** | 18px - 20px | 1.4 | 600 (SemiBold) | Tên CLB trong Card, Tiêu đề Modal |
| **Body Regular** | 15px - 16px | 1.6 | 400 (Regular) | Nội dung giới thiệu, Điều khoản, Tin tức |
| **Body Small** | 13px - 14px | 1.5 | 500 (Medium) | Ô nhập form, Header bảng dữ liệu, Menu |
| **Caption / Badge** | 11px - 12px | 1.4 | 600 (SemiBold) | Trạng thái hồ sơ, Mã sinh viên, Tag chuyên mục |

---

## 4. HỆ THỐNG BIỂU TƯỢNG CHUẨN HÓA (ICONOGRAPHY — LUCIDE REACT)

Toàn bộ icon trong hệ thống tuân thủ nghiêm ngặt chuẩn SVG từ thư viện `lucide-react`:
- **Kích thước chuẩn:** 18px - 20px cho điều hướng; 14px - 16px cho nút bấm nhỏ và badge.
- **Stroke Width:** 1.75 đến 2.0.
- **Quy tắc tuyệt đối:** Không sử dụng Emoji cho bất kỳ icon chức năng nào.

### Bảng tra cứu Icon theo ngữ cảnh nghiệp vụ:
| Chức năng | Icon Component | Kích thước | Ghi chú ngữ nghĩa |
| :--- | :--- | :---: | :--- |
| Trang chủ | `<House />` | 18px | Điều hướng về màn hình chính |
| Khám phá CLB | `<Compass />` | 18px | Khám phá danh mục CLB sinh viên |
| Danh sách CLB | `<UsersRound />` | 18px | Danh bạ và tập thể câu lạc bộ |
| Quản lý Hội viên | `<UserRoundCheck />` | 18px | Danh sách hội viên đã được duyệt |
| Nộp đơn ứng tuyển | `<ClipboardList />` | 18px | Hồ sơ và biểu mẫu xét tuyển |
| Mở đợt tuyển mới | `<UserRoundPlus />` | 18px | Tạo chiến dịch tuyển quân |
| Sự kiện & Lịch | `<CalendarDays />` | 18px | Sự kiện, lịch sinh hoạt thường niên |
| Tìm kiếm | `<Search />` | 16px | Thanh lọc tìm kiếm nhanh |
| Báo cáo & Thống kê | `<ChartNoAxesCombined />` | 18px | Dashboard phân tích toàn trường |
| Xuất tệp dữ liệu | `<Download />` | 16px | Xuất báo cáo CSV / Excel |
| Cài đặt | `<Settings2 />` | 18px | Tùy chỉnh thông tin CLB / Tài khoản |
| Quản trị & Bảo mật | `<ShieldCheck />` | 18px | Phân quyền và an toàn hệ thống |
| Album hình ảnh | `<Images />` | 18px | Quản lý media và hoạt động CLB |
| Đăng xuất | `<LogOut />` | 16px | Rút lui khỏi phiên làm việc an toàn |

---

## 5. THƯ VIỆN THÀNH PHẦN TÁI SỬ DỤNG (REUSABLE UI COMPONENTS)

Tất cả các thành phần được đóng gói trong `frontend/src/components/ui/`:
1. **`Button`:** Hỗ trợ các biến thể: `primary` (Navy), `success` (Campus Green), `secondary` (Gray Outline), `danger` (Red), `ghost`. Tích hợp trạng thái `loading` có spinner SVG đồng bộ và `disabled`.
2. **`Input` & `Textarea`:** Bo góc `rounded-xl`, viền nhạt `border-slate-200`, focus ring `focus:ring-2 focus:ring-[#167C66]`, hiển thị thông báo lỗi `error` phía dưới.
3. **`Badge`:** Các thẻ trạng thái nghiệp vụ chuẩn hóa:
   - `ACTIVE` / `ACCEPTED`: Nền xanh lá nhạt, viền xanh, chữ xanh đậm.
   - `PENDING` / `SUBMITTED`: Nền vàng hổ phách nhạt, viền vàng, chữ nâu hổ phách.
   - `UNDER_REVIEW`: Nền xanh dương nhạt.
   - `REJECTED`: Nền đỏ hồng nhạt.
   - `INACTIVE`: Nền xám tro.
4. **`ClubLogo`:** Hiển thị ảnh logo chuẩn từ máy chủ. Nếu chưa có ảnh, tự động render **Monogram Fallback sang trọng**: Tạo gradient riêng theo phân loại CLB (Học thuật, Tình nguyện, Thể thao, Nghệ thuật) với 2 chữ cái viết tắt in hoa thanh lịch.
5. **`Card`:** Khung thẻ trắng bo góc 20px (`rounded-2xl`), đổ bóng cực nhẹ (`shadow-xs` sang `shadow-md` khi hover), viền `border-slate-200/80`.
6. **`EmptyState`:** Khung thông báo không có dữ liệu chuyên nghiệp: Vector Icon trong vòng tròn nền nhạt, tiêu đề in đậm, mô tả hướng dẫn và nút CTA hành động.
