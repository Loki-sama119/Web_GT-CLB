# UNIVERSITY CLUB PORTAL — ĐẶC TẢ API (RESTFUL API CONTRACT)

Tất cả các API được định nghĩa dưới tiền tố `/api/v1`.
Định dạng dữ liệu trao đổi: `application/json`.
Cơ chế bảo mật phiên: Cookie chứa JWT token (`accessToken`).

## 1. Chuẩn hóa Phản hồi (Standard Response Format)

### Thành công:
```json
{
  "success": true,
  "message": "Thông điệp xử lý thành công",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Lỗi:
```json
{
  "success": false,
  "message": "Mô tả lỗi dễ hiểu cho người dùng",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng hợp lệ"
    }
  ]
}
```

---

## 2. Danh mục Endpoints

### 2.1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Đăng ký tài khoản sinh viên mới kèm thông tin cá nhân |
| POST | `/api/v1/auth/login` | Public | Đăng nhập hệ thống (trả về User info và set Cookie an toàn) |
| POST | `/api/v1/auth/logout` | Authenticated | Đăng xuất (xóa Cookie phiên) |
| GET | `/api/v1/auth/me` | Authenticated | Lấy thông tin tài khoản hiện tại kèm danh sách quyền CLB |

### 2.2. User Profile (`/api/v1/users`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/users/profile` | Authenticated | Lấy hồ sơ chi tiết sinh viên |
| PUT | `/api/v1/users/profile` | Authenticated | Cập nhật hồ sơ sinh viên (họ tên, khoa, viện, kỹ năng...) |

### 2.3. Categories & Clubs (`/api/v1/categories`, `/api/v1/clubs`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/categories` | Public | Danh sách danh mục lĩnh vực CLB |
| GET | `/api/v1/clubs` | Public | Danh sách CLB (lọc theo category, search, recruiting, phân trang) |
| GET | `/api/v1/clubs/:slug` | Public | Chi tiết CLB theo slug |
| POST | `/api/v1/clubs` | SUPER_ADMIN | Tạo mới CLB |
| PUT | `/api/v1/clubs/:id` | CLUB_ADMIN / SUPER_ADMIN | Cập nhật thông tin CLB |

### 2.4. Recruitment Campaigns & Forms (`/api/v1/recruitments`, `/api/v1/clubs/:id/recruitments`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/clubs/:id/recruitments` | Public / Club Admin | Danh sách đợt tuyển của CLB |
| POST | `/api/v1/clubs/:id/recruitments` | CLUB_ADMIN | Tạo đợt tuyển mới kèm biểu mẫu câu hỏi động |
| GET | `/api/v1/recruitments/:id` | Public | Xem thông tin đợt tuyển và cấu trúc form câu hỏi |
| PUT | `/api/v1/recruitments/:id` | CLUB_ADMIN | Cập nhật trạng thái đợt tuyển (DRAFT/OPEN/CLOSED) |

### 2.5. Applications (`/api/v1/applications`, `/api/v1/recruitments/:id/apply`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/api/v1/recruitments/:id/apply` | STUDENT | Nộp hồ sơ ứng tuyển vào đợt tuyển đang mở |
| GET | `/api/v1/applications/my-applications` | STUDENT | Lấy danh sách hồ sơ ứng tuyển của chính mình |
| GET | `/api/v1/clubs/:id/applications` | CLUB_ADMIN | Danh sách hồ sơ ứng tuyển vào CLB (lọc theo đợt, trạng thái) |
| GET | `/api/v1/applications/:id` | Owner / CLUB_ADMIN | Xem chi tiết hồ sơ ứng tuyển |
| PATCH | `/api/v1/applications/:id/status` | CLUB_ADMIN | Duyệt/Từ chối hồ sơ (ACCEPTED tự động kích hoạt Membership) |
| POST | `/api/v1/applications/:id/withdraw` | Owner | Rút đơn ứng tuyển |

### 2.6. Club Memberships (`/api/v1/clubs/:id/members`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/clubs/:id/members` | Public / CLUB_ADMIN | Danh sách thành viên CLB |
| PATCH | `/api/v1/clubs/:id/members/:memberId` | CLUB_ADMIN / SUPER_ADMIN | Phân quyền/chức vụ hội viên trong CLB |
| DELETE | `/api/v1/clubs/:id/members/:memberId` | CLUB_ADMIN / SUPER_ADMIN | Xóa thành viên khỏi CLB |

### 2.7. Events & News (`/api/v1/events`, `/api/v1/posts`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/events` | Public | Danh sách sự kiện sắp diễn ra |
| POST | `/api/v1/clubs/:id/events` | CLUB_ADMIN | Tạo sự kiện mới cho CLB |
| POST | `/api/v1/events/:id/register` | STUDENT | Đăng ký tham gia sự kiện |
| GET | `/api/v1/posts` | Public | Tin tức, bài viết các CLB |
| POST | `/api/v1/clubs/:id/posts` | CLUB_ADMIN | Đăng bài viết cho CLB |

### 2.8. Super Admin & Stats (`/api/v1/admin`, `/api/v1/stats`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/v1/stats/overview` | Public | Thống kê số lượng CLB, thành viên, sự kiện (dữ liệu thật từ DB) |
| GET | `/api/v1/admin/dashboard` | SUPER_ADMIN | Thống kê nâng cao toàn trường |
| GET | `/api/v1/admin/users` | SUPER_ADMIN | Quản lý người dùng, phân quyền Club Admin |
| GET | `/api/v1/admin/audit-logs` | SUPER_ADMIN | Xem nhật ký hệ thống |
