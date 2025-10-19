import { ExpoConfig, ConfigContext } from 'expo/config';
import { AppExtraConfig } from './appKeys.js';

export default ({ config }: ConfigContext): ExpoConfig => {

    console.log("--- RAW ENV CHECK ---");
    console.log("Raw ALCHEMY_API_KEY: ", process.env.ALCHEMY_API_KEY);
    console.log("Raw GAS_MANAGER_POLICY_ID: ", process.env.GAS_MANAGER_POLICY_ID);
    console.log("--- END RAW ENV CHECK ---");

  const privateConfig: AppExtraConfig = {
    // ALCHEMY
    alchemyApiKey: process.env.ALCHEMY_API_KEY,
    gasManagerPolicyId: process.env.GAS_MANAGER_POLICY_ID,

    // PIMLICO
    pimlicoApiKey: process.env.PIMLICO_API_KEY,

    // TURNKEY
    turnkeyOrganizationId: process.env.TURNKEY_ORGANIZATION_ID,
    turnkeyApiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY,
    turnkeyApiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,

    // API Base URL
    apiBaseUrl: process.env.API_BASE_URL,
  };

  console.log("privateConfig: ", privateConfig);

  return {
    // Merge any default or existing config
    ...config,

    "newArchEnabled": false,
    "name": "Kokio",
    "slug": "Kokio",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "kokio",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.kokio",
      "associatedDomains": [
        "webcredentials:kokio.app",
        "webcredentials:kokio.app"
      ],
      "config": {
        "usesNonExemptEncryption": false
      },
      "runtimeVersion": {
        "policy": "appVersion"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.kokio",
      "edgeToEdgeEnabled": false,
      "runtimeVersion": "1.0.0"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 36,
            "targetSdkVersion": 35,
            "kotlinVersion": "2.0.21",
            "buildToolsVersion": "35.0.0"
          },
          "ios": {
            "deploymentTarget": "17.0"
          }
        }
      ],
      "expo-router",
      "expo-font",
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ],
      "expo-asset",
      [
        "react-native-edge-to-edge",
        {
          "android": {
            "parentTheme": "Default",
            "enforceNavigationBarContrast": false
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "updates": {
      "url": "https://u.expo.dev/113a4624-12f1-425b-b76c-a7bedc503b5e"
    },
    extra: {
      eas: {
        projectId: "113a4624-12f1-425b-b76c-a7bedc503b5e"
      },
      ...privateConfig,
    },
  };
};
