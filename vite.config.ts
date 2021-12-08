import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    css: {
      modules: { localsConvention: 'camelCase' },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 7500,
    },
    plugins: [react()],
  });
};
