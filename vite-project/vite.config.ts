/// <reference types="vitest" /> // Explicitly include Vitest types
// Adapted from https://vitest.dev/guide/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true, // Enables vi, describe, it, expect globally
    environment: 'jsdom',
    setupFiles: ['src/vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/__tests__/**/*.test.tsx'],
    exclude: [...configDefaults.exclude, '**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});