import { Router } from "express";
import prisma from "../../config/db.js";
import { sendSuccess } from "../../utils/response.js";
import {
  verifiedWhere,
  visibleUserWhere,
  activeCampaignWhere,
} from "../../utils/dataPolicy.js";
const router = Router();
router.get("/overview", async (req, res, next) => {
  try {
    const club = { status: "ACTIVE", ...verifiedWhere() };
    const [totalClubs, totalMembers, totalCampaigns, totalEvents, categories] =
      await Promise.all([
        prisma.club.count({ where: club }),
        prisma.clubMembership.count({
          where: { status: "ACTIVE", club, user: visibleUserWhere() },
        }),
        prisma.recruitmentCampaign.count({
          where: { ...activeCampaignWhere(), club },
        }),
        prisma.clubEvent.count({
          where: { isPublic: true, club, ...verifiedWhere() },
        }),
        prisma.clubCategory.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { clubs: { where: club } } },
          },
        }),
      ]);
    sendSuccess(res, 200, "Thống kê từ các bản ghi được công bố", {
      totalClubs,
      totalMembers,
      totalCampaigns,
      totalEvents,
      categories,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
