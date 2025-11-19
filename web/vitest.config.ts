import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    exclude: ['e2e/**', 'playwright.config.ts', 'node_modules/**'],
  },
});

