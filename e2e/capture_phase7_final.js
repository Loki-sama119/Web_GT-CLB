import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('..', 'docs', 'design-review', 'final');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capturePhase7Screenshots() {
  const browser = await chromium.launch();
  console.log('🚀 Capturing Phase 7 Final Visual Acceptance Screenshots into docs/design-review/final/ ...');

  // --- DESKTOP (1440x900) ---
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const page = await desktopCtx.newPage();

  // 1. Home
  console.log('📸 01_home_desktop_1440.png');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_home_desktop_1440.png'), fullPage: false });

  // 2. Clubs Catalog
  console.log('📸 02_clubs_desktop_1440.png');
  await page.goto('/clubs');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '02_clubs_desktop_1440.png'), fullPage: false });

  // 3. Club Detail
  console.log('📸 03_club_detail_desktop_1440.png');
  await page.goto('/clubs/clb-lap-trinh-bafu-tech');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '03_club_detail_desktop_1440.png'), fullPage: false });

  // 4. Events
  console.log('📸 04_events_desktop_1440.png');
  await page.goto('/events');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '04_events_desktop_1440.png'), fullPage: false });

  // 5. Login
  console.log('📸 05_login_desktop_1440.png');
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '05_login_desktop_1440.png'), fullPage: false });

  // 6. Register
  console.log('📸 06_register_desktop_1440.png');
  await page.goto('/register');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '06_register_desktop_1440.png'), fullPage: false });

  // 7. Privacy Policy
  console.log('📸 07_privacy_desktop_1440.png');
  await page.goto('/privacy');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '07_privacy_desktop_1440.png'), fullPage: false });

  // 8. Terms of Service
  console.log('📸 08_terms_desktop_1440.png');
  await page.goto('/terms');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '08_terms_desktop_1440.png'), fullPage: false });

  await desktopCtx.close();

  // --- AUTHENTICATED DASHBOARDS (DESKTOP 1440x900) ---
  // Student Dashboard
  console.log('📸 09_student_dashboard_desktop_1440.png');
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
  await studentPage.screenshot({ path: path.join(outDir, '09_student_dashboard_desktop_1440.png'), fullPage: false });
  await studentCtx.close();

  // Club Admin Dashboard
  console.log('📸 10_club_admin_desktop_1440.png');
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
  await caPage.screenshot({ path: path.join(outDir, '10_club_admin_desktop_1440.png'), fullPage: false });
  await caCtx.close();

  // Super Admin Dashboard
  console.log('📸 11_super_admin_desktop_1440.png');
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
  await saPage.screenshot({ path: path.join(outDir, '11_super_admin_desktop_1440.png'), fullPage: false });
  await saCtx.close();

  // --- MOBILE (390x844) ---
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: 'http://localhost:80',
    isMobile: true
  });
  const mobilePage = await mobileCtx.newPage();

  console.log('📸 12_home_mobile_390.png');
  await mobilePage.goto('/');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(outDir, '12_home_mobile_390.png'), fullPage: false });

  console.log('📸 13_clubs_mobile_390.png');
  await mobilePage.goto('/clubs');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(outDir, '13_clubs_mobile_390.png'), fullPage: false });

  console.log('📸 14_club_detail_mobile_390.png');
  await mobilePage.goto('/clubs/clb-lap-trinh-bafu-tech');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(outDir, '14_club_detail_mobile_390.png'), fullPage: false });

  await mobileCtx.close();

  // Mobile Auth - Student Dashboard
  const mobileAuthCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: 'http://localhost:80',
    isMobile: true
  });
  const mobileAuthPage = await mobileAuthCtx.newPage();
  await mobileAuthPage.goto('/login');
  await mobileAuthPage.waitForLoadState('networkidle');
  await mobileAuthPage.getByPlaceholder('ten@bafu.edu.vn').fill('haidang.sv@bafu.edu.vn');
  await mobileAuthPage.getByPlaceholder('••••••••').fill('12345678');
  await mobileAuthPage.getByRole('button', { name: 'Đăng nhập' }).click();
  await mobileAuthPage.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  await mobileAuthPage.goto('/student/dashboard');
  await mobileAuthPage.waitForLoadState('networkidle');
  await mobileAuthPage.waitForTimeout(1000);
  await mobileAuthPage.screenshot({ path: path.join(outDir, '15_student_dashboard_mobile_390.png'), fullPage: false });
  await mobileAuthCtx.close();

  await browser.close();
  console.log('🎉 All Phase 7 final acceptance screenshots captured successfully into docs/design-review/final/!');
}

capturePhase7Screenshots().catch(err => {
  console.error('❌ Error capturing screenshots:', err);
  process.exit(1);
});
