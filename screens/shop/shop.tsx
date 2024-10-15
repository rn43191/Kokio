import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";

import Countries from "./tabs/countries";
import Global from "./tabs/global";
import Regions from "./tabs/regions";

// Define the types for routes
type Route = {
  key: string;
  title: string;
};

export default function TabTwoScreen() {
  const renderScene = SceneMap({
    Countries: Countries,
    Regions: Regions,
    Global: Global,
  });

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<Route[]>([
    { key: "Countries", title: "Countries" },
    { key: "Regions", title: "Regions" },
    { key: "Global", title: "Global" },
  ]);

  const TabBarLabel = ({ route: tabRoute, focused }) => {
    const { title = "" } = tabRoute || {};
    return (
      <View style={focused ? styles.focusedTab : {}}>
        <ThemedText style={styles.tabBarText}>{title}</ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.shopContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(args) => (
            <TabBar
              {...args}
              style={styles.tabBarStyle}
              renderLabel={TabBarLabel}
              indicatorStyle={styles.indicatorStyle}
            />
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.dark.secondaryBackground,
    borderRadius: Theme.borderRadius.small,
  },
  focusedTab: {
    backgroundColor: Colors.dark.inactive,
  },
  tabBarText: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.secondaryBackground,
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
