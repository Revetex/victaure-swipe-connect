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
      external: ['https://cdn.gpteng.co/gptengineer.js']
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
      host: 'mfjllillnpleasclqabb.supabase.co',
      timeout: 120000
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    cors: {
      origin: [
        'https://mfjllillnpleasclqabb.supabase.co',
        'http://localhost:8080',
        'http://localhost:3000',
        'https://*.lovableproject.com',
        'https://*.vercel.app',
        'https://*.supabase.co'
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'apikey', 'x-client-info', 'Range']
    },
    proxy: {
      '/auth/v1': {
        target: 'https://mfjllillnpleasclqabb.supabase.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1'),
        headers: {
          'Origin': 'https://mfjllillnpleasclqabb.supabase.co'
        }
      },
      '/rest/v1': {
        target: 'https://mfjllillnpleasclqabb.supabase.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1'),
        headers: {
          'Origin': 'https://mfjllillnpleasclqabb.supabase.co'
        }
      }
    }
  },
}));