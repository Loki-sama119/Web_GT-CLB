# Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU (Web_GT-CLB)

> **Cổng thông tin & Không gian kết nối hoạt động sinh viên — Trường Đại học Nông – Lâm Bắc Giang (BAFU)**  
> *Được phát triển theo định hướng Modern University Campus × Premium Editorial × Youth Community Experience.*

---

## 📌 Tổng quan dự án

Dự án **Web_GT-CLB** là nền tảng số hóa quản lý và quảng bá hoạt động của các Câu lạc bộ, Đội, Nhóm sinh viên thuộc Trường Đại học Nông – Lâm Bắc Giang. Hệ thống cung cấp không gian tương tác trực quan cho sinh viên tìm kiếm CLB, theo dõi sự kiện, nộp hồ sơ ứng tuyển trực tuyến và hỗ trợ Ban Chủ nhiệm CLB quản lý thành viên, chiến dịch tuyển quân minh bạch.

---

## 🔐 Danh Sách Tài Khoản Quản Trị & Hướng Dẫn Trải Nghiệm

Hệ thống đã kích hoạt và sẵn sàng toàn bộ các cấp độ tài khoản quản trị thực tế (Real Administrative Accounts):

### 1. Quản Trị Viên Hệ Thống Toàn Trường (Super Admin)

> 👑 **Quyền hạn tối cao:** Quản lý toàn diện hệ sinh thái câu lạc bộ, phê duyệt phân quyền, cấu hình hệ thống và theo dõi an toàn thông tin toàn trường.

- **Email đăng nhập:** `admin@bafu.edu.vn`
- **Mật khẩu:** `AdminPassword@2026`
- **Họ và tên hiển thị:** Ban Giám Hiệu & Quản Trị Hệ Thống BAFU (ADMIN-001)
- **Đường dẫn bảng điều khiển:** Truy cập menu tài khoản góc trên bên phải $\rightarrow$ **Trang Quản Trị Hệ Thống** (hoặc `/super-admin`)
- **Các tính năng quản trị thực thụ:**
  - 📊 **Dashboard Toàn Cảnh**: Phân tích tổng số lượng người dùng, câu lạc bộ, tổng đơn ứng tuyển, sự kiện và tỷ lệ duyệt toàn trường theo biểu đồ trực quan.
  - 🛡️ **Bổ nhiệm Ban Chủ Nhiệm CLB**: Phân quyền Chủ nhiệm (`LEADER`), Phó chủ nhiệm (`VICE_LEADER`) cho bất kỳ sinh viên nào thuộc trường.
  - 👥 **Quản Trị Người Dùng & Phân Quyền**: Xem, tìm kiếm và quản lý toàn bộ tài khoản sinh viên và cán bộ; thay đổi vai trò hoặc trạng thái hoạt động.
  - 📑 **Nhật Ký Kiểm Toán (Audit Logs)**: Ghi vết toàn bộ hành vi quản trị (xét duyệt, xóa sửa, import, đổi vai trò) phục vụ an toàn thông tin theo chuẩn OWASP.
  - 📥 **Nhập / Xuất Danh Mục CLB Hàng Loạt**: Tải file mẫu CSV và import hàng loạt câu lạc bộ mới vào hệ thống.
  - 📈 **Xuất Báo Cáo Thống Kê**: Xuất toàn bộ báo cáo phân tích hoạt động CLB toàn trường ra file Excel.
  - 🔍 **Hàng Đợi Kiểm Duyệt Tư Liệu**: Xác minh tính xác thực của hình ảnh, logo và video trước khi công bố ra công chúng.

---

### 2. Quản Trị Viên Câu Lạc Bộ (Club Admin / Ban Chủ Nhiệm)

> 🎖️ **Quyền hạn Ban Chủ Nhiệm:** Quản lý thành viên, xuất Excel danh sách hội viên, đăng bài viết sự kiện, chỉnh sửa hình ảnh đại diện và ảnh nền (background) của câu lạc bộ mình phụ trách.

- **Mật khẩu đăng nhập chung:** `12345678`
- **Đường dẫn bảng điều khiển:** Đăng nhập tài khoản BCN $\rightarrow$ Truy cập **Quản Trị CLB** (hoặc `/club-admin`)

