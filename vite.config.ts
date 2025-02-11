
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
      protocol: 'ws',
      host: '052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
      clientPort: 8080
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    cors: {
      origin: [
        'https://052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
        'https://mfjllillnpleasclqabb.supabase.co',
        'wss://mfjllillnpleasclqabb.supabase.co'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Client-Info', 
        'apikey', 
        'Content-Range',
        'Range',
        'Prefer',
        'Accept',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers',
        'X-Supabase-Auth'
      ],
      exposedHeaders: ['Content-Range', 'Range'],
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
          vendor: [
            'react', 
            'react-dom',
            'framer-motion',
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          auth: [
            '@supabase/auth-ui-react',
            '@supabase/auth-helpers-react'
          ],
          ui: [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ]
        },
      },
    },
  },
}));
