import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// Nạp biến môi trường cho database kiểm thử riêng biệt khi ở local
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true });
}

// Thiết lập môi trường test
process.env.NODE_ENV = 'test';

// Trong môi trường CI (GitHub Actions), giữ nguyên DATABASE_URL (cổng 5432) do workflow cung cấp
// Trong môi trường local, kết nối tới database kiểm thử riêng biệt (cổng 5433)
if (!process.env.CI) {
  const isInsideDocker = Boolean(process.env.HOSTNAME || process.env.DOCKER_CONTAINER);
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 
    (isInsideDocker 
      ? "postgresql://postgres:postgrespassword@postgres:5432/club_portal_test?schema=public"
      : "postgresql://postgres:postgrespassword@localhost:5433/club_portal_test?schema=public");
}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 15000,
  },
});
