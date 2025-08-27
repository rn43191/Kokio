import React, { useCallback, useState } from "react";
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
import * as Clipboard from "expo-clipboard";
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

  // TODO: From API
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

  const handleCopyQRData = async () => {
    try {
      await Clipboard.setStringAsync(qrData);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
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
        <ThemedText style={styles.sectionTitle}>Install eSIM</ThemedText>
        <Text style={styles.sectionDescription}>
          Scan the QR code by printing out or displaying the code on another
          device to install your eSIM.
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
            color="white"
            backgroundColor="#1a1a1a"
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
        <ThemedText style={styles.sectionTitle}>Manual Installation</ThemedText>
        <Text style={styles.sectionDescription}>
          Enter the details manually if you cannot scan the QR code.
        </Text>

        {/* Manual Installation Details */}
        <View style={styles.manualDetailsCard}>
          <Text style={styles.manualDetailsHeader}>
            SM-DP+ ADDRESS & ACTIVATION CODE
          </Text>
          <View style={styles.manualDetailsContent}>
            <View style={styles.manualDetailsTextContainer}>
              <Text style={styles.manualDetailsText}>{qrData}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyQRData}
            >
              <Ionicons name="copy-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.manualInstructionText}>
            Copy this information and enter details manually to install your
            eSIM. *Make sure your device has a stable internet connection before
            installing.
          </Text>
        </View>

        {/* Manual Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Steps: Go to Settings {">"} Network & internet and select the plus
            sign ("+") next to your SIM — if this is not available, select
            SIMs/Mobile network. Select Download a SIM instead? {">"} Next.
            Select Use a different network if you need to confirm your network.
            Select Need help? {">"} Enter it manually. Enter the SM-DP+ address
            and activation code for your new eSIM. Select Continue {">"}{" "}
            Download/Activate. Select Settings/Done when you see the Download
            Finished screen.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const DirectScene = () => (
    <ScrollView style={styles.content}>
      <View style={styles.installSection}>
        <ThemedText style={styles.sectionTitle}>Direct Installation</ThemedText>
        <Text style={styles.sectionDescription}>
          *Note that the eSIM installation process must not be interrupted and
          make sure your device has a stable internet connection before
          installing.
        </Text>

        <Text style={styles.instructionText}>
          Select Install eSIM and wait — do not close the app, installation may
          take a few minutes. Select Allow/OK, when prompted.
        </Text>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Install eSIM</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderScene = useCallback(({ route }: any) => {
    switch (route.key) {
      case "QR":
        return <QRScene />;
      case "Manual":
        return <ManualScene />;
      case "Direct":
        return <DirectScene />;
      default:
        return null;
    }
  }, []);

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
    marginVertical: 24,
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
  manualDetailsCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  manualDetailsHeader: {
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  manualDetailsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  manualDetailsTextContainer: {
    flex: 1,
  },
  manualDetailsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  copyButton: {
    padding: 8,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 16,
  },
  manualInstructionText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
  },
  manualWarningText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  installButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 24,
    alignItems: "center",
  },
  installButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default React.memo(EsimInstallation);
