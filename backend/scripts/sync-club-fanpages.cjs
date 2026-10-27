const { PrismaClient } = require('@prisma/client');

async function syncDb(connectionString, dbName) {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: connectionString }
    }
  });

  try {
    console.log(`\n=== Syncing ${dbName} ===`);

    // 1. Update fanpageUrl for the 3 clubs
    const updates = [
      {
        slug: 'clb-tinh-nguyen-xanh',
        fanpageUrl: 'https://www.facebook.com/p/CLB-T%C3%ACnh-Nguy%E1%BB%87n-Xanh-Tr%C6%B0%E1%BB%9Dng-%C4%90%E1%BA%A1i-h%E1%BB%8Dc-N%C3%B4ng-L%C3%A2m-B%E1%BA%AFc-Giang-61552769437618/'
      },
      {
        slug: 'clb-hien-mau-tinh-nguyen',
        fanpageUrl: 'https://www.facebook.com/maubafu/'
      },
      {
        slug: 'clb-lap-trinh-bafu-tech',
        fanpageUrl: 'https://www.facebook.com/Clbtinhocitbafu/'
      }
    ];

    for (const u of updates) {
      const club = await prisma.club.findUnique({ where: { slug: u.slug } });
      if (club) {
        await prisma.club.update({
          where: { id: club.id },
          data: { fanpageUrl: u.fanpageUrl }
        });
        console.log(`Updated fanpage for ${club.name} (${u.slug}) -> ${u.fanpageUrl}`);
      } else {
        console.log(`Club ${u.slug} not found in ${dbName}`);
      }
    }

    // 2. Ensure Tech Club event exists in db
    const techClub = await prisma.club.findUnique({ where: { slug: 'clb-lap-trinh-bafu-tech' } });
    if (techClub) {
      const existingEvent = await prisma.clubEvent.findFirst({
        where: {
          clubId: techClub.id,
          title: 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026'
        }
      });
      if (!existingEvent) {
        await prisma.clubEvent.create({
          data: {
            clubId: techClub.id,
            title: 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026',
            slug: 'hoi-thao-cong-nghe-ai-nong-nghiep-2026',
            description: 'Ứng dụng Computer Vision và IoT trong giám sát năng suất cây trồng tại Nông - Lâm Bắc Giang.',
            location: 'Hội trường B5, Giảng đường Trung tâm BAFU',
            startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
            maxParticipants: 120,
            status: 'UPCOMING'
          }
        });
        console.log(`Created missing event 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026' for ${techClub.name}`);
      } else {
        console.log(`Event 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026' already exists in ${dbName}`);
      }
    }

  } catch (err) {
    console.error(`Error syncing ${dbName}:`, err);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  const dbUrl = 'postgresql://postgres:postgrespassword@localhost:5433/club_portal_db?schema=public';
  const e2eUrl = 'postgresql://postgres:postgrespassword@localhost:5433/club_portal_e2e?schema=public';

  await syncDb(dbUrl, 'club_portal_db');
  await syncDb(e2eUrl, 'club_portal_e2e');
})();
