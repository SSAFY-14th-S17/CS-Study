import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/CS-Study/'
    : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      }
    }
  },
  server: {
    port: 3000,
    host: true,  // Docker에서 외부 접근 가능하도록
    open: false  // Docker 환경에서는 자동 열기 비활성화
  }
});