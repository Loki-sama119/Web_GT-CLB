# Báo Cáo Tái Kiểm Kê & Xác Minh Nguồn Tư Liệu Truyền Thông BAFU
*(BAFU Media Re-Audit & Authenticity Remediation Report)*

- **Dự án:** Cổng thông tin Câu lạc bộ Sinh viên BAFU (*Web_GT-CLB*)
- **Thời điểm thực hiện:** 01/11/2026
- **Phạm vi đối chiếu:** Trường Đại học Nông – Lâm Bắc Giang (*Bac Giang Agriculture and Forestry University - BAFU*)
- **Chuyên trách:** Senior Frontend Engineer & Media Verification Specialist

---

## 1. Nguyên Tắc & Chính Sách Xác Minh Tư Liệu

1. **Phân định ba tầng tư liệu độc lập:**
   - **Tầng 1 (Khuôn viên & Cơ sở vật chất trường BAFU):** Chỉ dùng ở phạm vi tổng quan trường, hero banner hoặc phóng sự trường. Tuyệt đối không gán ảnh trường thành hoạt động riêng của một CLB.
   - **Tầng 2 (Phong trào sinh viên chung BAFU):** Ảnh các sự kiện toàn trường như Gala chào tân sinh viên, giải thể thao trường (BAFU Cup), lễ tốt nghiệp, giờ giảng đường. Dùng trong khu vực biên tập hoạt động chung, có ghi rõ nguồn.
   - **Tầng 3 (Hoạt động riêng của từng CLB):** Chỉ công bố khi có bằng chứng bài đăng gốc, ban chủ nhiệm bàn giao và khớp định danh CLB. Khi chưa có, bắt buộc dùng **fallback trung tính có nhãn "Hình ảnh đang cập nhật"**; không được lấy ảnh ngẫu nhiên hoặc ảnh vũ trụ (galaxy) để lấp chỗ trống.
2. **Loại bỏ triệt để các hình ảnh gây hiểu nhầm:**
   - Toàn bộ nhóm ảnh `bg_galaxy_*` (galaxy wallpaper) đã bị loại bỏ hoàn toàn khỏi code logic, không còn được hiển thị ở bất kỳ trang nào.
   - Các logo chưa qua cấp phép từ các trang fanpage không rõ ràng (`logo-*-official.png`) đã bị gỡ khỏi mã nguồn; giao diện sử dụng fallback chuẩn có nhãn **"Chờ logo"**.
   - Wordmark của cổng thông tin sử dụng biểu trưng chữ typographic "BAFU • CAMPUS CLUBS", không tuyên bố là huy hiệu hoặc logo chính thức của nhà trường.
3. **Chính sách Video:**
   - Chỉ sử dụng video có nguồn xác minh từ kênh truyền thông của trường (`@dhnlbg` trên YouTube).
   - Video phóng sự khuôn viên BAFU (`pewDI97HQDQ`) được đưa vào Section 05 (Hoạt động chung của trường), không gán tràn lan vào từng câu lạc bộ.

---

## 2. Bảng Kiểm Kê & Đối Chiếu Chi Tiết Từng Tài Nguyên

