import { PASSKEY_CONFIG, TURNKEY_API_URL } from "@/constants/passkey.constants";
import { PasskeyStamper } from "@turnkey/react-native-passkey-stamper";
import { returnViemWalletClient } from "./passkey";
import { TurnkeyClient, User } from "@turnkey/sdk-react-native";
import { UserPasskey } from "@/providers/kokioProvider";
import { SmartContractAccount } from "@aa-sdk/core";
import { Kokio } from "kokio-sdk";

export const initializeKokioSDK = async (user: User, userPasskey: UserPasskey, walletAddress: string) => {
  const stamper = new PasskeyStamper({
    rpId: PASSKEY_CONFIG.RP_ID,
  });

  const turnkeyClient = new TurnkeyClient(
    { baseUrl: TURNKEY_API_URL },
    stamper
  );

  const viemClient = await returnViemWalletClient(
    user,
    turnkeyClient,
    walletAddress
  );

  if (!userPasskey.credentialId) {
    console.error("Error credentialId", userPasskey.credentialId);
    return;
  }

  const kokioSDK = new Kokio(
    viemClient,
    turnkeyClient,
    userPasskey.credentialId,
    PASSKEY_CONFIG.RP_ID,
    process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? "",
    process.env.EXPO_PUBLIC_PIMLICO_API_KEY ?? "",
    process.env.EXPO_PUBLIC_GAS_MANAGER_POLICY_ID ?? ""
  );

  return kokioSDK;
};
