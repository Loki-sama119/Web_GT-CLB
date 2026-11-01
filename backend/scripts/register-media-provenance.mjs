import fs from "node:fs";
import path from "node:path";
import {createHash} from 'node:crypto';
import { PrismaClient } from "@prisma/client";
const target = new URL(process.env.DATABASE_URL);
if (
  target.pathname !== "/club_portal_db" ||
  !["localhost", "127.0.0.1"].includes(target.hostname) ||
  !process.argv.includes("--demo")
)
  throw new Error("Only explicit local demo import allowed");
const backupOption=process.argv.find(arg=>arg.startsWith('--backup='));
if(!backupOption)throw new Error('Provide --backup=<verified demo snapshot directory> before importing metadata');
const backup=path.resolve(backupOption.slice('--backup='.length));
const receipt=JSON.parse(fs.readFileSync(path.join(backup,'receipt.json'),'utf8'));
if(!receipt.restoreVerified||receipt.database!=='club_portal_db'||receipt.sha256!==createHash('sha256').update(fs.readFileSync(path.join(backup,'database.dump'))).digest('hex'))throw new Error('Verified demo backup required');
const manifest = JSON.parse(
  fs.readFileSync(
    new URL(
      "../../frontend/public/images/asset-manifest.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const prisma = new PrismaClient();
try {
  for (const asset of manifest.assets)
    await prisma.mediaAsset.upsert({
      where: { assetId: asset.assetId },
      create: asset,
      update: {},
    });
  await prisma.auditLog.create({
    data: {
      action: "REGISTER_MEDIA_PROVENANCE",
      entityType: "MediaAsset",
      details: JSON.stringify({
        assets: manifest.assets.map((a) => a.assetId),
        approved: 0,
      }),
    },
  });
  console.log(
    JSON.stringify({ registered: manifest.assets.length, approved: 0 }),
  );
} finally {
  await prisma.$disconnect();
}
