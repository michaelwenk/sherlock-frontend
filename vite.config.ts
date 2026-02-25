import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    plugins: [react()],
  });
};