| STT | Tên tệp / Định danh | Loại tư liệu | Nguồn gốc đối chiếu (*Source URL / Bài viết*) | Chủ thể xác minh | Quyền sử dụng & Nhúng | Trạng thái xác minh | Vị trí hiển thị trên giao diện |
|:---:|:---|:---|:---|:---|:---:|:---:|:---|
| 1 | `campus-overview.jpg` | Ảnh toàn cảnh | `https://www.bafu.edu.vn/img/all/tongquan.jpg` | Khuôn viên trường BAFU nhìn từ trên cao | Reference / Tư liệu trường | **SOURCE_CONFIRMED_CAMPUS** | Nền Hero Banner (Section 02) |
| 2 | `students-welcome-2025.jpg` | Ảnh hoạt động sinh viên | `https://bafu.edu.vn/img/2025/tschonbafu(7).jpg` | Đêm hội Gala Chào Tân Sinh Viên BAFU | Reference / Bài giới thiệu trường | **SOURCE_CONFIRMED_STUDENT_GENERAL** | Visual Gallery chính (Section 04) |
| 3 | `students-football-2025.jpg` | Ảnh thể thao sinh viên | `https://bafu.edu.vn/img/2025/bafucup2(7).jpg` | Giải bóng đá truyền thống BAFU Cup | Reference / Bài giới thiệu trường | **SOURCE_CONFIRMED_STUDENT_GENERAL** | Visual Gallery phụ 1 (Section 04) |
| 4 | `students-practical-lab-2025.jpg` | Ảnh học thuật nghiên cứu | `https://bafu.edu.vn/img/2025/tschonbafu(2).JPG` | Sinh viên thực hành phòng thí nghiệm công nghệ sinh học | Reference / Bài giới thiệu trường | **SOURCE_CONFIRMED_STUDENT_GENERAL** | Visual Gallery phụ 2 (Section 04) |
| 5 | `students-graduation-2025.jpg` | Ảnh tốt nghiệp | `https://bafu.edu.vn/img/2025/tschonbafu(1).jpg` | Lễ trao bằng tốt nghiệp cử nhân, kỹ sư BAFU | Reference / Bài giới thiệu trường | **SOURCE_CONFIRMED_STUDENT_GENERAL** | Visual Gallery phụ 3 (Section 04) |
| 6 | `campus-building-b5.jpg` | Ảnh cơ sở vật chất | `https://www.bafu.edu.vn/img/all/tongquan1.jpg` | Giảng đường B5 và khuôn viên trường | Reference / Tư liệu trường | **SOURCE_CONFIRMED_CAMPUS** | Lưu trữ tư liệu CSVC |
| 7 | `bafu-computer-lab.jpg` | Ảnh phòng máy tính | `https://bafu.edu.vn/tnmt/phong-thuc-hanh-may-tinh/` | Phòng máy tính Khoa Tài nguyên & Môi trường BAFU | Reference / Tư liệu trường | **SOURCE_CONFIRMED_CAMPUS** | Lưu trữ tư liệu CSVC |
| 8 | `students-classroom-2025.jpg` | Ảnh học tập | `https://bafu.edu.vn/img/2025/tschonbafu(4).JPG` | Giờ học sinh viên trên giảng đường BAFU | Reference / Bài giới thiệu trường | **SOURCE_CONFIRMED_STUDENT_GENERAL** | Lưu trữ tư liệu học thuật |
| 9 | `pewDI97HQDQ` (YouTube) | Video phóng sự | `https://www.youtube.com/watch?v=pewDI97HQDQ` (Kênh `@dhnlbg`) | Phóng sự giới thiệu khuôn viên xanh BAFU | Official YouTube Embed (nocookie) | **VERIFIED_OFFICIAL_CHANNEL** | Khung video 16:9 (Section 05) |
| 10 | `bg_galaxy_*.jpg` (13 tệp) | Stock vũ trụ | Không có nguồn gốc trường BAFU | Ảnh stock trừu tượng | **PROHIBITED** | **DISQUALIFIED / REMOVED** | Đã loại bỏ hoàn toàn khỏi frontend |
| 11 | `logo-*-official.png` | Logo không rõ nguồn | Fanpage chưa xác minh danh tính pháp lý | Chưa xác định quyền sở hữu | **PROHIBITED** | **DISQUALIFIED / REMOVED** | Thay bằng fallback "Chờ logo" |

---

## 3. Danh Mục 5 Hồ Sơ Câu Lạc Bộ Được Công Bố

Theo kết quả đối chiếu với `backend/data/bafu-catalog.json` và các tài liệu chính thức của nhà trường, cổng thông tin chỉ công bố đúng **5 câu lạc bộ có bằng chứng tài liệu lưu trữ**:

