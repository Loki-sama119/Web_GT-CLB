const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureEditorialComparison() {
  const outputDir = path.resolve(__dirname, '../docs/editorial-redesign');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const baseUrl = 'http://localhost'; // or port 80/5173

  console.log('--- ĐANG CHỤP SO SÁNH GIAO DIỆN EDITORIAL (BEFORE & AFTER) ---');

  // 1. Desktop Viewport (1440 x 900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();

  // Current Home Desktop
  console.log('1. Chụp Current Home Desktop...');
  await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'current-home-desktop.png'),
    fullPage: false
  });

  // Prototype Home Desktop
  console.log('2. Chụp Prototype Home Desktop (BAFU Campus Editorial)...');
  await desktopPage.goto(`${baseUrl}/prototype/editorial-home`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'prototype-home-desktop.png'),
    fullPage: false
  });

  // Current Directory Desktop
  console.log('3. Chụp Current Directory Desktop...');
  await desktopPage.goto(`${baseUrl}/clubs`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'current-directory-desktop.png'),
    fullPage: false
  });

  // Prototype Directory Desktop
  console.log('4. Chụp Prototype Directory Desktop (Editorial Modular Grid)...');
  await desktopPage.goto(`${baseUrl}/prototype/editorial-clubs`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({
    path: path.join(outputDir, 'prototype-directory-desktop.png'),
    fullPage: false
  });

  await desktopContext.close();

  // 2. Mobile Viewport (390 x 844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobilePage = await mobileContext.newPage();

  // Current Home Mobile
  console.log('5. Chụp Current Home Mobile (390px)...');
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(outputDir, 'current-home-mobile.png'),
    fullPage: false
  });

  // Prototype Home Mobile
  console.log('6. Chụp Prototype Home Mobile (390px)...');
  await mobilePage.goto(`${baseUrl}/prototype/editorial-home`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(outputDir, 'prototype-home-mobile.png'),
    fullPage: false
  });

  // Current Directory Mobile
  console.log('7. Chụp Current Directory Mobile (390px)...');
  await mobilePage.goto(`${baseUrl}/clubs`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(outputDir, 'current-directory-mobile.png'),
    fullPage: false
  });

  // Prototype Directory Mobile
  console.log('8. Chụp Prototype Directory Mobile (390px)...');
  await mobilePage.goto(`${baseUrl}/prototype/editorial-clubs`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(outputDir, 'prototype-directory-mobile.png'),
    fullPage: false
  });

  await mobileContext.close();
  await browser.close();

  console.log('--- HOÀN TẤT CHỤP 8 ẢNH BẰNG CHỨNG TẠI docs/editorial-redesign/ ---');
}

captureEditorialComparison().catch((err) => {
  console.error('Lỗi khi chụp ảnh so sánh:', err);
  process.exit(1);
});
