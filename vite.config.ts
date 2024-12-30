import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
    watch: {
      usePolling: true,
    },
    cors: true,
  },
});