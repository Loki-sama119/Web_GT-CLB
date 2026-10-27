import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('..', 'docs', 'ui-evidence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: '1440_desktop', width: 1440, height: 900 },
  { name: '1280_laptop', width: 1280, height: 800 },
  { name: '768_tablet', width: 768, height: 1024 },
  { name: '390_mobile', width: 390, height: 844 },
  { name: '375_mobile_small', width: 375, height: 667 }
];

async function capture() {
  const browser = await chromium.launch();
  console.log('Starting Playwright multi-viewport UI evidence capture...');

  for (const vp of viewports) {
    console.log(`\n=== Capturing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      baseURL: 'http://localhost:80'
    });
    const page = await ctx.newPage();

    // 1. Landing / Home Page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_01_homepage.png`) });
    console.log(`Saved ${vp.name}_01_homepage.png`);

    // 2. Clubs Discovery Page
    await page.goto('/clubs');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_02_clubs.png`) });
    console.log(`Saved ${vp.name}_02_clubs.png`);

    // 3. Club Detail Page
    await page.goto('/clubs/clb-lap-trinh-bafu-tech');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_03_club_detail.png`) });
    console.log(`Saved ${vp.name}_03_club_detail.png`);

    // 4. Events Page
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_04_events.png`) });
    console.log(`Saved ${vp.name}_04_events.png`);

    // 5. Login Page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_05_login.png`) });
    console.log(`Saved ${vp.name}_05_login.png`);

    // 6. Student Dashboard (authenticated)
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('haidang.sv@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForLoadState('networkidle');
    await page.goto('/student/dashboard');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(outDir, `${vp.name}_06_student_dashboard.png`) });
    console.log(`Saved ${vp.name}_06_student_dashboard.png`);

    // 7. Club Admin Dashboard (authenticated as it.leader)
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
    await caPage.goto('/club-admin');
    await caPage.waitForLoadState('networkidle');
    await caPage.screenshot({ path: path.join(outDir, `${vp.name}_07_club_admin_dashboard.png`) });
    console.log(`Saved ${vp.name}_07_club_admin_dashboard.png`);

    // 8. Super Admin Dashboard (authenticated as admin)
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
    await saPage.goto('/admin/dashboard');
    await saPage.waitForLoadState('networkidle');
    await saPage.screenshot({ path: path.join(outDir, `${vp.name}_08_super_admin_dashboard.png`) });
    console.log(`Saved ${vp.name}_08_super_admin_dashboard.png`);

    await ctx.close();
    await caCtx.close();
    await saCtx.close();
  }

  // 9. Recruitment Application Modal (captured at 1440 desktop)
  console.log('\n=== Capturing Recruitment Modal Experience ===');
  const modalCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    baseURL: 'http://localhost:80'
  });
  const mPage = await modalCtx.newPage();
  await mPage.goto('/login');
  await mPage.getByPlaceholder('ten@bafu.edu.vn').fill('haidang.sv@bafu.edu.vn');
  await mPage.getByPlaceholder('••••••••').fill('12345678');
  await mPage.getByRole('button', { name: 'Đăng nhập' }).click();
  await mPage.waitForLoadState('networkidle');
  await mPage.goto('/clubs/clb-lap-trinh-bafu-tech');
  await mPage.waitForLoadState('networkidle');
  const applyBtn = mPage.getByRole('button', { name: 'Ứng Tuyển Ngay' }).first();
  if (await applyBtn.isVisible()) {
    await applyBtn.click();
    await mPage.waitForTimeout(500);
    await mPage.screenshot({ path: path.join(outDir, '1440_desktop_09_recruitment_modal.png') });
    console.log('Saved 1440_desktop_09_recruitment_modal.png');
  }
  await modalCtx.close();

  await browser.close();
  console.log('\nAll UI evidence screenshots successfully captured into docs/ui-evidence/!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
