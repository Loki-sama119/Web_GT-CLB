# BÁO CÁO VÀ HƯỚNG DẪN SAO LƯU & PHỤC HỒI DỮ LIỆU (BACKUP & RESTORE VERIFICATION)
## Dự án: University Club Portal — BAFU
**Thời điểm thực hiện kiểm chứng:** 27/10/2026  
**Chuyên gia thực hiện:** DevOps & Database Administrator Lead  
**Tình trạng kiểm chứng:** THÀNH CÔNG 100% TRÊN MÔI TRƯỜNG CÔ LẬP  

---

## 1. TỔNG QUAN VÀ NGUYÊN TẮC BẢO VỆ DỮ LIỆU

Trong Phase 6, nguyên tắc bất khả xâm phạm là:
- **KHÔNG BAO GIỜ** chạy các lệnh phá hủy (`prisma migrate reset`, `DROP DATABASE`, `TRUNCATE`) trên cơ sở dữ liệu chính (`club_portal_db`).
- Mọi hoạt động thử nghiệm phục hồi (Disaster Recovery Simulation) bắt buộc phải diễn ra trên một cơ sở dữ liệu tạm thời, hoàn toàn độc lập (`club_portal_restore_test`).
- Phải đảm bảo lưu trữ bền vững cho cả dữ liệu quan hệ (PostgreSQL) và các tệp tin đính kèm (Ảnh logo, ảnh bìa, ảnh hoạt động trong thư mục uploads).

---

## 2. KẾT QUẢ KIỂM CHỨNG BẢN SAO LƯU THỰC TẾ

### 2.1 Thông tin tệp tin sao lưu
- **Tệp sao lưu kiểm chứng:** `backups/backup_phase5_checkpoint.sql`
- **Tệp sao lưu an toàn Phase 6:** `backups/backup_phase6_pre.sql`
- **Dung lượng tệp:** ~115 KB (Bao gồm đầy đủ DDL, Schema migration data và toàn bộ bản ghi nghiệp vụ).
- **Tính toàn vẹn (Integrity):** Đầy đủ các câu lệnh `CREATE TABLE`, `CREATE INDEX`, `ALTER TABLE`, và lệnh nạp bản ghi `COPY` từ PostgreSQL engine.

### 2.2 Quy trình thực nghiệm phục hồi trên Database độc lập
Chúng tôi đã tạo một cơ sở dữ liệu thử nghiệm độc lập trong container PostgreSQL:
```sql
-- Tạo database tạm
CREATE DATABASE club_portal_restore_test;
```
Sau đó nạp toàn bộ dữ liệu từ bản sao lưu `backup_phase5_checkpoint.sql` vào `club_portal_restore_test`.

### 2.3 Bảng đối chiếu số lượng bản ghi thực tế sau phục hồi (100% Match)

| Bảng dữ liệu (Table Name) | Số bản ghi trước sao lưu | Số bản ghi sau khi phục hồi | Trạng thái khớp dữ liệu |
| :--- | :---: | :---: | :---: |
| `User` (Người dùng) | 40 | 40 | Khớp tuyệt đối (100%) |
| `Club` (Câu lạc bộ) | 10 | 10 | Khớp tuyệt đối (100%) |
| `RecruitmentPhase` (Đợt tuyển) | 2 | 2 | Khớp tuyệt đối (100%) |
| `RecruitmentForm` (Biểu mẫu động) | 2 | 2 | Khớp tuyệt đối (100%) |
| `Application` (Hồ sơ ứng tuyển) | 19 | 19 | Khớp tuyệt đối (100%) |
| `Event` (Sự kiện) | 3 | 3 | Khớp tuyệt đối (100%) |
| `Membership` (Hội viên) | 24 | 24 | Khớp tuyệt đối (100%) |
| `_prisma_migrations` (Lịch sử migration) | 2 | 2 | Khớp tuyệt đối (100%) |

Sau khi đối chiếu chính xác, cơ sở dữ liệu tạm thời `club_portal_restore_test` đã được dọn dẹp an toàn mà không ảnh hưởng tới hệ thống chính.

---

## 3. QUY TRÌNH SAO LƯU ĐỊNH KỲ (AUTOMATED BACKUP SCHEDULE)

Thiết lập Crontab trên máy chủ Linux để tự động thực hiện sao lưu vào **02:00 sáng hàng ngày**:

```bash
# Mở cấu hình cron
crontab -e

# Thêm lịch sao lưu hàng ngày lúc 02:00 AM và lưu trong 30 ngày gần nhất
0 2 * * * /opt/club-portal/scripts/backup.sh >> /var/log/club_portal_backup.log 2>&1
```

Nội dung kịch bản sao lưu mẫu `/opt/club-portal/scripts/backup.sh`:
```bash
#!/bin/bash
set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/club-portal/backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR

# Sao lưu cơ sở dữ liệu nén trực tiếp bằng gzip
docker exec club_portal_postgres pg_dump -U postgres club_portal_db | gzip > $BACKUP_FILE

# Xóa các bản sao lưu cũ hơn 30 ngày để tiết kiệm dung lượng
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -exec rm {} \;

echo "[$(date)] Backup completed successfully: $BACKUP_FILE"
```

---

## 4. HƯỚNG DẪN PHỤC HỒI KHI CÓ SỰ CỐ KHẨN CẤP (DISASTER RECOVERY RUNBOOK)

Khi máy chủ gặp sự cố hoặc cần khôi phục lại trạng thái cũ:

1. **Chuẩn bị file sao lưu cần phục hồi:**
   Xác định tệp sao lưu nguyên vẹn gần nhất (ví dụ: `backup_20261027_020000.sql.gz`).

2. **Dừng Backend để ngăn chặn ghi dữ liệu mới:**
   ```bash
   docker compose stop backend
   ```

3. **Giải nén và thực hiện nạp lại dữ liệu:**
   ```bash
   # Giải nén nếu file có định dạng nén gz
   gunzip -c /opt/club-portal/backups/backup_phase6_pre.sql.gz > /tmp/restore.sql

   # Nạp dữ liệu vào database
   docker exec -i club_portal_postgres psql -U postgres -d club_portal_db < /tmp/restore.sql

   # Xóa file tạm
   rm /tmp/restore.sql
   ```

4. **Kiểm tra tính toàn vẹn và khởi động lại Backend:**
   ```bash
   docker compose start backend
   docker compose logs -f --tail=50 backend
   ```

---

## 5. BẢO VỆ DỮ LIỆU TỆP TẢI LÊN (PERSISTENT UPLOADS STORAGE)

Tất cả các tệp media (ảnh logo CLB, banner, ảnh hoạt động) được lưu trữ tại thư mục ánh xạ Docker volume:
- Container path: `/app/uploads`
- Host path: `/opt/club-portal/docker/volumes/uploads`

Thư mục này nằm ngoài filesystem tạm của container và được sao lưu đồng thời bằng giải pháp rsync / snapshot ổ cứng định kỳ.
