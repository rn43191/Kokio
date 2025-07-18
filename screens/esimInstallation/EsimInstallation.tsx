import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TabView, TabBar } from "react-native-tab-view";

import { ThemedText } from "@/components/ThemedText";
import { Theme, Colors } from "@/constants/Colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ROUTES = [
  { key: "Direct", title: "Direct" },
  { key: "QR", title: "QR" },
  { key: "Manual", title: "Manual" },
];

const EsimInstallation = () => {
  const [index, setIndex] = useState(1);

  const qrData =
    "LPA:1$activation.airalo.com$LPA:1$activation.airalo.com$sample-qr-data";

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: qrData,
        title: "eSIM QR Code",
      });
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const TabBarLabel = ({ route, focused }: any) => (
    <Text
      style={[
        styles.tabBarText,
        !focused && styles.inactiveTab,
        focused && styles.highlightTabStyle,
      ]}
    >
      {route.title}
    </Text>
  );

  const QRScene = () => (
    <ScrollView style={styles.content}>
      {/* Warning Cards */}
      <View style={styles.warningCard}>
        <MaterialCommunityIcons
          name="comment-alert"
          size={32}
          color="#FF9500"
          style={styles.warningIconTopRight}
        />
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>
            Most eSIMs can only be installed once.
          </Text>
          <Text style={styles.warningDescription}>
            If you remove the eSIM from your device, you cannot install it
            again.
          </Text>
        </View>
      </View>

      <View style={styles.warningCard}>
        <MaterialCommunityIcons
          name="comment-alert"
          size={32}
          color="#FF9500"
          style={styles.warningIconTopRight}
        />
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>
            Make sure your device has a stable internet connection before
            installing
          </Text>
        </View>
      </View>

      {/* Install eSIM Section */}
      <View style={styles.installSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Install eSIM
        </ThemedText>
        <Text style={styles.sectionDescription}>
          Scan the QR code by printing out or displaying the code on another
          device to install your eSIM.
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
          <Text style={styles.shareButtonText}>Share QR code</Text>
          <Ionicons name="share-outline" size={20} color="white" />
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            {
              "1. Go to Settings > Cellular/Mobile Data > Add eSIM or Set up Cellular/Mobile Service > Use QR Code on your device."
            }
          </Text>
          <Text style={styles.instructionText}>
            {" 2. Scan the QR code or take a screenshot."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const ManualScene = () => (
    <ScrollView style={styles.content}>
      <View style={styles.installSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Manual Installation
        </ThemedText>
        <Text style={styles.sectionDescription}>
          Enter the details manually if you cannot scan the QR code.
        </Text>
        {/* Add manual installation content here */}
      </View>
    </ScrollView>
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "QR":
        return <QRScene />;
      case "Manual":
        return <ManualScene />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes: ROUTES }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBarStyle}
            renderLabel={TabBarLabel}
            indicatorStyle={styles.indicatorStyle}
            tabStyle={styles.tabStyle}
            contentContainerStyle={styles.tabBarContentContainer}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  warningCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    position: "relative",
    marginBottom: 16,
    marginTop: 16,
  },
  warningIconTopRight: {
    position: "absolute",
    top: -12,
    right: 14,
    zIndex: 1,
  },
  warningText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  warningContent: {
    flex: 1,
    paddingRight: 32,
  },
  warningTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  warningDescription: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
  },
  installSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionDescription: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 8,
  },
  instructionsContainer: {
    gap: 12,
  },
  instructionText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
  },
  downloadButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
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
});

export default React.memo(EsimInstallation);
