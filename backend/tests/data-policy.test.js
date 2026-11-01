import { describe, it, expect, afterEach } from "vitest";
import {
  assertTestDatabase,
  isIsolatedTest,
  verifiedWhere,
  presentClub,
  approvedAsset,
} from "../src/utils/dataPolicy.js";
const original = { node: process.env.NODE_ENV, url: process.env.DATABASE_URL };
afterEach(() => {
  process.env.NODE_ENV = original.node;
  process.env.DATABASE_URL = original.url;
});
describe("Database and publication boundaries", () => {
  it("refuses test runtime pointed at demo", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "postgresql://localhost/club_portal_db";
    expect(() => assertTestDatabase()).toThrow();
    expect(isIsolatedTest()).toBe(false);
  });
  it("does not grant test access based on NODE_ENV alone", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "postgresql://localhost/production";
    expect(verifiedWhere().dataClassification).toBe("REAL_VERIFIED");
  });
  it("requires test mode and exact isolated database name", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "postgresql://localhost/club_portal_e2e";
    expect(isIsolatedTest()).toBe(true);
    process.env.NODE_ENV = "production";
    expect(isIsolatedTest()).toBe(false);
  });
  it("hides pending or wrong-club logos and covers", () => {
    process.env.NODE_ENV = "production";
    const club = { id: "a", logoUrl: "/logo.png", coverUrl: "/cover.jpg" };
    expect(presentClub(club, []).logoUrl).toBe(null);
    const asset = {
      clubId: "b",
      url: "/logo.png",
      type: "LOGO",
      usagePermission: "APPROVED",
      verificationStatus: "VERIFIED_APPROVED",
      sourceUrl: "https://bafu.edu.vn/",
      verifiedAt: new Date(),
    };
    expect(presentClub(club, [asset]).logoUrl).toBe(null);
  });
  it("requires both verified source and permission approval", () => {
    expect(
      approvedAsset({
        verificationStatus: "VERIFIED_APPROVED",
        usagePermission: "PENDING",
        sourceUrl: "https://bafu.edu.vn/",
        verifiedAt: new Date(),
      }),
    ).toBe(false);
  });
  it("keeps aspect-independent original image URL only for an approved matching asset", () => {
    process.env.NODE_ENV = "production";
    const asset = {
      clubId: "a",
      url: "/logo.png",
      type: "LOGO",
      usagePermission: "APPROVED",
      verificationStatus: "VERIFIED_APPROVED",
      sourceUrl: "https://bafu.edu.vn/",
      verifiedAt: new Date(),
    };
    expect(
      presentClub({ id: "a", logoUrl: "/logo.png" }, [asset]).logoUrl,
    ).toBe("/logo.png");
  });
});
