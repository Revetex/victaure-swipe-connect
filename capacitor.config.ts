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
      'https://*.lovableproject.com',
      'https://mfjllillnpleasclqabb.supabase.co',
      'wss://mfjllillnpleasclqabb.supabase.co',
      'https://mfjllillnpleasclqabb.supabase.co:443',
      '*.lovableproject.com:443',
      'https://*.lovableproject.com:443',
      '*.vercel.app',
      '052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
      'https://052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com',
      'https://052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com:443',
      '10.0.2.2',
      '10.0.2.2:*',
      'http://10.0.2.2:*',
      'http://10.0.2.2',
      'https://10.0.2.2'
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
  ios: {
    contentInset: 'always',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
    webViewSoftInputMode: 'adjustResize'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    }
  }
};

export default config;