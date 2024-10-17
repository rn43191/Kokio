import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Theme, Colors, createStyles } from "@/constants/Colors";

const Header = ({ options }: { options: { title: string } }) => (
  <ThemedView
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: Theme.spacing.sm,
    }}
  >
    <ThemedText type="subtitle">Shop</ThemedText>
  </ThemedView>
);

export default function ShopStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ header: Header }} />
      <Stack.Screen name="[country]"  />
    </Stack>
  );
}
