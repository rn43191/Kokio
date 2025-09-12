import { ReactNode, createContext, useEffect, useReducer } from "react";
import { Kokio } from "kokio-sdk";
import { PASSKEY_CONFIG, TURNKEY_API_URL } from "@/constants/passkey.constants";
import { returnViemWalletClient } from "@/utils/passkey";

import { useTurnkey, User, Wallet } from "@turnkey/sdk-react-native";
import { TurnkeyClient } from "@turnkey/http";
import { SmartContractAccount } from "@aa-sdk/core";

import { PasskeyStamper } from "@turnkey/react-native-passkey-stamper";
import * as SecureStore from "expo-secure-store";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { useRouter } from "expo-router";

type AuthActionType =
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_KOKIO"; payload: any }
  | { type: "SET_DEVICE_UID"; payload: string }
  | { type: "SET_KOKIO_USER"; payload: UserData }
  | { type: "SET_KOKIO_PASSKEY"; payload: UserPasskey }
  | { type: "SET_USER_WALLET"; payload: SmartContractAccount }
  | { type: "CLEAR_KOKIO" }
  | { type: "CLEAR_KOKIO_USER" };

export interface UserPasskey {
  x: string;
  y: string;
  attestationObject: string;
  clientDataJson: string;
  credentialId: string;
}

interface UserData {
  userName: string;
  email: string;
  organizationId: string;
  id: string;
  wallets: Wallet[];
}
interface KokioState {
  error: string;
  sdk?: Kokio;
  deviceUID: string;
  userData?: UserData;
  userPasskey?: UserPasskey;
  userWallet?: SmartContractAccount;
}

const initialState: KokioState = {
  error: "",
  sdk: undefined,
  deviceUID: "",
  userData: undefined,
  userPasskey: undefined,
  userWallet: undefined,
};

function kokioReducer(kokio: KokioState, action: AuthActionType): KokioState {
  switch (action.type) {
    case "ERROR":
      return { ...kokio, error: action.payload };
    case "CLEAR_ERROR":
      return { ...kokio, error: "" };
    case "SET_KOKIO":
      return { ...kokio, sdk: action.payload };
    case "SET_DEVICE_UID":
      return { ...kokio, deviceUID: action.payload };
    case "SET_KOKIO_USER":
      return { ...kokio, userData: action.payload };
    case "SET_KOKIO_PASSKEY":
      return { ...kokio, userPasskey: action.payload };
    case "SET_USER_WALLET":
      return { ...kokio, userWallet: action.payload };
    case "CLEAR_KOKIO":
      return {
        ...kokio,
        sdk: undefined,
      };
    case "CLEAR_KOKIO_USER":
      return {
        ...kokio,
        deviceUID: "",
        userPasskey: undefined,
        userData: undefined,
        userWallet: undefined,
      };
    default:
      return kokio;
  }
}

export interface KokioProviderType {
  kokio: KokioState;
  clearError: () => void;
  setupKokio: () => void;
  setupKokioDeviceUID: (deviceUID: string) => Promise<void>;
  setupKokioUserData: (deviceUID: string, user: User) => Promise<void>;
  setupKokioUserPasskey: (
    deviceUID: string,
    passkey: UserPasskey
  ) => Promise<void>;
  setupKokioUserWallet: (
    deviceUID: string,
    wallet: SmartContractAccount
  ) => Promise<void>;
  clearKokio: () => void;
  clearKokioUser: () => Promise<void>;
}

export const KokioContext = createContext<KokioProviderType>({
  kokio: initialState,
  clearError: () => {},
  setupKokio: async () => Promise.resolve(),
  setupKokioDeviceUID: async () => Promise.resolve(),
  setupKokioUserData: async () => Promise.resolve(),
  setupKokioUserPasskey: async () => Promise.resolve(),
  setupKokioUserWallet: async () => Promise.resolve(),
  clearKokio: () => {},
  clearKokioUser: async () => Promise.resolve(),
});

interface KokioProviderProps {
  children: ReactNode;
}

