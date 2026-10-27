import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('..', 'docs', 'design-review');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureDesignReview() {
  const browser = await chromium.launch();
  console.log('🚀 Capturing Professional UI Redesign Evidence Screenshots into docs/design-review/ ...');

  // 1. Desktop Browser Context (1440x900)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const page = await desktopCtx.newPage();

  // 01_home_desktop_after.png
  console.log('📸 01_home_desktop_after.png');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_home_desktop_after.png'), fullPage: false });

  // 03_clubs_desktop_after.png
  console.log('📸 03_clubs_desktop_after.png');
  await page.goto('/clubs');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '03_clubs_desktop_after.png'), fullPage: false });

  // 04_club_detail_after.png
  console.log('📸 04_club_detail_after.png');
  await page.goto('/clubs/clb-lap-trinh-bafu-tech');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '04_club_detail_after.png'), fullPage: false });

  await desktopCtx.close();

  // 2. Mobile Browser Context (390x844)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: 'http://localhost:80',
    isMobile: true
  });
  const mobilePage = await mobileCtx.newPage();

  // 02_home_mobile_after.png
  console.log('📸 02_home_mobile_after.png');
  await mobilePage.goto('/');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(outDir, '02_home_mobile_after.png'), fullPage: false });

  await mobileCtx.close();

  // 3. Student Dashboard Context
  console.log('📸 05_student_dashboard_after.png');
  const studentCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const studentPage = await studentCtx.newPage();
  await studentPage.goto('/login');
  await studentPage.waitForLoadState('networkidle');
  await studentPage.getByPlaceholder('ten@bafu.edu.vn').fill('haidang.sv@bafu.edu.vn');
  await studentPage.getByPlaceholder('••••••••').fill('12345678');
  await studentPage.getByRole('button', { name: 'Đăng nhập' }).click();
  await studentPage.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  await studentPage.goto('/student/dashboard');
  await studentPage.waitForLoadState('networkidle');
  await studentPage.waitForTimeout(1000);
  await studentPage.screenshot({ path: path.join(outDir, '05_student_dashboard_after.png'), fullPage: false });
  await studentCtx.close();

  // 4. Club Admin Dashboard Context
  console.log('📸 06_club_admin_after.png');
  const caCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const caPage = await caCtx.newPage();
  await caPage.goto('/login');
  await caPage.waitForLoadState('networkidle');
  await caPage.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
  await caPage.getByPlaceholder('••••••••').fill('12345678');
  await caPage.getByRole('button', { name: 'Đăng nhập' }).click();
  await caPage.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  await caPage.goto('/club-admin');
  await caPage.waitForLoadState('networkidle');
  await caPage.waitForTimeout(1000);
  await caPage.screenshot({ path: path.join(outDir, '06_club_admin_after.png'), fullPage: false });
  await caCtx.close();

  // 5. Super Admin Dashboard Context
  console.log('📸 07_super_admin_after.png');
  const saCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const saPage = await saCtx.newPage();
  await saPage.goto('/login');
  await saPage.waitForLoadState('networkidle');
  await saPage.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
  await saPage.getByPlaceholder('••••••••').fill('AdminPassword@2026');
  await saPage.getByRole('button', { name: 'Đăng nhập' }).click();
  await saPage.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  await saPage.goto('/admin/dashboard');
  await saPage.waitForLoadState('networkidle');
  await saPage.waitForTimeout(1000);
  await saPage.screenshot({ path: path.join(outDir, '07_super_admin_after.png'), fullPage: false });
  await saCtx.close();

  await browser.close();
  console.log('✅ All evidence screenshots captured successfully in docs/design-review/!');
}

captureDesignReview().catch((err) => {
  console.error('❌ Error during capture:', err);
  process.exit(1);
});
