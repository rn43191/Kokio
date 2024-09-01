import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface Esim {
  id: string;
  country: string;
  duration: number;
  data: number;
  minutes: number;
  sms: number;
  flagColor: string;
}

const ActiveESIMItem = ({ item }: { item: Esim }) => (
  <>
    <View style={styles.esimItem}>
      <View style={styles.flagContainer}>
        {/* Replace with actual flag component or image */}
        <View style={[styles.flag, { backgroundColor: item.flagColor }]} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.country}>{item.country}</Text>
        <Text style={styles.details}>{item.duration} Days</Text>
        <Text style={styles.details}>{item.data}GB</Text>
        <Text style={styles.details}>{item.minutes} Mins</Text>
        <Text style={styles.details}>{item.sms} SMS</Text>
      </View>
    </View>
  </>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  esimItem: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    width: 320,
  },
  flagContainer: {
    marginBottom: 10,
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  country: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ActiveESIMsScroll;
