import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(
  new URL("../backend/package.json", import.meta.url),
);
const { PrismaClient } = require("@prisma/client");
export function assertE2EOrigin(value) {
  const url = new URL(value);
  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.port !== "8080" ||
    url.protocol !== "http:"
  )
    throw new Error(
      "E2E must use local isolated reverse proxy on port 8080. Public port 80 is refused.",
    );
}
export async function demoFingerprint() {
  const prisma = new PrismaClient({
    datasourceUrl:
      process.env.DEMO_AUDIT_DATABASE_URL ||
      "postgresql://postgres:postgrespassword@localhost:5433/club_portal_db?schema=public",
  });
  if (
    new URL(
      process.env.DEMO_AUDIT_DATABASE_URL ||
        "postgresql://localhost/club_portal_db",
    ).pathname !== "/club_portal_db"
  )
    throw new Error("Fingerprint requires named demo DB");
  try {
    const tables = [
      "users",
      "student_profiles",
      "clubs",
      "club_memberships",
      "applications",
      "application_answers",
      "application_histories",
      "recruitment_campaigns",
      "club_events",
      "event_registrations",
      "club_posts",
      "club_medias",
      "media_assets",
      "audit_logs",
      "notifications",
    ];
    const result = {};
    for (const table of tables) {
      const id = table === "media_assets" ? "assetId" : "id";
      const [row] = await prisma.$queryRawUnsafe(
        "SELECT count(*)::int AS count, md5(coalesce(string_agg(row_to_json(t)::text,'' ORDER BY \"" +
          id +
          "\"),'')) AS digest FROM \"" +
          table +
          '" t',
      );
      result[table] = row;
    }
    return result;
  } finally {
    await prisma.$disconnect();
  }
}
export const evidencePath = path.resolve(
  import.meta.dirname,
  "test-results/isolation-before.json",
);
export default async function setup(config) {
  const origin = config.projects[0].use.baseURL;
  assertE2EOrigin(origin);
  const response = await fetch(new URL("/api/v1/environment", origin));
  const info = await response.json();
  if (info.environment !== "test" || info.databaseKind !== "e2e")
    throw new Error(
      "8080 is not connected to the E2E database; refusing all writes.",
    );
  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(
    evidencePath,
    JSON.stringify(await demoFingerprint(), null, 2),
  );
}
