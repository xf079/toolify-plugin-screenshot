import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'react-screenshot',
      fileName: (format) => `react-screenshot.${format}.js`,
    },
    rollupOptions: {
      external: ['tsx'],
      output: {
        globals: {
          React: 'React',
        },
      },
    },
  },
});
