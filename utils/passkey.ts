import {
  Passkey,
  PasskeyCreateResult,
  PasskeyGetResult,
} from "react-native-passkey";
import { getRandomChallenge } from "../helpers/converters";
import {
  BrokenPasskeyCreateResult,
  TPasskeyAuthenticationConfig,
  TPasskeyRegistrationConfig,
} from "./types";
import { PASSKEY_CONFIG } from "@/constants/passkey.constants";

/**
 * Creates a passkey and returns registration result
 * @param config - registration config
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
  try {
    const challenge = config.challenge || getRandomChallenge();

    let createFn = options?.withPlatformKey
      ? Passkey.createPlatformKey
      : options?.withSecurityKey
      ? Passkey.createSecurityKey
      : Passkey.create;

    let registrationResult: PasskeyCreateResult = await createFn({
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

    return registrationResult;
  } catch (e) {
    console.error("create error", e);
  }
}

/**
 * Authenticates with a passkey and returns authenticator params
 * @param config - authentication config
 * @returns authentication result
 */
export const authenticatePasskey = async (
  config: TPasskeyAuthenticationConfig
) => {
  try {
    const authenticationResult: PasskeyGetResult = await Passkey.get({
      rpId: config.rp.id,
      challenge: config.challenge,
      ...(config.credentialId && {
        allowCredentials: [{ id: config.credentialId, type: "public-key" }],
      }),
    });

    console.log("Authentication json -", authenticationResult);

    return authenticationResult;
  } catch (e) {
    console.error("authenticate error", e);
  }
};
