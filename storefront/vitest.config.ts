import path from 'node:path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { loadLocalEnv } from './test/load-env';

loadLocalEnv(__dirname);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      lib: path.resolve(__dirname, 'lib'),
      styles: path.resolve(__dirname, 'styles')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    exclude: ['node_modules', '.next', 'tests/e2e/**']
  }
});
