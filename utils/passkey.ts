import { Passkey, PasskeyCreateResult } from "react-native-passkey";
import { getRandomChallenge } from "../helpers/passkeyUtils";
import { BrokenPasskeyCreateResult, TPasskeyRegistrationConfig } from "./types";
import { PASSKEY_CONFIG } from "@/constants/passkey.constants";

/**
 * Creates a testing passkey and returns authenticator params
 * @param config - passkey user registration config
 * @returns authenticator params
 * @throws error if passkey creation fails
 */
export async function onTestingPasskeyCreate() {
  if (!Passkey.isSupported()) {
    alert("Passkeys are not supported on this device");
  }

  try {
    const now = new Date();
    const humanReadableDateTime = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}@${now.getHours()}h${now.getMinutes()}min`;
    console.log(
      "creating passkey with the following datetime: ",
      humanReadableDateTime
    );

    // ID isn't visible by users, but needs to be random enough and valid base64 (for Android)
    const userId = Buffer.from(String(Date.now())).toString("base64");

    const authenticatorParams = await createPasskey({
      authenticatorName: "End-User Passkey",
      rp: {
        id: PASSKEY_CONFIG.RP_ID,
        name: PASSKEY_CONFIG.RP_NAME,
      },
      user: {
        id: userId,
        // We insert a human-readable date time for ease of use
        name: `Key @ ${humanReadableDateTime}`,
        displayName: `Key @ ${humanReadableDateTime}`,
      },
      authenticatorSelection: {
        requireResidentKey: true,
        residentKey: "required",
        userVerification: "preferred",
      },
    });
    console.log("passkey registration succeeded: ", authenticatorParams);
    return authenticatorParams;
  } catch (e) {
    console.error("error during passkey creation", e);
  }
}

/**
 * Creates a passkey and returns authenticator params
 * @param config - passkey registration config
 * @param options - options for creating passkey
 * @returns authenticator params
 * @throws error if passkey creation fails
 */
export async function createPasskey(
  config: TPasskeyRegistrationConfig,
  options?: {
    withSecurityKey: boolean;
    withPlatformKey: boolean;
  }
) {
  const challenge = config.challenge || getRandomChallenge();

  let createFn = options?.withPlatformKey
    ? Passkey.createPlatformKey
    : options?.withSecurityKey
    ? Passkey.createSecurityKey
    : Passkey.create;

  let registrationResult = await createFn({
    challenge: challenge,
    rp: config.rp || {
      id: PASSKEY_CONFIG.RP_ID,
      name: PASSKEY_CONFIG.RP_NAME,
    },
    user: config.user,
    authenticatorSelection: config.authenticatorSelection || {
      requireResidentKey: true,
      residentKey: "required",
      userVerification: "preferred",
    },
    attestation: config.attestation || "none",
    extensions: config.extensions || {},
    // All algorithms can be found here: https://www.iana.org/assignments/cose/cose.xhtml#algorithms
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7,
      },
    ],
  });

  const brokenRegistrationResult =
    registrationResult as BrokenPasskeyCreateResult;
  if (typeof brokenRegistrationResult === "string") {
    registrationResult = JSON.parse(brokenRegistrationResult);
  }

  console.log("registration result: ", registrationResult);

  return {
    authenticatorName: config.authenticatorName,
    challenge: challenge,
    attestation: {
      credentialId: registrationResult.id,
      clientDataJson: registrationResult.response.clientDataJSON,
      attestationObject: registrationResult.response.attestationObject,
    },
  };
}
