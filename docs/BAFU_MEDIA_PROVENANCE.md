# Sổ nguồn và quyền sử dụng hình ảnh BAFU

Kiểm tra ngày 27/10/2026. Không tài nguyên nào được tự gán VERIFIED_APPROVED; công bố ảnh yêu cầu nguồn, đúng chủ thể và bằng chứng quyền sử dụng.

## Sổ tài nguyên thực thi

`frontend/public/images/asset-manifest.json` và bảng PostgreSQL `media_assets` có 11 tài nguyên. Metadata gồm assetId, filename, url, type, sourceUrl, sourcePostUrl, sourcePage, clubId, eventId, publishedAt, capturedAt, usagePermission, verificationStatus, verifiedAt, altText. Những trường không biết để null; không dùng ngày filename làm ngày đăng.

Các nguồn ảnh cũ được ghi lại tại `public/images/bafu/asset-sources.csv`:

- `campus-overview.jpg`: [tệp trên website trường](https://www.bafu.edu.vn/img/all/tongquan.jpg), ngữ cảnh khuôn viên, không gán cho CLB.
- `campus-building-b5.jpg`: [tệp trên website trường](https://www.bafu.edu.vn/img/all/tongquan1.jpg), ngữ cảnh trường, không có bằng chứng là hoạt động Hiến máu.
- Nhóm `students-graduation-2025.jpg`, `students-practical-lab-2025.jpg`, `students-welcome-2025.jpg`, `students-football-2025.jpg`, `students-classroom-2025.jpg`: tham chiếu từ [bài giới thiệu trường](https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html). Không có căn cứ quy thuộc mỗi ảnh cho CLB trong seed. Ngày chụp/đăng của từng tệp chưa xác nhận.
- `bafu-computer-lab.jpg`: sổ cũ trỏ đến [trang phòng thực hành](https://bafu.edu.vn/tnmt/phong-thuc-hanh-may-tinh/), không phải URL tệp gốc đã kiểm chứng; không chứng minh IT BAFU/BAFU Tech.
- `logo-bafu-reference.jpg`: [tệp bên thứ ba](https://media.kenhtuyensinh.vn/images/cms/2018/06/16108508293430737830883302193200450163718n.jpg); chỉ REFERENCE, không phải logo được nhà trường cấp cho dự án.
- `bafu_campus_students.jpg`, `bafu_club_workshop.jpg`: tệp cũ chưa có nguồn đáng tin cậy, không dùng công khai. Không khẳng định đây là ảnh thật hay ảnh AI khi chưa có chứng cứ.

Tất cả còn chờ xác minh đầy đủ và cấp quyền; các tệp vẫn được bảo toàn. Không tải lại hoặc tối ưu ảnh chưa được duyệt để rồi đưa vào giao diện. Ảnh campus khi được duyệt chỉ được endpoint `/media-assets/campus` trả về ở ngữ cảnh trường. Logo/cover công khai phải khớp URL, loại ảnh và clubId với MediaAsset được duyệt. Album cũng yêu cầu metadata cùng CLB. Logo dùng `object-contain`, không crop mất chữ.

## Tham chiếu sai đã loại bỏ

Dry-run giữ ID và URL cũ trong backup, không xóa tệp vật lý:

- CLB Tình nguyện Xanh: ảnh gala/chào sinh viên chung bị dùng như hoạt động riêng. Đã gỡ `/images/bafu/students-welcome-2025.jpg` khỏi cover.
- BAFU Tech: ảnh phòng máy trường bị dùng như bằng chứng tổ chức IT. Đã gỡ `/images/bafu/bafu-computer-lab.jpg`, và không gộp với CLB Tin học.
- CLB bóng đá seed: ảnh giải trường không chứng minh đội bóng có tên trong seed. Đã gỡ `/images/bafu/students-football-2025.jpg` và ẩn hồ sơ DEMO.
- CLB Khởi nghiệp: ảnh lớp học chung không chứng minh hoạt động riêng. Đã gỡ `/images/bafu/students-classroom-2025.jpg`.
- CLB Hiến máu: ảnh tòa nhà không phải ảnh hiến máu. Đã gỡ `/images/bafu/campus-building-b5.jpg`.
- Album BAFU Tech: 10 tệp `.jpg` thực chất là chuỗi `fake-activity-image`; đã xóa đúng 10 hàng test sau backup. Không phát hành hoặc tái sử dụng những tệp này.
- Caption homepage cũ ghi tư liệu 2026 cho tệp tên 2025 và khẳng định hơn 10 CLB; đã thay bằng fallback trung tính có nhãn cập nhật. Thẻ cũ cũng truy cập sai `_count.members`, khiến bật số dự phòng 10/15/20; đã loại bỏ.

## Logo, cover và fanpage cần bàn giao

BAFU: chưa có tệp gốc và giấy/chứng cứ cấp quyền cho dự án. Wordmark hiện tại là tên dự án bằng chữ, không phải huy hiệu hay logo chính thức của trường.

Tình nguyện Xanh, CLB Hiến máu, CLB Tin học, CLB Khởi nghiệp và CLB Văn nghệ: logo/cover đều NOT_FOUND ở mức tài nguyên được duyệt; logo URL gốc, local logo, ngày xác minh và quyền sử dụng chưa có, không tạo giả. Giao diện dùng biểu tượng ảnh trung tính kèm chữ “Chờ logo”; không dùng monogram hoặc gradient làm nhận diện chính thức. Màu nhấn của trang là màu phân loại biên tập.

Các fanpage do người dùng cung cấp đã được thử đọc công khai:

- [Tình nguyện Xanh](https://www.facebook.com/p/CLB-T%C3%ACnh-Nguy%E1%BB%87n-Xanh-Tr%C6%B0%E1%BB%9Dng-%C4%90%E1%BA%A1i-h%E1%BB%8Dc-N%C3%B4ng-L%C3%A2m-B%E1%BA%AFc-Giang-61552769437618/): UNAVAILABLE_IN_READER, công cụ trả cache miss; chưa xác định được nguyên nhân từ phía Facebook.
- [maubafu](https://www.facebook.com/maubafu/): trả “You’re Temporarily Blocked”; BLOCKED_BY_SOURCE. Không khẳng định cùng danh tính với hồ sơ Hiến máu.
- [CLB Tin học](https://www.facebook.com/Clbtinhocitbafu/): UNAVAILABLE_IN_READER, công cụ trả cache miss; không truy xuất được nội dung/ảnh gốc. Không khẳng định cùng danh tính với BAFU Tech.
- [Fanpage trường](https://www.facebook.com/bafu.university): robots từ chối. Không vượt đăng nhập/chống thu thập.

Browser control Windows cũng bị công cụ dừng do không xác định URL đủ tin cậy; không tiếp tục điều khiển UI sau thông báo đó. Nghiên cứu nguồn dùng web reader/search công khai làm phương án thay thế. Không lấy screenshot Facebook mờ làm logo.

Đề nghị Ban chủ nhiệm/đơn vị phụ trách bàn giao: logo gốc PNG/SVG, cover/album đúng CLB, URL bài gốc và ngày đăng, mô tả chủ thể, xác nhận quyền dùng trên cổng thí điểm, thông tin đơn vị xác nhận danh tính fanpage. Chưa gửi bất kỳ tin nhắn nào thay mặt người dùng.

## Quy trình tiếp nhận

Upload ảnh không tự cấp quyền công bố. MediaAsset mới ở trạng thái pending. Super Admin kiểm tra nguồn/chủ thể và ghi permissionEvidence khi duyệt qua `/admin/media-assets/:id/review`; thao tác lưu audit log. Gỡ duyệt lập tức khiến public API bỏ ảnh. Không xóa ảnh vật lý khi gỡ một tham chiếu album để tránh làm hỏng vị trí sử dụng khác.

Không thể đạt yêu cầu “logo thật xuất hiện” trước khi có tệp và cấp quyền. Hiện tại yêu cầu an toàn thay thế được đáp ứng bằng fallback có nhãn; phần tích hợp hình ảnh được ghi rõ là CHƯA HOÀN TẤT.
