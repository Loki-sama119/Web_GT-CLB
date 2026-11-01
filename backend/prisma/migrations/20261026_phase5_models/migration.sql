-- CreateTable
CREATE TABLE "club_medias" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_histories" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "changedById" TEXT,
    "fromStatus" "ApplicationStatus" NOT NULL,
    "toStatus" "ApplicationStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "club_medias" ADD CONSTRAINT "club_medias_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_histories" ADD CONSTRAINT "application_histories_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_histories" ADD CONSTRAINT "application_histories_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
