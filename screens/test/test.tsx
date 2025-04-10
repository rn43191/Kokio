import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTurnkey } from "@turnkey/sdk-react-native";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import {
  deleteSubOrganization,
  returnTurnkeyAlchemyLightAccountClient,
  stampGetWhoami,
} from "@/utils/passkey";
import { keccak256, toBytes } from "viem";
import { HashFunction, PayloadEncoding } from "@/utils/types";

const isValidEmail = (email: string | undefined) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function TestScreen() {
  const { signUpWithPasskey, loginWithPasskey, initEmailLogin } =
    useAuthRelay();
  const { user, session, clearSession, signRawPayload, exportWallet } =
    useTurnkey();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [smartAccountAddress, setSmartAccountAddress] = useState("");

  const signUpDisabled = email.length < 1 || username.length < 1;

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
    if (!isValidEmail(email)) return alert("Invalid email address");

    try {
      const response = await signUpWithPasskey({ username, email });
      console.log("response", response);
      return response;
    } catch (e) {
      console.error("Error signing up", e);
    }
  }, [email, username]);

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
                  styles.signInButton,
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
                <Text style={[styles.signInText]}>
                  Sign Up with Passkey & Email
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={onSignIn}>
            {({ pressed }) => (
              <View
                style={[
                  styles.signInButton,
                  {
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.signInText]}>Sign In with Passkey</Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={onSignInEmail}>
            {({ pressed }) => (
              <View
                style={[
                  styles.signInButton,
                  {
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.signInText]}>Sign In with Email</Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {session && (
        <Pressable
          style={styles.button}
          onPress={() => {
            clearSession();
            setSmartAccountAddress("");
          }}
        >
          <Text>Logout</Text>
        </Pressable>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          onPress={async () => {
            const data = await returnTurnkeyAlchemyLightAccountClient(user);
            setSmartAccountAddress(data.accountClient.account?.address!);
          }}
        >
          <Text>Get Account Address</Text>
        </Pressable>
      )}

      {session && user && (
        <Pressable
          style={styles.button}
          onPress={() => stampGetWhoami(user.organizationId)}
        >
          <Text>Get stamped Who Am I</Text>
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
          <Text>Sign message</Text>
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
          <Text>Export User Wallet</Text>
        </Pressable>
      )}

      {user && (
        <>
          <View style={styles.separator} />
          <Text style={styles.userText}>{user.userName}</Text>
          <Text style={styles.userText}>{user.email}</Text>
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
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginHorizontal: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: "5%",
  },
  resultText: {
    maxWidth: "80%",
  },
  buttonContainer: {
    padding: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 4,
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: "#fff",
    margin: 2,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
  },
  userText: {
    marginBottom: 10,
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

  signInButton: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
  },
  signInText: {
    color: "white",
    fontFamily: "SpaceMono",
  },
});
