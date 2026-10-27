import { test, expect } from '@playwright/test';

test.describe.serial('University Club Portal - End-to-End Test Suite (TC01-TC18)', () => {
  let testStudentEmail = '';
  let testStudentCode = '';
  let testStudentName = '';

  test.beforeAll(() => {
    const timestamp = Date.now();
    testStudentEmail = `playwright.student.${timestamp}@bafu.edu.vn`;
    testStudentCode = `SV${timestamp.toString().slice(-6)}`;
    testStudentName = `Sinh Viên Playwright ${timestamp.toString().slice(-4)}`;
  });

  test('01. Khách xem Landing page, danh mục, thống kê và danh sách CLB', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Cổng Thông Tin Câu Lạc Bộ Sinh Viên/);
    await expect(page.locator('h1')).toContainText('Cháy Hết Mình Cùng');

    await expect(page.getByText('Câu lạc bộ', { exact: true })).toBeVisible();
    await expect(page.getByText('Hội viên sinh viên')).toBeVisible();

    await page.getByRole('link', { name: 'Khám phá CLB ngay' }).first().click();
    await expect(page).toHaveURL(/.*\/clubs/);

    const searchInput = page.getByPlaceholder('Tìm kiếm theo tên câu lạc bộ');
    await searchInput.fill('Tech');
    await page.getByRole('button', { name: 'Tìm kiếm' }).click();

    await expect(page.getByText('CLB Lập Trình & Công Nghệ BAFU Tech').first()).toBeVisible();
  });

  test('02. Xem chi tiết CLB, BCN, lịch sinh hoạt và đợt tuyển', async ({ page }) => {
    await page.goto('/clubs/clb-lap-trinh-bafu-tech');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('CLB Lập Trình & Công Nghệ BAFU Tech');
    await expect(page.getByText('Lịch sinh hoạt thường kỳ')).toBeVisible();
    await expect(page.getByText('Ban Chủ Nhiệm Câu Lạc Bộ')).toBeVisible();

    await expect(page.getByText('Đợt Tuyển Thành Viên Gen 5 — BAFU Tech 2026').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Ứng tuyển vào CLB ngay/i })).toBeVisible();
  });

  test('03. Đăng ký tài khoản sinh viên mới', async ({ page }) => {
    await page.goto('/register');

    await page.getByPlaceholder('Nguyễn Văn A').fill(testStudentName);
    await page.getByPlaceholder('SV2026...').fill(testStudentCode);
    await page.getByPlaceholder('0987...').fill('0987112233');
    await page.getByPlaceholder('sinhvien@bafu.edu.vn').fill(testStudentEmail);
    await page.getByPlaceholder('••••••••').fill('Password123!');

    await page.getByRole('button', { name: 'Hoàn tất đăng ký' }).click();

    await expect(page).toHaveURL(/.*\/student\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: testStudentName })).toBeVisible();
    await expect(page.getByRole('main').getByText(testStudentCode, { exact: true })).toBeVisible();
  });

  test('04. Đăng nhập và nộp đơn ứng tuyển trực tuyến vào BAFU Tech', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill(testStudentEmail);
    await page.getByPlaceholder('••••••••').fill('Password123!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/clubs/clb-lap-trinh-bafu-tech');
    await page.getByRole('button', { name: /Ứng tuyển vào CLB ngay/i }).click();

    await page.getByLabel('Ban Lập trình Web/App').check();
    await page.getByLabel('JavaScript / TypeScript').check();

    const reasonTextarea = page.getByPlaceholder('Nhập chi tiết câu trả lời...');
    await reasonTextarea.fill('Em đam mê lập trình web và muốn cùng các anh chị xây dựng phần mềm hữu ích cho trường.');

    await page.getByRole('button', { name: 'Gửi đơn ứng tuyển' }).click();
    await expect(page.getByText('Nộp Hồ Sơ Thành Công!')).toBeVisible({ timeout: 10000 });
  });

  test('05. Kiểm tra trạng thái hồ sơ trong Dashboard sinh viên', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill(testStudentEmail);
    await page.getByPlaceholder('••••••••').fill('Password123!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Chờ đăng nhập thành công trước khi chuyển trang
    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/.*\/student\/dashboard/, { timeout: 10000 });
    await expect(page.getByText('Đợt Tuyển Thành Viên Gen 5 — BAFU Tech 2026').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Đã nộp đơn')).toBeVisible();
  });

  test('06. Club Admin duyệt hồ sơ và kích hoạt hội viên', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/club-admin');
    await expect(page.getByText('Quản Lý: CLB Lập Trình & Công Nghệ BAFU Tech')).toBeVisible({ timeout: 10000 });

    const searchAppInput = page.getByPlaceholder('Tìm ứng viên theo họ tên');
    await searchAppInput.fill(testStudentName);

    await expect(page.getByText(testStudentName).first()).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Xem & Xét duyệt' }).first().click({ force: true });

    await expect(page.getByText('Ban Lập trình Web/App')).toBeVisible();

    const notesInput = page.getByPlaceholder('Nhận xét thái độ, điểm phỏng vấn');
    await notesInput.fill('Ứng viên có động lực tốt, đạt yêu cầu.');

    await page.getByRole('button', { name: /Duyệt trúng tuyển/i }).click({ force: true });

    await expect(page.getByText('ACCEPTED').first()).toBeVisible({ timeout: 10000 });
  });

  test('07. Sinh viên thấy tư cách thành viên đã được kích hoạt', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill(testStudentEmail);
    await page.getByPlaceholder('••••••••').fill('Password123!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/.*\/student\/dashboard/, { timeout: 10000 });

    await expect(page.getByText('Đã trúng tuyển')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('CLB Lập Trình & Công Nghệ BAFU Tech').first()).toBeVisible();
    await expect(page.getByText('Hội viên chính thức').first()).toBeVisible();
  });

  test('08. Super Admin quản lý toàn trường và xem thống kê', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('AdminPassword@2026');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*\/admin\/dashboard/, { timeout: 10000 });

    await expect(page.getByText('Trung Tâm Quản Trị Hệ Thống (Super Admin)')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tổng người dùng')).toBeVisible();
    await expect(page.getByText('Hồ Sơ Ứng Tuyển Gần Đây')).toBeVisible();

    await page.getByRole('button', { name: 'Người Dùng & Phân Quyền' }).click();
    await expect(page.getByText('Cấp Quyền Ban Chủ Nhiệm Cho Thành Viên')).toBeVisible();

    await page.getByRole('button', { name: /Nhật Ký Kiểm Toán/i }).click();
    await expect(page.getByText('Nhật Ký Thao Tác Hệ Thống (Audit Logs)')).toBeVisible();
  });

  test('09. Đăng xuất và bảo đảm phiên bị vô hiệu hóa an toàn', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('AdminPassword@2026');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).not.toHaveURL(/.*\/login/, { timeout: 10000 });

    await page.locator('header').getByRole('button').last().click();
    await page.getByRole('button', { name: /Đăng xuất/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Đăng nhập' })).toBeVisible();

    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
