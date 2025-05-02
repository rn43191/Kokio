import { ReactNode, createContext, useReducer } from "react";
import { Kokio } from "kokio-sdk";
import { TURNKEY_PARENT_ORG_ID } from "@/constants/passkey.constants";
import { returnViemWalletClient } from "@/utils/passkey";

import { useTurnkey } from "@turnkey/sdk-react-native";

type AuthActionType =
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_KOKIO"; payload: any }
  | { type: "CLEAR_KOKIO" };

interface KokioState {
  error: string;
  sdk: Kokio | null;
}

const initialState: KokioState = {
  error: "",
  sdk: null,
};

function authReducer(kokio: KokioState, action: AuthActionType): KokioState {
  switch (action.type) {
    case "ERROR":
      return { ...kokio, error: action.payload };
    case "CLEAR_ERROR":
      return { ...kokio, error: "" };
    case "SET_KOKIO":
      return { ...kokio, sdk: action.payload };
    case "CLEAR_KOKIO":
      return { ...kokio, sdk: null };
    default:
      return kokio;
  }
}

export interface KokioProviderType {
  kokio: KokioState;
  clearError: () => void;
  setupKokio: () => void;
  clearKokio: () => void;
}

export const KokioContext = createContext<KokioProviderType>({
  kokio: initialState,
  clearError: () => {},
  setupKokio: () => {},
  clearKokio: () => {},
});

interface KokioProviderProps {
  children: ReactNode;
}

export const KokioProvider: React.FC<KokioProviderProps> = ({ children }) => {
  const [kokio, dispatch] = useReducer(authReducer, initialState);
  const { user, client: turnkeyClient } = useTurnkey();

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setupKokio = async () => {
    // Check if user and turnkeyClient are defined before proceeding
    // Kokio SDK requires a Turnkey client to be initialized with a user

    if (!turnkeyClient) {
      dispatch({ type: "ERROR", payload: "Turnkey client not found" });
      return;
    }

    if (!user) {
      dispatch({ type: "ERROR", payload: "User not found" });
      return;
    }

    const viem = await returnViemWalletClient(user);

    const kokioSDK = new Kokio(
      viem.viemClient,
      turnkeyClient,
      TURNKEY_PARENT_ORG_ID,
      process.env.EXPO_PUBLIC_GAS_MANAGER_POLICY_ID ?? ""
    );

    if (!kokioSDK) {
      dispatch({ type: "ERROR", payload: "Kokio SDK not initialized" });
      return;
    }

    dispatch({ type: "SET_KOKIO", payload: kokioSDK });
  };
  const clearKokio = () => {
    dispatch({ type: "CLEAR_KOKIO" });
  };

  return (
    <KokioContext.Provider
      value={{
        kokio,
        clearError,
        setupKokio,
        clearKokio,
      }}
    >
      {children}
    </KokioContext.Provider>
  );
};
