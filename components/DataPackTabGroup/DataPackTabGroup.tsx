import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";

import ESIMItem, { Esim } from "../ESIMItem";

const TAB_KEYS = {
  DATA: "DATA",
  DATA_CALLS_SMS: "DATA_CALLS_SMS",
};

// Define the types for routes
type Route = {
  key: string;
  title: string;
};

const ESIMsFlatList = ({ esims }: { esims: Esim[] }) => {
  return (
    <FlatList
      data={esims}
      renderItem={({ item }) => <ESIMItem item={item} showBuyButton />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

export default function DataPackTabGroup({ esims }) {
  const renderScene = SceneMap({
    [TAB_KEYS.DATA]: () => <ESIMsFlatList esims={esims} />,
    [TAB_KEYS.DATA_CALLS_SMS]: () => <ESIMsFlatList esims={esims} />,
  });

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<Route[]>([
    { key: TAB_KEYS.DATA, title: "Data" },
    { key: TAB_KEYS.DATA_CALLS_SMS, title: "Data+Calls+SMS" },
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
    <ThemedView style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: Theme.spacing.sm,
  },
  flatListContainer: {
    paddingTop: Theme.spacing.xs,
    display: "flex",
    flexDirection: "column",
    gap: Theme.spacing.sm,
  },
});
