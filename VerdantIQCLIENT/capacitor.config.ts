import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.verdantiq.ecosphere',
  appName: 'VerdantIQ',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://verdantiq-client.onrender.com',
    cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a0f1d',
  },
};

export default config;
