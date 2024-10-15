import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import ESIMItem, { Esim } from "../ESIMItem";

const ActiveESIMsScroll = ({ esims }: { esims: Esim[] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active eSIMs</Text>
      <FlatList
        data={esims}
        renderItem={({ item }) => <ESIMItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: "#AEAEB2",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 20, // Add padding to accommodate the flag
  },
  esimItemContainer: {
    marginHorizontal: 5,
    width: 330,
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
    marginBottom: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});

export default ActiveESIMsScroll;
