import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "fr.ordremycelienne.app",
  appName: "Prophétesse-Mycélium",
  webDir: "out",
  ios: {
    contentInset: "always",
    scheme: "Prophetesse-Mycelium",
    backgroundColor: "#3a562fff",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#3a562fff",
      iosSpinnerStyle: "small",
      spinnerColor: "#c9a227",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
