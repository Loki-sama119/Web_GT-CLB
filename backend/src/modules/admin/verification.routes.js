import { Router } from "express";
import prisma from "../../config/db.js";
import { authenticate } from "../../middlewares/auth.js";
import { requireSuperAdmin } from "../../middlewares/rbac.js";
import { CLASSIFICATIONS, approvedAsset } from "../../utils/dataPolicy.js";

const router = Router();
router.use(authenticate, requireSuperAdmin);
const httpsUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
router.get("/verification", async (req, res, next) => {
  try {
    const [clubs, events, campaigns, assets] = await Promise.all([
      prisma.club.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          dataClassification: true,
          sourceUrl: true,
          verifiedAt: true,
          activityStatus: true,
        },
      }),
      prisma.clubEvent.findMany({ orderBy: { startTime: "desc" } }),
      prisma.recruitmentCampaign.findMany(),
      prisma.mediaAsset.findMany(),
    ]);
    res.json({ success: true, data: { clubs, events, campaigns, assets } });
  } catch (e) {
    next(e);
  }
});
router.post("/verification/:kind/:id", async (req, res, next) => {
  try {
    const models = {
      clubs: "club",
      events: "clubEvent",
      campaigns: "recruitmentCampaign",
    };
    const model = models[req.params.kind];
    if (!model)
      return res
        .status(400)
        .json({ success: false, message: "Loại bản ghi không hợp lệ" });
    const { dataClassification, sourceUrl, evidence } = req.body;
    if (
      !CLASSIFICATIONS.includes(dataClassification) ||
      !evidence?.trim() ||
      (dataClassification === "REAL_VERIFIED" && !httpsUrl(sourceUrl))
    )
      return res
        .status(400)
        .json({
          success: false,
          message: "Cần phân loại, bằng chứng và URL nguồn HTTPS khi xác minh.",
        });
    const record = await prisma.$transaction(async (tx) => {
      const before = await tx[model].findUniqueOrThrow({
        where: { id: req.params.id },
      });
      const updated = await tx[model].update({
        where: { id: req.params.id },
        data: {
          dataClassification,
          sourceUrl: sourceUrl || null,
          verifiedAt:
            dataClassification === "REAL_VERIFIED" ? new Date() : null,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: "VERIFY_CONTENT",
          entityType: model,
          entityId: updated.id,
          details: JSON.stringify({
            before: before.dataClassification,
            after: dataClassification,
            sourceUrl,
            evidence,
          }),
        },
      });
      return updated;
    });
    res.json({ success: true, data: { record } });
  } catch (e) {
    next(e);
  }
});
router.post("/media-assets/:id/review", async (req, res, next) => {
  try {
    const { sourceUrl, sourcePostUrl, altText, permissionEvidence, approved } =
      req.body;
    if (
      typeof approved !== "boolean" ||
      (approved &&
        (!httpsUrl(sourceUrl) ||
          !altText?.trim() ||
          !permissionEvidence?.trim()))
    )
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Duyệt ảnh cần nguồn HTTPS, mô tả đúng chủ thể và bằng chứng quyền sử dụng.",
        });
    const asset = await prisma.$transaction(async (tx) => {
      const updated = await tx.mediaAsset.update({
        where: { assetId: req.params.id },
        data: approved
          ? {
              sourceUrl,
              sourcePostUrl: sourcePostUrl || null,
              altText,
              usagePermission: "APPROVED",
              verificationStatus: "VERIFIED_APPROVED",
              verifiedAt: new Date(),
            }
          : {
              usagePermission: "PENDING",
              verificationStatus: "SOURCE_FOUND_UNVERIFIED",
              verifiedAt: null,
            },
      });
      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: approved ? "APPROVE_MEDIA" : "WITHDRAW_MEDIA_APPROVAL",
          entityType: "MediaAsset",
          entityId: updated.assetId,
          details: JSON.stringify({
            sourceUrl,
            permissionEvidence: permissionEvidence || null,
          }),
        },
      });
      return updated;
    });
    res.json({ success: true, data: { asset } });
  } catch (e) {
    next(e);
  }
});
export default router;
