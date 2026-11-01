# Nghiệm thu BAFU Campus Editorial

Ngày 27/10/2026. Phạm vi là dự án cổng thông tin sinh viên thí điểm trong workspace. Không tuyên bố đây là website hoặc nhận diện chính thức được BAFU phê duyệt.

## Kết quả chẩn đoán scale

Trước khi sửa CSS, Chromium được chạy ở 100%, deviceScaleFactor=1 tại 1440×900, 1366×768, 768×1024, 390×844 và 375×812. Kết quả thô: `screenshots/bafu-authenticity/before/scale-metrics.json`.

- innerWidth, outerWidth và clientWidth bằng viewport tương ứng; visualViewport.scale=1.
- Root/body font-size=16px; CSS zoom=1; root transform=none; không tìm thấy phần tử scale nhỏ làm co toàn trang.
- Container desktop 1320px ở cả 1440 và 1366; không tràn ngang ở cả năm viewport.
- H1 cũ 74px desktop, 60px tablet, 48px mobile. Tailwind dùng breakpoint mặc định; viewport meta đúng `width=device-width, initial-scale=1.0`.
- `App.css` có scale trong ví dụ Vite nhưng không được import, không phải bằng chứng nguyên nhân.

Không tái hiện được lỗi co toàn trang do CSS tại zoom 100%. Quan sát ảnh trước cho thấy chữ phụ 10–12px, hero chia cột hẹp khiến tiêu đề xuống nhiều dòng, nhiều diện tích trống và ảnh/card lỗi làm cảm giác bố cục nhỏ, rời rạc. Những điểm này được sửa bằng bố cục và phân cấp nội dung; không dùng CSS zoom để bù.

Chrome GUI hiện có chưa được đo trực tiếp: công cụ Computer Use dừng vì không xác định URL đủ tin cậy. Đọc cấu hình lưu của profile mặc định không thấy override localhost, nhưng không đủ xác nhận zoom thực của cửa sổ đang mở/profile khác. Windows có Win8DpiScaling=0, không có LogPixels ở khóa đã đọc; chưa xác nhận scaling từng màn hình. Không kết luận lỗi do Chrome hoặc Windows khi thiếu đo đạc.

## Thiết kế triển khai

Trang chủ có masthead editorial, lưới 12 cột, tỷ lệ 7/5, headline lớn, search có nhãn truy cập và một CTA chính. Năm section có số thứ tự: khám phá, tuyển thành viên, sự kiện, danh bạ, tư liệu hoạt động. Không còn section xanh lớn bao quanh nội dung nhỏ hoặc số hội viên nhân 10.

Container trang chủ: `min(1320px, viewport − 80px)` desktop; khoảng lề 24px ở tablet và 18px ở mobile. Lưới thu thành một cột ở mobile. Danh mục có thẻ featured, thẻ mô-đun và chế độ danh sách; search/reset/filter hoạt động qua API. Trang CLB tách nguồn xác minh, giới thiệu, lịch sử, ban điều hành, tuyển và album; thiếu dữ liệu được ghi rõ.

Font thực tế: Be Vietnam Pro cho nội dung và tiêu đề tiếng Việt, được kiểm tra qua FontFaceSet trong Chromium. Body root 16px; nội dung masthead desktop 17px; các nhãn phụ có kích thước nhỏ theo vai trò, không tăng root font để che lỗi zoom. Dashboard được tải riêng bằng React lazy; bundle chính dưới ngưỡng cảnh báo 500kB trong build Vite.

Mỗi CLB có mô tả và liên kết nguồn riêng. `clubIdentity.js` chỉ gán màu/tiêu đề biên tập theo lĩnh vực, không giả làm brand guideline chính thức. Chưa có logo/cover được cấp quyền: thẻ có fallback chữ và nhãn ảnh đang cập nhật; logo là biểu tượng ảnh trung tính có nhãn “Chờ logo”. Hero sẵn sàng nhận campus asset được duyệt qua API, hiện dùng poster chữ trung tính. Điều này chưa đạt yêu cầu bộ ảnh thật hoàn chỉnh.

Dashboard giữ sidebar/topbar, KPI API, các tab nghiệp vụ, bảng có cuộn nội bộ, lọc, CSV và RBAC. Đã bỏ header dạng landing page ở Super Admin, giảm trang trí và làm bảng mobile đủ rộng để đọc. Endpoint `/management/clubs` cho người có quyền tiếp tục quản lý hồ sơ chưa công bố, không nới public directory. Super Admin có hàng đợi xác minh dữ liệu/tư liệu.

Các component thay đổi: CampusMasthead, FeatureClubTile, EditorialClubCard, DirectoryRow, EventPoster, ClubLogo, BrandWordmark, Navbar, Footer; HomePage được dựng lại. Bổ sung ClubVisual, VerificationPanel, editorial.css và clubIdentity. Xóa hai route/component prototype chứa số liệu minh họa hardcode. Sửa ngày EventPoster từ trường sai startDate/fallback hôm nay sang startTime, giữ nguyên năm sự kiện lịch sử.

