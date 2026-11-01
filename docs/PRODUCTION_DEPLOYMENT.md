# HƯỚNG DẪN TRIỂN KHAI VẬN HÀNH PRODUCTION (PRODUCTION DEPLOYMENT GUIDE)
## Dự án: University Club Portal — BAFU
**Phiên bản tài liệu:** 1.0.0  
**Giai đoạn:** Phase 6 — Release Hardening  
**Tác giả:** DevOps & Infrastructure Engineering  

---

## 1. YÊU CẦU PHẦN CỨNG VÀ HẠ TẦNG (SYSTEM REQUIREMENTS)

### 1.1 Cấu hình tối thiểu đề xuất (VPS / On-Premise Server)
- **Hệ điều hành:** Ubuntu Server 22.04 LTS hoặc 24.04 LTS (x86_64).
- **CPU:** Tối thiểu 2 vCPU (Khuyến nghị 4 vCPU cho tải cao điểm tuyển thành viên).
- **RAM:** Tối thiểu 4 GB (Khuyến nghị 8 GB với 2 GB Swap).
- **Lưu trữ:** 50 GB SSD (NVMe khuyến nghị cho PostgreSQL data và thư mục upload ảnh).
- **Mạng:** Băng thông tối thiểu 100 Mbps, địa chỉ IPv4 tĩnh công khai (Public Static IP).

### 1.2 Yêu cầu phần mềm cài đặt sẵn trên máy chủ
```bash
# Cập nhật hệ điều hành
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker Engine & Docker Compose V2
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Cài đặt Certbot để cấp phát chứng chỉ SSL Let's Encrypt (nếu chạy certbot độc lập)
sudo apt install -y certbot
```

---

## 2. KIẾN TRÚC MẠNG VÀ PHÂN VÙNG BẢO MẬT (ISOLATED NETWORK ARCHITECTURE)

Hệ thống được thiết kế theo mô hình **Zero-Trust Network Segmentation**:
- **Cổng công khai (Internet Exposure):** CHỈ mở duy nhất Port `80` (HTTP chuyển hướng sang HTTPS) và Port `443` (HTTPS) trên Reverse Proxy Nginx.
- **Vùng mạng ứng dụng (Internal App Network):** Backend Node.js và Frontend chạy trên mạng ảo Docker `club_internal_net`, không mở cổng trực tiếp ra Internet.
- **Vùng dữ liệu cô lập (Private Database Network):** PostgreSQL 16 **KHÔNG ánh xạ bất kỳ cổng nào ra máy chủ bên ngoài** (không bind `0.0.0.0:5432`). Chỉ cho phép container Backend trong cùng Docker Network truy cập thông qua hostname `postgres:5432`.

```
 Internet (Sinh viên / BCN / Quản trị viên)
                   │
                   ▼ (Port 80 / 443 TLS 1.3)
      ┌─────────────────────────┐
      │   Nginx Reverse Proxy   │ (OWASP Security Headers + SSL Termination)
      └────────────┬────────────┘
                   │ Docker Network: club_internal_net
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│ Frontend (Vite) │ │  Backend (API)  │
│ Container: 80   │ │ Container: 5000 │
└─────────────────┘ └────────┬────────┘
                             │ Docker Network: club_data_net (Isolated)
                             ▼
                    ┌─────────────────┐
                    │  PostgreSQL 16  │ (Private, NO HOST PORT EXPOSED)
                    │ Volume: pgdata  │
                    └─────────────────┘
```

---

## 3. QUẢN LÝ BIẾN MÔI TRƯỜNG VÀ SECRETS (ENV & SECRET MANAGEMENT)

Tạo file bí mật `.env.production` tại thư mục gốc của dự án trên máy chủ (phân quyền chỉ user quản trị đọc được `chmod 600 .env.production`):

```bash
# Phân quyền tệp cấu hình bảo mật
chmod 600 .env.production
```

