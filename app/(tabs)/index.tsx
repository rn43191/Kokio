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
import ActiveESIMsScroll from "@/components/home/active-esim-scroll";
import Wallet from "@/components/home/wallet";

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
      <ActiveESIMsScroll esims={mockEsims} />
      <Wallet />
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
