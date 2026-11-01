import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const docker =
  process.env.DOCKER_BIN ||
  "C:/Program Files/Docker/Docker/resources/bin/docker.exe";
const db = process.argv[2] || "club_portal_db";
if (!["club_portal_db", "club_portal_e2e", "club_portal_test"].includes(db))
  throw new Error("Database not allowlisted");
const run = (...args) =>
  execFileSync(docker, args, { encoding: "utf8", maxBuffer: 30 * 1024 * 1024 });
const sql = (name, query) =>
  run(
    "exec",
    "club_portal_postgres",
    "psql",
    "-U",
    "postgres",
    "-d",
    name,
    "-Atc",
    query,
  ).trim();
const tables = JSON.parse(
  sql(
    db,
    `SELECT json_agg(tablename ORDER BY tablename) FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations'`,
  ),
);
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
const out = path.resolve("../backups", `${db}-${stamp}`);
fs.mkdirSync(out, { recursive: true });
const dump = `/tmp/${db}-${stamp}.dump`;
run(
  "exec",
  "club_portal_postgres",
  "pg_dump",
  "-U",
  "postgres",
  "-d",
  db,
  "-Fc",
  "-f",
  dump,
);
run("cp", `club_portal_postgres:${dump}`, path.join(out, "database.dump"));
run("exec", "club_portal_postgres", "pg_restore", "--list", dump);
const restoreDb = `bafu_restore_${stamp}`;
run("exec", "club_portal_postgres", "createdb", "-U", "postgres", restoreDb);
run(
  "exec",
  "club_portal_postgres",
  "pg_restore",
  "-U",
  "postgres",
  "--exit-on-error",
  "-d",
  restoreDb,
  dump,
);
const fingerprints = (name) =>
  Object.fromEntries(
    tables.map((table) => [
      table,
      JSON.parse(
        sql(
          name,
          `SELECT json_build_object('count',count(*),'digest',md5(coalesce(string_agg(row_to_json(t)::text,'' ORDER BY "${table==='media_assets'?'assetId':'id'}"),''))) FROM "${table}" t`,
        ),
      ),
    ]),
  );
const before = fingerprints(db),
  restored = fingerprints(restoreDb);
if (JSON.stringify(before) !== JSON.stringify(restored))
  throw new Error("Restore fingerprint mismatch");
// Private row inventory is ignored by Git. No password hashes are exported here.
const inventory = {};
for (const table of tables)
  inventory[table] = JSON.parse(
    sql(
      db,
      `SELECT coalesce(json_agg(to_jsonb(t) - 'passwordHash'),'[]'::json) FROM "${table}" t`,
    ),
  );
fs.writeFileSync(
  path.join(out, "inventory.json"),
  JSON.stringify(inventory, null, 2),
);
const receipt = {
  database: db,
  capturedAt: new Date().toISOString(),
  restoreDatabase: restoreDb,
  restoreVerified: true,
  sha256: createHash("sha256")
    .update(fs.readFileSync(path.join(out, "database.dump")))
    .digest("hex"),
  tables: before,
};
fs.writeFileSync(
  path.join(out, "receipt.json"),
  JSON.stringify(receipt, null, 2),
);
console.log(JSON.stringify({ directory: out, ...receipt }, null, 2));
