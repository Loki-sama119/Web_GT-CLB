import prisma from '../../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadBaseDir = path.resolve(__dirname, '../../../uploads');

export class MediaController {
  // 1. Upload Logo CLB
  static async uploadLogo(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn tệp ảnh logo' });
      }
      const { clubId } = req.params;
      const fileUrl = `/uploads/logos/${req.file.filename}`;

      const updatedClub = await prisma.club.update({
        where: { id: clubId },
        data: { logoUrl: fileUrl }
      });

      res.status(200).json({
        success: true,
        message: 'Cập nhật logo câu lạc bộ thành công',
        data: { logoUrl: fileUrl, club: updatedClub }
      });
    } catch (err) {
      next(err);
    }
  }

  // 2. Upload Ảnh Bìa (Cover) CLB
  static async uploadCover(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn tệp ảnh bìa' });
      }
      const { clubId } = req.params;
      const fileUrl = `/uploads/covers/${req.file.filename}`;

      const updatedClub = await prisma.club.update({
        where: { id: clubId },
        data: { coverUrl: fileUrl }
      });

      res.status(200).json({
        success: true,
        message: 'Cập nhật ảnh bìa câu lạc bộ thành công',
        data: { coverUrl: fileUrl, club: updatedClub }
      });
    } catch (err) {
      next(err);
    }
  }

  // 3. Upload Avatar Sinh Viên
  static async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn tệp ảnh đại diện' });
      }
      const userId = req.user.id;
      const fileUrl = `/uploads/avatars/${req.file.filename}`;

      const profile = await prisma.studentProfile.upsert({
        where: { userId },
        update: { avatarUrl: fileUrl },
        create: {
          userId,
          fullName: 'Sinh viên',
          studentCode: `SV${Date.now().toString().slice(-6)}`,
          avatarUrl: fileUrl
        }
      });

      res.status(200).json({
        success: true,
        message: 'Cập nhật ảnh đại diện thành công',
        data: { avatarUrl: fileUrl, profile }
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
        where: { clubId },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        message: 'Lấy album ảnh hoạt động thành công',
        data: { medias }
      });
    } catch (err) {
      next(err);
    }
  }

  // 5. Thêm ảnh vào album hoạt động của CLB
  static async addClubMedia(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn tệp ảnh để thêm vào album' });
      }
      const { clubId } = req.params;
      const { caption, orderIndex } = req.body;
      const fileUrl = `/uploads/albums/${req.file.filename}`;

      const media = await prisma.clubMedia.create({
        data: {
          clubId,
          url: fileUrl,
          caption: caption || '',
          orderIndex: orderIndex ? parseInt(orderIndex, 10) : 0
        }
      });

      res.status(201).json({
        success: true,
        message: 'Thêm ảnh vào album hoạt động thành công',
        data: { media }
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
        where: { id: mediaId, clubId }
      });

      if (!media) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hình ảnh trong album' });
      }

      // Xóa file vật lý trên đĩa
      try {
        const relativePath = media.url.replace('/uploads/', '');
        const filePath = path.join(uploadBaseDir, relativePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.error('Lỗi khi xóa file đĩa:', fileErr);
      }

      await prisma.clubMedia.delete({
        where: { id: mediaId }
      });

      res.status(200).json({
        success: true,
        message: 'Xóa ảnh khỏi album thành công'
      });
    } catch (err) {
      next(err);
    }
  }
}
