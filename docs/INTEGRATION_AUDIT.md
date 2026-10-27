# BÁO CÁO TÍCH HỢP HỆ THỐNG VÀ DOCKER (INTEGRATION AUDIT)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Thời điểm thực hiện:** 26/10/2026  
**Vai trò:** Senior DevOps & System Architect  

---

## 1. KIẾN TRÚC VÀ TÌNH TRẠNG 4 CONTAINERS

Hệ thống được khởi chạy hoàn chỉnh bằng Docker Compose thông qua mạng ảo nội bộ `club_network`:

| Tên Container | Hình ảnh / Base | Cổng Expose Host | Cổng Nội bộ | Trạng thái | Nhiệm vụ |
|---|---|---|---|---|---|
| `club_portal_postgres` | `postgres:16-alpine` | `5433:5432` | 5432 | **Up (healthy)** | Cơ sở dữ liệu quan hệ PostgreSQL 16 |
| `club_portal_backend` | Node 20 Alpine Multi-stage | `5000:5000` | 5000 | **Up (healthy)** | API RESTful Express.js & Prisma ORM |
| `club_portal_frontend` | Node 20 -> Nginx Alpine | `5173:80` | 80 | **Up (started)** | Ứng dụng SPA React 19 + Tailwind CSS |
| `club_portal_nginx` | `nginx:alpine` | `80:80` | 80 | **Up (started)** | Cổng Gateway đảo ngược (Reverse Proxy) |

> **Ghi chú về cổng 5433:** Máy chủ host có sẵn dịch vụ PostgreSQL chạy trên cổng mặc định 5432. Do đó, container database được ánh xạ ra cổng `5433` của host để tránh xung đột tài nguyên, trong khi bên trong Docker network các container vẫn giao tiếp với nhau qua cổng nội bộ chuẩn `5432`.

---

## 2. TỐI ƯU HÓA DOCKER BUILD CONTEXT

Trước khi tối ưu, Docker daemon phải copy toàn bộ thư mục `node_modules` và `.git` vào Docker build context, dẫn đến dung lượng cực lớn và tốc độ build chậm:
- Context Backend ban đầu: **~349 MB**
- Context Frontend ban đầu: **~140 MB**

### Giải pháp áp dụng:
1. Đã tạo `backend/.dockerignore`:
   ```
   node_modules
   npm-debug.log
   .env
   .env.*
   dist
   .git
   coverage
   ```
2. Đã tạo `frontend/.dockerignore`:
   ```
   node_modules
   dist
   .env
   .git
   ```
3. **Kết quả đạt được:**
   - Dung lượng build context Backend giảm xuống còn **126.3 kB** (giảm 99.96%).
   - Dung lượng build context Frontend giảm xuống còn **2.25 kB** (giảm 99.99%).
   - Tốc độ rebuild image từ vài phút giảm xuống chỉ còn vài giây.

---

## 3. CƠ CHẾ BẢO MẬT VÀ MULTI-STAGE BUILD

### 3.1. Dockerfile Backend
- Áp dụng non-root user `USER node` để thực thi process Express.
- Tự động sinh Prisma Client trong build time: `npx prisma generate`.
- Cấu hình Healthcheck tích hợp:
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1
  ```

### 3.2. Dockerfile Frontend & SPA Routing
- Sử dụng Multi-stage build: Giai đoạn 1 biên dịch `npm run build` tạo bundle siêu nhẹ; Giai đoạn 2 phục vụ tĩnh qua `nginx:alpine`.
- Đã cấu hình `frontend/nginx.conf` với luật `try_files $uri $uri/ /index.html;` nhằm đảm bảo router phía client (React Router) hoạt động mượt mà khi người dùng refresh hoặc truy cập trực tiếp đường link sâu (`/clubs/:slug`, `/student/dashboard`).

---

## 4. CẤU HÌNH NGINX REVERSE PROXY GATEWAY

Cấu hình tại `docker/nginx.conf` đóng vai trò điểm tiếp nhận duy nhất cho người dùng và các dịch vụ bên ngoài tại cổng 80:
- Đường dẫn `/api/`: Chuyển tiếp tới `http://backend:5000/api/` kèm cấu hình `proxy_set_header X-Real-IP`, `X-Forwarded-For`.
- Đường dẫn `/health`: Kiểm tra sức khỏe của API backend.
- Đường dẫn `/`: Chuyển tiếp tới `http://frontend:80` để tải giao diện.

Kiểm tra thực tế xác nhận:
- `http://localhost/` -> HTTP 200 (Trang chủ BAFU Club Portal).
- `http://localhost/api/v1/categories` -> HTTP 200 (Trả về 5 danh mục CLB).
- `http://localhost/health` -> HTTP 200 (`{"status":"ok"}`).
