# Kiểm kê tính xác thực dữ liệu BAFU

Ngày xử lý: 27/10/2026, múi giờ Asia/Bangkok. Đây là dự án thí điểm, chưa có phê duyệt vận hành chính thức của nhà trường.

## Môi trường đã kiểm tra

Docker Compose local có PostgreSQL 16, host `localhost:5433`, container `club_portal_postgres`. Các database tồn tại: `club_portal_db`, `club_portal_e2e`, `club_portal_test` và database mặc định `postgres`.

- Bản phục vụ thí điểm local: `club_portal_db`, API qua cổng 80. `NODE_ENV=production` ở đây là chế độ chạy Node; cấu hình Compose local và dữ liệu seed xác nhận đây là bản demo trong workspace. Đã bổ sung `DEPLOYMENT_ENV=demo` để phân biệt rõ.
- E2E: `club_portal_e2e`, backend `5001`, reverse proxy `8080`.
- Vitest: `club_portal_test`. Cấu hình kiểm thử từ chối tên database ngoài danh sách test.
- Không truy cập hoặc thay đổi database production từ xa.

Schema thực tế có `User`, `StudentProfile`, `ClubCategory`, `Club`, `ClubMembership`, `RecruitmentCampaign`, `ApplicationForm`, `FormQuestion`, `Application`, `ApplicationAnswer`, `ApplicationHistory`, `ClubEvent`, `EventRegistration`, `ClubPost`, `Notification`, `AuditLog`, `ClubMedia`. Không có bảng giả định `ClubApplication` hay `Membership`. Migration mới bổ sung `DataClassification`, nguồn, ngày xác minh và sổ `MediaAsset`.

## Bằng chứng phân loại và xử lý

Sáu nhóm được hỗ trợ: REAL_VERIFIED, REAL_UNVERIFIED, DEMO, E2E_TEST, PLACEHOLDER, UNKNOWN. Mặc định của bản ghi mới là UNKNOWN; đăng ký trong runtime test được gắn E2E_TEST. Public API chỉ công bố nội dung REAL_VERIFIED có URL nguồn và ngày xác minh; trạng thái ACTIVE không tự chứng minh tính xác thực.

- 15/17 tài khoản khớp email literal trong `prisma/seed.js` và cùng đợt tạo `2026-10-26T12:51:12Z`: DEMO, giữ bản ghi, vô hiệu hóa đăng nhập. Không coi đây là cán bộ/sinh viên thật.
- 2 tài khoản ngoài cohort: UNKNOWN, giữ nguyên tài khoản, profile và quyền. Báo cáo Git không công bố email cá nhân của hai tài khoản này.
- Không có tài khoản Playwright còn tồn tại trong snapshot demo ban đầu. Không tuyên bố đã xóa những tài khoản không có trong snapshot.
- 10 CLB ban đầu có nguồn từ seed. Chỉ sửa riêng các trường thông tin có bằng chứng của Tình nguyện Xanh; 9 tổ chức seed khác vẫn được bảo toàn, gắn DEMO và ẩn công khai. Không xóa CLB vì tên không nằm trong danh sách.
- 2 hồ sơ Khởi nghiệp/Hiến máu được sửa mô tả, bỏ contact/lịch sinh hoạt không có nguồn. CLB Tin học và Văn nghệ được tạo riêng từ nguồn. Không gộp IT BAFU với BAFU Tech; không khẳng định `maubafu` là cùng tổ chức với hồ sơ Hiến máu.
- 3 chiến dịch seed: giữ quan hệ và gắn DEMO, không mở tuyển công khai. Không giữ chỉ tiêu 25 như dữ liệu thật.
- 2 sự kiện seed: DEMO. 1 sự kiện còn lại: UNKNOWN, giữ nguyên vì chưa đủ bằng chứng xóa. Cả ba không được public API công bố.
- 2 sự kiện có nguồn được bổ sung ở trạng thái COMPLETED, ngày gốc 16/09/2024 và 11/04/2018. `datePrecision=DAY` ngăn hiển thị giờ chưa biết.
- 10 hàng `club_medias`: E2E_TEST xác định bằng việc đọc tệp backup và so sánh byte chính xác với `fake-activity-image` trong `backend/tests/api.test.js`, đồng thời đối chiếu caption/URL. Chỉ xóa 10 hàng có ID trong dry-run. Giữ nguyên mọi tệp vật lý.
- Applications, answers, forms, questions, memberships, registrations được kiểm kê theo ID và quan hệ với campaign/user; không xóa hàng loạt. Bản minh họa không đi vào KPI/danh sách nghiệp vụ của bản công khai. Audit/history được giữ để truy vết.

## Số lượng trước và sau

