import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/cs-study/', // GitHub Pages 저장소 이름으로 변경하세요
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});