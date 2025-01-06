import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.victaure.app',
  appName: 'Victaure',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    buildOptions: {
      debuggable: true,
      minSdkVersion: 21,
      targetSdkVersion: 33,
    }
  }
};

export default config;