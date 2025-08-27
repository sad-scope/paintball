import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Для Vercel используем корневой путь
  build: {
    outDir: 'dist', // По умолчанию для Vite
    sourcemap: true, // Для отладки на Vercel
  },
  resolve: {
    alias: {
      widgets: path.resolve(__dirname, 'src/widgets'),
      assets: path.resolve(__dirname, 'src/assets'),
      shared: path.resolve(__dirname, 'src/shared'),
      features: path.resolve(__dirname, 'src/features'),
      entities: path.resolve(__dirname, 'src/entities'),
    },
  },
});
