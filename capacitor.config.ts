import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.victaure.app',
  appName: 'Victaure',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'localhost',
      'localhost:*',
      'http://localhost',
      'http://localhost:*',
      '*.supabase.co',
      '*.vercel.app',
      '*.lovableproject.com',
      'https://*.supabase.co',
      'https://*.lovableproject.com',
      'https://mfjllillnpleasclqabb.supabase.co',
      'wss://mfjllillnpleasclqabb.supabase.co',
      'https://mfjllillnpleasclqabb.supabase.co:443'
    ]
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999",
    },
  }
};

export default config;