#### 📋 Danh sách tài khoản Ban Chủ Nhiệm theo từng CLB:

| STT | Câu Lạc Bộ Quản Lý | Chủ Nhiệm CLB | Email Đăng Nhập | Mật Khẩu |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **CLB Tình nguyện Xanh BAFU** | Vũ Quốc Bảo | `tinhnguyen.leader@bafu.edu.vn` | `12345678` |
| 2 | **CLB Tin học / BAFU Tech** | Lê Hoàng Nam | `it.leader@bafu.edu.vn` | `12345678` |
| 3 | **CLB Bóng Đá Sinh Viên BAFU** | Nguyễn Văn Hùng | `bongda.leader@bafu.edu.vn` | `12345678` |
| 4 | **CLB Cầu Lông BAFU Badminton** | Trần Thị Mai | `caulong.leader@bafu.edu.vn` | `12345678` |
| 5 | **CLB Guitar & Melody BAFU** | Phạm Minh Tuấn | `guitar.leader@bafu.edu.vn` | `12345678` |
| 6 | **CLB Tiếng Anh BEC** | Đỗ Thảo Vy | `english.leader@bafu.edu.vn` | `12345678` |
| 7 | **CLB Bóng Rổ BAFU Hoops** | Bùi Đức Anh | `bongro.leader@bafu.edu.vn` | `12345678` |
| 8 | **CLB Nhiếp Ảnh BAFU Lens** | Hoàng Yến Nhi | `nhiepanh.leader@bafu.edu.vn` | `12345678` |
| 9 | **CLB Võ Thuật Taekwondo & Karatedo** | Trịnh Đình Quang | `vothuat.leader@bafu.edu.vn` | `12345678` |
| 10 | **CLB MC & Kỹ Năng BAFU Voice** | Nguyễn Thị Lan | `truyenthong.leader@bafu.edu.vn` | `12345678` |

#### ✨ Các tính năng chi tiết của Ban Chủ Nhiệm (`/club-admin`):
1. 🖼️ **Chỉnh sửa Background & Avatar CLB**:
   - Nút **"Đổi logo"** trên avatar đại diện CLB.
   - Nút **"Đổi Background / Ảnh Bìa CLB"** (hỗ trợ tệp ảnh độ nét cao lên tới 5MB), tự động lưu trữ và hiển thị trực tiếp trên trang giới thiệu chi tiết câu lạc bộ.
2. 📢 **Tạo bài viết & Đăng hoạt động / Sự kiện CLB**:
   - Tab **"Đăng Bài / Sự Kiện CLB"**: Đăng tải thông tin các buổi workshop, giao lưu, tập huấn hoặc giải thi đấu (Tiêu đề, mô tả nội dung, địa điểm tổ chức, thời gian bắt đầu/kết thúc, giới hạn số lượng sinh viên tham gia).
3. ➕ **Thêm thành viên mới trực tiếp**:
   - Tab **"Danh Sách Hội Viên"** $\rightarrow$ Nút **"+ Thêm Thành Viên"**: Cho phép nhập nhanh **Email** hoặc **Mã sinh viên (MSSV)** và lựa chọn vai trò (`Hội viên`, `Phó chủ nhiệm`, `Chủ nhiệm`) để ghi danh trực tiếp vào tổ chức.
4. 🗑️ **Xóa thành viên & Phân quyền nội bộ**:
   - Nút xóa hội viên (icon Thùng rác) loại bỏ thành viên không còn sinh hoạt khỏi danh sách chính thức.
   - Hộp chọn chức vụ cho phép thăng cấp/điều chỉnh vai trò của thành viên tức thời mà không cần reload trang.
5. 📊 **Xuất danh sách thành viên ra file Excel "đẹp mê li"**:
   - Nút **"Xuất Danh Sách (Excel/CSV)"**: Tải ngay file bảng tính chuẩn định dạng **UTF-8 with BOM**, tự động nhận diện tiếng Việt có dấu hoàn hảo trên mọi phiên bản Microsoft Excel, Google Sheets, WPS Office.
   - Các cột hiển thị sắc sảo, đầy đủ: `STT`, `Họ Và Tên`, `Mã Sinh Viên`, `Email`, `Số Điện Thoại`, `Khoa/Khóa`, `Chức Vụ Trong CLB`, `Trạng Thái`, `Ngày Gia Nhập`.
   - Cơ chế bảo mật: Tự động xử lý ký tự chống tấn công CSV/Formula Injection theo tiêu chuẩn OWASP ASVS.
