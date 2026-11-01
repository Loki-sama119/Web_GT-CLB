const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../docs/phase7-1-evidence');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();

  // 1-5: Public Desktop Pages
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('1. Capturing HomePage Desktop...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'homepage-desktop.png'), fullPage: true });

    console.log('2. Capturing ClubsPage Desktop...');
    await page.goto('http://localhost:8080/clubs', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'clubs-desktop.png'), fullPage: true });

    console.log('3. Capturing Club Detail Tình Nguyện Xanh...');
    await page.goto('http://localhost:8080/clubs/clb-tinh-nguyen-xanh', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-detail-tinh-nguyen-xanh.png'), fullPage: true });

    console.log('4. Capturing Club Detail CLB Máu BAFU...');
    await page.goto('http://localhost:8080/clubs/clb-hien-mau-tinh-nguyen', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-detail-mau-bafu.png'), fullPage: true });

    console.log('5. Capturing Club Detail IT BAFU Tech...');
    await page.goto('http://localhost:8080/clubs/clb-lap-trinh-bafu-tech', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-detail-it-bafu.png'), fullPage: true });

    await context.close();
  }

  // 6: Club Admin Desktop
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('6. Capturing Club Admin Dashboard Desktop...');
    await page.goto('http://localhost:8080/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:8080/club-admin', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-admin-dashboard-desktop.png'), fullPage: true });

    await context.close();
  }

  // 7: Super Admin Desktop
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('7. Capturing Super Admin Dashboard Desktop...');
    await page.goto('http://localhost:8080/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('admin@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('AdminPassword@2026');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Tạo Câu Lạc Bộ Mới/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, 'super-admin-clubs-desktop.png'), fullPage: true });

    await context.close();
  }

  // 8-10: Mobile (390px)
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    console.log('8. Capturing HomePage Mobile (390px)...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'homepage-mobile-390px.png'), fullPage: true });

    console.log('9. Capturing Club Detail Mobile (390px)...');
    await page.goto('http://localhost:8080/clubs/clb-lap-trinh-bafu-tech', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-detail-mobile-390px.png'), fullPage: true });

    console.log('10. Capturing Club Admin Dashboard Mobile (390px)...');
    await page.goto('http://localhost:8080/login');
    await page.getByPlaceholder('ten@bafu.edu.vn').fill('it.leader@bafu.edu.vn');
    await page.getByPlaceholder('••••••••').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForTimeout(1000);
    await page.goto('http://localhost:8080/club-admin', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, 'club-admin-mobile-390px.png'), fullPage: true });

    await context.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully in docs/phase7-1-evidence/ !');
})();
