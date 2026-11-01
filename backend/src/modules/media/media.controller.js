import {
  verifiedWhere,
  isIsolatedTest,
  approvedAsset,
} from "../../utils/dataPolicy.js";
import prisma from "../../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadBaseDir = path.resolve(__dirname, "../../../uploads");

export class MediaController {
  // 1. Upload Logo CLB
  static async uploadLogo(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng chọn tệp ảnh logo" });
      }
      const { clubId } = req.params;
      const fileUrl = `/uploads/logos/${req.file.filename}`;

      await prisma.mediaAsset.create({
        data: {
          filename: req.file.filename,
          url: fileUrl,
          type: fileUrl.includes("logos") ? "LOGO" : "COVER",
          clubId,
          altText: "Tệp tải lên đang chờ xác minh",
          usagePermission: "PENDING",
          verificationStatus: "SOURCE_FOUND_UNVERIFIED",
        },
      });
      const updatedClub = await prisma.club.update({
        where: { id: clubId },
        data: { logoUrl: fileUrl },
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật logo câu lạc bộ thành công",
        data: { logoUrl: fileUrl, club: updatedClub },
      });
    } catch (err) {
      next(err);
    }
  }

  // 2. Upload Ảnh Bìa (Cover) CLB
  static async uploadCover(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng chọn tệp ảnh bìa" });
      }
      const { clubId } = req.params;
      const fileUrl = `/uploads/covers/${req.file.filename}`;

      await prisma.mediaAsset.create({
        data: {
          filename: req.file.filename,
          url: fileUrl,
          type: fileUrl.includes("logos") ? "LOGO" : "COVER",
          clubId,
          altText: "Tệp tải lên đang chờ xác minh",
          usagePermission: "PENDING",
          verificationStatus: "SOURCE_FOUND_UNVERIFIED",
        },
      });
      const updatedClub = await prisma.club.update({
        where: { id: clubId },
        data: { coverUrl: fileUrl },
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật ảnh bìa câu lạc bộ thành công",
        data: { coverUrl: fileUrl, club: updatedClub },
      });
    } catch (err) {
      next(err);
    }
  }

  // 3. Upload Avatar Sinh Viên
  static async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng chọn tệp ảnh đại diện" });
      }
      const userId = req.user.id;
      const fileUrl = `/uploads/avatars/${req.file.filename}`;

      const profile = await prisma.studentProfile.upsert({
        where: { userId },
        update: { avatarUrl: fileUrl },
        create: {
          userId,
          fullName: "Sinh viên",
          studentCode: `SV${Date.now().toString().slice(-6)}`,
          avatarUrl: fileUrl,
        },
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        data: { avatarUrl: fileUrl, profile },
      });
    } catch (err) {
      next(err);
    }
  }

  // 4. Lấy album ảnh hoạt động của CLB
  static async getClubAlbum(req, res, next) {
    try {
      const { clubId } = req.params;
      const medias = await prisma.clubMedia.findMany({
        where: {
          clubId,
          ...verifiedWhere(),
          club: { status: "ACTIVE", ...verifiedWhere() },
        },
        orderBy: { createdAt: "desc" },
      });

      const assets = await prisma.mediaAsset.findMany({ where: { clubId } });
      res.status(200).json({
        success: true,
        message: "Lấy album ảnh hoạt động thành công",
        data: {
          medias: isIsolatedTest()
            ? medias
            : medias.filter((m) =>
                assets.some((a) => a.url === m.url && approvedAsset(a)),
              ),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // 5. Thêm ảnh vào album hoạt động của CLB
  static async addClubMedia(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Vui lòng chọn tệp ảnh để thêm vào album",
          });
      }
      const { clubId } = req.params;
      const { caption, orderIndex } = req.body;
      const fileUrl = `/uploads/albums/${req.file.filename}`;

      await prisma.mediaAsset.create({
        data: {
          filename: req.file.filename,
          url: fileUrl,
          type: "GALLERY",
          clubId,
          altText: caption || "Ảnh đang chờ xác minh",
          usagePermission: "PENDING",
          verificationStatus: "SOURCE_FOUND_UNVERIFIED",
        },
      });
      const media = await prisma.clubMedia.create({
        data: {
          clubId,
          url: fileUrl,
          caption: caption || "",
          orderIndex: orderIndex ? parseInt(orderIndex, 10) : 0,
        },
      });

      res.status(201).json({
        success: true,
        message: "Thêm ảnh vào album hoạt động thành công",
        data: { media },
      });
    } catch (err) {
      next(err);
    }
  }

  // 6. Xóa ảnh khỏi album CLB
  static async deleteClubMedia(req, res, next) {
    try {
      const { clubId, mediaId } = req.params;

      const media = await prisma.clubMedia.findFirst({
        where: { id: mediaId, clubId },
      });

      if (!media) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Không tìm thấy hình ảnh trong album",
          });
      }

      // Keep original files for provenance and shared-reference recovery.
      await prisma.clubMedia.delete({
        where: { id: mediaId },
      });

      res.status(200).json({
        success: true,
        message: "Xóa ảnh khỏi album thành công",
      });
    } catch (err) {
      next(err);
    }
  }
}
