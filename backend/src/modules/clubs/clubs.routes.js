import { Router } from "express";
import { ClubsController } from "./clubs.controller.js";
import prisma from "../../config/db.js";
import {
  managedContentWhere,
  visibleUserWhere,
} from "../../utils/dataPolicy.js";
import { authenticate } from "../../middlewares/auth.js";
import { requireSuperAdmin, requireClubAdmin } from "../../middlewares/rbac.js";

const router = Router();

// Private workspace includes pending content without publishing it in the directory.
router.get("/management/clubs", authenticate, async (req, res, next) => {
  try {
    const clubs = await prisma.club.findMany({
      where: {
        ...managedContentWhere(),
        ...(req.user.role === "SUPER_ADMIN"
          ? {}
          : {
              memberships: {
                some: {
                  userId: req.user.id,
                  status: "ACTIVE",
                  role: { in: ["LEADER", "VICE_LEADER"] },
                },
              },
            }),
      },
      include: {
        category: true,
        _count: {
          select: {
            memberships: {
              where: { status: "ACTIVE", user: visibleUserWhere() },
            },
            campaigns: { where: managedContentWhere() },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: { clubs } });
  } catch (error) {
    next(error);
  }
});

// Public routes
router.get("/categories", ClubsController.getCategories);
router.get("/clubs", ClubsController.getClubs);
router.get("/clubs/:slug", ClubsController.getClubBySlug);

// Protected routes
router.post(
  "/clubs",
  authenticate,
  requireSuperAdmin,
  ClubsController.createClub,
);
router.put(
  "/clubs/:id",
  authenticate,
  requireClubAdmin((req) => req.params.id),
  ClubsController.updateClub,
);

export default router;
