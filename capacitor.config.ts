
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
      '*.lovableproject.com',
      '*.vercel.app',
      '052296aa-8ca7-44bf-8824-632071249d15.lovableproject.com'
    ],
    headers: {
      // Add Cache-Control header
      'Cache-Control': 'max-age=31536000, public',
      // Add SameSite attribute to cookies and other security headers
      'Set-Cookie': 'SameSite=Strict; Secure',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(self), camera=(self), microphone=(self)',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site',
    }
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
    Cookies: {
      enabled: true,
      samesite: 'Strict',
      secure: true
    }
  }
};

export default config;
