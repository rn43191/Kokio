import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";

import _map from "lodash/map";

import { ThemedText } from "@/components/ThemedText";
import CountryFlag from "@/components/ui/CountryFlag";
import { Colors, Theme } from "@/constants/Colors";
import appBootstrap from "@/utils/appBootstrap";
import { navigateToESIMsByCountry } from "@/utils/general";

export default function Countries() {
  const list = appBootstrap.getCountries;

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={navigateToESIMsByCountry(item?.code)}
      style={{
        flex: 1,
      }}
    >
      <View key={item?.code || index} style={styles.country}>
        <CountryFlag
          style={styles.flag}
          isoCode={item?.code}
          flagUrl={item?.flag}
          size={80}
        />
        <ThemedText style={styles.countryLabel}>{item?.name || ""}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabWrapper}>
      <ThemedText style={styles.tabTitle}>{"Popular Destinations"}</ThemedText>
      <View style={styles.countriesWrapper}>
        <FlatList
          data={list}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.columnWrapperStyle}
          keyExtractor={(item, index) => item?.code || index}
        />
      </View>
    </View>
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
    paddingTop: 12,
  },
  countriesWrapper: {
    width: "90%",
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
    paddingTop: Theme.spacing.sm,
  },
  flag: {
    borderRadius: Theme.borderRadius.medium + Theme.borderRadius.medium,
  },
  columnWrapperStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
