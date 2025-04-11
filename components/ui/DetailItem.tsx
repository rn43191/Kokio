import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import _get from "lodash/get";

const ICON_TYPE_VS_RENDERER = {
  ION: Ionicons,
  MCI: MaterialCommunityIcons,
};

const DetailItem = ({
  iconType,
  iconName,
  prefix,
  value,
  suffix,
  highlight = true,
  containerStyles,
}: any) => {
  const IconRenderer =
    _get(ICON_TYPE_VS_RENDERER, iconType) || ICON_TYPE_VS_RENDERER.ION;

  return (
    <View style={[styles.detailItem, containerStyles]}>
      {iconName && <IconRenderer name={iconName} size={20} />}
      {prefix && <Text>{prefix}</Text>}
      <Text style={[styles.details, highlight && { fontWeight: "800" }]}>
        {value || ""}
      </Text>
      {suffix && <Text>{suffix}</Text>}
    </View>
  );
};

export default DetailItem;

const styles = StyleSheet.create({
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  details: {
    fontSize: 14,
  },
});
