import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: env.VITE_FRONTEND_BASE_URL ? env.VITE_FRONTEND_BASE_URL : '',
    server: {
      host: env.VITE_FRONTEND_HOST ? env.VITE_FRONTEND_HOST : 'localhost',
      port: env.VITE_FRONTEND_PORT ? Number(env.VITE_FRONTEND_PORT) : 3001,
    },
    plugins: [react()],
  };
});
