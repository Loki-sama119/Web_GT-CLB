CREATE TYPE "DataClassification" AS ENUM ('REAL_VERIFIED','REAL_UNVERIFIED','DEMO','E2E_TEST','PLACEHOLDER','UNKNOWN');
ALTER TABLE "users" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "clubs" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "recruitment_campaigns" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "club_events" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "club_posts" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "club_medias" ADD COLUMN "dataClassification" "DataClassification" NOT NULL DEFAULT 'UNKNOWN', ADD COLUMN "sourceUrl" TEXT, ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "clubs" ADD COLUMN "activityStatus" TEXT NOT NULL DEFAULT 'NOT_CONFIRMED', ADD COLUMN "identityKey" TEXT;
ALTER TABLE "club_events" ADD COLUMN "datePrecision" TEXT NOT NULL DEFAULT 'TIME', ADD COLUMN "organizer" TEXT;
CREATE TABLE "media_assets" (
 "assetId" TEXT PRIMARY KEY, "filename" TEXT NOT NULL, "url" TEXT NOT NULL, "type" TEXT NOT NULL,
 "sourceUrl" TEXT, "sourcePostUrl" TEXT, "sourcePage" TEXT, "clubId" TEXT REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE,
 "eventId" TEXT REFERENCES "club_events"("id") ON DELETE SET NULL ON UPDATE CASCADE, "publishedAt" TIMESTAMP(3), "capturedAt" TIMESTAMP(3),
 "usagePermission" TEXT NOT NULL DEFAULT 'PENDING', "verificationStatus" TEXT NOT NULL DEFAULT 'SOURCE_FOUND_UNVERIFIED', "verifiedAt" TIMESTAMP(3), "altText" TEXT NOT NULL
);