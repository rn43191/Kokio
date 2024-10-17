import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";

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
  const colorScheme = 'dark' || useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

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
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const HeaderTitle = ({ title }: { title: string }) => (
  <ThemedText style={styles.headerTitle}>{title}</ThemedText>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "black",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  backButton: {
    marginLeft: 10,
  },
});
