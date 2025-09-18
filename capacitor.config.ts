import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a0620ebcbe564a95b492d68e2f187163',
  appName: 'twin-capture',
  webDir: 'dist',
  server: {
    url: 'https://a0620ebc-be56-4a95-b492-d68e2f187163.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;