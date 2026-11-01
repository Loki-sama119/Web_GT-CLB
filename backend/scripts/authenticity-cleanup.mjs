import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const args = process.argv.slice(2);
const option = (name) =>
  args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const backup = path.resolve(option("backup") || "../backups/MISSING");
const receipt = JSON.parse(
  fs.readFileSync(path.join(backup, "receipt.json"), "utf8"),
);
const hash = createHash("sha256")
  .update(fs.readFileSync(path.join(backup, "database.dump")))
  .digest("hex");
if (
  !receipt.restoreVerified ||
  hash !== receipt.sha256 ||
  receipt.database !== "club_portal_db"
)
  throw new Error("Verified demo backup required");
const target = new URL(process.env.DATABASE_URL);
if (
  target.pathname !== "/club_portal_db" ||
  !["localhost", "127.0.0.1"].includes(target.hostname) ||
  option("environment") !== "demo"
)
  throw new Error("Explicit local demo target required; production is refused");
const inventory = JSON.parse(
  fs.readFileSync(path.join(backup, "inventory.json"), "utf8"),
);
const catalog = JSON.parse(
  fs.readFileSync(
    new URL("../data/bafu-catalog.json", import.meta.url),
    "utf8",
  ),
);
const prisma = new PrismaClient();
const cohort = "2026-10-26T12:51:12";
const seedSource = fs.readFileSync(
  new URL("../prisma/seed.js", import.meta.url),
  "utf8",
);
const hasSeedLiteral = (value) =>
  seedSource.includes(JSON.stringify(value)) ||
  seedSource.includes("'" + value + "'");
const seedUsers = inventory.users.filter(
  (u) => u.createdAt.startsWith(cohort) && hasSeedLiteral(u.email),
);
const seedClubs = inventory.clubs.filter(
  (c) => c.createdAt.startsWith(cohort) && hasSeedLiteral(c.slug),
);
const plan = {
  database: "club_portal_db",
  environment: "demo",
  backupSha256: hash,
  createdAt: new Date().toISOString(),
  userUpdates: seedUsers.map((u) => ({
    id: u.id,
    classification: "DEMO",
    evidence: "Exact seed creation cohort and email in prisma/seed.js",
  })),
  clubUpdates: seedClubs.map((c) => ({
    id: c.id,
    classification: "DEMO",
    evidence:
      "Exact seed cohort; later factual catalogue repairs are field-specific",
  })),
  campaigns: inventory.recruitment_campaigns
    .filter((c) => c.createdAt.startsWith(cohort))
    .map((c) => ({ id: c.id, classification: "DEMO" })),
  events: inventory.club_events
    .filter((c) => c.createdAt.startsWith(cohort))
    .map((c) => ({ id: c.id, classification: "DEMO" })),
  posts: inventory.club_posts
    .filter((c) => c.createdAt.startsWith(cohort))
    .map((c) => ({ id: c.id, classification: "DEMO" })),
  deleteMedia: [],
  deleteUsers: [],
  preserveUnknownUserIds: inventory.users
    .filter((u) => !seedUsers.some((s) => s.id === u.id))
    .map((u) => u.id),
  detachImages: inventory.clubs
    .filter((c) => c.coverUrl || c.logoUrl)
    .map((c) => ({
      id: c.id,
      coverUrl: c.coverUrl,
      logoUrl: c.logoUrl,
      reason: "No approved ownership/context and usage evidence",
    })),
  catalog: catalog.clubs.map((c) => ({ slug: c.slug, sourceUrl: c.sourceUrl })),
  relatedRecords: Object.fromEntries(
    Object.entries(inventory).map(([table, rows]) => [
      table,
      rows.map((row) => ({
        id: row.id,
        classification:
          row.userId && seedUsers.some((u) => u.id === row.userId)
            ? "DEMO"
            : "UNKNOWN",
      })),
    ]),
  ),
};
for (const media of inventory.club_medias) {
  const file = path.resolve(
    "../backups/uploads-before-authenticity",
    media.url.replace("/uploads/", ""),
  );
  if (
    fs.existsSync(file) &&
    fs.readFileSync(file).equals(Buffer.from("fake-activity-image"))
  )
    plan.deleteMedia.push({
      id: media.id,
      url: media.url,
      classification: "E2E_TEST",
      evidence:
        "Byte-for-byte fake-activity-image fixture from backend/tests/api.test.js; original file preserved",
    });
}
const planPath = path.join(backup, "cleanup-plan.json");
if (!args.includes("--apply")) {
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
  console.log(
    JSON.stringify(
      {
        mode: "dry-run",
        planPath,
        seedUsers: seedUsers.length,
        seedClubs: seedClubs.length,
        confirmedFakeMedia: plan.deleteMedia.length,
        preservedUnknownUsers: plan.preserveUnknownUserIds.length,
        deleteUserIds: [],
        deleteMediaIds: plan.deleteMedia.map((m) => m.id),
      },
      null,
      2,
    ),
  );
  await prisma.$disconnect();
  process.exit(0);
}
const approvedPlan = JSON.parse(fs.readFileSync(planPath, "utf8"));
if (fs.existsSync(path.join(backup, "cleanup-result.json")))
  throw new Error(
    "This plan has already been applied; preserve the receipt and prepare a new audit for further changes",
  );
