// Add global shims
import "react-native-get-random-values";
import "@ethersproject/shims";
import "cbor-rn-prereqs";

import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import useBootstrap from "@/hooks/useBootstrap";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import NetInfo from "@react-native-community/netinfo";
import {
  getSkipNextOfflineRedirect,
  setSkipNextOfflineRedirect,
} from "@/utils/offlineRedirectFlag";
import { ROUTE_NAMES } from "@/constants/route.constants";
import { Providers } from "@/providers";
import { AuthenticationModal } from "@/components/AuthenticationModal";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [isConnected, setIsConnected] = useState(true);
  const [loaded] = useFonts({
    "Lexend-Light": require("../assets/fonts/Lexend-Light.ttf"),
    Lexend: require("../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Medium": require("../assets/fonts/Lexend-Medium.ttf"),
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Black": require("../assets/fonts/Lexend-Black.ttf"),
  });

  const { isLoading } = useBootstrap();

  // Initial connectivity check
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsConnected(online);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsConnected(online);

      if (
        !online &&
        !getSkipNextOfflineRedirect() &&
        pathname !== ROUTE_NAMES.OFFLINE
      ) {
        router?.replace(ROUTE_NAMES.OFFLINE as any);
      }

      // Once back online, reset the flag
      if (online) {
        setSkipNextOfflineRedirect(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Hide splash screen after fonts and bootstrap complete
  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  // Wait until ready
  if (!loaded || isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="Offline" options={{ headerShown: false }} />
      </Stack>
      <AuthenticationModal />
    </Providers>
  );
}