Nội dung `.env.production` tham chiếu từ mẫu [.env.production.example](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/.env.production.example):
- `DATABASE_URL`: Sử dụng mật khẩu ngẫu nhiên tối thiểu 32 ký tự, kết nối `postgresql://postgres:STRONG_PASSWORD@postgres:5432/club_portal_db?schema=public`.
- `JWT_SECRET`: Khóa bí mật tối thiểu 64 ký tự hex ngẫu nhiên sinh bằng `openssl rand -hex 32`.
- `COOKIE_SECRET`: Chuỗi khóa ký cookie bảo mật cao.
- `NODE_ENV`: Bắt buộc thiết lập `production`.
- `FRONTEND_URL`: Tên miền chính thức của trường (ví dụ: `https://clb.bafu.edu.vn`).

---

## 4. QUY TRÌNH TRIỂN KHAI VỚI DOCKER COMPOSE PRODUCTION

### Bước 1: Sao chép mã nguồn và thiết lập thư mục dữ liệu
```bash
# Clone repository hoặc cập nhật mã nguồn đã đóng gói
cd /opt/club-portal
git checkout feature/phase6-release-readiness

# Khởi tạo thư mục lưu trữ bền vững (Persistent Volumes)
mkdir -p /opt/club-portal/docker/volumes/postgres_data
mkdir -p /opt/club-portal/docker/volumes/uploads
mkdir -p /opt/club-portal/docker/certbot/conf
mkdir -p /opt/club-portal/docker/certbot/www
mkdir -p /opt/club-portal/docker/nginx/logs
```

### Bước 2: Thiết lập chứng chỉ SSL Let's Encrypt
```bash
# Cấp chứng chỉ SSL lần đầu (Standalone mode hoặc qua Nginx webroot)
sudo certbot certonly --webroot -w /opt/club-portal/docker/certbot/www \
  -d clb.bafu.edu.vn \
  --email bafudev@bafu.edu.vn \
  --agree-tos --no-eff-email
```

### Bước 3: Khởi chạy cụm dịch vụ Production
```bash
# Build và chạy ngầm các container production
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Kiểm tra trạng thái sức khỏe các dịch vụ
docker compose -f docker-compose.prod.yml ps
```

### Bước 4: Chạy Migration cơ sở dữ liệu trên Production
```bash
# Thực thi Prisma Migration Deploy (Không làm mất dữ liệu hiện có)
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

---

## 5. GIÁM SÁT SỨC KHỎE VÀ QUẢN LÝ NHẬT KÝ (LOG ROTATION & HEALTH CHECKS)

### 5.1 Giới hạn và luân chuyển nhật ký (Log Rotation)
Trong [docker-compose.prod.yml](file:///d:/CLB%20Sinh%20Vi%C3%AAn%20BAFU/Web_GT-CLB/docker-compose.prod.yml), tất cả các container đều được áp dụng chính sách:
- Driver: `json-file`
- `max-size`: `10m` (Tối đa 10 MB mỗi tệp nhật ký)
- `max-file`: `3` (Lưu tối đa 3 tệp cũ, tự động xóa tệp cũ nhất khi quá giới hạn)

### 5.2 Kiểm tra trạng thái hoạt động (Health Checks)
- **Nginx:** `GET /health` trả về `200 OK`
- **Backend:** `GET http://localhost:5000/api/health` kiểm tra kết nối database và trả về `status: healthy`
- **PostgreSQL:** Lệnh nội bộ `pg_isready -U postgres -d club_portal_db` thực hiện định kỳ 10 giây/lần.

---

## 6. CHIẾN LƯỢC DỰ PHÒNG VÀ HOÀN NGUYÊN (ROLLBACK STRATEGY)

Trong trường hợp phiên bản mới phát sinh lỗi nghiêm trọng sau khi triển khai:
1. **Dừng container hiện tại:**
   ```bash
   docker compose -f docker-compose.prod.yml stop backend frontend
   ```
2. **Khôi phục bản sao lưu database trước khi cập nhật:**
   ```bash
   docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d club_portal_db < /opt/club-portal/backups/backup_phase6_pre.sql
   ```
3. **Chuyển về Git commit ổn định trước đó và tái khởi động:**
   ```bash
   git checkout <PREVIOUS_STABLE_COMMIT_HASH>
   docker compose -f docker-compose.prod.yml up -d --build
   ```
4. **Kiểm tra nhật ký kiểm chứng:**
   ```bash
   docker compose -f docker-compose.prod.yml logs -f --tail=100 backend
   ```
