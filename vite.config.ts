import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // The preview proxy serves the app from a sandbox hostname; allow it so the
    // dev server does not reject proxied requests.
    allowedHosts: ['.e2b.app', 'localhost'],
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
