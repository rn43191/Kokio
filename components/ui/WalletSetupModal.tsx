import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { useKokio } from "@/hooks/useKokio";
import { checkIfEmailInUse } from "@/utils/api";
import { useTurnkey } from "@turnkey/sdk-react-native";
import { isValidEmail } from "@/helpers/isValidEmail";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const modalRef = React.useRef<Modal>(null);

  const { signUpWithPasskey } = useAuthRelay();
  const { setupKokioUserPasskey, kokio } = useKokio();
  const { updateUser, session } = useTurnkey();
  const [email, setEmail] = useState(session?.user?.email || "");

  const handleContinue = useCallback(async () => {
    setIsLoading(true);

    const response = await signUpWithPasskey({ email });
    if (response?.authenticatorParams && response?.user) {
      // save kokio user data authenticator params
      setupKokioUserPasskey(response.user, {
        clientDataJson: response.authenticatorParams.attestation.clientDataJson,
        attestationObject:
          response.authenticatorParams.attestation.attestationObject,
        credentialId: response.authenticatorParams.attestation.credentialId,
        x:
          response.decodedAttestationObject?.decodedAttestationObjectCbor?.x ??
          "",
        y:
          response.decodedAttestationObject?.decodedAttestationObjectCbor?.y ??
          "",
      });
      setIsLoading(false);
      setShowRecovery(true);
    } else {
      setIsLoading(false);
      onClose();
    }

    setIsLoading(false);
    setShowRecovery(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsLoading(false);
    setShowRecovery(false);
    setEmail(session?.user?.email || "");
    onClose();
  }, [onClose, session]);

  const initialContent = useMemo(
    () => (
      <>
        <ThemedText bold style={styles.title}>
          eSIM Wallet
        </ThemedText>

        <Text style={styles.description}>
          Before you can fund your on-device eSIM wallet, it need to be setup.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.laterButton} onPress={handleClose}>
            <Text style={styles.laterButtonText}>Later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [handleClose, handleContinue]
  );

  const loadingContent = useMemo(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={90} color="#FF9500" />
        <Text style={styles.loadingText}>
          Please wait while your wallet is being deployed...
        </Text>
      </View>
    ),
    []
  );

  const handleRemindLater = useCallback(() => {
    setShowRecovery(false);
    setEmail("");
    onClose();
  }, [onClose]);

  const onChangeUserEmail = useCallback(async () => {
    const inUse = await checkIfEmailInUse({ email });
    if (inUse) {
      alert("Email already in use");
      return;
    }
    try {
      const response = await updateUser({ email });
      console.log("response", response);
      return response;
    } catch (e) {
      console.error("Error updating user email", e);
    }
  }, [email]);

  const handleDone = useCallback(() => {
    // if email is provided, save it for recovery purpose
    onChangeUserEmail();
    setShowRecovery(false);
    setEmail(session?.user?.email || "");
    onContinue();
  }, [onContinue]);

  const recoveryContent = useMemo(
    () => (
      <>
        <View style={styles.warningContainer}>
          <MaterialCommunityIcons
            name="comment-alert"
            size={32}
            color="#FF9500"
            style={styles.warningIconTopRight}
          />
          <Text style={styles.warningText}>
            If you no longer have your device, you'll need this email id to
            restore access to your eSIM wallet funds.
          </Text>
        </View>

        <View style={styles.recoveryCard}>
          <ThemedText bold style={styles.recoveryTitle}>
            Wallet Recovery
          </ThemedText>

          <Text style={styles.addressText}>
            Address: {kokio.userData?.wallets[0].accounts[0].address}
          </Text>

          <Text style={styles.recoveryDescription}>
            Please provide an email address for recovery purpose and to restore
            access to your eSIM wallet funds
          </Text>

          <TextInput
            style={styles.emailInput}
            placeholder="Email id"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.recoveryButtonContainer}>
          <TouchableOpacity
            style={styles.remindLaterButton}
            onPress={handleRemindLater}
          >
            <Text style={styles.remindLaterText}>Remind me later</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [email, handleRemindLater, handleDone]
  );

  const renderContent = () => {
    if (isLoading) return loadingContent;
    if (showRecovery) return recoveryContent;
    return initialContent;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
      navigationBarTranslucent
      ref={modalRef}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            style={[styles.contentContainerWrapper]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View
              style={[
                styles.contentContainer,
                showRecovery && styles.expandedContainer,
              ]}
            >
              {renderContent()}
            </View>
          </KeyboardAvoidingView>
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
    backgroundColor: "#242427",
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
    paddingHorizontal: 48,
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
  loadingContainer: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  loadingText: {
    color: "#AEAEB2",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "#242427",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  warningText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  warningIconTopRight: {
    position: "absolute",
    top: -12,
    right: 14,
    zIndex: 1,
  },
  recoveryCard: {
    backgroundColor: "#242427",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  recoveryTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 12,
  },
  addressText: {
    color: "#AEAEB2",
    fontSize: 14,
    marginBottom: 16,
  },
  recoveryDescription: {
    color: "#AEAEB2",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  emailInput: {
    backgroundColor: "#7676803D",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  recoveryButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  remindLaterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  remindLaterText: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "500",
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  expandedContainer: {
    paddingTop: 20,
    backgroundColor: "transparent",
  },
});

export default WalletSetupModal;
