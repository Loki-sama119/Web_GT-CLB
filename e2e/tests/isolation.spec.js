import { test, expect } from "@playwright/test";
import { assertE2EOrigin } from "../isolation.mjs";
test("refuses E2E requests against public port 80", () => {
  expect(() => assertE2EOrigin("http://localhost")).toThrow();
  expect(() => assertE2EOrigin("http://localhost:80")).toThrow();
  expect(() => assertE2EOrigin("http://localhost:5173")).toThrow();
  expect(() => assertE2EOrigin("http://localhost:8080")).not.toThrow();
});
test("frontend API requests use isolated same-origin 8080", async ({
  page,
  request,
}) => {
  const info = await request.get("/api/v1/environment");
  expect(await info.json()).toEqual({
    environment: "test",
    databaseKind: "e2e",
  });
  const origins = [];
  page.on("request", (r) => {
    if (new URL(r.url()).pathname.startsWith("/api/"))
      origins.push(new URL(r.url()).origin);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "TÌM MỘT NƠI",
  );
  await page.getByRole("link", { name: "Khám phá tất cả" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(origins.length).toBeGreaterThan(0);
  expect(origins.every((o) => new URL(o).port === "8080")).toBe(true);
});
