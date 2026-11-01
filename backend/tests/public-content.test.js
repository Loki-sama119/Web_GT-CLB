import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/db.js";
const originalMode = process.env.NODE_ENV;
const tag = Date.now() + "-" + Math.random().toString(16).slice(2);
const clubs = [],
  campaigns = [],
  events = [],
  assets = [];
let verified, unknown, demo, privateEvent, publicEvent, campaign;
describe("Public content authenticity (isolated test DB, public publication policy)", () => {
  beforeAll(async () => {
    const name = new URL(process.env.DATABASE_URL).pathname;
    if (name !== "/club_portal_test")
      throw new Error("Public-policy fixtures require club_portal_test");
    const category = await prisma.clubCategory.findFirstOrThrow();
    for (const classification of ["REAL_VERIFIED", "UNKNOWN", "DEMO"]) {
      const club = await prisma.club.create({
        data: {
          name: "Policy " + classification + " " + tag,
          slug: "policy-" + classification.toLowerCase() + "-" + tag,
          categoryId: category.id,
          shortDescription: "Test fixture",
          description: "Isolated test fixture",
          status: "ACTIVE",
          dataClassification: classification,
          sourceUrl:
            classification === "REAL_VERIFIED" ? "https://bafu.edu.vn/" : null,
          verifiedAt: classification === "REAL_VERIFIED" ? new Date() : null,
          logoUrl: "/pending-logo.png",
        },
      });
      clubs.push(club);
    }
    [verified, unknown, demo] = clubs;
    campaign = await prisma.recruitmentCampaign.create({
      data: {
        clubId: verified.id,
        title: "Pending campaign " + tag,
        slug: "pending-" + tag,
        description: "Isolated test fixture",
        status: "OPEN",
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000),
      },
    });
    campaigns.push(campaign);
    for (const isPublic of [true, false]) {
      const event = await prisma.clubEvent.create({
        data: {
          clubId: verified.id,
          title: "Policy event " + tag,
          slug: "policy-" + isPublic + "-" + tag,
          description: "Isolated fixture",
          location: "Test only",
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          dataClassification: "REAL_VERIFIED",
          sourceUrl: "https://bafu.edu.vn/",
          verifiedAt: new Date(),
          isPublic,
        },
      });
      events.push(event);
    }
    [publicEvent, privateEvent] = events;
    // A valid asset owned by another club must not authorize this club's logo.
    assets.push(
      await prisma.mediaAsset.create({
        data: {
          clubId: unknown.id,
          filename: "pending-logo.png",
          url: "/pending-logo.png",
          type: "LOGO",
          altText: "Test only",
          sourceUrl: "https://bafu.edu.vn/",
          verifiedAt: new Date(),
          usagePermission: "APPROVED",
          verificationStatus: "VERIFIED_APPROVED",
        },
      }),
    );
    process.env.NODE_ENV = "production";
  });
  afterAll(async () => {
    process.env.NODE_ENV = originalMode;
    await prisma.mediaAsset.deleteMany({
      where: { assetId: { in: assets.map((a) => a.assetId) } },
    });
    await prisma.club.deleteMany({
      where: { id: { in: clubs.map((c) => c.id) } },
    });
    await prisma.$disconnect();
  });
  it("excludes UNKNOWN and DEMO from public search and category totals", async () => {
    const res = await request(app).get("/api/v1/clubs").query({ search: tag });
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.data.clubs.map((c) => c.id)).toEqual([verified.id]);
  });
  it("refuses direct URLs of quarantined clubs", async () => {
    for (const club of [unknown, demo])
      expect(
        (await request(app).get("/api/v1/clubs/" + club.slug)).status,
      ).toBe(404);
  });
  it("hides unapproved and cross-club logo references", async () => {
    const res = await request(app).get("/api/v1/clubs/" + verified.slug);
    expect(res.status).toBe(200);
    expect(res.body.data.club.logoUrl).toBe(null);
    expect(res.body.data.club.campaigns).toEqual([]);
  });
  it("does not expose pending recruitment via direct ID", async () => {
    expect(
      (await request(app).get("/api/v1/recruitments/" + campaign.id)).status,
    ).toBe(404);
  });
  it("does not expose a private verified event via direct ID", async () => {
    expect(
      (await request(app).get("/api/v1/events/" + privateEvent.id)).status,
    ).toBe(404);
    expect(
      (await request(app).get("/api/v1/events/" + publicEvent.id)).status,
    ).toBe(200);
  });
  it("public album returns no unapproved assets", async () => {
    const res = await request(app).get(
      "/api/v1/clubs/" + verified.id + "/album",
    );
    expect(res.status).toBe(200);
    expect(res.body.data.medias).toEqual([]);
  });
  it("requires authentication for content and asset verification", async () => {
    expect((await request(app).get("/api/v1/admin/verification")).status).toBe(
      401,
    );
    expect(
      (
        await request(app)
          .post("/api/v1/admin/media-assets/" + assets[0].assetId + "/review")
          .send({ approved: true })
      ).status,
    ).toBe(401);
  });
  it('keeps pending clubs in the private workspace and excludes demo records',async()=>{
    expect((await request(app).get('/api/v1/management/clubs')).status).toBe(401);
    const login=await request(app).post('/api/v1/auth/login').send({email:'admin@bafu.edu.vn',password:'AdminPassword@2026'});
    expect(login.status).toBe(200);
    const result=await request(app).get('/api/v1/management/clubs').set('Cookie',login.headers['set-cookie'].map(value=>value.split(';')[0]).join('; '));
    expect(result.status).toBe(200);
    const ids=result.body.data.clubs.map(c=>c.id);
    expect(ids).toContain(unknown.id);expect(ids).not.toContain(demo.id);
  });
});
