const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureGallery() {
  const outputDir = path.resolve(__dirname, '../docs/editorial-redesign');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const baseUrl = 'http://localhost';

  console.log('--- ĐANG CHỤP BỘ ẢNH BẰNG CHỨNG BAFU CAMPUS EDITORIAL ---');

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-375', width: 375, height: 667 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width < 768 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' : undefined
    });
    const page = await context.newPage();

    // 1. Homepage
    console.log(`Chụp Homepage (${vp.name})...`);
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(outputDir, `homepage-${vp.name}.png`),
      fullPage: false
    });

    // 2. Clubs Directory (chụp cho 1440 và 390)
    if (vp.width === 1440 || vp.width === 390) {
      console.log(`Chụp Clubs Directory (${vp.name})...`);
      await page.goto(`${baseUrl}/clubs`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outputDir, `clubs-directory-${vp.name}.png`),
        fullPage: false
      });

      // 3. Club Detail
      console.log(`Chụp Club Detail (${vp.name})...`);
      await page.goto(`${baseUrl}/clubs/clb-lap-trinh-bafu-tech`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outputDir, `club-detail-${vp.name}.png`),
        fullPage: false
      });

      // 4. Events Poster Page
      console.log(`Chụp Events Page (${vp.name})...`);
      await page.goto(`${baseUrl}/events`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outputDir, `events-${vp.name}.png`),
        fullPage: false
      });
    }

    await context.close();
  }

  await browser.close();
  console.log('--- HOÀN TẤT CHỤP BỘ ẢNH GALLERY BAFU CAMPUS EDITORIAL ---');
}

captureGallery().catch((err) => {
  console.error('Lỗi khi chụp gallery:', err);
  process.exit(1);
});
