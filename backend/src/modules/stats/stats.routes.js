import { Router } from 'express';
import prisma from '../../config/db.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();

router.get('/overview', async (req, res, next) => {
  try {
    const [totalClubs, totalMembers, totalCampaigns, totalEvents, categories] = await Promise.all([
      prisma.club.count({ where: { status: 'ACTIVE' } }),
      prisma.clubMembership.count({ where: { status: 'ACTIVE' } }),
      prisma.recruitmentCampaign.count({ where: { status: 'OPEN' } }),
      prisma.clubEvent.count(),
      prisma.clubCategory.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { clubs: true } }
        }
      })
    ]);

    return sendSuccess(res, 200, 'Lấy dữ liệu thống kê thành công', {
      totalClubs,
      totalMembers,
      totalCampaigns,
      totalEvents,
      categories
    });
  } catch (error) {
    next(error);
  }
});

export default router;