export const KokioProvider: React.FC<KokioProviderProps> = ({ children }) => {
  const [kokio, dispatch] = useReducer(kokioReducer, initialState);
  const { user, clearSession } = useTurnkey();
  const { reauthenticate } = useAuthRelay();

  const saveValueForDeviceUID = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  const saveValueForUserData = async (key: string, value: UserData) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  const saveValueForUserPasskey = async (key: string, value: UserPasskey) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  const saveValueForUserWallet = async (
    key: string,
    value: SmartContractAccount
  ) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  const getValueForDeviceUID = async (key: string) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("🔐 Here's your device UIdD: 🔐 \n" + result);
      const parsedResult: string = JSON.parse(result);
      return parsedResult;
    } else {
      console.log("No device UID value stored under that key.");
    }
  };

  const getValueForUserData = async (key: string) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("🔐 Here's your user data: 🔐 \n" + result);
      const parsedResult: UserData = JSON.parse(result);
      return parsedResult;
    } else {
      console.log("No user data values stored under that key.");
    }
  };

  const getValueForUserPasskey = async (
    key: string
  ): Promise<UserPasskey | void> => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("🔐 Here's your passkey data: 🔐 \n" + result);
      const parsedResult: UserPasskey = JSON.parse(result);
      return parsedResult;
    } else {
      console.log("No passkey data values stored under that key.");
    }
  };

  const getValueForUserWallet = async (
    key: string
  ): Promise<SmartContractAccount | void> => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("🔐 Here's your wallet data 🔐 \n" + result);
      const parsedResult: SmartContractAccount = JSON.parse(result);
      return parsedResult;
    } else {
      console.log("No wallet data stored under that key.");
    }
  };

  const deleteValueForUser = async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  };

  // Check if user is already saved with data inside the expo secure store then disable the passkey creation
  // and use the existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      const deviceUID = await getValueForDeviceUID("deviceUID");

      if (deviceUID) {
        dispatch({
          type: "SET_DEVICE_UID",
          payload: deviceUID,
        });

        const userData = await getValueForUserData(`userData-${deviceUID}`);
        if (userData) {
          dispatch({
            type: "SET_KOKIO_USER",
            payload: {
              userName: userData.userName,
              email: userData.email,
              organizationId: userData.organizationId,
              id: userData.id,
              wallets: userData.wallets,
            },
          });
        }
        const userPasskey = await getValueForUserPasskey(
          `userPasskey-${deviceUID}`
        );
        if (userPasskey) {
          dispatch({
            type: "SET_KOKIO_PASSKEY",
            payload: {
              x: userPasskey.x,
              y: userPasskey.y,
              attestationObject: userPasskey.attestationObject,
              clientDataJson: userPasskey.clientDataJson,
              credentialId: userPasskey.credentialId,
            },
          });
        }
        const userWallet = await getValueForUserWallet(
          `userWallet-${deviceUID}`
        );
        if (userWallet) {
          dispatch({
            type: "SET_USER_WALLET",
            payload: userWallet,
          });
        }
      }
    };
    fetchUserData();
  }, []);

  // Check if user is already saved with data inside the expo secure store then disable the passkey creation
  // and use the existing user data
  useEffect(() => {
    if (!kokio.sdk && user && kokio.deviceUID && kokio.userPasskey) {
      // If user is found, setup Kokio SDK with current user data and user organizationId from Turnkey
      setupKokioUserData(kokio.deviceUID, user);
      setupKokio();
    }
    if (!user) {
      // If user is not found, clear Kokio SDK
      clearKokio();
      reauthenticate();
    }
  }, [user, kokio.deviceUID, kokio.userPasskey, kokio.sdk]);

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setupKokioDeviceUID = async (deviceUID: string) => {
    await saveValueForDeviceUID("deviceUID", deviceUID);

    console.log("Device UID saved to secure store:", deviceUID);

    dispatch({
      type: "SET_DEVICE_UID",
      payload: deviceUID,
    });
  };

  const setupKokioUserData = async (deviceUID: string, user: User) => {
    // Save user data to secure store
    await saveValueForUserData(`userData-${deviceUID}`, {
      id: user.id,
      organizationId: user.organizationId,
      userName: user.userName,
      email: user.email ?? "",
      wallets: user.wallets || [],
    });

    console.log("User data saved to secure store:", user);

    dispatch({
      type: "SET_KOKIO_USER",
      payload: {
        userName: user.userName,
        email: user.email ?? "",
        organizationId: user.organizationId,
        id: user.id,
        wallets: user.wallets || [],
      },
    });
  };

  const setupKokioUserPasskey = async (
    deviceUID: string,
    passkey: UserPasskey
  ) => {
    // Save user passkey to secure store
    await saveValueForUserPasskey(`userPasskey-${deviceUID}`, {
      x: passkey.x,
      y: passkey.y,
      attestationObject: passkey.attestationObject,
      clientDataJson: passkey.clientDataJson,
      credentialId: passkey.credentialId,
    });

    console.log("User passkey saved to secure store:", passkey);

    dispatch({
      type: "SET_KOKIO_PASSKEY",
      payload: {
        x: passkey.x,
        y: passkey.y,
        attestationObject: passkey.attestationObject,
        clientDataJson: passkey.clientDataJson,
        credentialId: passkey.credentialId,
      },
    });
  };

  const setupKokioUserWallet = async (
    deviceUID: string,
    wallet: SmartContractAccount
  ) => {
    // Save user passkey to secure store
    await saveValueForUserWallet(`userWallet-${deviceUID}`, wallet);

    console.log("User wallet saved to secure store:", wallet);

    dispatch({
      type: "SET_USER_WALLET",
      payload: wallet,
    });
  };

  const setupKokio = async () => {
    // Check if user and turnkeyClient are defined before proceeding
    // Kokio SDK requires a Turnkey client to be initialized with a user
    if (!user) {
      dispatch({ type: "ERROR", payload: "User not found" });
      return;
    }

    if (!kokio.userPasskey?.credentialId) {
      dispatch({ type: "ERROR", payload: "Credential Id not found" });
      return;
    }

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
      kokio.userWallet?.address ?? ""
    );

    const kokioSDK = new Kokio(
      viemClient,
      turnkeyClient,
      kokio.userPasskey?.credentialId,
      PASSKEY_CONFIG.RP_ID,
      process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? "",
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

  const clearKokioUser = async () => {
    // Clear user data from secure store
    dispatch({ type: "CLEAR_KOKIO_USER" });
    await deleteValueForUser(`userPasskey-${kokio.deviceUID}`);
    await deleteValueForUser(`userWallet-${kokio.deviceUID}`);
    await deleteValueForUser(`userData-${kokio.deviceUID}`);
    await deleteValueForUser("deviceUID");
    await clearKokio();
    await clearSession();
  };

  return (
    <KokioContext.Provider
      value={{
        kokio,
        clearError,
        setupKokio,
        setupKokioDeviceUID,
        setupKokioUserData,
        setupKokioUserPasskey,
        setupKokioUserWallet,
        clearKokio,
        clearKokioUser,
      }}
    >
      {children}
    </KokioContext.Provider>
  );
};
