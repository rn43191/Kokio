import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Colors";

interface CheckoutSuccessModalProps {
  visible: boolean;
  onClose?: () => void;
  onInstallESIM: () => void;
}

const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  visible,
  onClose = () => {},
  onInstallESIM,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 200 }),
        withRepeat(
          withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(1, { duration: 800 })
          ),
          -1,
          true
        )
      );
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainerWrapper}>
            <View style={styles.contentContainer}>
              <Animated.View style={[styles.successIcon, animatedIconStyle]}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={42}
                  color="#30D158"
                />
              </Animated.View>

              <ThemedText bold style={styles.title}>
                Transaction Successful
              </ThemedText>

              <ThemedText style={styles.subtitle}>
                It's now time to install your newly purchased eSIM.
              </ThemedText>

              <ThemedText style={styles.description}>
                If you are not abroad yet, no worries, the eSIM will only
                activate once connected to your destination network
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.installButton}
            onPress={onInstallESIM}
          >
            <ThemedText style={styles.installButtonText}>
              Install eSIM
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "rgba(60, 60, 60, 0.9)",
    paddingHorizontal: 16,
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
    backgroundColor: "#7878805C",
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
  },
  successIcon: {
    borderRadius: 24,
    position: "absolute",
    top: -22,
    right: 30,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  installButton: {
    backgroundColor: Theme.colors.highlight,
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    marginBottom: 16,
  },
  installButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CheckoutSuccessModal;
