import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Platform,
  Text,
  Dimensions,
} from "react-native";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import ToggleSwitch from "toggle-switch-react-native";
import _sum from "lodash/sum";

import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Colors";
import DetailItem from "@/components/ui/DetailItem";
import Checkbox from "@/components/ui/Checkbox";
import AmountInput from "@/components/amountInput";

import { createRadioButtons } from "./checkout.helpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const RADIO_WIDTH = SCREEN_WIDTH - 24;

const Checkout = ({ currentBalance = 25 }: any) => {
  const [isESimEnabled, setIsESimEnabled] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [fundOnDeviceWallet, setFundOnDeviceWallet] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | null>(0);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => createRadioButtons(selectedId, styles.buttonStyle),
    [selectedId]
  );

  const addAmountSection = useMemo(() => {
    return (
      <View>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: Theme.colors.foreground, marginRight: 4 }}
          >
            Add this amount to my eSIM wallet
          </ThemedText>
          <ThemedText style={{ color: Theme.colors.foreground }}>
            (1USD=1USDC)
          </ThemedText>
        </View>
        <AmountInput value={amount} onChangeValue={setAmount} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <ThemedText style={{ color: Theme.colors.foreground }}>
            Current Balance
          </ThemedText>
          <ThemedText>25.00 USDC</ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText style={{ color: Theme.colors.foreground }}>
            Balance after
          </ThemedText>
          <ThemedText>{_sum([amount, 25]).toFixed(2)} USDC</ThemedText>
        </View>
      </View>
    );
  }, [amount, setAmount]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ marginTop: 16 }}>
          <ThemedText type="defaultSemiBold">eSIM & Network</ThemedText>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Checkbox onChange={setIsESimEnabled} checked={isESimEnabled} />
            <Text style={{ color: Theme.colors.foreground, marginLeft: 8 }}>
              I confirm my device is eSIM compatible and network-enabled.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <ThemedText type="defaultSemiBold">Payment Method</ThemedText>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={styles.containerStyle}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <ThemedText type="defaultSemiBold">Fund Device Wallet</ThemedText>
          <Text style={{ color: Theme.colors.foreground, marginTop: 12 }}>
            Speed up and secure your next eSIM purchase or top-up by funding
            your on-device eSIM crypto wallet.
          </Text>
          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <ToggleSwitch
              isOn={fundOnDeviceWallet}
              onToggle={setFundOnDeviceWallet}
              onColor="#30D158"
              offColor={Theme.colors.muted}
              size="small"
            />
            <ThemedText style={{ marginLeft: 8 }}>
              I'd like to also fund my on-device wallet
            </ThemedText>
          </View>
          {fundOnDeviceWallet && addAmountSection}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            pressed && styles.checkoutButtonPressed,
          ]}
          onPress={() => console.log("TODO: Checkout pressed")}
        >
          <DetailItem prefix="Total " value={6.5} suffix="USD" />
        </Pressable>
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  bottomButtonContainer: {
    backgroundColor: "#191919",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
  },
  checkoutButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 32,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonPressed: {
    opacity: 0.9,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoImage: {
    width: 24,
    height: 24,
    objectFit: "contain",
  },
  containerStyle: {
    flex: 1,
    alignItems: "flex-start",
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: RADIO_WIDTH,
    backgroundColor: "#7676803D",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 0,
    marginVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
});
