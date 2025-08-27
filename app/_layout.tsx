// Add global shims
import "react-native-get-random-values";
import "@ethersproject/shims";
import "cbor-rn-prereqs";
import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Providers } from "@/providers";
import { Platform } from "react-native";
import { useAppState } from "@/hooks/useAppState";
import {
  getSkipNextAuthRedirect,
  setSkipNextAuthRedirect,
} from "@/utils/authRedirectFlag";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // const appState = useAppState(true);
  // console.log("AppState in layout", appState);

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="otp-modal"
          options={{
            headerShown: false,
            presentation:
              Platform.OS === "ios" ? "formSheet" : "containedTransparentModal",
            animation:
              Platform.OS === "android" ? "slide_from_bottom" : "default",
          }}
        />
      </Stack>
    </Providers>
  );
}
