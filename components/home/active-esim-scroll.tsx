import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Theme } from "@/constants/Colors";
import CountryFlag from "react-native-country-flag";

interface Esim {
  id: string;
  country: string;
  isoCode: string;
  duration: number;
  data: number;
  minutes: number;
  sms: number;
  flagColor: string;
}

const ActiveESIMItem = ({ item }: { item: Esim }) => (
  <View style={styles.esimItemContainer}>
    <View style={styles.flagContainer}>
      {/* <View style={[styles.flag, { backgroundColor: item.flagColor }]} /> */}
      <CountryFlag style={styles.flag} isoCode={item.isoCode} size={25} />
    </View>
    <View style={styles.esimItem}>
      <Text style={styles.country}>{item.country}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={20} />
          <Text style={styles.details}>{item.duration} Days</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cellular-outline" size={20} />
          <Text style={styles.details}>{item.data}GB</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={20} />
          <Text style={styles.details}>{item.minutes} Mins</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="chatbox-outline" size={20} />
          <Text style={styles.details}>{item.sms} SMS</Text>
        </View>
      </View>
    </View>
  </View>
);

const ActiveESIMsScroll = ({ esims }: { esims: Esim[] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active eSIMs</Text>
      <FlatList
        data={esims}
        renderItem={({ item }) => <ActiveESIMItem item={item} />}
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
