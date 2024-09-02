import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { LinearGradient } from "expo-linear-gradient";

// TODO: Update Gradient colors to match the design

const Wallet = () => {
  return (
    <LinearGradient
      colors={["#000", "#202020", "#404040"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>eSIM Wallet</ThemedText>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
      </ThemedView>
      <ThemedView style={styles.balanceContainer}>
        <ThemedText style={styles.balanceLabel}>Total balance</ThemedText>
        <View style={styles.balanceAmountContainer}>
          <ThemedText
            style={styles.balanceAmount}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            768
          </ThemedText>
          <ThemedText style={styles.balanceCurrency}>USDC</ThemedText>
        </View>
      </ThemedView>
      <ThemedText style={styles.address}>0xJdk..123</ThemedText>
    </LinearGradient>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 24,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 23.4,
    elevation: 10,
    width: "100%", // Ensure the container takes full width
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  logo: {
    // Add appropriate size for your logo
    width: 32,
    height: 32,
  },
  balanceContainer: {
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmountContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  balanceAmount: {
    fontSize: 45,
    fontWeight: "bold",
    flexShrink: 1, // Allow text to shrink if needed
    lineHeight: 44,
  },
  balanceCurrency: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  address: {
    alignSelf: "flex-end",
    fontSize: 12,
    fontWeight: "600",
  },
});
