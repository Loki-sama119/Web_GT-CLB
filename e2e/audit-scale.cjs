const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const out = path.resolve(
    __dirname,
    "../screenshots/bafu-authenticity/before",
  );
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [768, 1024],
    [390, 844],
    [375, 812],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    await page.goto("http://localhost/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      innerWidth,
      outerWidth,
      devicePixelRatio,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      visualViewportScale: visualViewport.scale,
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      bodyFontSize: getComputedStyle(document.body).fontSize,
      rootZoom: getComputedStyle(document.documentElement).zoom,
      bodyZoom: getComputedStyle(document.body).zoom,
      rootTransform: getComputedStyle(document.documentElement).transform,
      mainWidth: document.querySelector("main")?.getBoundingClientRect().width,
      containerWidth: document
        .querySelector('[class*="max-w-"]')
        ?.getBoundingClientRect().width,
      viewport: document.querySelector('meta[name="viewport"]')?.content,
      h1Font: getComputedStyle(document.querySelector("h1")).fontSize,
      fonts: [...document.fonts].map((f) => ({
        family: f.family,
        status: f.status,
      })),
      scaledElements: [...document.querySelectorAll("*")]
        .filter(
          (e) =>
            getComputedStyle(e).zoom !== "1" ||
            getComputedStyle(e).transform.startsWith("matrix(0."),
        )
        .map((e) => ({ tag: e.tagName, class: e.className }))
        .slice(0, 20),
    }));
    results.push({ width, height, ...metrics });
    await page.screenshot({
      path: path.join(out, `home-${width}.png`),
      fullPage: true,
    });
    await page.close();
  }
  fs.writeFileSync(
    path.join(out, "scale-metrics.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify(
      results.map(({ fonts, ...r }) => r),
      null,
      2,
    ),
  );
  await browser.close();
})();
