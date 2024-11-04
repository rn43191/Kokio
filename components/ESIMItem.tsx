import React, { useCallback } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CountryFlag from "react-native-country-flag";
import _get from "lodash/get";

import { Colors, Theme } from "@/constants/Colors";
import DetailItem from "./ui/DetailItem";

export interface Esim {
  id: string;
  country: string;
  isoCode: string;
  duration: number;
  data: number;
  minutes: number;
  sms: number;
  flagColor: string;
}

const ESIMItem = ({
  item,
  showBuyButton,
  containerStyle = {},
}: {
  item: Esim;
  showBuyButton: Boolean;
  containerStyle?: Object;
}) => {
  const handleBuyCTAClick = useCallback(
    (id: String) => () => {
      router.navigate(`/checkout/${id}`);
    },
    []
  );

  return (
    <View style={[styles.esimItemContainer, containerStyle]}>
      <View style={styles.flagContainer}>
        {/* <View style={[styles.flag, { backgroundColor: item.flagColor }]} /> */}
        <CountryFlag style={styles.flag} isoCode={item.isoCode} size={25} />
      </View>
      <View style={styles.esimItem}>
        <Text style={styles.country}>{item.country}</Text>
        <View style={styles.detailsContainer}>
          <DetailItem
            iconName="calendar-outline"
            value={item.duration}
            suffix="Days"
          />
          <DetailItem
            iconName="cellular-outline"
            value={item.data}
            suffix="GB"
          />
          <DetailItem
            iconName="call-outline"
            value={item.minutes}
            suffix="Mins"
          />
          <DetailItem
            iconName="chatbox-outline"
            value={item.sms}
            suffix="SMS"
          />
        </View>
        {showBuyButton && (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyCTAClick(item.id)}
          >
            <DetailItem prefix="$" value={_get(item, "price", 0)} />
            <View style={styles.buyButtonText}>
              <Ionicons name="cart-outline" size={20} />
              <Text style={styles.details}>Buy</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  esimItemContainer: {
    marginTop: Theme.spacing.lg,
  },
  horizontalPadding: {
    paddingHorizontal: 8,
  },
  esimItem: {
    backgroundColor: "#FFD700",
    borderRadius: 21,
    padding: 16,
    gap: 8,
    width: "100%",
  },
  flagContainer: {
    position: "absolute",
    top: -20,
    right: 40,
    zIndex: 10,
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  country: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    fontSize: 14,
    fontWeight: "800",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  buyButton: {
    backgroundColor: Colors.dark.goldenYellow,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.large,
    marginTop: Theme.spacing.sm,
  },
  buyButtonText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: Theme.spacing.md,
  },
});

export default ESIMItem;