if (
  approvedPlan.backupSha256 !== hash ||
  [
    "deleteMedia",
    "userUpdates",
    "clubUpdates",
    "campaigns",
    "events",
    "posts",
    "detachImages",
    "catalog",
  ].some(
    (key) => JSON.stringify(approvedPlan[key]) !== JSON.stringify(plan[key]),
  )
)
  throw new Error("Dry-run plan mismatch");
const summary = await prisma.$transaction(
  async (tx) => {
    for (const change of plan.userUpdates) {
      const current = await tx.user.findUniqueOrThrow({
        where: { id: change.id },
      });
      const original = inventory.users.find((u) => u.id === change.id);
      if (
        current.email !== original.email ||
          current.createdAt.toISOString() !==
            new Date(original.createdAt.endsWith('Z')?original.createdAt:original.createdAt+'Z').toISOString()
      )
        throw new Error("User changed since audit; aborting");
    }
    for (const media of approvedPlan.deleteMedia) {
      const current = await tx.clubMedia.findUniqueOrThrow({
        where: { id: media.id },
      });
      if (current.url !== media.url)
        throw new Error("Media changed since audit; aborting");
    }
    const before = {
      users: await tx.user.count(),
      clubs: await tx.club.count(),
      media: await tx.clubMedia.count(),
      auditLogs: await tx.auditLog.count(),
    };
    for (const [model, changes] of [
      ["user", plan.userUpdates],
      ["club", plan.clubUpdates],
      ["recruitmentCampaign", plan.campaigns],
      ["clubEvent", plan.events],
      ["clubPost", plan.posts],
    ]) {
      for (const change of changes)
        await tx[model].update({
          where: { id: change.id },
          data: {
            dataClassification: change.classification,
            ...(model === "user" ? { isActive: false } : {}),
          },
        });
    }
    for (const image of plan.detachImages)
      await tx.club.update({
        where: { id: image.id },
        data: { coverUrl: null, logoUrl: null },
      });
    for (const item of catalog.clubs) {
      const category = await tx.clubCategory.findUniqueOrThrow({
        where: { slug: item.category },
      });
      const { category: ignored, ...fact } = item;
      const data = {
        ...fact,
        categoryId: category.id,
        status: "ACTIVE",
        dataClassification: "REAL_VERIFIED",
        verifiedAt: new Date(),
        email: null,
        phone: null,
        fanpageUrl: null,
        meetingSchedule: null,
        establishedDate: null,
        logoUrl: null,
        coverUrl: null,
      };
      await tx.club.upsert({
        where: { slug: item.slug },
        create: data,
        update: data,
      });
    }
    // The historical IT BAFU and BAFU Tech records are deliberately separate.
    for (const item of catalog.events) {
      const club = await tx.club.findUniqueOrThrow({
        where: { slug: item.clubSlug },
      });
      const { date, clubSlug, ...fact } = item;
      const existing = await tx.clubEvent.findFirst({
        where: { slug: item.slug, clubId: club.id },
      });
      const data = {
        ...fact,
        clubId: club.id,
        startTime: new Date(date + "T00:00:00+07:00"),
        endTime: new Date(date + "T00:00:00+07:00"),
        datePrecision: "DAY",
        status: "COMPLETED",
        isPublic: true,
        dataClassification: "REAL_VERIFIED",
        verifiedAt: new Date(),
      };
      if (!existing) await tx.clubEvent.create({ data });
    }
    for (const media of approvedPlan.deleteMedia)
      await tx.clubMedia.delete({ where: { id: media.id } });
    // Keep every physical file; this removes only proven test rows and preserves unknown records.
    await tx.auditLog.create({
      data: {
        action: "AUTHENTICITY_CLEANUP",
        entityType: "DATA_AUDIT",
        details: JSON.stringify({
          backupSha256: hash,
          disabledDemoUserIds: plan.userUpdates.map((u) => u.id),
          deletedMediaIds: plan.deleteMedia.map((m) => m.id),
          preservedUnknownUserIds: plan.preserveUnknownUserIds,
        }),
      },
    });
    return {
      before,
      after: {
        users: await tx.user.count(),
        clubs: await tx.club.count(),
        media: await tx.clubMedia.count(),
        auditLogs: await tx.auditLog.count(),
      },
      deletedMediaIds: plan.deleteMedia.map((m) => m.id),
      deletedUserIds: [],
      unknownUsersPreserved: plan.preserveUnknownUserIds,
    };
  },
  { timeout: 30000 },
);
fs.writeFileSync(
  path.join(backup, "cleanup-result.json"),
  JSON.stringify(summary, null, 2),
);
console.log(JSON.stringify(summary, null, 2));
await prisma.$disconnect();