6. 📝 **Xét duyệt đơn ứng tuyển trực tuyến**:
   - Tab **"Xét Duyệt Hồ Sơ Ứng Tuyển"**: Xem chi tiết câu trả lời ứng tuyển của sinh viên, ghi chú nội bộ của ban tuyển quân, và nút **"✓ Duyệt trúng tuyển"** (Hệ thống tự động kích hoạt tư cách hội viên chính thức và gửi thông báo chúc mừng).

---

### 3. Tài Khoản Sinh Viên (Trải Nghiệm Nộp Đơn & Đăng Ký)

Dành cho người dùng thử nghiệm luồng ứng tuyển vào các câu lạc bộ và đăng ký vé tham gia sự kiện:

- **Mật khẩu chung:** `12345678`
- `haidang.sv@bafu.edu.vn` (Nguyễn Hải Đăng - K49 CNTT)
- `minhthu.sv@bafu.edu.vn` (Trần Minh Thư - K49 Kinh tế)
- `quanghuy.sv@bafu.edu.vn` (Phạm Quang Huy - K48 Cơ Điện)
- `thutrang.sv@bafu.edu.vn` (Lê Thu Trang - K48 Nông học)

---

## 🎨 Giao diện mới: Campus Editorial & Authentic Experience

Hệ thống vừa hoàn thành đợt tái thiết kế toàn diện (Homepage Redesign) với các đặc điểm nổi bật:

### 1. Bảng màu & Nhận diện thương hiệu (Visual Identity)
- **Forest Green (`#0F5132`)**: Màu xanh nông lâm đặc trưng, biểu trưng cho tri thức và sức sống thanh niên BAFU.
- **Emerald (`#16845A`)**: Gam xanh trẻ trung, hiện đại cho các điểm nhấn tương tác.
- **Cream White (`#F8FAF7`)**: Nền sáng thanh lịch, dễ chịu cho mắt khi đọc nội dung dài.
- **Charcoal (`#17211C`)**: Màu chữ đen than đậm đà, tương phản sắc nét.
- **Accent Gold (`#E7B85B`)**: Điểm xuyết huy hiệu, giải thưởng và trạng thái vinh danh.
- **Typography**: Phông chữ hiện đại tiếng Việt *Plus Jakarta Sans* và *Be Vietnam Pro*.

### 2. Bố cục 8 phần chuẩn mực trang chủ
1. **Navbar cao cấp**: Thanh điều hướng sticky với BrandWordmark typographic `BF BAFU. CAMPUS CLUBS`, tự động co giãn thông minh không tràn viền trên mobile 390px.
2. **Hero Banner Full-Width (760px)**: Ảnh toàn cảnh campus BAFU độ nét cao (`campus-overview.jpg`), khẩu hiệu *"KHÁM PHÁ CỘNG ĐỒNG SINH VIÊN BAFU"*, bộ nút bấm Dual CTA và thanh tìm kiếm câu lạc bộ nổi (Floating Search Bar).
3. **Thanh Thống Kê Sống (Live Metrics Counter)**: Thể hiện số lượng CLB đã đối chiếu nguồn, lĩnh vực hoạt động và chuyên trang xác minh tư liệu.
4. **Visual Club Grid (3 cột desktop)**: Trình bày danh bạ câu lạc bộ với thẻ bo góc hiện đại, tỷ lệ ảnh 16:9, viền gradient phân loại lĩnh vực và nhãn trạng thái minh bạch.
5. **Editorial Campus Gallery & Lightbox**: Khung ảnh hoạt động sinh viên bất đối xứng (1 ảnh tiêu điểm lớn + 3 ảnh tư liệu), tích hợp Modal phóng to (Lightbox) xem ảnh độ phân giải gốc kèm chú thích nguồn.
6. **Video Phóng Sự BAFU (16:9 YouTube Official)**: Tích hợp video giới thiệu trường chính thức từ kênh YouTube `@dhnlbg` với giao diện phát video chuẩn tỷ lệ, không tự động phát tiếng gây phiền người dùng.
7. **Dải Kêu Gọi Hành Động (Action Band)**: Kêu gọi sinh viên tham gia cộng đồng và đề xuất thành lập câu lạc bộ mới.
8. **Footer Minh Bạch & Bản Quyền**: Footer 4 cột với tuyên bố bản quyền, liên kết nhanh, địa chỉ trường và ghi chú minh bạch dữ liệu.

