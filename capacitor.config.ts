import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.victaure.app',
  appName: 'Victaure',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      '*.supabase.co',
      '*.vercel.app',
      '*.lovableproject.com',
      'https://*.supabase.co',
      'https://*.lovableproject.com',
      'https://mfjllillnpleasclqabb.supabase.co',
      'wss://mfjllillnpleasclqabb.supabase.co',
      'https://mfjllillnpleasclqabb.supabase.co:443',
      'https://*.lovableproject.com:443',
      'https://*.supabase.co/*',
      'https://mfjllillnpleasclqabb.supabase.co/auth/v1/*',
      'https://mfjllillnpleasclqabb.supabase.co/rest/v1/*'
    ]
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;