import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTurnkey } from "@turnkey/sdk-react-native";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import {
  checkIfEmailInUse,
  deleteSubOrganization,
  viemClientTestFunction,
  stampGetWhoami,
} from "@/utils/passkey";
import { keccak256, toBytes, toHex, Address } from "viem";
import { HashFunction, PayloadEncoding } from "@/utils/types";
import { uncompressRawPublicKey } from "@turnkey/crypto";
import { hexToArrayBuffer } from "@/helpers/converters";
import { useKokio } from "@/hooks/useKokio";
import { P256Key } from "kokio-sdk/types";

const isValidEmail = (email: string | undefined) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function TestScreen() {
  const { signUpWithPasskey, loginWithPasskey, initEmailLogin } =
    useAuthRelay();
  const {
    user,
    session,
    clearSession,
    signRawPayload,
    exportWallet,
    updateUser,
  } = useTurnkey();

  const { kokio, setupKokio } = useKokio();

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [data, setData] = useState<{
    x: string;
    y: string;
  } | null>(null);

  const signUpDisabled = username.length < 1;

  const onSignIn = useCallback(async () => {
    try {
      const response = await loginWithPasskey();
      return response;
    } catch (e) {
      console.error("Error signing in", e);
    }
  }, [email, username]);

  const onSignInEmail = useCallback(async () => {
    try {
      if (!isValidEmail(email) || email.length < 1)
        return alert("Invalid email address");
      const response = await initEmailLogin(email);
      return response;
    } catch (e) {
      console.error("Error signing in", e);
    }
  }, [email, username]);

  const onSignUp = useCallback(async () => {
    if (signUpDisabled) return alert("Please fill in all fields");
    if (email.length > 0 && !isValidEmail(email))
      return alert("Invalid email address");
    try {
      const response = await signUpWithPasskey({ username, email });
      console.log("response", response);
      return response;
    } catch (e) {
      console.error("Error signing up", e);
    }
  }, [email, username]);

  const onChangeUserEmail = useCallback(async () => {
    if (!isValidEmail(email)) return alert("Invalid email address");
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
  }, [email, username]);

  useEffect(() => {
    if (session) {
      const publicKey = session ? session.publicKey : "0x";
      const bufferPublicKey = hexToArrayBuffer(publicKey);
      const publicKeyBytes = new Uint8Array(bufferPublicKey);
      const decompressed = session
        ? uncompressRawPublicKey(publicKeyBytes)
        : "";

      // Remove the 0x04 prefix
      const xBytes = decompressed.slice(1, 33);
      const yBytes = decompressed.slice(33, 65);

      const xHex = toHex(xBytes);
      const yHex = toHex(yBytes);
      setData({
        x: xHex,
        y: yHex,
      });
    }
  }, [session]);

  const returnSmartAccountAddress = useCallback(async () => {
    // # Viktor Kokio
    // #(NOBRIDGE) LOG  Credentials id: 7qQ3mS7LgV_chnQAASzfpg
    // #(NOBRIDGE) LOG  {"attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViUk2E-QIol2_wJ0zsX_cMNQ-S2H1mi_ziPKN1OBzugWPtdAAAAAOqbjWZNAR0hPOS2tIy1ddQAEO6kN5kuy4Ff3IZ0AAEs36alAQIDJiABIVggFNzHK4hc-8UXQFchDqoT_yGRNciOZyjEyg3BdkbGbpsiWCApELwxH5-3Rp2Gx2SF2Gyx4lCpwHJcWvHetMxV-4r3Bw", "clientDataJson": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiZjQ3MjczMjA1ZWQ5NjA0Zjc1MmZmZjNiODExOTk1YjE0MjQ4Y2U4OWMzYjI3YmQ2MDI5YTU4OTI0M2M3ZGVjZiIsIm9yaWdpbiI6ImFuZHJvaWQ6YXBrLWtleS1oYXNoOlNEeFJVSFE1WVd0LWR1ZWdEU3pHZlFfR1dFX0FGMUVWeW5tLWtzVE5HR1UiLCJhbmRyb2lkUGFja2FnZU5hbWUiOiJhcHAua29raW8ifQ"}
    // #(NOBRIDGE) LOG  Public Key X from attestationObject: 0x14dcc72b885cfbc5174057210eaa13ff219135c88e6728c4ca0dc17646c66e9b
    // #(NOBRIDGE) LOG  Public Key Y from attestationObject: 0x2910bc311f9fb7469d86c76485d86cb1e250a9c0725c5af1deb4cc55fb8af707

    /* Sample input params to deterministically Kokio’s
     ** device calculate the device wallet address without
     ** actually deploying it.
     */
    const deviceUniqueIdentifier = "Device_App";
    const deviceWalletOwnerKey: P256Key = [
      "0x14dcc72b885cfbc5174057210eaa13ff219135c88e6728c4ca0dc17646c66e9b",
      "0x2910bc311f9fb7469d86c76485d86cb1e250a9c0725c5af1deb4cc55fb8af707",
    ];
    const salt = 25042025n; // BigInt
    const sender = "0xFf5EA36C69189b8e21d6bb0Ff847f4FdAd429890" as Address; // Turnkey address

    // Calculates device wallet address without deploying
    const deviceWallet = await kokio.sdk!.smartAccount.getSmartWallet(
      deviceUniqueIdentifier,
      deviceWalletOwnerKey,
      salt,
      sender
    );

    /* Returns the smart account client, inline with
     ** Alchemy’s SDK
     */
    const deviceWalletClient =
      await kokio.sdk!.smartAccount.getSmartWalletClient(
        deviceWallet // Returned by getSmartWallet fn
      );
    console.log("device wallet client", deviceWalletClient.account?.address);

    try {
      const uo = await deviceWalletClient.sendUserOperation({
        uo: {
          target: deviceWalletClient.account.address,
          data: "0x",
          value: 0n,
        },
      });
      console.log("uo", uo);
    } catch (e) {
      console.log("error", e);
    }
  }, [kokio]);

  useEffect(() => {
    if (!kokio.sdk && user) {
      setupKokio();
    }
    if (kokio.sdk && user) {
      const viemWalletAddressFromKokioSdk =
        kokio.sdk?.viemWalletClient.account?.address;
      console.log("kokio viem wallet address", viemWalletAddressFromKokioSdk);
    }
  }, [kokio, user]);

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        backgroundColor: "#fccefe",
        paddingBottom: insets.bottom,
        flex: 1,
      }}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.title}>Testing Passkeys and Smart Accounts</Text>
      {!user && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={(val) => setUsername(val)}
            placeholder="John Doe"
          />
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(val) => setEmail(val.toLowerCase())}
            placeholder="john@doe.com"
          />
          <Pressable onPress={onSignUp}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  {
                    opacity: pressed || signUpDisabled ? 0.5 : 1,
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.buttonText]}>
                  Sign Up with Passkey & OPTIONAL EMAIL
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={onSignIn}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  {
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.buttonText]}>Sign In with Passkey</Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={onSignInEmail}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  {
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.buttonText]}>Sign In with Email</Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {user && session && (
        <>
          <Text style={styles.userText}>{user.userName}</Text>
          <Text style={styles.userText}>{user.email}</Text>

          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(val) => setEmail(val.toLowerCase())}
            placeholder={user.email !== "" ? user.email : "john@doe.com"}
          />

          <Pressable
            onPress={onChangeUserEmail}
            style={[styles.button, { opacity: !isValidEmail(email) ? 0.5 : 1 }]}
            disabled={!isValidEmail(email)}
          >
            <Text style={[styles.buttonText]}>
              {user.email !== "" ? "Change" : "Set"} Email Address
            </Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => {
              clearSession();
              setSmartAccountAddress("");
            }}
          >
            <Text style={[styles.buttonText]}>Logout</Text>
          </Pressable>

          <View style={styles.separator} />

          <View>
            <Text style={styles.userText}>SubOrgId: {user.organizationId}</Text>
            <Text style={styles.userText}>
              Turnkey User Wallet Id: {user?.wallets[0].id}
            </Text>
            <Text style={styles.userText}>
              Turnkey User Wallet Address: {user.wallets[0].accounts[0].address}
            </Text>
            {smartAccountAddress && (
              <Text style={styles.userText}>
                Smart Account Address: {smartAccountAddress}
              </Text>
            )}
            {data && (
              <Text style={styles.userText}>
                {`\n`}
                Session public key X: {data.x}
                {`\n`}
                Session public key Y: {data.y}
              </Text>
            )}
          </View>
        </>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          // onPress={async () => {
          //   const data = await viemClientTestFunction(user);
          //   setSmartAccountAddress(data.accountClient.account?.address!);
          // }}
          onPress={() => {
            returnSmartAccountAddress();
          }}
        >
          <Text style={[styles.buttonText]}>Get Account Address</Text>
        </Pressable>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          onPress={() => stampGetWhoami(user.organizationId)}
        >
          <Text style={[styles.buttonText]}>Get stamped Who Am I</Text>
        </Pressable>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          onPress={async () => {
            try {
              const hashedMessage = keccak256(toBytes("Hello World"));

              const response = await signRawPayload({
                signWith: user.wallets[0].accounts[0].address as string,
                payload: hashedMessage,
                encoding: PayloadEncoding.Hexadecimal,
                hashFunction: HashFunction.NoOp,
              });
              console.log("response of raw signed message", response);
            } catch (error) {
              alert("Error signing message.");
              console.error("Error signing message:", error);
            }
          }}
        >
          <Text style={[styles.buttonText]}>Sign message</Text>
        </Pressable>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          onPress={async () => {
            try {
              const mnem = await exportWallet({
                walletId: session?.user?.wallets[0].id!,
              });
              console.log(mnem);
            } catch (error) {
              console.error("Error exporting wallet:", error);
            }
          }}
        >
          <Text style={[styles.buttonText]}>Export User Wallet</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: "5%",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
  },
  userText: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: "SpaceMono",
  },
  textInputContainer: {
    marginTop: 10,
    width: "100%",
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "rgba(0,0,0,0.095)",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.025)",
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    padding: 8,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
  },
  buttonText: {
    color: "white",
    fontFamily: "SpaceMono",
  },
});
