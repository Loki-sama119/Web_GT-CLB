import fs from "node:fs";
import path from "node:path";
import { demoFingerprint, evidencePath } from "./isolation.mjs";
export default async function teardown() {
  const before = JSON.parse(fs.readFileSync(evidencePath, "utf8")),
    after = await demoFingerprint();
  const pass = JSON.stringify(before) === JSON.stringify(after);
  fs.writeFileSync(
    path.join(path.dirname(evidencePath), "isolation-result.json"),
    JSON.stringify({ pass, before, after }, null, 2),
  );
  if (!pass)
    throw new Error(
      "Demo database changed during E2E; isolation regression detected.",
    );
}
