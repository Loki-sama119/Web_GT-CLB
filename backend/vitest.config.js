import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// Nạp biến môi trường cho database kiểm thử riêng biệt
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 15000,
  },
});
