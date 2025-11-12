import React, { useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

import { Colors } from "@/constants/Colors";
import { StoredPurchasedESIM } from "@/providers/kokioProvider";

import ESIMItem from "../ESIMItem";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH * 0.9;
const SPACING = 8;

const ActiveESIMsScroll = ({
  purchasedESIMs,
}: {
  purchasedESIMs: StoredPurchasedESIM[];
}) => {
  const handleESIMPress = useCallback((purchasedESIM: StoredPurchasedESIM) => {
    return () => {
      router.navigate({
        pathname: "/(tabs)/(shop)/installation",
        params: {
          orderId: _get(purchasedESIM, "transactionData.orderId", ""),
          qrcode: _get(
            purchasedESIM,
            "transactionData.installationDetails.qrcode",
            ""
          ),
          appleInstallationUrl: _get(
            purchasedESIM,
            "transactionData.installationDetails.appleInstallationUrl",
            ""
          ),
          iccid: _get(purchasedESIM, "transactionData.iccid", ""),
          fromHome: "true",
        },
      });
    };
  }, []);

  if (_isEmpty(purchasedESIMs)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>eSIMs</Text>
      <FlatList
        data={purchasedESIMs}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ESIMItem
              item={item?.eSimItem}
              showBuyButton={false}
              onPress={handleESIMPress(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item?.transactionData?.orderId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    color: Colors.dark.accentForeground,
    paddingLeft: 20,
  },
  listContainer: {
    paddingHorizontal: SPACING,
  },
  itemWrapper: {
    width: ITEM_WIDTH,
  },
});

export default ActiveESIMsScroll;
