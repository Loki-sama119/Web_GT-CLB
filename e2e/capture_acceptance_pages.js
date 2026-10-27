import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('..', 'docs', 'ui-acceptance');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetViewports = [
  { name: 'desktop_1440', width: 1440, height: 900, isMobile: false },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true }
];

async function captureAllAcceptancePages() {
  const browser = await chromium.launch();
  console.log('🚀 Starting UI Acceptance Evidence Capture for Desktop 1440px & Mobile 390px...');

  for (const vp of targetViewports) {
    console.log(`\n========================================`);
    console.log(`📸 Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    // 1. Guest Context
    const guestCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      baseURL: 'http://localhost:80'
    });
    const guestPage = await guestCtx.newPage();

    // 1.1 Landing Page
    console.log(`Capturing Landing Page...`);
    await guestPage.goto('/');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_01_landing_page.png`), fullPage: false });

    // 1.2 Login Page
    console.log(`Capturing Login Page...`);
    await guestPage.goto('/login');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_02_login_page.png`), fullPage: false });

    // 1.3 Register Page
    console.log(`Capturing Register Page...`);
    await guestPage.goto('/register');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_03_register_page.png`), fullPage: false });

    // 1.4 Khám phá CLB
    console.log(`Capturing Clubs Discovery Page...`);
    await guestPage.goto('/clubs');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_04_clubs_discovery.png`), fullPage: false });

    // 1.5 Chi tiết CLB
    console.log(`Capturing Club Detail Page...`);
    await guestPage.goto('/clubs/clb-lap-trinh-bafu-tech');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_05_club_detail.png`), fullPage: false });

    // 1.6 Events Page
    console.log(`Capturing Events Page...`);
    await guestPage.goto('/events');
    await guestPage.waitForLoadState('networkidle');
    await guestPage.screenshot({ path: path.join(outDir, `${vp.name}_06_events_page.png`), fullPage: false });

    await guestCtx.close();

    // 2. Student Context (authenticated as haidang.sv@bafu.edu.vn)
    console.log(`Capturing Student Dashboard & Recruitment Modal...`);
    const studentCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      baseURL: 'http://localhost:80'
    });
    const studentPage = await studentCtx.newPage();
    await studentPage.goto('/login');
    await studentPage.getByPlaceholder('ten@bafu.edu.vn').fill('haidang.sv@bafu.edu.vn');
    await studentPage.getByPlaceholder('••••••••').fill('12345678');
    await studentPage.getByRole('button', { name: 'Đăng nhập' }).click();
    await studentPage.waitForLoadState('networkidle');

    // 2.1 Student Dashboard
    await studentPage.goto('/student/dashboard');
    await studentPage.waitForLoadState('networkidle');
    await studentPage.screenshot({ path: path.join(outDir, `${vp.name}_07_student_dashboard.png`), fullPage: false });

    // 2.2 Recruitment Form / Modal
    await studentPage.goto('/clubs/clb-lap-trinh-bafu-tech');
    await studentPage.waitForLoadState('networkidle');
    const applyButton = studentPage.getByRole('button', { name: 'Ứng Tuyển Ngay' }).first();
    if (await applyButton.isVisible()) {
      await applyButton.click();
      await studentPage.waitForTimeout(600);
      await studentPage.screenshot({ path: path.join(outDir, `${vp.name}_08_recruitment_modal.png`), fullPage: false });
    }
    await studentCtx.close();

    // 3. Club Admin Context (authenticated as it.leader@bafu.edu.vn)
    console.log(`Capturing Club Admin Dashboard & Member Management...`);
    const caCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      baseURL: 'http://localhost:80'
    });
    const caPage = await caCtx.newPage();
    await caPage.goto('/login');
    await caPage.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
    await caPage.getByPlaceholder('••••••••').fill('12345678');
    await caPage.getByRole('button', { name: 'Đăng nhập' }).click();
    await caPage.waitForLoadState('networkidle');

    // 3.1 Club Admin Dashboard (Overview & Applications)
    await caPage.goto('/club-admin');
    await caPage.waitForLoadState('networkidle');
    await caPage.screenshot({ path: path.join(outDir, `${vp.name}_09_club_admin_dashboard.png`), fullPage: false });

    // 3.2 Member Management Tab
    const membersTab = caPage.getByText('Danh Sách Hội Viên');
    if (await membersTab.first().isVisible()) {
      await membersTab.first().click();
      await caPage.waitForTimeout(600);
      await caPage.screenshot({ path: path.join(outDir, `${vp.name}_10_club_member_management.png`), fullPage: false });
    }
    await caCtx.close();

    // 4. Super Admin Context (authenticated as admin@bafu.edu.vn)
    console.log(`Capturing Super Admin Dashboard...`);
    const saCtx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      baseURL: 'http://localhost:80'
    });
    const saPage = await saCtx.newPage();
    await saPage.goto('/login');
    await saPage.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
    await saPage.getByPlaceholder('••••••••').fill('AdminPassword@2026');
    await saPage.getByRole('button', { name: 'Đăng nhập' }).click();
    await saPage.waitForLoadState('networkidle');

    // 4.1 Super Admin Dashboard Overview
    await saPage.goto('/admin/dashboard');
    await saPage.waitForLoadState('networkidle');
    await saPage.screenshot({ path: path.join(outDir, `${vp.name}_11_super_admin_dashboard.png`), fullPage: false });

    // 4.2 Super Admin Reports Tab
    const reportsTab = saPage.getByText('Báo Cáo CLB Toàn Trường');
    if (await reportsTab.first().isVisible()) {
      await reportsTab.first().click();
      await saPage.waitForTimeout(600);
      await saPage.screenshot({ path: path.join(outDir, `${vp.name}_12_super_admin_reports.png`), fullPage: false });
    }
    await saCtx.close();
  }

  await browser.close();
  console.log('\n🎉 Finished! All UI Acceptance screenshots saved to docs/ui-acceptance/');
}

captureAllAcceptancePages().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