1. **CLB Tình nguyện Xanh BAFU (`clb-tinh-nguyen-xanh`):**
   - *Nguồn đối chiếu:* [Bài viết ngày 18/09/2024](https://www.bafu.edu.vn/home/tin-tuc/hoat-dong-su-kien/4179-sinh-vien-truong-dai-hoc-nong--lam-bac-giang-mang-trung-thu-den-voi-cac-em-thieu-nhi.html) về chương trình Trung thu trao quà thiếu nhi.
   - *Trạng thái:* Tên CLB được xác minh; trạng thái hoạt động hiện tại: `NOT_CONFIRMED` (Đang cập nhật).
   - *Media:* Không dùng ảnh galaxy; logo hiển thị nhãn "Chờ logo".
2. **CLB Hiến máu tình nguyện BAFU (`clb-hien-mau-tinh-nguyen`):**
   - *Nguồn đối chiếu:* [Bài viết giới thiệu trường](https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html).
   - *Trạng thái:* Tên CLB được xác minh; trạng thái hoạt động hiện tại: `NOT_CONFIRMED`.
   - *Media:* Thay thế ảnh galaxy máu bằng nền nhận diện biên tập màu đỏ hồng nhân đạo và nhãn "Chờ logo".
3. **CLB Tin học BAFU (`clb-tin-hoc-bafu`):**
   - *Nguồn đối chiếu:* [Bài viết ngày 13/10/2015](https://bafu.edu.vn/home/tin-tuc/hoat-dong-su-kien/1639-le-phat-dong-phong-trao-sinh-vien-5-tot-nam-hoc-2015-2016.html) ghi nhận quyết định thành lập.
   - *Trạng thái:* Tách bạch rõ với BAFU Tech trong seed; trạng thái: `NOT_CONFIRMED`.
   - *Media:* Fallback trung tính, không gán logo chưa cấp phép.
4. **CLB Khởi nghiệp BAFU (`clb-khoi-nghiep-bafu`):**
   - *Nguồn đối chiếu:* [Báo Bắc Giang ngày 11/04/2018](https://www.baobacninhtv.vn/truong-dai-hoc-nong-lam-bac-giang-ra-mat-clb-khoi-nghiep-bafu-postid280036.bbg) về lễ ra mắt CLB tại trường.
   - *Trạng thái:* Lễ ra mắt là sự kiện lịch sử đã diễn ra, không biến thành sự kiện tương lai; trạng thái: `NOT_CONFIRMED`.
   - *Media:* Fallback trung tính màu cam vàng biên tập.
5. **CLB Văn nghệ BAFU (`clb-van-nghe-bafu`):**
   - *Nguồn đối chiếu:* [Bài viết giới thiệu trường](https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html).
   - *Trạng thái:* Tách bạch với tên tự đặt "Melody"; trạng thái: `NOT_CONFIRMED`.
   - *Media:* Fallback trung tính màu tím nghệ thuật.

---

## 4. Biện Pháp Khắc Phục Kỹ Thuật Đã Áp Dụng

1. **Thay đổi trong `frontend/src/utils/bafuData.js`:**
   - Xóa bỏ 9 CLB demo giả lập và số liệu thành viên hư cấu (560 thành viên, 52/120...).
   - Chỉ giữ nguyên 5 CLB có nguồn và 2 sự kiện lịch sử (`2024-09-16` và `2018-04-11`).
   - Xóa toàn bộ đường dẫn trỏ tới `bg_galaxy_*`.
2. **Thay đổi trong `frontend/src/utils/clubIdentity.js`:**
   - Xóa bỏ hàm fallback trả về `bg_galaxy_bafu.jpg` hoặc `bg_galaxy_*`.
   - Chuyển sang sử dụng hệ thống màu nhấn CSS và gradient trang nhã cho từng phân loại danh mục.
3. **Thay đổi trong `frontend/src/components/ui/ClubLogo.jsx`:**
   - Xóa bỏ bảng ánh xạ logo giả lập (`CLUB_LOGO_MAP`).
   - Tạo fallback component chuẩn mực hiển thị icon ảnh và nhãn "Chờ logo".
4. **Thay đổi trong `frontend/src/components/ui/BrandWordmark.jsx`:**
   - Xóa bỏ việc sử dụng tệp `logo-bafu-official.png` chưa được cấp phép.
   - Dùng Typography Brandmark chuẩn "BF BAFU. CAMPUS CLUBS - Cổng thông tin sinh viên".
5. **Cập nhật `frontend/public/images/asset-manifest.json`:**
   - Ghi nhận đầy đủ nguồn gốc, bài viết nguồn, giấy phép và tình trạng kiểm duyệt của từng tệp tư liệu.

