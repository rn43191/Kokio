import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Active from "@/components/home/active";
import ActiveESIMsScroll from "@/components/home/active-esim-scroll";

const mockEsims = [
  {
    id: "1",
    country: "Italy",
    isoCode: "it",
    duration: 3,
    data: 1.7,
    minutes: 52,
    sms: 27,
    flagColor: "#008C45",
  },
  {
    id: "2",
    country: "Greece",
    isoCode: "gr",
    duration: 5,
    data: 3,
    minutes: 120,
    sms: 100,
    flagColor: "#008C45",
  },
  {
    id: "3",
    country: "France",
    isoCode: "fr",
    duration: 20,
    data: 5.7,
    minutes: 52,
    sms: 7,
    flagColor: "#008C45",
  },
  // Add more eSIM objects as needed
];

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      {/* Active eSims */}
      {/* <Active /> */}
      <ActiveESIMsScroll esims={mockEsims} />
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Try it!</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemedText>Testing</ThemedText>
        </CardContent>
        <CardFooter>
          <Button>Test</Button>
        </CardFooter>
      </Card>
      <ThemedView style={styles.stepContainer}>
        <Button>Test</Button>
        <ThemedText type="subtitle">Step 1: Try it!</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
