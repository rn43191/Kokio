// Add global shims
import "node-libs-expo/globals";
import "@ethersproject/shims";
import "react-native-get-random-values";
import "cbor-rn-prereqs";

import "react-native-reanimated";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AlchemyAuthSessionProvider } from "@/context/AlchemyAuthSessionProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(main)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// Feel free to load and use whatever fonts of your choosing.
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<AlchemyAuthSessionProvider>
			<SafeAreaProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name="otp-modal"
						options={{
							presentation:
								Platform.OS === "ios"
									? "formSheet"
									: "containedTransparentModal",
							animation:
								Platform.OS === "android"
									? "slide_from_bottom"
									: "default",
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</AlchemyAuthSessionProvider>
	);
}
