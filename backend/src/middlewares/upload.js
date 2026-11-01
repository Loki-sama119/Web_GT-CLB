import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đảm bảo các thư mục upload tồn tại
const uploadBaseDir = path.resolve(__dirname, '../../uploads');
const folders = ['avatars', 'logos', 'covers', 'albums'];

folders.forEach(folder => {
  const target = path.join(uploadBaseDir, folder);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
});

// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'albums';
    if (req.uploadType === 'avatar') subfolder = 'avatars';
    else if (req.uploadType === 'logo') subfolder = 'logos';
    else if (req.uploadType === 'cover') subfolder = 'covers';

    cb(null, path.join(uploadBaseDir, subfolder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  }
});

// Kiểm tra định dạng file
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP!'), false);
  }
};

export const uploadMedia = (type = 'album', maxSizeMB = 5) => {
  return (req, res, next) => {
    req.uploadType = type;
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxSizeMB * 1024 * 1024 }
    }).single('file');

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `Kích thước tệp vượt quá giới hạn tối đa ${maxSizeMB}MB`
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};
