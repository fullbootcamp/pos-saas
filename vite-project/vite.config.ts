import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config'; //important line

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
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude], //add this line
  },
});