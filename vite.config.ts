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
  server: {
    host: '0.0.0.0',
    port: 8080,
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
      origin: [
        'https://052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
        'https://mfjllillnpleasclqabb.supabase.co',
        'https://mfjllillnpleasclqabb.supabase.co/auth/v1/*',
        'https://mfjllillnpleasclqabb.supabase.co/rest/v1/*',
        'https://mfjllillnpleasclqabb.supabase.co/storage/v1/*',
        'http://localhost:8080',
        'http://10.0.2.2:8080'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Client-Info', 
        'apikey', 
        'X-Supabase-Auth',
        'Range',
        'Prefer'
      ],
      exposedHeaders: ['Content-Range'],
      credentials: true,
      preflightContinue: true,
      optionsSuccessStatus: 204
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}));