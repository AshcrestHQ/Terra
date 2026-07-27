const config = {
  appId: 'com.sproutgarden.app',
  appName: 'Sprout & Flourish',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false,
    }
  }
};

export default config;
