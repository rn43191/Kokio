import React from "react";
import { StyleSheet, FlatList, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import _get from "lodash/get";
import _map from "lodash/map";
import _chunk from "lodash/chunk";
import _filter from "lodash/filter";
import _lowerCase from "lodash/lowerCase";
import _includes from "lodash/includes";
import _trim from "lodash/trim";
import _reduce from "lodash/reduce";
import _size from "lodash/size";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";
import CountryFlag from "@/components/ui/CountryFlag";
import { useThemeColor } from "@/hooks/useThemeColor";
import { REGION_CONFIG, COUNTRY_CONFIG } from "@/constants/general.constants";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH * 0.8;
const SPACING = 8;

const isSearchTextMatch = ({ searchText, item, keyExtractor }) =>
  _includes(_lowerCase(_get(item, keyExtractor)), searchText);

const CountryItemRender = ({ item }) => {
  const firstItem = _get(item, "0", {});
  const secondItem = _get(item, "1", {});
  return (
    <View style={styles.countryItem}>
      <View style={styles.flagWrapper}>
        <CountryFlag
          isoCode={firstItem?.isoCode}
          style={styles.flag}
          size={76}
        />
        <ThemedText>{firstItem?.label}</ThemedText>
      </View>
      <View style={styles.flagWrapper}>
        <CountryFlag
          isoCode={secondItem?.isoCode}
          style={styles.flag}
          size={76}
        />
        <ThemedText>{secondItem?.label}</ThemedText>
      </View>
    </View>
  );
};

const RegionEmptyListComponent = () => (
  <ThemedText
    style={[
      styles.regionItem,
      {
        textAlign: "center",
      },
    ]}
  >
    No regions found
  </ThemedText>
);

const RegionItemRender = ({
  item,
}: {
  item: { label?: string; isoCode: string };
}) => (
  <ThemedView
    style={styles.regionItem}
    darkColor={Colors.dark.secondaryBackground}
  >
    <ThemedView
      darkColor={Colors.dark.secondaryBackground}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons
        name="globe-outline"
        size={16}
        color={useThemeColor({}, "foreground")}
        style={{ marginRight: 16 }}
      />
      <ThemedText>{item?.label}</ThemedText>
    </ThemedView>
    <Ionicons
      name="chevron-forward"
      size={16}
      color={useThemeColor({}, "foreground")}
    />
  </ThemedView>
);

const SearchResult = ({ searchText }: { searchText: string }) => {
  const sanitizedSearchText = _lowerCase(_trim(searchText));
  const countries = _reduce(
    COUNTRY_CONFIG,
    (acc, item) => {
      if (
        isSearchTextMatch({
          searchText: sanitizedSearchText,
          item,
          keyExtractor: "label",
        })
      ) {
        acc.push(item);
      }
      return acc;
    },
    []
  );

  const regions = _reduce(
    REGION_CONFIG,
    (acc, item) => {
      if (
        isSearchTextMatch({
          searchText: sanitizedSearchText,
          item,
          keyExtractor: "label",
        })
      ) {
        acc.push(item);
      }
      return acc;
    },
    []
  );

  return (
    <ThemedView style={styles.container}>
      {_size(countries) ? (
        <ThemedView style={styles.countrySectionWrapper}>
          <FlatList
            data={_chunk(countries, 2)}
            renderItem={CountryItemRender}
            keyExtractor={(item) => item?.isoCode}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.countryListContainer}
            snapToInterval={160 + SPACING}
            decelerationRate="fast"
            ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
          />
        </ThemedView>
      ) : null}
      <ThemedView style={styles.regionSectionWrapper}>
        <ThemedText style={styles.regionTitle}> Regions</ThemedText>
        <ThemedView style={styles.regionListContainer}>
          <FlatList
            data={regions}
            renderItem={RegionItemRender}
            keyExtractor={(item) => item?.isoCode}
            ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
            ListEmptyComponent={RegionEmptyListComponent}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: Theme.spacing.sm,
    paddingLeft: Theme.spacing.sm,
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  countrySectionWrapper: { marginTop: 12, marginHorizontal: 24 },
  regionSectionWrapper: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 24,
    marginBottom: 12,
    overflow: "hidden",
  },
  regionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.dark.secondaryBackground,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  flag: {
    borderRadius: Theme.borderRadius.large,
  },
  countryListContainer: {
    paddingHorizontal: SPACING,
    marginTop: 12,
  },
  regionTitle: {
    marginBottom: 12,
    color: useThemeColor({}, "foreground"),
  },
  regionListContainer: {
    backgroundColor: Colors.dark.secondaryBackground,
    borderWidth: 1,
    borderRadius: 16,
    marginLeft: 20,
    overflow: "scroll",
  },
  countryItem: {
    width: ITEM_WIDTH,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemSeperator: { height: SPACING },
  flagWrapper: {
    alignItems: "center",
    gap: 8,
  },
});

export default SearchResult;
