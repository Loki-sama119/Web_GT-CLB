# 🎓 Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU (Web_GT-CLB)

> **Cổng Thông Tin & Không Gian Kết Nối Hoạt Động Sinh Viên — Trường Đại học Nông – Lâm Bắc Giang (BAFU)**  
> *Phiên bản: 2.6.0-enterprise | Thiết kế: Modern University Campus × Premium Editorial × Youth Community Experience.*  
> *Kho lưu trữ chính thức:* [https://github.com/Loki-sama119/Web_GT-CLB](https://github.com/Loki-sama119/Web_GT-CLB)

---

## 📌 Giới thiệu dự án

**Web_GT-CLB** là nền tảng số hóa quản lý, quảng bá và kết nối toàn diện hệ sinh thái các Câu lạc bộ, Đội, Nhóm sinh viên thuộc **Trường Đại học Nông – Lâm Bắc Giang (BAFU)**. Dự án được xây dựng với mục tiêu:
- Cung cấp cổng thông tin minh bạch, hiện đại, chuẩn nhận diện thương hiệu BAFU.
- Cho phép sinh viên khám phá CLB, đăng ký tham gia sự kiện và nộp hồ sơ gia nhập trực tuyến.
- Trao quyền cho Ban Chủ Nhiệm quản trị thành viên, xuất bảng tính Excel chất lượng cao, đăng bài viết sự kiện và tùy biến hình ảnh đại diện / ảnh bìa CLB.
- Cung cấp công cụ quản trị hệ thống toàn diện cho Nhà trường (Super Admin) kèm nhật ký kiểm toán bảo mật và cơ chế xác thực OTP qua Email.

---

## 🚀 Hướng Dẫn Nhanh Cho Người Mới (Quick Start Guide)

Dự án đã được tự động hóa tối đa để người mới clone về có thể **chạy ngay chỉ trong 1 thao tác**.

### 1. Yêu cầu chuẩn bị
- **Hệ điều hành:** Windows 10/11 (hoặc macOS / Linux).
- **Phần mềm cần cài đặt:**
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Khuyên dùng — Đảm bảo đã bật Docker Desktop trước khi chạy).
  - [Git](https://git-scm.com/) để tải mã nguồn.

---

### 2. Các bước khởi chạy trên Windows (Khuyên Dùng)

#### Bước 1: Tải mã nguồn về máy
Mở Terminal / PowerShell và gõ:
```bash
git clone https://github.com/Loki-sama119/Web_GT-CLB.git
cd Web_GT-CLB
```

#### Bước 2: Chạy file `start.bat`
Chỉ cần **bấm đúp chuột vào file `start.bat`** (hoặc gõ `.\start.bat` trong Terminal). Menu điều khiển tiếng Việt sẽ xuất hiện:

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
Nhập lựa chọn của bạn (Mặc định [1]):
```

👉 **Nhấn phím `1` và Enter (hoặc chỉ cần Enter):** Hệ thống sẽ tự động khởi động toàn bộ cơ sở dữ liệu, backend, frontend và mở sẵn trình duyệt tại [http://localhost](http://localhost).

---

### 3. Khởi chạy bằng Docker Compose thủ công
Nếu bạn không dùng Windows hoặc muốn gõ lệnh trực tiếp:
```bash
# Khởi chạy toàn bộ các dịch vụ
docker compose up -d

# Xem website tại:
# http://localhost
```

---

### 4. Bảng cổng dịch vụ sau khi khởi chạy
| Dịch vụ | Địa chỉ truy cập | Ghi chú |
| :--- | :--- | :--- |
| **Website Cổng Thông Tin CLB** | [http://localhost](http://localhost) | Cổng 80 qua Nginx Reverse Proxy |
| **Backend RESTful API** | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) | Express 5 Backend |
| **Kiểm tra sức khỏe Backend** | [http://localhost:5000/health](http://localhost:5000/health) | Trả về `{"status":"OK"}` |
| **Cơ sở dữ liệu PostgreSQL** | `localhost:5433` | User: `postgres` / Pass: `postgrespassword` / DB: `club_portal_db` |
| **E2E Test Endpoint** | [http://localhost:18080](http://localhost:18080) | Môi trường test tự động độc lập |

---

## 🔐 Danh Sách Tài Khoản & Mật Khẩu Đăng Nhập

Hệ thống đã kích hoạt sẵn **100% tài khoản hoạt động thực tế** (1 Super Admin, 10 Ban Chủ Nhiệm, 4 Sinh viên mẫu). Bạn có thể đăng nhập ngay mà không cần tạo mới:

### 👑 1. Tài khoản Quản Trị Viên Hệ Thống Toàn Trường (Super Admin)
Dành cho Ban Giám Hiệu, Phòng Công tác sinh viên hoặc Đoàn Thanh niên trường để quản lý toàn bộ hệ thống:

- **Email đăng nhập:** `admin@bafu.edu.vn`
- **Mật khẩu:** `AdminPassword@2026`
- **Họ và tên:** Ban Giám Hiệu & Quản Trị Hệ Thống BAFU (Mã: `ADMIN-001`)
- **Đường dẫn Bảng điều khiển:** Bấm menu tài khoản góc trên bên phải $\rightarrow$ chọn **Quản Trị Hệ Thống** (hoặc truy cập `/admin/dashboard`).
- **Các quyền hạn thực tế:**
  - 📊 **Dashboard Phân Tích Toàn Trường**: Thống kê số lượng người dùng, câu lạc bộ, tổng số đơn ứng tuyển, sự kiện và tỷ lệ duyệt thành viên.
  - 🛡️ **Bổ nhiệm Ban Chủ Nhiệm**: Phân quyền Chủ nhiệm (`LEADER`) hoặc Phó chủ nhiệm (`VICE_LEADER`) cho bất kỳ tài khoản sinh viên nào.
  - 👥 **Quản Trị Người Dùng**: Khóa/mở khóa tài khoản, tìm kiếm theo tên, MSSV, thay đổi vai trò hệ thống.
  - 📑 **Nhật Ký Kiểm Toán (Audit Logs)**: Ghi vết bảo mật theo chuẩn an toàn thông tin (ai đã duyệt, xóa, thay đổi dữ liệu nào, vào thời gian nào).
  - 📥 **Import / Export Danh Mục CLB**: Tải template CSV và nhập hàng loạt CLB mới.
  - 📈 **Báo Cáo Thống Kê Hoạt Động**: Xuất toàn cảnh số liệu các CLB ra file bảng tính.

---

### 🎖️ 2. Tài khoản Ban Chủ Nhiệm Các Câu Lạc Bộ (Club Admin)
Dành cho Chủ nhiệm & Ban chấp hành của từng CLB để quản lý riêng tổ chức của mình:

- **Mật khẩu đăng nhập chung:** `12345678`
- **Đường dẫn Bảng điều khiển:** Đăng nhập tài khoản BCN $\rightarrow$ Bấm menu tài khoản $\rightarrow$ chọn **Quản Lý CLB (Admin)** (hoặc truy cập `/club-admin`).

#### 📋 Bảng danh sách tài khoản Ban Chủ Nhiệm:
| STT | Câu Lạc Bộ Quản Lý | Họ và Tên Chủ Nhiệm | Email Đăng Nhập | Mật Khẩu |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **CLB Tình nguyện Xanh BAFU** | Vũ Quốc Bảo | `tinhnguyen.leader@bafu.edu.vn` | `12345678` |
| 2 | **CLB Tin học / BAFU Tech** | Lê Hoàng Nam | `it.leader@bafu.edu.vn` | `12345678` |
| 3 | **CLB Bóng Đá Sinh Viên BAFU** | Nguyễn Văn Hùng | `bongda.leader@bafu.edu.vn` | `12345678` |
| 4 | **CLB Cầu Lông BAFU Badminton** | Trần Thị Mai | `caulong.leader@bafu.edu.vn` | `12345678` |
| 5 | **CLB Guitar & Melody BAFU** | Phạm Minh Tuấn | `guitar.leader@bafu.edu.vn` | `12345678` |
| 6 | **CLB Tiếng Anh BEC** | Đỗ Thảo Vy | `english.leader@bafu.edu.vn` | `12345678` |
| 7 | **CLB Bóng Rổ BAFU Hoops** | Bùi Đức Anh | `bongro.leader@bafu.edu.vn` | `12345678` |
| 8 | **CLB Nhiếp Ảnh BAFU Lens** | Hoàng Yến Nhi | `nhiepanh.leader@bafu.edu.vn` | `12345678` |
| 9 | **CLB Võ Thuật Taekwondo & Karatedo** | Dương Tấn Đạt | `vothuat.leader@bafu.edu.vn` | `12345678` |
| 10 | **CLB MC & Kỹ Năng BAFU Voice** | Lê Quỳnh Nga | `truyenthong.leader@bafu.edu.vn` | `12345678` |

#### ✨ Các tính năng quản trị thực thụ của Ban Chủ Nhiệm (`/club-admin`):
1. 🖼️ **Chỉnh sửa Background & Avatar CLB:**
   - Thay đổi ảnh đại diện (Logo CLB) bằng nút **"Đổi logo"**.
   - Tải lên ảnh bìa (Cover / Background) chất lượng cao bằng nút **"Đổi ảnh bìa CLB"** (hỗ trợ file ảnh JPG/PNG/WebP lên đến 5MB), ảnh sẽ hiển thị ngay tại trang chi tiết CLB.
2. 📢 **Tạo bài viết & Đăng thông báo Sự kiện CLB:**
   - Tab **"Đăng Bài / Sự Kiện CLB"**: Điền tiêu đề, mô tả nội dung, địa điểm tổ chức, thời gian bắt đầu/kết thúc và giới hạn số lượng tham gia để công bố sự kiện cho sinh viên toàn trường.
3. ➕ **Thêm thành viên mới trực tiếp:**
   - Tab **"Danh Sách Hội Viên"** $\rightarrow$ Bấm nút **"+ Thêm thành viên"**: Nhập Email hoặc Mã sinh viên (MSSV) và chọn chức vụ (`Hội viên`, `Phó chủ nhiệm`, `Chủ nhiệm`) để ghi danh tức thì.
4. 🗑️ **Xóa thành viên & Điều chỉnh vai trò nội bộ:**
   - Nút xóa thành viên (icon Thùng rác màu đỏ) loại bỏ hội viên không còn hoạt động.
   - Hộp chọn chức vụ cho phép thăng chức / chuyển đổi vai trò ngay trong bảng.
5. 📊 **Xuất danh sách thành viên ra file Excel đẹp mắt:**
   - Bấm nút **"Xuất danh sách (Excel/CSV)"** để tải về bảng tính chuẩn **UTF-8 with BOM**.
   - Mở trên Microsoft Excel, Google Sheets hoặc WPS hiển thị **tiếng Việt có dấu 100% chuẩn đẹp**, không bị lỗi font hay vỡ cột.
   - Có cơ chế chống tấn công Formula Injection (CSV Injection) bảo mật tuyệt đối.
6. 📝 **Xét duyệt hồ sơ ứng tuyển trực tuyến:**
   - Tab **"Xét Duyệt Hồ Sơ"**: Đọc câu trả lời phỏng vấn của ứng viên và bấm **"✓ Duyệt trúng tuyển"** (hệ thống tự động chuyển thành viên vào danh sách chính thức).

---

### 🎒 3. Tài khoản Sinh Viên Trải Nghiệm (Students)
Dành cho việc thử nghiệm chức năng nộp đơn ứng tuyển và đăng ký tham gia sự kiện:

- **Mật khẩu chung:** `12345678`
- `haidang.sv@bafu.edu.vn` (Nguyễn Hải Đăng — K49 Khoa Công nghệ Thông tin)
- `minhthu.sv@bafu.edu.vn` (Trần Minh Thư — K49 Khoa Kinh tế - QTKD)
- `quanghuy.sv@bafu.edu.vn` (Phạm Quang Huy — K48 Khoa Cơ Điện)
- `thutrang.sv@bafu.edu.vn` (Lê Thu Trang — K48 Khoa Nông học)

---

## 🔑 Tính Năng Quên Mật Khẩu & Đổi Mật Khẩu

Hệ thống tích hợp quy trình bảo mật tài khoản hoàn chỉnh:

### 1. Quên mật khẩu qua mã xác thực OTP (Forgot Password Flow)
- **Vị trí:** Tại trang Đăng nhập (`/login`), bấm vào dòng chữ **"Quên mật khẩu?"** bên cạnh ô Mật khẩu.
- **Bước 1 — Nhập Email:** Điền email đã đăng ký (ví dụ: `admin@bafu.edu.vn` hoặc email cá nhân) $\rightarrow$ Bấm **"Gửi mã xác thực"**.
- **Bước 2 — Xác thực OTP & Đặt mật khẩu mới:** Hệ thống sinh mã OTP 6 số ngẫu nhiên có hiệu lực trong 15 phút. Người dùng nhập mã OTP cùng mật khẩu mới (ít nhất 6 ký tự) $\rightarrow$ Bấm **"Cập nhật mật khẩu"**.
- **Cơ chế chống brute-force:** Giới hạn tối đa 5 lần thử mã OTP, tự động hủy bỏ nếu nhập sai quá số lần quy định. Mật khẩu được mã hóa an toàn bằng thuật toán `bcrypt` (10 rounds).

### 2. Đổi mật khẩu cho tài khoản đang đăng nhập (Change Password)
- Người dùng ở bất kỳ vai trò nào (Super Admin, Club Admin, Sinh viên) đều có thể đổi mật khẩu bất kỳ lúc nào:
  - **Cách 1:** Bấm vào avatar góc trên bên phải Navbar $\rightarrow$ Chọn **"Đổi Mật Khẩu"**.
  - **Cách 2:** Trong Dashboard Sinh viên, bấm nút **"Đổi mật khẩu"** cạnh thông tin hồ sơ.
- Giao diện Modal popup tiện lợi: Yêu cầu nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu mới.

---

## 📧 Hướng Dẫn Cấu Hình SMTP Gửi Mail Thực Tế

Hệ thống hỗ trợ gửi email thông báo kết quả ứng tuyển, xác nhận sự kiện và gửi mã OTP đặt lại mật khẩu.

### 1. Chế độ Mặc Định (An toàn — Không lo lỗi crash)
Nếu bạn **chưa cấu hình thông tin SMTP**, hệ thống sẽ tự động kích hoạt chế độ **MOCK LOGGER**:
- Mọi yêu cầu gửi email sẽ in trực tiếp nội dung và mã OTP ra màn hình Terminal / Docker logs.
- API luôn phản hồi thành công và trả về mã OTP thử nghiệm để bạn test ngay lập tức mà không gặp bất kỳ trở ngại nào.

### 2. Cấu hình gửi qua Gmail thật (Chỉ mất 2 phút)
Để email gửi về đúng hòm thư thật của bạn:

1. Đăng nhập vào tài khoản Google của bạn.
2. Bật **"Xác minh 2 bước" (2-Step Verification)** tại: [https://myaccount.google.com/security](https://myaccount.google.com/security)
3. Truy cập trang tạo **Mật khẩu ứng dụng**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Đặt tên ứng dụng (ví dụ: `BAFU Club Portal`) $\rightarrow$ Bấm **Tạo**.
5. Google sẽ cấp cho bạn một chuỗi mật khẩu gồm 16 chữ cái (ví dụ: `abcd efgh ijkl mnop`).
6. Mở file `.env` (hoặc file `backend/.env`) và điền:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=email_cua_ban@gmail.com
   SMTP_PASS=abcdefghijklmnop
   SMTP_FROM="Cổng Thông Tin CLB Sinh Viên BAFU" <email_cua_ban@gmail.com>
   ```
7. Khởi động lại hệ thống bằng cách chạy lại `start.bat` (chọn mục `1` hoặc `4` rồi `1`). Từ thời điểm này, mọi mã OTP và thông báo sẽ được gửi trực tiếp tới hòm thư người nhận!

---

## 💻 Chế Độ Phát Triển Local (Dành Cho Lập Trình Viên)

Nếu bạn muốn tùy biến mã nguồn trực tiếp (Hot Module Replacement — HMR):

```powershell
# 1. Khởi chạy cơ sở dữ liệu PostgreSQL bằng Docker
cd Web_GT-CLB
docker compose up -d postgres

# 2. Khởi chạy Backend Express (Terminal 1)
cd backend
npm install
npx prisma generate
npm run dev
# Backend chạy tại: http://localhost:5000

# 3. Khởi chạy Frontend React Vite (Terminal 2)
cd ../frontend
npm install
npm run dev
# Frontend Dev chạy tại: http://localhost:5173
```

---

## 🎨 Điểm Nổi Bật Về Giao Diện & Dữ Liệu BAFU

- **Hệ màu chuẩn đại học:**
  - `Forest Green (#0F5132)`: Sắc xanh truyền thống của trường Nông Lâm.
  - `Emerald (#16845A)`: Xanh ngọc bích năng động của tuổi trẻ.
  - `Cream White (#F8FAF7)`: Nền ngà thanh lịch, bảo vệ mắt.
  - `Accent Gold (#E7B85B)`: Màu vinh danh giải thưởng & huy hiệu.
- **Hero Banner Full-Width:** Tràn toàn cảnh màn hình, hình ảnh khuôn viên BAFU chất lượng cao, khẩu hiệu *"KHÁM PHÁ CỘNG ĐỒNG SINH VIÊN BAFU"*, bộ nút bấm Dual CTA và thanh tìm kiếm câu lạc bộ nổi thông minh.
- **Minh bạch tư liệu:** Đã loại bỏ 100% hình ảnh vũ trụ không liên quan (`bg_galaxy_*`), chỉ sử dụng ảnh và logo có đối chiếu từ nguồn thông tin nhà trường.

---

## 🧪 Kiểm Thử Chất Lượng (Quality Assurance)

Dự án đảm bảo các tiêu chuẩn kiểm thử khắt khe:
- **Linting:** `npm run lint` (`oxlint`) $\rightarrow$ **0 lỗi** trên toàn bộ 43 files.
- **Frontend Build:** `npm run build` (Vite 6) $\rightarrow$ Đóng gói tối ưu thành công.
- **Docker Build:** Đóng gói Multi-stage build với Alpine Linux siêu nhẹ và an toàn.
- **Responsive:** Hiển thị mượt mà trên Desktop FHD (1920x1080), Laptop (1440x900), Tablet iPad (768x1024) và Mobile (iPhone 390x844).

---

## 👥 Bản Quyền & Đơn Vị Phát Triển

- **Đơn vị:** Cổng Thông Tin Câu Lạc Bộ Sinh Viên — Trường Đại học Nông – Lâm Bắc Giang (BAFU).
- **Kho lưu trữ:** [https://github.com/Loki-sama119/Web_GT-CLB](https://github.com/Loki-sama119/Web_GT-CLB)
- **Giấy phép:** Nội bộ phục vụ hoạt động sinh viên và đào tạo Đại học Nông – Lâm Bắc Giang.
