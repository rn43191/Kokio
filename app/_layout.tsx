import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@/contexts/ToastContext";
import useBootstrap from "@/hooks/useBootstrap";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import NetInfo from "@react-native-community/netinfo";
import {
  getSkipNextOfflineRedirect,
  setSkipNextOfflineRedirect,
} from "@/utils/offlineRedirectFlag";

// Prevent splash screen from auto-hiding
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

      if (!online && !getSkipNextOfflineRedirect() && pathname !== "/Offline") {
        router.replace("/Offline");
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
    if (loaded && !isLoading ) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  // Wait until ready
  if (!loaded || isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="Offline" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
