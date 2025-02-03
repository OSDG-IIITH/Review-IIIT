import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_SUBPATH,
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_DEV_PORT),
    strictPort: true,
    // Force a direct HMR connection instead of proxying it via the backend
    // in the dev environment
    hmr: {
      port: Number(process.env.VITE_DEV_PORT),
    },
  },
});
