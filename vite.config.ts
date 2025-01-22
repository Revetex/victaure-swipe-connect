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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          dashboard: ['./src/components/Dashboard.tsx'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: '052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
      timeout: 120000,
      path: '/@vite/client',
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    https: {
      key: undefined,
      cert: undefined
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Client-Info', 
        'apikey', 
        'X-Supabase-Auth',
        'Range',
        'Prefer',
        'Origin',
        'Accept',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
      ],
      exposedHeaders: ['Content-Range'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },
}));