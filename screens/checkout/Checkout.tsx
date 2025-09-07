import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import ToggleSwitch from "toggle-switch-react-native";
import _sum from "lodash/sum";

import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Colors";
import DetailItem from "@/components/ui/DetailItem";
import Checkbox from "@/components/ui/Checkbox";
import AmountInput from "@/components/amountInput";
import { Esim } from "@/components/ESIMItem";
import { getEsimOrderPayload } from "@/helpers/esimOrder";
// import { eSimOderCheckout } from "@/services/esims";
import CheckoutSuccessModal from "@/components/ui/CheckoutSuccessModal";
import WalletSetupModal from "@/components/ui/WalletSetupModal";
import CreditCardModal from "@/components/CreditCardModal";

import { createRadioButtons } from "./checkout.helpers";
import { RADIO_KEYS } from "@/constants/checkout.constants";
import { useKokio } from "@/hooks/useKokio";
import { useTurnkey } from "@turnkey/sdk-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const RADIO_WIDTH = SCREEN_WIDTH - 24;

const Checkout = ({ currentBalance = 25 }: any) => {
  const { item: eSimDetails } = useLocalSearchParams();

  const eSimItem: Esim = React.useMemo(() => {
    if (typeof eSimDetails === "string") {
      try {
        return JSON.parse(eSimDetails);
      } catch (error) {
        return null;
      }
    }
    return eSimDetails;
  }, [eSimDetails]);

  const [isESimEnabled, setIsESimEnabled] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >();
  const [fundOnDeviceWallet, setFundOnDeviceWallet] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | null>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWalletSetupModal, setShowWalletSetupModal] = useState(false);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const { kokio } = useKokio();
  const { session } = useTurnkey();

  const radioButtons: RadioButtonProps[] = useMemo(
    () => createRadioButtons(selectedPaymentMethod, styles.buttonStyle),
    [selectedPaymentMethod]
  );

  const addAmountSection = useMemo(() => {
    return (
      <View>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <ThemedText
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
          <ThemedText>{`${(currentBalance || 0).toFixed(2)}  USDC`}</ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText style={{ color: Theme.colors.foreground }}>
            Balance after
          </ThemedText>
          <ThemedText>
            {_sum([amount, currentBalance]).toFixed(2)} USDC
          </ThemedText>
        </View>
      </View>
    );
  }, [amount, setAmount]);

  const handleCheckout = useCallback(async () => {
    // If credit card is selected, open the credit card modal instead of proceeding with checkout
    if (selectedPaymentMethod === RADIO_KEYS.CREDIT_CARD) {
      setShowCreditCardModal(true);
      return;
    }

    try {
      const payload = getEsimOrderPayload({ eSimItem });
      // TODO: Uncomment on API integrate
      // const response = await eSimOderCheckout(payload);

      setShowSuccessModal(true);
      // TODO: Persist API response for navigating to QA Screen
    } catch (err) {
      setShowSuccessModal(true); // TODO: false on API integrate
    }
  }, [eSimItem, selectedPaymentMethod]);

  const handleInstallESIM = useCallback(() => {
    setShowSuccessModal(false);
    router.navigate({
      pathname: "/(tabs)/(shop)/installation",
      params: {},
    });
  }, []);

  const handleWalletModalClose = useCallback(() => {
    setShowWalletSetupModal(false);
  }, []);

  const handlePaymentMethodChange = useCallback((value: string) => {
    if (value === RADIO_KEYS.E_SIM_WALLET) {
      if (kokio.userData && session) {
        setSelectedPaymentMethod(value);
      } else {
        setShowWalletSetupModal(true);
      }
    } else {
      setSelectedPaymentMethod(value);
    }
  }, []);

  const handleCreditModalClose = useCallback(() => {
    setShowCreditCardModal(false);
  }, []);

  const handleCreditCardSubmit = useCallback(
    (cardData: {
      cardName: string;
      nameOnCard: string;
      cardNumber: string;
      expiration: string;
      cvv: string;
      saveCard: boolean;
    }) => {
      // TODO: Handle credit card submission
      console.log("Credit card data:", cardData);
      setShowCreditCardModal(false);

      // Now proceed with the actual checkout process
      try {
        const payload = getEsimOrderPayload({ eSimItem });
        // TODO: Uncomment on API integrate
        // const response = await eSimOderCheckout(payload);

        setShowSuccessModal(true);
        // TODO: Persist API response for navigating to QA Screen
      } catch (err) {
        setShowSuccessModal(true); // TODO: false on API integrate
      }
    },
    [eSimItem]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ marginTop: 16 }}>
          <ThemedText>eSIM & Network</ThemedText>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Checkbox onChange={setIsESimEnabled} checked={isESimEnabled} />
            <Text style={{ color: Theme.colors.foreground, marginLeft: 8 }}>
              I confirm my device is eSIM compatible and network-enabled.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <ThemedText>Payment Method</ThemedText>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={handlePaymentMethodChange}
              selectedId={selectedPaymentMethod}
              containerStyle={styles.containerStyle}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <ThemedText>Fund Device Wallet</ThemedText>
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

      <TouchableOpacity
        style={[
          styles.bottomButtonContainer,
          (!isESimEnabled || !selectedPaymentMethod) && { opacity: 0.5 },
        ]}
        onPress={
          isESimEnabled && selectedPaymentMethod ? handleCheckout : undefined
        }
        disabled={!isESimEnabled || !selectedPaymentMethod}
      >
        <DetailItem
          prefix="Total "
          value={eSimItem.actualSellingPrice}
          suffix="USD"
          containerStyles={styles.checkoutButton}
        />
      </TouchableOpacity>

      <CheckoutSuccessModal
        visible={showSuccessModal}
        onInstallESIM={handleInstallESIM}
      />

      <WalletSetupModal
        visible={showWalletSetupModal}
        onClose={handleWalletModalClose}
        onContinue={() => {
          // TODO: Loader for Wallet
          handleWalletModalClose();
          setSelectedPaymentMethod(RADIO_KEYS.E_SIM_WALLET);
        }}
      />

      <CreditCardModal
        visible={showCreditCardModal}
        onClose={handleCreditModalClose}
        onSubmit={handleCreditCardSubmit}
      />
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
  walletModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  walletModalContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
  },
  walletModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  walletModalDescription: {
    fontSize: 16,
    color: "#AEAEB2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  walletModalButtons: {
    flexDirection: "row",
    gap: 1,
  },
  laterButton: {
    flex: 1,
    backgroundColor: "#48484A",
    paddingVertical: 16,
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  laterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
