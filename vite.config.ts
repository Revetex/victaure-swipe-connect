import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          pdf: ['jspdf', 'html2canvas'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['date-fns', 'class-variance-authority', 'clsx', 'tailwind-merge']
        },
      },
      external: ['/gptengineer.js']
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: '052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
      timeout: 120000
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },
    proxy: {
      '/gptengineer.js': {
        target: 'https://cdn.gpteng.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gptengineer\.js/, '/gptengineer.js')
      }
    }
  },
}));