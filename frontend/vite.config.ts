import { defineConfig, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

const logger = () => {
  return {
    name: 'log-paths',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        console.log(`[vite] ${req.method} ${req.url}`);
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_SUBPATH,
  plugins: [react(), logger()],
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
