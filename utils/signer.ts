import { RNAlchemySigner } from "@account-kit/react-native-signer";
import { alchemy, sepolia } from "@account-kit/infra";
import { createConfig } from "@account-kit/react-native";

const configParams = {
  chain: sepolia,
  transport: alchemy({
    apiKey: process.env.EXPO_PUBLIC_ALCHEMY_API_KEY!,
  }),
  signerConnection: {
    apiKey: process.env.EXPO_PUBLIC_ALCHEMY_API_KEY!,
  },
  sessionConfig: {
    expirationTimeMs: 1000 * 60 * 60 * 24, // <-- Adjust the session expiration time as needed (currently 24 hours)
  },
};

export const alchemyConfig = createConfig(configParams);

export const signer = RNAlchemySigner({
  client: {
    connection: { apiKey: process.env.EXPO_PUBLIC_ALCHEMY_API_KEY! },
  },
  // optional param to override session settings
  sessionConfig: {
    // sets the expiration to 60 minutes
    expirationTimeMs: 1000 * 60 * 60,
  },
});