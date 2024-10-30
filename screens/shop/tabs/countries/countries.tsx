import {
  StyleSheet,
  Image,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Link, router } from "expo-router";

import _map from "lodash/map";

import { ThemedText } from "@/components/ThemedText";
import CountryFlag from "@/components/ui/CountryFlag";
import useHideTabBar from "@/hooks/useHideTabBar";
import { Colors, Theme } from "@/constants/Colors";

export default function Countries({
  list = [
    { isoCode: "SG", label: "India", name: "INDIA" },
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
  const navigateToESIMsByCountry = (country: any) => () => {
    router.push(`/country/${country}`);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity onPress={navigateToESIMsByCountry(item?.label)}>
      <View key={item?.isoCode || index} style={styles.country}>
        <CountryFlag style={styles.flag} isoCode={item?.isoCode} size={60} />
        <ThemedText style={styles.countryLabel}>{item?.label || ""}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.tabWrapper}>
        <ThemedText style={styles.tabTitle}>{"Popular Countries"}</ThemedText>
        <View style={styles.countriesWrapper}>
          <FlatList
            data={list}
            numColumns={2}
            renderItem={renderItem}
            columnWrapperStyle={styles.columnWrapperStyle}
          />
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
    width: "100%",
  },
  country: {
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
  columnWrapperStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