---

## 🛡️ Chính sách Dữ liệu & Tư liệu Xác thực (Authenticity Policy)

Nhằm đảm bảo tính trung thực và bảo vệ uy tín hình ảnh Nhà trường:

- **Loại bỏ 100% hình ảnh không có thật**: Đã gỡ bỏ toàn bộ ảnh nền vũ trụ giả lập (`bg_galaxy_*`), các logo fanpage chưa được Đoàn trường cấp phép, và ảnh stock không thuộc khuôn viên BAFU.
- **Cơ chế Fallback trung tính**: Khi một CLB chưa có ảnh hoặc logo được phê duyệt chính thức, giao diện tự động sử dụng huy hiệu chữ viết tắt (Initials Badge) hoặc thông báo *"Hình ảnh đang cập nhật"* thay vì gán ghép ảnh giả.
- **Danh mục 5 CLB đã đối chiếu nguồn lưu trữ chính thức**:
  1. *CLB Tình nguyện Xanh BAFU* (Tình nguyện & Xã hội)
  2. *CLB Hiến máu tình nguyện BAFU* (Nhân đạo & Chữ thập đỏ)
  3. *CLB Tin học BAFU* (Khoa học & Kỹ thuật số)
  4. *CLB Khởi nghiệp BAFU* (Đổi mới sáng tạo & Hướng nghiệp)
  5. *CLB Văn nghệ BAFU* (Văn hóa, Nghệ thuật & Tuyên truyền ca khúc cách mạng)
- **Minh bạch số liệu**: Xóa bỏ hoàn toàn số lượng thành viên ảo hay các chiến dịch tuyển quân giả mạo.

---

## 💻 Công nghệ sử dụng (Tech Stack)

| Tầng | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 6 | SPA tốc độ cao, hỗ trợ SSR/Preview |
| **Styling** | Tailwind CSS 4 | Modern utility-first CSS |
| **Icons & UI** | Phosphor Icons & Lucide | Hệ thống icon tối giản, sắc sảo |
| **Backend** | Express 5 (Node.js 20 LTS) | RESTful API, cookie HTTP-only, Rate Limiting |
| **Database** | PostgreSQL 16 + Prisma ORM 6 | Cơ sở dữ liệu quan hệ, di chuyển schema an toàn |
| **Reverse Proxy** | Nginx Alpine | Cân bằng tải, reverse proxy API, nén gzip và cache static assets |
| **Đóng gói** | Docker & Docker Compose | Đóng gói 5 container độc lập (Multi-stage build) |

---

## 🚀 Hướng dẫn khởi chạy hệ thống

### Cách 1: Sử dụng file `start.bat` (Khuyên dùng trên Windows)

Chỉ cần bấm đúp vào file `start.bat` (ở thư mục gốc hoặc thư mục `Web_GT-CLB`), menu điều khiển tương tác sẽ xuất hiện:

```text
=====================================================================
       CỔNG THÔNG TIN CÂU LẠC BỘ SINH VIÊN BAFU (WEB_GT-CLB)
           Trường Đại học Nông - Lâm Bắc Giang
=====================================================================

  [1] Khởi chạy toàn bộ hệ thống bằng Docker (Khuyên dùng)
      - Bao gồm: Nginx (Cổng 80), Frontend, Backend, PostgreSQL
      - Tự động mở trình duyệt http://localhost

  [2] Khởi chạy chế độ Lập trình Dev (Local Node.js)
      - Bật PostgreSQL Docker (Cổng 5433)
      - Mở Backend Dev (npm run dev trên cổng 5000)
      - Mở Frontend Dev (npm run dev trên cổng 5173)

  [3] Kiểm tra trạng thái hệ thống và Container Health

  [4] Dừng toàn bộ hệ thống Docker (docker compose down)

  [5] Build lại toàn bộ Docker từ đầu (No cache rebuild)

  [6] Xem Logs thời gian thực của hệ thống (docker compose logs)

  [0] Thoát
=====================================================================
```

