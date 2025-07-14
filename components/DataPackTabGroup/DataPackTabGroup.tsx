import React, { useMemo, useState } from "react";
import { StyleSheet, FlatList, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

import _get from "lodash/get";
import _groupBy from "lodash/groupBy";
import _isEmpty from "lodash/isEmpty";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, Theme } from "@/constants/Colors";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import EsimItemSkeleton from "@/components/EsimItemSkeleton";

import ESIMItem, { Esim } from "../ESIMItem";

const SCREEN_WIDTH = Dimensions.get("window").width - 28;

const TAB_KEYS = {
  DATA: "DATA",
  DATA_CALLS_SMS: "DATA_CALLS_SMS",
};

const ROUTES = [
  { key: TAB_KEYS.DATA, title: "Data" },
  { key: TAB_KEYS.DATA_CALLS_SMS, title: "Data+Calls+SMS" },
];

const EmptyListComponent = () => (
  <ThemedText
    style={[
      {
        textAlign: "center",
        verticalAlign: "middle",
        flex: 1,
        paddingTop: 42,
      },
    ]}
  >
    No Plans found
  </ThemedText>
);

const ESIMsFlatList = React.memo(
  ({ esims, isLoading }: { esims: Esim[]; isLoading: boolean }) => {
    return isLoading ? (
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item }) => (
          <EsimItemSkeleton containerStyle={styles.eSimItemContainer} />
        )}
        keyExtractor={(_, index) => index}
        contentContainerStyle={styles.flatListContainer}
      />
    ) : (
      <FlatList
        data={esims}
        renderItem={({ item }) => (
          <ESIMItem
            item={item}
            showBuyButton
            containerStyle={styles.eSimItemContainer}
          />
        )}
        keyExtractor={(item, index) => item.catalogueId || index}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={EmptyListComponent}
      />
    );
  }
);

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

function DataPackTabGroup({
  esims,
  containerStyle,
  isLoading,
}: {
  esims: Esim[];
  containerStyle?: any;
  isLoading?: any;
}) {
  const [index, setIndex] = useState<number>(0);

  const { eSimsByData, eSimsByDataCallsSMS } = useMemo(() => {
    const eSimsGroupedByPlanType = _groupBy(esims, "planType");
    const eSimsByData = _get(eSimsGroupedByPlanType, TAB_KEYS.DATA);
    const eSimsByDataCallsSMS = _get(
      eSimsGroupedByPlanType,
      TAB_KEYS.DATA_CALLS_SMS
    );
    return { eSimsByData, eSimsByDataCallsSMS };
  }, [esims]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case TAB_KEYS.DATA:
        return <ESIMsFlatList esims={eSimsByData} isLoading={isLoading} />;
      case TAB_KEYS.DATA_CALLS_SMS:
        return (
          <ESIMsFlatList esims={eSimsByDataCallsSMS} isLoading={isLoading} />
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {_isEmpty(eSimsByData) || _isEmpty(eSimsByDataCallsSMS) ? (
        <ESIMsFlatList
          esims={eSimsByData || eSimsByDataCallsSMS}
          isLoading={isLoading}
        />
      ) : (
        <TabView
          navigationState={{ index, routes: ROUTES }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(args) => (
            <TabBar
              {...args}
              style={styles.tabBarStyle}
              renderLabel={TabBarLabel}
              indicatorStyle={styles.indicatorStyle}
              tabStyle={styles.tabStyle}
              contentContainerStyle={styles.tabBarContentContainer}
            />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabBarContentContainer: {
    justifyContent: "space-around",
  },
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
  inactiveTab: {
    color: Colors.dark.inactive,
  },
  tabBarText: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.secondaryBackground,
    textAlign: "center",
    paddingVertical: 2,
    width: SCREEN_WIDTH / ROUTES.length,
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
  eSimItemContainer: {
    paddingHorizontal: 8,
  },
});

export default React.memo(DataPackTabGroup);
