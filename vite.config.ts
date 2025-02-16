
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
      clientPort: 443
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    cors: {
      origin: [
        'https://052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
        'https://mfjllillnpleasclqabb.supabase.co',
        'wss://mfjllillnpleasclqabb.supabase.co',
        'https://victaure.com'
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
        'X-Supabase-Auth',
        '*'
      ],
      exposedHeaders: ['Content-Range', 'Range'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'framer-motion'
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-select',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs'
          ],
          'ai': [
            '@huggingface/transformers'
          ],
          'maps': [
            'mapbox-gl'
          ],
          'pdf': [
            'jspdf',
            'html2canvas'
          ],
          'charts': [
            'recharts'
          ],
          'utils': [
            'clsx',
            'tailwind-merge',
            'zustand',
            'date-fns'
          ]
        }
      }
    }
  }
}));

