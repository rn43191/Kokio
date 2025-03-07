import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Application from "expo-application";
import {
  Passkey as passkey,
  PasskeyCreateRequest,
  PasskeyGetRequest,
} from "react-native-passkey";
import React from "react";
import { PublicKeyCredentialUserEntityJSON } from "@simplewebauthn/typescript-types";
import { toHex } from "viem";
import cbor from "cbor";
import {
  parseAuthenticatorData,
  ParsedAuthenticatorData,
} from "@/helpers/parseAuthenticatorData";
import {
  base64UrlToString,
  bufferToBase64URLString,
  getRandomChallenge,
  utf8StringToBuffer,
} from "@/helpers/passkeyUtils";
import { PASSKEY_CONFIG } from "@/constants/passkey.constants";

const now = new Date();
const humanReadableDateTime = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}@${now.getHours()}h${now.getMinutes()}min`;
console.log(
  "creating passkey with the following datetime: ",
  humanReadableDateTime
);
const rp = {
  id: PASSKEY_CONFIG.RP_ID,
  name: PASSKEY_CONFIG.RP_NAME,
} satisfies PublicKeyCredentialRpEntity;
const challenge = getRandomChallenge();
const user = {
  id: Buffer.from(String(Date.now())).toString("base64"),
  // We insert a human-readable date time for ease of use
  name: `Key @ ${humanReadableDateTime}`,
  displayName: `Key @ ${humanReadableDateTime}`,
} satisfies PublicKeyCredentialUserEntityJSON;

const authenticatorSelection = {
  userVerification: "required",
  residentKey: "required",
} satisfies AuthenticatorSelectionCriteria;

export default function TestScreen() {
  const insets = useSafeAreaInsets();

  const [result, setResult] = React.useState<any>();
  const [pubKeyData, setPubKeyData] = React.useState<{
    x: string;
    y: string;
  }>();
  const [creationResponse, setCreationResponse] = React.useState<
    NonNullable<Awaited<ReturnType<typeof passkey.create>>>["response"] | null
  >(null);
  const [credentialId, setCredentialId] = React.useState("");

  const createPasskey = async () => {
    try {
      const json = await passkey.create({
        challenge,
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        rp,
        user,
        authenticatorSelection,
        ...(Platform.OS !== "android" && {
          extensions: { largeBlob: { support: "required" } },
        }),
      } as PasskeyCreateRequest);

      console.log("creation json -", json);

      if (json?.rawId) setCredentialId(json.rawId);
      if (json?.response) setCreationResponse(json.response);

      // // https://github.com/passkeys-4337/smart-wallet/blob/main/front/src/libs/web-authn/service/web-authn.ts#L97
      let cred = json as unknown as {
        rawId: ArrayBuffer;
        response: {
          clientDataJSON: ArrayBuffer;
          attestationObject: string;
        };
      };
      // // decode attestation object and get public key
      const decodedAttestationObj: { authData: Uint8Array } = cbor.decode(
        cred.response.attestationObject
      );

      const authData: ParsedAuthenticatorData = parseAuthenticatorData(
        decodedAttestationObj.authData
      );
      const publicKey: { [-2]: string; [-3]: string } = cbor.decode(
        authData.credentialPublicKey!
      );
      const x = toHex(publicKey[-2]);
      const y = toHex(publicKey[-3]);
      const rawId = toHex(new Uint8Array(cred.rawId));
      console.log("x", x, "y", y, "rawId", rawId);
      setPubKeyData({ x, y });
      setResult(json);
    } catch (e) {
      console.error("create error", e);
    }
  };

  const authenticatePasskey = async () => {
    const json = await passkey.get({
      rpId: rp.id as string,
      challenge,
      ...(credentialId && {
        allowCredentials: [{ id: credentialId, type: "public-key" }],
      }),
    });

    console.log("authentication json -", json);

    setResult(json);
  };

  const writeBlob = async () => {
    console.log("user credential id -", credentialId);
    if (!credentialId) {
      alert(
        "No user credential id found - large blob requires a selected credential"
      );
      return;
    }

    const json = await passkey.get({
      rpId: rp.id as string,
      challenge,
      extensions: {
        largeBlob: {
          write: bufferToBase64URLString(
            utf8StringToBuffer("Hey its a private key!")
          ),
        },
      },
      ...(credentialId && {
        allowCredentials: [{ id: credentialId, type: "public-key" }],
      }),
    } as PasskeyGetRequest);

    console.log("add blob json -", json);

    const written = json?.clientExtensionResults?.largeBlob?.written;
    if (written) Alert.alert("This blob was written to the passkey");

    setResult(json);
  };

  const readBlob = async () => {
    const json = await passkey.get({
      rpId: rp.id as string,
      challenge,
      extensions: { largeBlob: { read: true } },
      ...(credentialId && {
        allowCredentials: [{ id: credentialId, type: "public-key" }],
      }),
    } as PasskeyGetRequest);

    console.log("read blob json -", json);

    const blob = json?.clientExtensionResults?.largeBlob?.blob;
    if (blob)
      Alert.alert("This passkey has blob", base64UrlToString(blob as any));

    setResult(json);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          paddingTop: insets.top,
          backgroundColor: "#fccefe",
          paddingBottom: insets.bottom,
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.title}>Testing Passkeys</Text>
        <Text>Application ID: {Application.applicationId}</Text>
        <Text>
          Passkeys are {passkey.isSupported() ? "Supported" : "Not Supported"}
        </Text>
        {credentialId && <Text>User Credential ID: {credentialId}</Text>}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={createPasskey}>
            <Text>Create</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={authenticatePasskey}>
            <Text>Authenticate</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={writeBlob}>
            <Text>Add Blob</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={readBlob}>
            <Text>Read Blob</Text>
          </Pressable>
          {creationResponse && (
            <Pressable
              style={styles.button}
              onPress={() => {
                Alert.alert("Public Key", JSON.stringify(creationResponse));
              }}
            >
              <Text>Get PublicKey</Text>
            </Pressable>
          )}
        </View>
        {result && (
          <Text style={styles.resultText}>
            Result {JSON.stringify(result, null, 2)}
          </Text>
        )}
        {pubKeyData && (
          <Text style={styles.resultText}>
            X: {pubKeyData.x}
            Y: {pubKeyData.y}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
