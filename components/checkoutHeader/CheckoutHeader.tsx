import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import CountryFlag from "react-native-country-flag";
import _get from "lodash/get";

import { Theme } from "@/constants/Colors";

import DetailItem from "../ui/DetailItem";
import { MOCK_DETAIL_ITEMS, MOCK_ESIM_DATA } from "./__mocks__/data"; // TODO: Remove Mock

const HEADER_MIN_HEIGHT = 140;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MAX_ALLOWED_HEIGHT = SCREEN_HEIGHT * 0.6;

const DIVIDER_WIDTH = Dimensions.get("window").width - 32;

const ExpandableContent = () => (
  <View style={{ gap: 12 }}>
    {MOCK_DETAIL_ITEMS.map((item, index) => (
      <View key={index} style={[!item.isFlexColumn && styles.expandedItem]}>
        <DetailItem
          iconType={item.iconType}
          iconName={item.iconName}
          value={item.value}
          highlight={false}
        />
        <DetailItem
          value={item.data}
          containerStyles={item.dataContainerStyles}
        />
      </View>
    ))}
  </View>
);

const CheckoutHeader = ({ details = MOCK_ESIM_DATA }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(HEADER_MIN_HEIGHT)).current;

  const navigation = useNavigation();

  const headerMaxHeight = Math.min(
    contentHeight + HEADER_MIN_HEIGHT + 16,
    MAX_ALLOWED_HEIGHT
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (_, { dy }) => {
          if (Math.abs(dy) > 20) {
            const expand = dy > 0 && !isExpanded;
            const collapse = dy < 0 && isExpanded;
            if (expand) {
              setIsExpanded(true);
              Animated.spring(animation, {
                toValue: headerMaxHeight,
                useNativeDriver: false,
              }).start();
            } else if (collapse) {
              setIsExpanded(false);
              Animated.spring(animation, {
                toValue: HEADER_MIN_HEIGHT,
                useNativeDriver: false,
              }).start();
            } else {
              Animated.spring(animation, {
                toValue: isExpanded ? headerMaxHeight : HEADER_MIN_HEIGHT,
                useNativeDriver: false,
              }).start();
            }
          }
        },
      }),
    [headerMaxHeight, isExpanded]
  );

  const onContentLayout = (event: any) =>
    setContentHeight(_get(event, "nativeEvent.layout.height"));

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
  };

  const countryAndFlagWithGoBack = useMemo(
    () => (
      <View style={styles.countryFlagContainer}>
        <View style={styles.mainContent}>
          <Ionicons
            name="chevron-back-outline"
            size={36}
            color={Theme.colors.background}
            style={{ marginRight: Theme.spacing.sm }}
            onPress={handleBack}
          />
          <Text style={styles.countryText}>{_get(details, "country")}</Text>
        </View>
        <CountryFlag
          style={styles.flag}
          isoCode={_get(details, "isoCode")}
          size={48}
        />
      </View>
    ),
    [handleBack, details]
  );

  const detailItems = useMemo(
    () => (
      <View style={styles.detailItemsContainer}>
        <DetailItem
          iconName="calendar-outline"
          value={_get(details, "duration")}
          suffix="Days"
        />
        <DetailItem
          iconName="cellular-outline"
          value={_get(details, "data")}
          suffix="GB"
        />
        <DetailItem
          iconName="call-outline"
          value={_get(details, "minutes")}
          suffix="Mins"
        />
        <DetailItem
          iconName="chatbox-outline"
          value={_get(details, "sms")}
          suffix="SMS"
        />
      </View>
    ),
    [details]
  );

  return (
    <Animated.View
      style={[styles.header, { height: animation }]}
      {...panResponder.panHandlers}
    >
      <View style={{ marginBottom: 18 }}>
        {countryAndFlagWithGoBack}
        {detailItems}
      </View>

      <Animated.View
        style={[
          styles.expandIndicator,
          {
            height: animation.interpolate({
              inputRange: [HEADER_MIN_HEIGHT, headerMaxHeight],
              outputRange: [4, 1],
            }),
            width: animation.interpolate({
              inputRange: [HEADER_MIN_HEIGHT, headerMaxHeight],
              outputRange: [40, DIVIDER_WIDTH],
            }),
          },
        ]}
      />

      <Animated.View
        style={[
          {
            opacity: animation.interpolate({
              inputRange: [HEADER_MIN_HEIGHT, headerMaxHeight],
              outputRange: [0, 1],
            }),
          },
        ]}
        pointerEvents="none"
      >
        <View onLayout={onContentLayout}>
          <ExpandableContent />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Theme.colors.card,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
  },
  countryFlagContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryText: {
    fontSize: 32,
    fontWeight: "700",
  },
  flag: {
    borderRadius: 6,
  },
  detailItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  expandedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandIndicator: {
    backgroundColor: "#3C3C43",
    opacity: 0.2,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default React.memo(CheckoutHeader);
