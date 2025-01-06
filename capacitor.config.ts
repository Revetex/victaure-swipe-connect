import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.victaure.app',
  appName: 'Victaure',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'mfjllillnpleasclqabb.supabase.co',
      '*.supabase.co',
      '*.vercel.app',
      '*.lovableproject.com',
      'localhost',
      'localhost:*',
      'http://localhost',
      'http://localhost:*',
      'https://*.supabase.co',
      'https://*.lovableproject.com'
    ]
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;