const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const out = path.resolve(__dirname, "../screenshots/bafu-authenticity/after");
const sizes = [
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
  [375, 812],
];
const publicPages = [
  ["home", "/"],
  ["clubs", "/clubs"],
  ["club-community", "/clubs/clb-tinh-nguyen-xanh"],
  ["events", "/events"],
];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const records = [];
  async function capture(page, label, url, width, height) {
    const errors = [];
    const listener = (e) => errors.push(e.message);
    page.on("pageerror", listener);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const measurements = await page.evaluate(() => ({
      innerWidth,
      outerWidth,
      dpr: devicePixelRatio,
      viewportScale: visualViewport.scale,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      rootFont: getComputedStyle(document.documentElement).fontSize,
      bodyFont: getComputedStyle(document.body).fontSize,
      bodyFamily: getComputedStyle(document.body).fontFamily,
      rootZoom: getComputedStyle(document.documentElement).zoom,
      rootTransform: getComputedStyle(document.documentElement).transform,
      containerWidth: document
        .querySelector(".editorial-container")
        ?.getBoundingClientRect().width,
      h1Size:
        document.querySelector("h1") &&
        getComputedStyle(document.querySelector("h1")).fontSize,
      fontsLoaded: [...document.fonts]
        .filter((f) => f.status === "loaded")
        .map((f) => f.family),
      brokenImages: [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src),
      bodyText: document.body.innerText,
      assets: [
        ...document.querySelectorAll("script[src],link[rel=stylesheet]"),
      ].map((e) => e.src || e.href),
    }));
    const full = label + "-" + width + ".png";
    await page.screenshot({ path: path.join(out, full), fullPage: true });
    if (label === "home")
      await page.screenshot({
        path: path.join(out, "home-viewport-" + width + ".png"),
      });
    const { bodyText, ...metrics } = measurements;
    const prohibited =
      /Sinh Viên Playwright|Nguyễn Văn Kiểm Thử|test@example\.com|CLB Lập Trình & Công Nghệ BAFU Tech|Guitar Melody|Hoops/.test(
        bodyText,
      );
    records.push({
      label,
      url,
      width,
      height,
      capturedAt: new Date().toISOString(),
      screenshot: full,
      sha256: crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join(out, full)))
        .digest("hex"),
      metrics,
      errors,
      prohibitedContent: label.startsWith("dashboard") ? null : prohibited,
    });
    page.off("pageerror", listener);
  }
  const publicEnvironment = await (
    await fetch("http://localhost/api/v1/environment")
  ).json();
  if (publicEnvironment.environment !== "public")
    throw new Error("Public acceptance target mismatch");
  const testEnvironment = await (
    await fetch("http://localhost:8080/api/v1/environment")
  ).json();
  if (testEnvironment.databaseKind !== "e2e")
    throw new Error("Dashboard screenshots require isolated E2E backend");
  for (const [width, height] of sizes) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    for (const [label, route] of publicPages)
      await capture(page, label, "http://localhost" + route, width, height);
    if (width === 1440 || width === 390) {
      for (const slug of [
        "clb-hien-mau-tinh-nguyen",
        "clb-tin-hoc-bafu",
        "clb-khoi-nghiep-bafu",
        "clb-van-nghe-bafu",
      ])
        await capture(
          page,
          slug,
          "http://localhost/clubs/" + slug,
          width,
          height,
        );
    }
    if (width === 390) {
      await page.goto("http://localhost/");
      await page.getByRole("button", { name: "Mở menu", exact: true }).click();
      await page
        .getByRole("button", { name: "Đóng menu", exact: true })
        .waitFor();
      await page.screenshot({
        path: path.join(out, "mobile-navigation-390.png"),
      });
      await page
        .getByRole("link", { name: "Khám phá CLB", exact: true })
        .last()
        .click();
      await page.getByRole("heading", { level: 1 }).waitFor();
    }
    await page.goto("http://localhost/events");
    await page.getByRole("button", { name: "Đã diễn ra", exact: true }).click();
    await page.getByText("Trung thu: Trao yêu thương cho em").waitFor();
    await page.screenshot({
      path: path.join(out, "events-history-" + width + ".png"),
      fullPage: true,
    });
    await page.close();
    for (const [label, email, password, route] of [
      [
        "dashboard-student",
        "haidang.sv@bafu.edu.vn",
        "12345678",
        "/student/dashboard",
      ],
      ["dashboard-club", "it.leader@bafu.edu.vn", "12345678", "/club-admin"],
      [
        "dashboard-admin",
        "admin@bafu.edu.vn",
        "AdminPassword@2026",
        "/admin/dashboard",
      ],
    ]) {
      const p = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      await p.goto("http://localhost:8080/login");
      await p.getByPlaceholder("ten@bafu.edu.vn").fill(email);
      await p.getByPlaceholder("••••••••").fill(password);
      await p.getByRole("button", { name: "Đăng nhập", exact: true }).click();
      await p.waitForURL((u) => !u.pathname.startsWith("/login"));
      await capture(p, label, "http://localhost:8080" + route, width, height);
      await p.close();
    }
    console.log("Captured " + width + " x " + height);
  }
  fs.writeFileSync(
    path.join(out, "acceptance.json"),
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        publicEnvironment,
        testEnvironment,
        records,
      },
      null,
      2,
    ),
  );
  await browser.close();
  const problems = records.filter(
    (r) =>
      r.metrics.scrollWidth > r.width + 1 ||
      r.metrics.brokenImages.length ||
      r.errors.length ||
      r.prohibitedContent,
  );
  console.log(
    JSON.stringify({ screenshots: records.length, problems }, null, 2),
  );
  if (problems.length) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
