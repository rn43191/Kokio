import React from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";

interface WalletSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const WalletSetupModal: React.FC<WalletSetupModalProps> = ({
  visible,
  onClose,
  onContinue,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainerWrapper}>
            <View style={styles.contentContainer}>
              <ThemedText bold style={styles.title}>
                eSIM Wallet
              </ThemedText>

              <Text style={styles.description}>
                Before you can fund your on-device eSIM wallet, it need to be
                setup.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.laterButton} onPress={onClose}>
                  <Text style={styles.laterButtonText}>Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={onContinue}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 0,
  },
  modalContainer: {
    backgroundColor: "rgba(60, 60, 60, 0.9)",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  contentContainerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    width: "80%",
    backgroundColor: "rgba(36, 36, 39,1)",
    borderRadius: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#AEAEB2",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#48484A",
    marginTop: 28,
  },
  laterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#48484A",
  },
  laterButtonText: {
    color: "#AEAEB2",
    fontSize: 16,
    fontWeight: "400",
  },
  continueButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WalletSetupModal;