- User: 17 → 17; 15 DEMO bị vô hiệu hóa, 2 UNKNOWN được bảo toàn.
- StudentProfile: 17 → 17.
- Club: 12 → 14; 5 REAL_VERIFIED ở mức tên tổ chức/tư liệu lịch sử, 9 DEMO ẩn công khai. Hoạt động hiện tại của cả 5 hồ sơ: NOT_CONFIRMED.
- ClubMembership: 11 → 11; KPI hội viên công khai: 0, không suy diễn từ dữ liệu seed.
- RecruitmentCampaign: 3 → 3; đợt tuyển công khai đang mở: 0.
- Application: 4 → 4; ApplicationAnswer: 13 → 13; ApplicationHistory: 0 → 0.
- ClubEvent: 3 → 5; 2 lịch sử được công bố, 0 sự kiện sắp diễn ra đã xác minh.
- EventRegistration: 3 → 3; ClubPost: 1 → 1.
- ClubMedia: 10 → 0, chỉ xóa fixture đã chứng minh.
- MediaAsset: 0 → 11, không có tài nguyên được cấp quyền/duyệt để công bố.
- AuditLog: 72 → 74 sau cleanup và đăng ký provenance; không xóa audit log.

## Backup, dry-run và rollback

Các backup dưới `backups/` bị loại khỏi Git vì chứa dữ liệu và thông tin xác thực:

- Demo: `club_portal_db-20261027102841559/database.dump`; SHA-256 `69ee601a2f3c4972d49afee0a308fc49132b4842efaf47ef9f7b2d3182a20074`.
- E2E: `club_portal_e2e-20261027103010601/database.dump`; SHA-256 `b1f02c833a2067a373771cb210f0d1c7db7579e29cc3cd5f57bb48eb7345aae2`.
- Vitest: `club_portal_test-20261027103024152/database.dump`; SHA-256 `87adceab877bf0aa4f7b8fe42492b29c21762e4d8085cb714df4e5582b519312`.

Mỗi dump được kiểm tra `pg_restore --list`, phục hồi vào một database riêng `bafu_restore_<timestamp>`, rồi đối chiếu count và digest toàn bộ hàng của từng bảng. Cả ba khớp. Không xóa database kiểm chứng. Media gốc đã sao lưu ở `backups/uploads-before-authenticity/`.

Demo backup chứa `inventory.json`, `receipt.json`, `cleanup-plan.json`, `cleanup-result.json`. Plan liệt kê ID từng bản ghi, ID dự kiến xóa và các tham chiếu ảnh cũ. Script `authenticity-cleanup.mjs` mặc định dry-run, yêu cầu `--environment=demo`, database local đúng tên, backup đã được kiểm tra và `--apply` riêng. Apply dùng transaction, giữ nhật ký, từ chối chạy lại cùng plan và kiểm tra thay đổi so với inventory.

Rollback: phục hồi dump vào một database mới, đối chiếu trước; sau đó operator chuyển cấu hình kết nối sang bản đã kiểm chứng hoặc phục hồi từng bản ghi từ inventory. Không `--clean` lên database đang phục vụ. Không reset PostgreSQL, TRUNCATE, migrate reset hoặc xóa volume. Nếu cần khôi phục 10 hàng media, tệp vẫn có cả trong volume gốc và bản sao backup.

## Ngăn tái nhiễm

`e2e/isolation.mjs` từ chối origin ngoài localhost/127.0.0.1:8080 và kiểm tra endpoint environment thực sự là database E2E. Global setup/teardown so sánh count và digest 15 bảng demo trước/sau; kết quả thực chạy: PASS. Test network cũng xác nhận frontend gọi API cùng origin 8080. Volume `uploads_e2e` tách khỏi `uploads_data` để ngăn cả ô nhiễm tệp, không chỉ database.

Seed chỉ chạy với NODE_ENV=test, đúng database test, `SEED_TEST_FIXTURES=true` và database rỗng; không còn nhánh xóa sạch dữ liệu. CI dùng `club_portal_test`. Ba script cũ xóa theo allowlist/gộp danh tính và tự gán ảnh đã bị vô hiệu hóa. Không có credential demo trong giao diện đăng nhập.

## Còn cần xử lý bằng nghiệp vụ

Không gắn nhãn người dùng UNKNOWN là thật. Cần xác minh danh tính và bổ nhiệm tài khoản quản trị thật; các tài khoản admin seed đã bị khóa. Hàng đợi xác minh có API và giao diện Super Admin, nhưng không dùng tài khoản minh họa để vận hành pilot. Bản ghi audit cũ được giữ lại, không dùng làm bằng chứng các tổ chức seed có thật.
