// Add global shims
// import "@flyskywhy/react-native-browser-polyfill";
import "node-libs-expo/globals";
import "@ethersproject/shims";
import "react-native-get-random-values";
import "cbor-rn-prereqs";
import "@/polyfills/window";

import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Platform } from "react-native";
import { AlchemyAuthSessionProvider } from "@/context/AlchemyAuthSessionProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlchemyAccountProvider } from "@account-kit/react-native";
import { alchemyConfig } from "@/utils/signer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <QueryClientProvider client={queryClient}>
        <AlchemyAuthSessionProvider> */}
      <AlchemyAccountProvider config={alchemyConfig} queryClient={queryClient}>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="otp-modal"
              options={{
                headerShown: false,
                presentation:
                  Platform.OS === "ios"
                    ? "formSheet"
                    : "containedTransparentModal",
                animation:
                  Platform.OS === "android" ? "slide_from_bottom" : "default",
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </AlchemyAccountProvider>
      {/* </AlchemyAuthSessionProvider>
      </QueryClientProvider> */}
    </ThemeProvider>
  );
}
