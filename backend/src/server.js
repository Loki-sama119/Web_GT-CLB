import app from './app.js';
import { ENV } from './config/env.js';
import prisma from './config/db.js';

const PORT = ENV.PORT;

const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`🚀 Server backend đang chạy thành công tại http://localhost:${PORT}`);
    console.log(`📡 API Endpoints sẵn sàng tại http://localhost:${PORT}/api/v1`);
  } catch (error) {
    console.error('❌ Lỗi kết nối CSDL PostgreSQL:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('Đang dừng server an toàn...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});
