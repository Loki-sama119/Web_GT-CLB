# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH HỆ THỐNG (DEPLOYMENT GUIDE)
**Dự án:** University Club Portal — Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU  
**Phiên bản:** Phase 4 Production-Ready  
**Thời điểm cập nhật:** 26/10/2026  

---

## 1. YÊU CẦU HỆ THỐNG TỐI THIỂU
- **Hệ điều hành:** Linux (Ubuntu 22.04 LTS khuyến nghị), Windows 10/11 với WSL2, hoặc macOS.
- **Docker:** Phiên bản 24.0 trở lên kèm `docker compose`.
- **Node.js:** Phiên bản 20.x LTS (nếu chạy không qua Docker).
- **RAM:** Tối thiểu 4 GB (khuyến nghị 8 GB).
- **Disk:** Tối thiểu 10 GB dung lượng trống.

---

## 2. TRIỂN KHAI NHANH BẰNG DOCKER COMPOSE

### 2.1. Chuẩn bị file cấu hình môi trường
Hệ thống sử dụng các file `.env` chuẩn. Trong môi trường Docker Compose, các biến môi trường mặc định đã được thiết lập sẵn trong `docker-compose.yml`:
- `POSTGRES_USER`: `postgres`
- `POSTGRES_PASSWORD`: `postgrespassword`
- `POSTGRES_DB`: `club_portal_db`
- `DATABASE_URL`: `postgresql://postgres:postgrespassword@postgres:5432/club_portal_db?schema=public`
- `JWT_SECRET`: `super-secret-jwt-key-for-university-club-portal-2026`
- `RATE_LIMIT_MAX`: `2000`

### 2.2. Khởi chạy toàn bộ 4 Containers
Chạy lệnh duy nhất tại thư mục gốc của dự án:
```bash
docker compose up -d --build
```

### 2.3. Kiểm tra trạng thái
```bash
docker compose ps
```
Cả 4 container phải ở trạng thái `running` / `healthy`:
- `club_portal_postgres` (Host 5433 -> 5432)
- `club_portal_backend` (Host 5000 -> 5000)
- `club_portal_frontend` (Host 5173 -> 80)
- `club_portal_nginx` (Host 80 -> 80)

---

## 3. CHIẾN LƯỢC QUẢN LÝ DATABASE VÀ PRISMA MIGRATE AN TOÀN

### 3.1. Nguyên tắc bảo toàn dữ liệu
- **Tuyệt đối không chạy `prisma migrate reset`** hoặc `prisma db push --force-reset` trên môi trường Production để tránh mất dữ liệu thực tế của sinh viên và câu lạc bộ.
- Database đã được baseline an toàn thông qua migration file `backend/prisma/migrations/0_init/migration.sql`.

### 3.2. Khi triển khai phiên bản mới hoặc chạy trên CI/CD
Sử dụng lệnh:
```bash
cd backend
npx prisma migrate deploy
```
Lệnh `migrate deploy` chỉ áp dụng các file migration chưa được chạy, đảm bảo 100% dữ liệu hiện có được giữ nguyên vẹn.

---

## 4. QUY TRÌNH SAO LƯU VÀ PHỤC HỒI DỮ LIỆU (BACKUP & RESTORE)

### 4.1. Sao lưu dữ liệu PostgreSQL (Backup)
Chạy lệnh tạo bản sao lưu dạng SQL nén trực tiếp từ container database:
```bash
# Tạo thư mục sao lưu nếu chưa có
mkdir -p backups

# Thực hiện pg_dump
docker exec -t club_portal_postgres pg_dump -U postgres -d club_portal_db > backups/backup_club_portal_$(date +%Y%m%d_%H%M%S).sql
```

### 4.2. Phục hồi dữ liệu từ file sao lưu (Restore)
Trong trường hợp cần hoàn nguyên dữ liệu:
```bash
# 1. Ngắt kết nối các ứng dụng tới database
docker compose stop backend

# 2. Xóa và tạo lại database rỗng
docker exec -i club_portal_postgres psql -U postgres -c "DROP DATABASE IF EXISTS club_portal_db;"
docker exec -i club_portal_postgres psql -U postgres -c "CREATE DATABASE club_portal_db;"

# 3. Nạp lại dữ liệu từ file backup
docker exec -i club_portal_postgres psql -U postgres -d club_portal_db < backups/backup_club_portal_XXXXXX.sql

# 4. Khởi động lại backend
docker compose start backend
```

---

## 5. KIỂM TRA SỨC KHỎE VÀ GIÁM SÁT HỆ THỐNG

### 5.1. Các điểm cuối kiểm tra (Health Check Endpoints)
- **Cổng Gateway Nginx:** `http://localhost/` (Trả về mã HTTP 200)
- **API Backend Health:** `http://localhost/health` hoặc `http://localhost:5000/health` (Trả về `{"status":"ok"}`)
- **API Categories:** `http://localhost/api/v1/categories` (Trả về danh mục CLB)

### 5.2. Xem nhật ký (Logs)
```bash
# Xem log toàn bộ hệ thống
docker compose logs -f

# Xem riêng log của backend
docker compose logs -f backend
```
