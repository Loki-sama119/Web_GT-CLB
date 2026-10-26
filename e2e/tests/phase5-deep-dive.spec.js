import { test, expect } from '@playwright/test';

test.describe.serial('Phase 5 & 6 Deep-Dive E2E Suite - Release Hardening', () => {

  test('01. Kiểm tra trang Sự kiện cộng đồng BAFU và bộ lọc', async ({ page }) => {
    await page.goto('/events');
    await expect(page).toHaveTitle(/Cổng Thông Tin Câu Lạc Bộ Sinh Viên/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Lịch Sự Kiện & Hoạt Động');

    // Kiểm tra hiển thị sự kiện từ seed
    await expect(page.getByText('Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026').first()).toBeVisible();
    await expect(page.getByText('Hội trường A1 - BAFU').first()).toBeVisible();
  });

  test('02. Kiểm tra Album Hoạt Động tại trang Chi Tiết Câu Lạc Bộ', async ({ page }) => {
    await page.goto('/clubs/clb-lap-trinh-bafu-tech');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('CLB Lập Trình & Công Nghệ BAFU Tech');

    // Tab album hoạt động
    await expect(page.getByText('Album Hoạt Động')).toBeVisible();
  });

  test('03. Club Admin quản lý hội viên, tìm kiếm và nút xuất CSV hội viên', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/club-admin');
    await expect(page.getByText('Quản Lý: CLB Lập Trình & Công Nghệ BAFU Tech')).toBeVisible({ timeout: 10000 });

    // Chuyển sang tab Danh Sách Hội Viên
    await page.getByRole('button', { name: 'Danh Sách Hội Viên' }).click();
    await expect(page.getByPlaceholder('Tìm hội viên theo Họ tên, MSSV, Khoa...')).toBeVisible();

    // Kiểm tra nút xuất file CSV hội viên
    const exportBtn = page.getByRole('button', { name: /Xuất Danh Sách/i });
    await expect(exportBtn).toBeVisible();
  });

  test('04. Super Admin kiểm tra Báo Cáo CLB Toàn Trường và bảng số liệu', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('AdminPassword@2026');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/admin/dashboard');
    await expect(page.getByText('Trung Tâm Quản Trị Hệ Thống (Super Admin)')).toBeVisible({ timeout: 10000 });

    // Chuyển sang tab Báo Cáo CLB Toàn Trường
    await page.getByRole('button', { name: 'Báo Cáo CLB Toàn Trường' }).click();
    await expect(page.getByText('Báo Cáo Hoạt Động Câu Lạc Bộ Toàn Trường')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tổng sự kiện CLB đã tổ chức')).toBeVisible();
    await expect(page.getByText('Lượt sinh viên đăng ký sự kiện')).toBeVisible();
    await expect(page.getByText('Tỷ lệ duyệt trúng tuyển TB')).toBeVisible();

    // Kiểm tra nút xuất file CSV báo cáo toàn trường
    const exportSchoolBtn = page.getByRole('button', { name: /Xuất Báo Cáo Excel/i });
    await expect(exportSchoolBtn).toBeVisible();

    // Chuyển sang tab Quản Lý & Tạo CLB (Batch import & Approval)
    await page.getByRole('button', { name: 'Tạo Câu Lạc Bộ Mới' }).click();
    await expect(page.getByText('Danh Sách & Phê Duyệt Câu Lạc Bộ')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Nhập Danh Sách CLB Bằng CSV (Batch Import)')).toBeVisible();
    await expect(page.getByRole('button', { name: /Tải file mẫu CSV/i })).toBeVisible();
  });

  test('06. Khách kiểm tra trang Chính Sách Quyền Riêng Tư (Privacy Policy) và DSAR', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chính Sách Quyền Riêng Tư & Bảo Vệ Dữ Liệu Cá Nhân');
    await expect(page.getByText('Mục Đích Thu Thập Thông Tin')).toBeVisible();
    await expect(page.getByText('Quyền Của Chủ Thể Dữ Liệu (Tham chiếu OWASP ASVS)')).toBeVisible();
    await expect(page.getByText('Quy Trình Tiếp Nhận & Xử Lý Yêu Cầu Dữ Liệu (DSAR)')).toBeVisible();
  });

  test('07. Khách kiểm tra trang Điều Khoản Sử Dụng (Terms of Service)', async ({ page }) => {
    await page.goto('/terms-of-service');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Điều Khoản Sử Dụng Cổng Thông Tin');
    await expect(page.getByText('Trách Nhiệm Của Sinh Viên')).toBeVisible();
    await expect(page.getByText('Trách Nhiệm Của Ban Chủ Nhiệm Câu Lạc Bộ')).toBeVisible();
    await expect(page.getByText('Các Hành Vi Nghiêm Cấm & Xử Lý Vi Phạm')).toBeVisible();
  });
});
