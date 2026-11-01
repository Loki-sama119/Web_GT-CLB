import { chromium } from "@playwright/test";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "frontend", "dist");
const outDir = path.resolve(__dirname, "..", "screenshots", "homepage-redesign");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Simple static file server
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function createStaticServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let parsedUrl = req.url.split("?")[0];
      let filePath = path.join(distDir, parsedUrl === "/" ? "index.html" : parsedUrl);

      // Handle SPA fallback
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, "index.html");
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end("Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      });
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

async function smoothScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });
  await page.waitForTimeout(600);
}

async function run() {
  console.log("1. Starting static server for frontend/dist on port 4173...");
  const server = await createStaticServer(4173);
  const url = "http://localhost:4173";
  console.log(`Static server running at ${url}`);

  console.log("2. Launching Playwright Chromium...");
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "1920_desktop_fhd", width: 1920, height: 1080 },
    { name: "1440_desktop", width: 1440, height: 900 },
    { name: "768_tablet", width: 768, height: 1024 },
    { name: "390_mobile", width: 390, height: 844 },
  ];

  try {
    for (const vp of viewports) {
      console.log(`\n=== Capturing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);

      // Hero viewport screenshot
      await page.screenshot({
        path: path.join(outDir, `bafu_redesign_${vp.name}_hero.png`),
        fullPage: false,
      });
      console.log(`Saved: bafu_redesign_${vp.name}_hero.png`);

      // Scroll to trigger all image rendering
      await smoothScroll(page);

      // Full page screenshot
      await page.screenshot({
        path: path.join(outDir, `bafu_redesign_${vp.name}_fullpage.png`),
        fullPage: true,
      });
      console.log(`Saved: bafu_redesign_${vp.name}_fullpage.png`);

      await context.close();
    }

    // Capture Interactive States:
    console.log("\n=== Capturing Interactive States ===");
    const testContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await testContext.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await smoothScroll(page);

    // 1. Lightbox modal open
    const firstGalleryItem = page.locator("#hoat-dong .group").first();
    if (await firstGalleryItem.isVisible()) {
      await firstGalleryItem.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outDir, "bafu_redesign_1440_lightbox_modal.png"),
      });
      console.log("Saved: bafu_redesign_1440_lightbox_modal.png");
      const closeBtn = page.getByRole("button", { name: /Đóng/i });
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await page.keyboard.press("Escape");
      }
      await page.waitForTimeout(300);
    }

    // 2. Upcoming events tab
    const upcomingTabBtn = page.getByRole("button", { name: /Lịch sự kiện sắp tới/i });
    if (await upcomingTabBtn.isVisible()) {
      await upcomingTabBtn.scrollIntoViewIfNeeded();
      await upcomingTabBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outDir, "bafu_redesign_1440_upcoming_tab_empty_state.png"),
      });
      console.log("Saved: bafu_redesign_1440_upcoming_tab_empty_state.png");
    }

    // 3. Mobile Navigation Menu Open
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(url, { waitUntil: "networkidle" });
    const menuBtn = mobilePage.getByRole("button", { name: /Mở menu/i });
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(400);
      await mobilePage.screenshot({
        path: path.join(outDir, "bafu_redesign_390_mobile_menu_open.png"),
      });
      console.log("Saved: bafu_redesign_390_mobile_menu_open.png");
    }

    await testContext.close();
    await mobileContext.close();
    console.log("\nAll screenshots captured successfully into screenshots/homepage-redesign/");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
