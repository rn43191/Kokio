import { StyleSheet, Image, Platform, View, ScrollView } from "react-native";
import _map from "lodash/map";

import { ThemedText } from "@/components/ThemedText";
import CountryFlag from "@/components/ui/CountryFlag";
import { Colors, Theme } from "@/constants/Colors";

export default function Countries({
  list = [
    { isoCode: "SG", label: "India" },
    { isoCode: "GB" },
    { isoCode: "YE" },
    { isoCode: "CR" },
    { isoCode: "SG" },
    { isoCode: "GB" },
    { isoCode: "YE" },
    { isoCode: "CR" },
    { isoCode: "SG" },
    { isoCode: "GB" },
    { isoCode: "YE" },
    { isoCode: "CR" },
    { isoCode: "SG" },
    { isoCode: "GB" },
    { isoCode: "YE" },
    { isoCode: "CR" },
  ],
}) {
  return (
    <ScrollView>
      <View style={styles.tabWrapper}>
        <ThemedText style={styles.tabTitle}>{"Popular Countries"}</ThemedText>
        <View style={styles.countriesWrapper}>
          {_map(list, (country: any, index: any) => (
            <View key={country?.isoCode || index} style={styles.country}>
              <CountryFlag
                style={styles.flag}
                isoCode={country?.isoCode}
                size={60}
              />
              <ThemedText style={styles.countryLabel}>
                {country?.label || ""}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabTitle: {
    paddingTop: 12,
    paddingBottom: 24,
    color: Colors.dark.text,
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countriesWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  country: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.md,
  },
  countryLabel: {
    color: Colors.dark.text,
  },
  flag: {
    borderRadius: Theme.borderRadius.medium,
  },
});
