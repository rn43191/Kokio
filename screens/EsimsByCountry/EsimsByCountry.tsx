import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import DataPackTabGroup from "@/components/DataPackTabGroup";

const mockEsims = [
  {
    id: "1",
    country: "Italy",
    isoCode: "it",
    duration: 3,
    data: 1.7,
    minutes: 52,
    sms: 27,
    price: 6.5,
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
    price: 10.5,
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
    price: 6.5,
    flagColor: "#008C45",
  },
  {
    id: "4",
    country: "Spain",
    isoCode: "es",
    duration: 7,
    data: 2.5,
    minutes: 60,
    sms: 30,
    price: 6.5,
    flagColor: "#AA151B",
  },
  {
    id: "5",
    country: "Germany",
    isoCode: "de",
    duration: 10,
    data: 4.0,
    minutes: 80,
    sms: 40,
    price: 6.5,
    flagColor: "#000000",
  },
  {
    id: "6",
    country: "Portugal",
    isoCode: "pt",
    duration: 15,
    data: 6.5,
    minutes: 100,
    sms: 50,
    price: 6.5,
    flagColor: "#006600",
  },
  {
    id: "7",
    country: "Netherlands",
    isoCode: "nl",
    duration: 12,
    data: 3.2,
    minutes: 90,
    sms: 45,
    price: 6.5,
    flagColor: "#21468B",
  },
  {
    id: "8",
    country: "Sweden",
    isoCode: "se",
    duration: 8,
    data: 2.8,
    minutes: 65,
    sms: 35,
    price: 6.5,
    flagColor: "#006AB6",
  },
  {
    id: "9",
    country: "Belgium",
    isoCode: "be",
    duration: 6,
    data: 1.9,
    minutes: 55,
    sms: 25,
    price: 6.5,
    flagColor: "#FFD700",
  },
];

export default function EsimsByCountry() {
  return (
    <DataPackTabGroup
      esims={mockEsims}
      containerStyle={styles.containerStyle}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 8,
  },
});
