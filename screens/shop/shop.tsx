import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import _get from "lodash/get";
import _debounce from "lodash/debounce";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";

import Countries from "./tabs/countries";
import Global from "./tabs/global";
import Regions from "./tabs/regions";
import SearchResult from "./searchResult";

const SCREEN_WIDTH = Dimensions.get("window").width - 36;

const ROUTES = [
  { key: "Countries", title: "Countries" },
  { key: "Regions", title: "Regions" },
  { key: "Global", title: "Global" },
];

const TabBarLabel = ({ route: tabRoute, focused }: any) => (
  <ThemedText
    style={[
      styles.tabBarText,
      !focused && styles.inactiveTab,
      focused && styles.highlightTabStyle,
    ]}
  >
    {_get(tabRoute, "title", "")}
  </ThemedText>
);

const renderScene = SceneMap({
  Countries: Countries,
  Regions: Regions,
  Global: Global,
});

const Shop = () => {
  const [index, setIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const debouncedOnSearch = _debounce(setSearchText, 500);

  return (
    <ThemedView style={styles.shopContainer}>
      <SearchInput onSearch={debouncedOnSearch} onClear={setSearchText} />
      <ThemedView style={styles.container}>
        {searchText ? (
          <SearchResult searchText={searchText} />
        ) : (
          // <TabView
          //   navigationState={{ index, routes: ROUTES }}
          //   renderScene={renderScene}
          //   onIndexChange={setIndex}
          //   renderTabBar={(args) => (
          //     <TabBar
          //       {...args}
          //       style={styles.tabBarStyle}
          //       renderLabel={TabBarLabel}
          //       indicatorStyle={styles.indicatorStyle}
          //       tabStyle={styles.tabStyle}
          //       contentContainerStyle={styles.tabBarContentContainer}
          //     />
          //   )}
          // />
          <Countries />
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 12 },
  tabBarStyle: {
    backgroundColor: Colors.dark.secondaryBackground,
    borderRadius: Theme.borderRadius.medium,
  },
  tabStyle: {
    padding: 0,
    minHeight: 30,
  },
  highlightTabStyle: {
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: "#5C5C61",
  },
  tabBarContentContainer: {
    justifyContent: "space-around",
  },
  inactiveTab: {
    color: Colors.dark.inactive,
  },
  tabBarText: {
    color: Colors.dark.text,
    textAlign: "center",
    paddingVertical: 2,
    width: SCREEN_WIDTH / ROUTES.length,
  },
  indicatorStyle: {
    display: "none",
  },
  shopContainer: {
    paddingRight: Theme.spacing.sm,
    paddingLeft: Theme.spacing.sm,
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});

export default React.memo(Shop);
