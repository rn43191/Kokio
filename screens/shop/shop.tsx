import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import _debounce from "lodash/debounce";

import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";

import Countries from "./tabs/countries";
import Global from "./tabs/global";
import Regions from "./tabs/regions";
import SearchResult from "./searchResult";

const Tab = createMaterialTopTabNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.indicatorStyle,
        tabBarItemStyle: styles.tabStyle,
        tabBarContentContainerStyle: styles.tabBarContentContainer,
        tabBarLabelStyle: styles.tabBarText,
        tabBarActiveTintColor: Colors.dark.text,
        tabBarInactiveTintColor: Colors.dark.inactive,
        tabBarPressColor: "#5C5C61",
      }}
    >
      <Tab.Screen
        name="Countries"
        component={Countries}
        options={{ tabBarLabel: "Countries" }}
      />
      <Tab.Screen
        name="Regions"
        component={Regions}
        options={{ tabBarLabel: "Regions" }}
      />
      <Tab.Screen
        name="Global"
        component={Global}
        options={{ tabBarLabel: "Global" }}
      />
    </Tab.Navigator>
  );
};

const Shop = () => {
  const [searchText, setSearchText] = useState<string>("");

  const debouncedOnSearch = _debounce(setSearchText, 500);

  return (
    <ThemedView style={styles.shopContainer}>
      <SearchInput onSearch={debouncedOnSearch} onClear={setSearchText} />
      <ThemedView style={styles.container}>
        {searchText ? (
          <SearchResult searchText={searchText} />
        ) : (
          <TabsNavigator />
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
  tabBarContentContainer: {
    justifyContent: "space-around",
  },
  tabBarText: {
    color: Colors.dark.text,
    textAlign: "center",
    paddingVertical: 2,
    fontSize: 14,
    fontWeight: "500",
  },
  indicatorStyle: {
    backgroundColor: Colors.dark.muted,
    height: "100%",
    borderRadius: Theme.borderRadius.medium,
  },
  shopContainer: {
    paddingRight: Theme.spacing.sm,
    paddingLeft: Theme.spacing.sm,
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});

export default React.memo(Shop);
