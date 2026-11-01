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

Hệ thống đã kích hoạt sẵn **100% tài khoản hoạt động thực tế** (1 Super Admin, 9 Ban Chủ Nhiệm, 4 Sinh viên mẫu). Bạn có thể đăng nhập ngay mà không cần tạo mới:

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
| 7 | **CLB Nhiếp Ảnh BAFU Lens** | Hoàng Yến Nhi | `nhiepanh.leader@bafu.edu.vn` | `12345678` |
| 8 | **CLB Võ Thuật Taekwondo & Karatedo** | Dương Tấn Đạt | `vothuat.leader@bafu.edu.vn` | `12345678` |
| 9 | **CLB MC & Kỹ Năng BAFU Voice** | Lê Quỳnh Nga | `truyenthong.leader@bafu.edu.vn` | `12345678` |

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

## 📧 Hướng Dẫn Cấu Hình SMTP Gửi Mail & Cơ Chế Fallback An Toàn

Hệ thống Cổng Thông Tin CLB Sinh Viên BAFU được tích hợp dịch vụ Email tự động qua Nodemailer, phục vụ các luồng nghiệp vụ quan trọng:
- 📩 **Gửi mã OTP 6 số đặt lại mật khẩu** (kèm giao diện HTML nhận diện thương hiệu BAFU sang trọng, có hạn dùng 15 phút).
- 🔐 **Thông báo mật khẩu đã thay đổi** (cảnh báo bảo mật tức thì khi tài khoản có biến động).
- 🎉 **Thông báo kết quả xét duyệt hồ sơ ứng tuyển** (Trúng tuyển `ACCEPTED`, Chưa phù hợp `REJECTED`, Yêu cầu bổ sung hồ sơ).
- 🎫 **Gửi vé xác nhận đăng ký sự kiện CLB** (thời gian, địa điểm, hướng dẫn check-in nhận điểm rèn luyện).

---

### 1. Cơ Chế Fallback Thông Minh (Safe Mock Logger)

> [!NOTE]
> **Chạy ngay không cần cấu hình:** Nếu bạn là người mới thử nghiệm và chưa cấu hình tài khoản SMTP, hệ thống sẽ **tự động kích hoạt cơ chế Fallback an toàn (Safe Mock Logger)**:
> - Mọi thao tác gửi email sẽ **không bao giờ bị lỗi hay làm crash API request**.
> - Nội dung email và **mã OTP 6 số sẽ được in trực tiếp ra màn hình Terminal / Docker Console** và trả về gợi ý `debugOtp` trong môi trường thử nghiệm.
> - Bạn có thể copy ngay mã OTP từ console để kiểm tra chức năng mà không cần cài đặt thêm bất kỳ thứ gì.

---

### 2. Hướng Dẫn Thao Tác Cấu Hình Gửi Mail Thật Bằng Gmail (Step-by-Step)

Để hệ thống gửi email thực tế đến hòm thư người dùng (Gmail cá nhân hoặc email nhà trường `@bafu.edu.vn`), bạn chỉ cần làm theo **5 bước đơn giản** sau:

