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

const MOCK_COUNTRIES_LIST = [
  { isoCode: "IN", label: "India", name: "INDIA" },
  { isoCode: "SG", label: "Singapore", name: "SINGAPORE" },
  { isoCode: "GB", label: "United Kingdom", name: "UNITED KINGDOM" },
  { isoCode: "YE", label: "Yemen", name: "YEMEN" },
  { isoCode: "CR", label: "Costa Rica", name: "COSTA RICA" },
  { isoCode: "US", label: "United States", name: "UNITED STATES" },
  { isoCode: "AU", label: "Australia", name: "AUSTRALIA" },
  { isoCode: "JP", label: "Japan", name: "JAPAN" },
  { isoCode: "FR", label: "France", name: "FRANCE" },
  { isoCode: "BR", label: "Brazil", name: "BRAZIL" },
  { isoCode: "CA", label: "Canada", name: "CANADA" },
  { isoCode: "ZA", label: "South Africa", name: "SOUTH AFRICA" },
  { isoCode: "CN", label: "China", name: "CHINA" },
  { isoCode: "DE", label: "Germany", name: "GERMANY" },
  { isoCode: "RU", label: "Russia", name: "RUSSIA" },
  { isoCode: "MX", label: "Mexico", name: "MEXICO" },
];

export default function Countries({ list = MOCK_COUNTRIES_LIST }) {
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