Tham khảo có đọc: [RISD Identity](https://identity.risd.edu/), [UAL](https://www.arts.ac.uk/), [Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui). Không sao chép nhận diện của các đơn vị này.

## Bằng chứng hình ảnh

Ảnh trước: `screenshots/bafu-authenticity/before/home-{width}.png`.

Ảnh mới: `screenshots/bafu-authenticity/after/`. `acceptance.json` ghi URL, thời điểm, kích thước, asset build JS/CSS thực tải, SHA-256 mỗi screenshot, kích thước container, fonts, ảnh lỗi và lỗi JavaScript.

- 43 tổ hợp trang/viewport chính được chụp: home, directory, hồ sơ Tình nguyện Xanh, events và ba dashboard ở đủ năm kích thước; bốn hồ sơ CLB còn lại thêm desktop/mobile.
- Có thêm ảnh viewport masthead, menu mobile và lịch sử sự kiện ở năm kích thước.
- Kết quả script: không tràn ngang toàn trang, không ảnh lỗi, không pageerror; nội dung public không còn fixture/CLB seed được trình bày như dữ liệu thật.
- Homepage container đo được: 1320px ở 1440, 1286px ở 1366, 720px ở 768, 354px ở 390 và 339px ở 375. Root font 16px, zoom 1, transform none.
- Đã xem trực tiếp ảnh desktop, mobile, directory, profile và dashboard. Sau vòng đầu đã sửa nhãn đăng nhập mobile xuống dòng và header/bảng Super Admin quá chật; bộ ảnh cuối được chụp lại.

**Phân biệt môi trường:** ảnh public ở `http://localhost` là dữ liệu sau cleanup. Ảnh `dashboard-*` ở `http://localhost:8080` là kiểm tra bố cục/nghiệp vụ bằng fixture E2E, có thể chứa tên Playwright. Không dùng các ảnh đó để tuyên bố dashboard pilot có dữ liệu thật; không đổi tên hoặc chỉnh sửa screenshot để che fixture. Bản public không còn tài khoản quản trị seed đăng nhập được, nên chưa có screenshot dashboard pilot của quản trị viên thật.

## Kiểm thử thực chạy

- Frontend production build: PASS, gồm build Docker sau chỉnh sửa QA. Dashboard tách chunk; không có lỗi compile.
- Backend: 49/49 PASS, gồm 35 regression cũ, 6 kiểm tra policy và 8 kiểm tra public/private publication API. Bài mới phát hiện test dùng token body ở production mode; test đã sửa dùng HTTP-only cookie đúng hợp đồng API, không nới auth.
- Playwright regression: 34/34 PASS ở Chromium desktop và mobile, gồm hai kiểm tra isolation trên mỗi project. Kết quả cuối lưu tại `docs/qa/e2e-results.json`.
- Database isolation: global setup/teardown đối chiếu 15 bảng demo, PASS; source mới không ghi thêm user/app/membership/media vào demo khi E2E chạy.
- Public read-only functional QA: PASS ở desktop/mobile; tìm kiếm Tin học, kết quả rỗng, reset, lọc Văn nghệ, lịch sử 2018/2024, ẩn hồ sơ BAFU Tech seed, login không có nút tài khoản mẫu.
- Responsive QA: 43/43 tổ hợp đo đạc không lỗi như trên; đây là Chromium, không tuyên bố đã kiểm Safari/iOS hoặc Firefox.

Chứng cứ máy đọc được trong `docs/qa/` và `screenshots/bafu-authenticity/after/acceptance.json`. Không tái sử dụng screenshot nghiệm thu từ các giai đoạn trước.

## Git, vận hành và phần chưa đạt

Các thay đổi được chia commit theo Data Audit, Test Data Cleanup, Media Audit, BAFU Asset Integration, Club Identity, Editorial UI và Visual Acceptance; commit local trên nhánh sửa riêng. Không push, force push, merge main, xóa lịch sử hoặc xóa backup/volume.

Docker Desktop từng lỗi EOF khi xuất image. Đã khởi động lại, kiểm tra PostgreSQL và sửa Dockerfile tránh chown đệ quy toàn bộ dependency tree; các build tiếp theo thành công. Container đã được tạo lại từ image mới và Nginx đã reload upstream. Không reset database trong quá trình khôi phục.

Những tiêu chí CHƯA hoàn tất để phát hành chính thức:

1. Logo gốc, cover/album có quyền sử dụng của trường và từng CLB; Facebook bị chặn. Hiện chỉ có fallback có nhãn, không có logo chính thức được tích hợp.
2. Xác nhận hoạt động năm 2026, lịch sinh hoạt, ban chủ nhiệm, đợt tuyển và danh tính fanpage từ đơn vị quản lý.
3. Xác nhận zoom của cửa sổ Chrome đang mở và scaling từng màn hình Windows.
4. Bổ nhiệm tài khoản quản trị thật, xác minh hai tài khoản UNKNOWN và nghiệm thu dashboard pilot bằng dữ liệu thật. Không tự nâng quyền hai tài khoản chưa rõ nguồn.
5. Phê duyệt của nhà trường nếu muốn gọi đây là cổng chính thức. Chưa có phê duyệt; website giữ nhãn bản thí điểm.

Do các phần trên, không tuyên bố toàn bộ Definition of Done đã đạt.