#### 🔹 Bước 1: Bật Xác minh 2 bước (2-Step Verification) cho tài khoản Google
1. Mở trình duyệt và truy cập trang bảo mật Google: [https://myaccount.google.com/security](https://myaccount.google.com/security).
2. Tại mục **"Cách bạn đăng nhập vào Google" (How you sign in to Google)**, kiểm tra xem **"Xác minh 2 bước" (2-Step Verification)** đã bật chưa.
3. Nếu đang tắt $\rightarrow$ Bấm vào để bật và xác thực số điện thoại của bạn.

> [!IMPORTANT]
> **Bắt buộc phải bật Xác minh 2 bước** thì Google mới cho phép tạo "Mật khẩu ứng dụng" (App Password). Bạn **không được sử dụng mật khẩu đăng nhập thông thường của Gmail** vì Google sẽ chặn kết nối từ bên thứ ba vì lý do bảo mật.

#### 🔹 Bước 2: Tạo "Mật khẩu ứng dụng" (App Password)
1. Truy cập trực tiếp liên kết tạo mật khẩu ứng dụng của Google:  
   👉 **[https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
2. Nhập tên ứng dụng gợi nhớ vào ô tên: ví dụ nhập `BAFU Club Portal`.
3. Bấm nút **"Tạo" (Create)**.
4. Google sẽ hiển thị một cửa sổ thông báo chứa **mã mật khẩu 16 ký tự** (dạng 4 nhóm chữ cái, ví dụ: `abcd efgh ijkl mnop`).
5. **Sao chép chuỗi 16 ký tự này** (không cần giữ khoảng cách hoặc để liền nhau đều được).

#### 🔹 Bước 3: Điền cấu hình vào tệp môi trường `.env`
Mở file `.env` (tại thư mục gốc dự án `Web_GT-CLB/.env` hoặc `Web_GT-CLB/backend/.env`), tìm đến phần cấu hình SMTP và điền thông tin của bạn:

```env
# ==============================================================================
# CẤU HÌNH GỬI EMAIL SMTP (GMAIL HOẶC GOOGLE WORKSPACE BAFU)
# ==============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email_cua_ban@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="Cổng Thông Tin CLB Sinh Viên BAFU" <no-reply@bafu.edu.vn>
```

#### 🔹 Bước 4: Bảng giải thích chi tiết ý nghĩa từng thông số
| Tên biến | Giá trị mẫu | Ý nghĩa & Hướng dẫn thiết lập |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` | Địa chỉ máy chủ gửi mail của Google (hoặc `smtp.office365.com` nếu dùng Outlook BAFU). |
| `SMTP_PORT` | `587` | Cổng SMTP tiêu chuẩn hỗ trợ giao thức bảo mật TLS/STARTTLS (Có thể dùng `465` cho SSL). |
| `SMTP_USER` | `ten_ban@gmail.com` | Địa chỉ email Google của bạn (dùng để xác thực gửi thư). |
| `SMTP_PASS` | `abcd efgh ijkl mnop` | **Mật khẩu ứng dụng 16 ký tự** vừa lấy ở Bước 2 (Tuyệt đối không dùng mật khẩu Gmail chính). |
| `SMTP_FROM` | `"Cổng CLB BAFU" <no-reply@bafu.edu.vn>` | Tên và địa chỉ hiển thị trong hòm thư của người nhận (giúp email trông chuyên nghiệp và uy tín). |

#### 🔹 Bước 5: Khởi động lại hệ thống để nhận cấu hình mới
- **Nếu chạy bằng `start.bat`:** Chọn mục `[4] Dừng hệ thống` rồi chọn lại mục `[1] Khởi chạy hệ thống`.
- **Nếu chạy bằng Docker Compose:**
  ```powershell
  docker compose up -d --force-recreate backend
  ```
- **Nếu chạy Dev (Local Node.js):** Tắt terminal backend đang chạy (Ctrl+C) và gõ lại `npm run dev`.

---

### 3. Thử Nghiệm Gửi Email & Kiểm Tra Kết Quả

1. Mở website tại [http://localhost](http://localhost) và vào trang **Đăng nhập** (`/login`).
2. Bấm nút **"Quên mật khẩu?"**.
3. Nhập một email bất kỳ đang có trong hệ thống (ví dụ: `admin@bafu.edu.vn` hoặc email cá nhân bạn vừa đăng ký).
4. Bấm **"Gửi mã xác thực"**:
   - **Nếu đã cấu hình SMTP thật:** Mở hòm thư email của bạn kiểm tra hộp thư đến (Inbox) hoặc thư mục Rác (Spam) để xem email HTML có logo BAFU và mã OTP 6 số.
   - **Nếu dùng chế độ Mock Fallback:** Mở terminal chạy `docker logs club_portal_backend` hoặc màn hình console để xem dòng log dạng:  
     `📧 [MOCK EMAIL] Gửi tới: admin@bafu.edu.vn | Tiêu đề: "[BAFU Club Portal] Mã xác thực OTP đặt lại mật khẩu: 123456"`

---

### 4. Xử Lý Các Sự Cố Thường Gặp (Troubleshooting)

- ⚠️ **Lỗi `535-5.7.8 Username and Password not accepted`:**
  - *Nguyên nhân:* Bạn đang nhập mật khẩu đăng nhập thông thường của Gmail hoặc chuỗi Mật khẩu ứng dụng bị sai ký tự.
  - *Cách sửa:* Đảm bảo đã bật Xác minh 2 bước và truy cập lại [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) để tạo một App Password mới, sau đó dán chính xác vào `SMTP_PASS`.
- ⚠️ **Lỗi `ETIMEDOUT` hoặc `Connection timed out`:**
  - *Nguyên nhân:* Mạng Wi-Fi hoặc tường lửa nội bộ chặn cổng 587.
  - *Cách sửa:* Đổi `SMTP_PORT=465` trong file `.env` và khởi động lại backend.
- ⚠️ **Email bị rơi vào mục Thư rác (Spam):**
  - *Nguyên nhân:* Bộ lọc của Google/Outlook đánh dấu email tự động mới thiết lập.
  - *Cách sửa:* Bấm "Không phải thư rác" (Not Spam) để đưa thư về hộp thư chính.

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
