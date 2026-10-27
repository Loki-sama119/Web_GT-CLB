# BAFU Campus Clubs

Dự án cổng thông tin câu lạc bộ sinh viên thí điểm cho bối cảnh Trường Đại học Nông – Lâm Bắc Giang. Chưa phải website được nhà trường phê duyệt. Tên và màu chữ của dự án không phải logo chính thức của trường.

## Trạng thái hiện tại

Ngày 27/10/2026: giao diện Campus Editorial, public directory theo nguồn xác minh, lịch sử sự kiện giữ ngày gốc, dashboard chức năng và hàng đợi xác minh. Bản local có 5 hồ sơ CLB đối chiếu được nguồn ở mức tồn tại/lịch sử; hoạt động hiện tại chưa xác nhận. Không có đợt tuyển hoặc sự kiện sắp diễn ra được xác minh. Logo/ảnh chưa được cấp quyền dùng fallback có nhãn.

Dữ liệu demo, tài khoản và sự kiện seed không được trình bày như dữ liệu thật. 15 tài khoản seed trong database pilot local đã bị vô hiệu hóa; hai tài khoản UNKNOWN được giữ nguyên. Không có nút điền tài khoản mẫu trên trang đăng nhập. Cần xác minh và bổ nhiệm quản trị viên thật trước khi vận hành.

## Stack và chức năng

React 19, Vite 6, Tailwind CSS 4; Express 5, Prisma 6, PostgreSQL 16. Xác thực HTTP-only cookie, hồ sơ sinh viên, danh bạ CLB, ứng tuyển/form động, hội viên, sự kiện, media, RBAC, CSV chống formula injection và audit log. Bản ghi nội dung mới mặc định UNKNOWN; chỉ nội dung có nguồn và được xác minh mới công bố. Ảnh cần thêm bằng chứng quyền sử dụng và duyệt theo đúng chủ thể.

## Khởi chạy local

1. Cài Docker Desktop và Docker Compose. Dùng cấu hình trong `docker-compose.yml` cho workspace local; cấu hình production từ xa phải được operator chuẩn bị riêng.
2. Chạy `docker compose up -d --build`.
3. Áp dụng migration bằng `npx prisma migrate deploy` trong backend với DATABASE_URL đúng môi trường. Không dùng migrate reset hoặc reset volume.
4. Sau khi tạo lại backend container, reload Nginx: `docker compose exec nginx nginx -s reload`.

- Public local: [http://localhost](http://localhost).
- Frontend container độc lập: [http://localhost:5173](http://localhost:5173); các luồng có API cần đi qua reverse proxy.
- E2E: [http://localhost:8080](http://localhost:8080), backend 5001, database club_portal_e2e, volume upload riêng.
- Backend demo: cổng 5000, database club_portal_db. PostgreSQL host 5433.

Có thể chạy frontend bằng `npm run dev` và backend bằng `npm run dev` trong từng thư mục với biến môi trường local phù hợp. Không dùng seed để khởi tạo pilot. Import danh mục xác minh cần có backup và kế hoạch theo ID; xem báo cáo audit.

## Kiểm thử và fixture

Trong backend: `npm test` dùng club_portal_test. Trong frontend: `npm run build`. Trong e2e: `npm test` dùng reverse proxy 8080; global setup kiểm tra đúng database, teardown kiểm chứng demo không thay đổi. Trình duyệt Playwright cần được cài; trên Windows có thể đặt PLAYWRIGHT_BROWSERS_PATH đến thư mục trình duyệt đã cài.

Nếu tạo môi trường kiểm thử mới, migrate trước vào database test rỗng. Seed chỉ chấp nhận NODE_ENV=test, SEED_TEST_FIXTURES=true và tên club_portal_test hoặc club_portal_e2e; từ chối database đã có user, không xóa sạch dữ liệu. CI cũng dùng club_portal_test. Tài khoản fixture chỉ nằm trong seed của môi trường test, không dùng làm tài khoản người thật.

Kết quả đợt này: backend 49/49, E2E 34/34, production build PASS, public functional desktop/mobile PASS, 43 tổ hợp screenshot/viewport không tràn ngang hoặc ảnh lỗi. Xem JSON thực chạy thay vì số liệu các báo cáo giai đoạn cũ.

## Tài liệu nghiệm thu hiện hành

- [Audit dữ liệu và rollback](docs/BAFU_DATA_AUTHENTICITY_AUDIT.md).
- [Nguồn, quyền sử dụng và ảnh đã gỡ gán sai](docs/BAFU_MEDIA_PROVENANCE.md).
- [Danh mục CLB có nguồn, các trường hợp chưa xác minh](docs/BAFU_REAL_CLUB_CATALOG.md).
- [Giao diện, chẩn đoán scale, QA và phần chưa đạt](docs/BAFU_EDITORIAL_REDESIGN_REPORT.md).
- [Kết quả kiểm thử](docs/qa/) và [ảnh nghiệm thu mới](screenshots/bafu-authenticity/).

Các báo cáo Phase 6/7 và tài liệu trước đợt audit này là lịch sử phát triển có dữ liệu minh họa. Không dùng chúng để chứng minh số thành viên, tổ chức, cấp quyền logo hay phê duyệt của nhà trường. Báo cáo logo cũ đã được đính chính riêng.

Backup và inventory có dữ liệu cá nhân được giữ trong backups/ và không đưa vào Git. Không xóa database phục hồi kiểm chứng, backup hoặc media gốc khi chưa có kế hoạch được operator xác nhận.