> **Mẹo:** Nhấn phím `1` (hoặc Enter) để khởi chạy toàn bộ và tự động mở website trên trình duyệt!

---

### Cách 2: Khởi chạy bằng Docker Compose thủ công

Yêu cầu máy tính đã cài đặt **Docker Desktop**.

```powershell
# 1. Di chuyển vào thư mục dự án
cd Web_GT-CLB

# 2. Xây dựng và khởi chạy các container ngầm
docker compose up -d --build

# 3. Mở trình duyệt trải nghiệm
start http://localhost
```

**Các cổng dịch vụ đã cấu hình sẵn:**
- **Cổng thông tin sinh viên**: [http://localhost](http://localhost) (Cổng 80 thông qua Nginx)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Backend Health Check**: [http://localhost:5000/health](http://localhost:5000/health)
- **PostgreSQL Database**: `localhost:5433` (User: `postgres`, Password: `postgrespassword`, DB: `club_portal_db`)
- **E2E Test Endpoint**: [http://localhost:18080](http://localhost:18080) (Đã điều chỉnh sang cổng 18080 để tránh xung đột cổng 8080)

---

### Cách 3: Chế độ phát triển (Local Development)

Nếu bạn muốn chỉnh sửa mã nguồn trực tiếp mà không qua Docker:

```powershell
# 1. Khởi chạy cơ sở dữ liệu PostgreSQL
docker compose up -d postgres

# 2. Khởi chạy Backend
cd backend
npm install
npx prisma generate
npm run dev

# 3. Khởi chạy Frontend (mở một Terminal mới)
cd frontend
npm install
npm run dev
# Truy cập giao diện Vite Dev tại: http://localhost:5173
```

---

## 🧪 Kiểm thử chất lượng (Testing & Verification)

Dự án đã vượt qua tất cả các bộ kiểm thử tự động:

- **Code Quality**: `npm run lint` (`oxlint`) — **0 errors**.
- **Production Bundle**: `npm run build` (Vite) — **PASS** (Hoàn tất đóng gói không lỗi).
- **Docker Image Build**: Multi-stage build cho Frontend & Backend với cờ `--no-cache` — **PASS**.
- **Responsive Viewport Verification**: Kiểm tra trực quan trên 4 kích cỡ màn hình tiêu chuẩn:
  - Desktop FHD: `1920 × 1080px`
  - Desktop Chuẩn: `1440 × 900px`
  - Tablet: `768 × 1024px`
  - Mobile: `390 × 844px` (iPhone 12/13/14)

---

## 📚 Tài liệu nghiệm thu liên quan

Xem chi tiết trong thư mục `docs/`:
- [`BAFU_HOMEPAGE_REDESIGN.md`](docs/BAFU_HOMEPAGE_REDESIGN.md): Đặc tả kiến trúc giao diện trang chủ, bảng màu và nhịp điệu typography.
- [`BAFU_MEDIA_REAUDIT.md`](docs/BAFU_MEDIA_REAUDIT.md): Báo cáo rà soát và loại bỏ toàn diện hình ảnh sai nguồn gốc.
- [`BAFU_UI_ACCEPTANCE.md`](docs/BAFU_UI_ACCEPTANCE.md): Biên bản nghiệm thu kiểm thử responsive, lightbox và video embed.
- [`BAFU_REAL_CLUB_CATALOG.md`](docs/BAFU_REAL_CLUB_CATALOG.md): Danh mục hồ sơ đối chiếu các CLB BAFU.

Ảnh chụp màn hình nghiệm thu đầy đủ lưu tại: `screenshots/homepage-redesign/`.

---

## 👥 Nhóm phát triển

- **Đơn vị chủ quản**: Dự án Cổng thông tin CLB BAFU — Trường Đại học Nông – Lâm Bắc Giang
- **Phiên bản**: `2.5.0-administrative`
- **Kho lưu trữ GitHub**: [https://github.com/Loki-sama119/Web_GT-CLB](https://github.com/Loki-sama119/Web_GT-CLB)
