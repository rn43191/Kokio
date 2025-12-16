import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import _head from "lodash/head";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";

import _get from "lodash/get";
import _split from "lodash/split";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Theme } from "@/constants/Colors";

type TabType = "Direct" | "QR" | "Manual";

const TextWithCopy = ({ label, text }) => {
  const handleCopyQRData = async () => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };
  return (
    <View style={styles.textCopyContainer}>
      <Text style={styles.manualDetailsHeader}>{label}</Text>
      <View style={styles.manualDetailsContent}>
        <View style={styles.manualDetailsTextContainer}>
          <Text style={styles.manualDetailsText}>{text}</Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyQRData}>
          <Ionicons name="copy-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EsimInstallation = () => {
  const { qrcode, appleInstallationUrl, iccid, orderId } =
    useLocalSearchParams();
  const qrData =
    (Array.isArray(qrcode) ? _head(qrcode) : qrcode) ||
    "LPA:1$activation.airalo.com$sample-qr-data";

  const qrDataSplit = _split(qrData, "$");
  const activationAddress = _get(qrDataSplit, [1]);
  const activationCode = _get(qrDataSplit, [2]);
  const [activeTab, setActiveTab] = useState<TabType>("QR");

  const QRScene = () => {
    const qrViewRef = useRef(null);

    const handleShareQR = async () => {
      try {
        if (!qrViewRef.current) {
          console.log("QR view ref is not available");
          return;
        }

        const uri = await captureRef(qrViewRef.current, {
          format: "png",
          quality: 0.8,
          result: "tmpfile",
          fileName: "Install-eSIM-QR-Code.png",
        });

        Share.open({
          url: `file://${uri}`,
          type: "image/png",
        }).catch((err) => {
          err && console.log("react-native-share API failed", err);
        });
      } catch (error) {
        console.error("QR Share failed with error", error);
      }
    };

    return (
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
          <ViewShot style={styles.qrContainer} ref={qrViewRef}>
            <QRCode
              value={qrData}
              size={200}
              color="white"
              backgroundColor="#1a1a1a"
            />
          </ViewShot>

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
  };

  const ManualScene = () => (
    <ScrollView style={styles.content}>
      <View style={styles.installSection}>
        <ThemedText style={styles.sectionTitle}>Manual Installation</ThemedText>
        <Text style={styles.sectionDescription}>
          Enter the details manually if you cannot scan the QR code.
        </Text>

        {/* Manual Installation Details */}
        <View style={styles.manualDetailsCard}>
          <TextWithCopy
            label="SM-DP+ ADDRESS & ACTIVATION CODE"
            text={qrData}
          />

          {Platform.OS === "ios" && activationAddress && (
            <TextWithCopy label="SM-DP+ ADDRESS" text={activationAddress} />
          )}
          {Platform.OS === "ios" && activationCode && (
            <TextWithCopy label="ACTIVATION CODE" text={activationCode} />
          )}

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
          <Text style={styles.shareButtonText}>Coming soon</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTabBar = () => {
    const tabs: TabType[] = ["Direct", "QR", "Manual"];

    return (
      <View style={styles.tabBarOuterContainer}>
        <View style={styles.tabBarContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              {activeTab === tab && <View style={styles.tabIndicator} />}
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === tab
                        ? Colors.dark.text
                        : Colors.dark.inactive,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Direct":
        return <DirectScene />;
      case "QR":
        return <QRScene />;
      case "Manual":
        return <ManualScene />;
      default:
        return <QRScene />;
    }
  };

  return (
    <View style={styles.container}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabBarOuterContainer: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  tabBarContainer: {
    backgroundColor: Colors.dark.secondaryBackground,
    borderRadius: Theme.borderRadius.medium,
    flexDirection: "row",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    minHeight: 30,
  },
  tabButtonText: {
    color: Colors.dark.text,
    textAlign: "center",
    fontWeight: "500",
    zIndex: 1,
  },
  tabIndicator: {
    position: "absolute",
    backgroundColor: Colors.dark.muted,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Theme.borderRadius.medium,
    zIndex: 0,
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
    padding: 20,
    backgroundColor: "#1a1a1a",
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
  textCopyContainer: {
    marginBottom: 12,
  },
});

export default React.memo(EsimInstallation);
