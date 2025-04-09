import {
  Passkey,
  PasskeyCreateResult,
  PasskeyGetResult,
} from "react-native-passkey";
import {
  DEFAULT_ETHEREUM_ACCOUNTS,
  PASSKEY_CONFIG,
  TURNKEY_API_URL,
  TURNKEY_PARENT_ORG_ID,
} from "@/constants/passkey.constants";
import {
  isSupported,
  createPasskey,
  PasskeyStamper,
  TurnkeyAuthenticatorParams,
} from "@turnkey/react-native-passkey-stamper";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { TurnkeyClient } from "@turnkey/http";
import { TurnkeySigner } from "@turnkey/ethers";
import {
  base64UrlToBuffer,
  decodeClientDataJSON,
  getRandomChallenge,
  parseDEREncodedSignature,
} from "@/helpers/converters";
import { decode } from "cbor";
import {
  BrokenPasskeyCreateResult,
  ParamsType,
  TPasskeyAuthenticationConfig,
  TPasskeyRegistrationConfig,
} from "./types";
import { Buffer } from "buffer";
import { parseAuthenticatorData } from "@/helpers/parseAuthenticatorData";
import {
  toHex,
  http,
  createWalletClient,
  Account,
  WalletClient,
  parseSignature,
} from "viem";
import { createLightAccountClient } from "@account-kit/smart-contracts";
import { sepolia } from "viem/chains";
import { createAccount } from "@turnkey/viem";
import { Alchemy, Network } from "alchemy-sdk";
import {
  WalletClientSigner,
  toSmartContractAccount,
  type SmartAccountSigner,
  type ToSmartContractAccountParams,
} from "@aa-sdk/core";
import {
  AlchemySmartAccountClient,
  createAlchemySmartAccountClient,
} from "@account-kit/infra";
import { User } from "@turnkey/sdk-react-native";

/**
 * Decodes the attestation object and extracts public key data
 * @param json - JSON object containing the attestation data
 * @returns object containing x and y coordinates of the public key
 * @throws error if decoding fails
 * @throws error if no json is provided
 */
export async function decodeAttestationObj(cred: {
  rawId: string;
  response: {
    clientDataJson: string;
    attestationObject: string;
  };
}): Promise<
  | {
      x: string;
      y: string;
      credentialId: string;
    }
  | undefined
> {
  if (!cred) {
    console.error("No json provided");
    return { x: "", y: "", credentialId: "" };
  }
  try {
    console.log("creation json -", cred);

    if (cred?.rawId) console.log("Credentials id:", cred.rawId);
    if (cred?.response) console.log(cred.response);
    const attestationObject = Buffer.from(
      cred.response.attestationObject,
      "base64"
    );
    const decodedAttestationObj = decode(attestationObject);
    let authDataBuffer = decodedAttestationObj.authData;
    if (Buffer.isBuffer(authDataBuffer)) {
      authDataBuffer = authDataBuffer.buffer.slice(
        authDataBuffer.byteOffset,
        authDataBuffer.byteOffset + authDataBuffer.byteLength
      );
    }
    const authDataUint8Array = new Uint8Array(decodedAttestationObj.authData); // Safe conversion
    const authData = parseAuthenticatorData(authDataUint8Array);
    const publicKey = decode(Buffer.from(authData.credentialPublicKey!.buffer));
    const x = toHex(publicKey.get(-2));
    const y = toHex(publicKey.get(-3));
    console.log("Public Key X from attestationObject:", x);
    console.log("Public Key Y from attestationObject:", y);
    return { x, y, credentialId: cred.rawId };
  } catch (e) {
    console.error("create error", e);
  }
}

/**
 * Creates a passkey and returns registration result
 * @param config - registration config
 * @param options - options for creating passkey
 * @returns authenticator params
 * @throws error if passkey creation fails
 */
export async function createPasskeyNative(
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
export async function authenticatePasskeyNative(
  config: TPasskeyAuthenticationConfig
) {
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
}

export async function handleInitOtpAuthClient({ email }: { email: string }) {
  console.log("here");

  let organizationId: string = TURNKEY_PARENT_ORG_ID;

  const stamper = new ApiKeyStamper({
    apiPublicKey: process.env.EXPO_PUBLIC_TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.EXPO_PUBLIC_TURNKEY_API_PRIVATE_KEY!,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  const { organizationIds } = await client.getSubOrgIds({
    organizationId,
    filterType: "EMAIL",
    filterValue: email,
  });

  if (organizationIds.length > 0) {
    console.log(organizationIds);
    organizationId = organizationIds[0];
  } else {
    // User does not exist
    console.error(
      "User cannot be created with email... user needs to create account with email and passkey"
    );
    return;
  }

  const result = await client.initOtpAuth({
    type: "ACTIVITY_TYPE_INIT_OTP_AUTH_V2",
    organizationId: organizationId,
    timestampMs: String(Date.now()),
    parameters: {
      otpType: "OTP_TYPE_EMAIL",
      contact: email,
    },
  });

  return { result, organizationId };
}

export async function onPasskeyCreate(user: {
  username: string;
  email: string;
}): Promise<
  | {
      authenticatorParams: TurnkeyAuthenticatorParams;
      subOrgCreationResponse: any;
    }
  | undefined
> {
  if (!isSupported()) {
    alert("Passkeys are not supported on this device");
  }

  // This part needs to be run on the server possibly and the onPasskeyCreate needs to get authenticatorParams as params
  const stamper = new ApiKeyStamper({
    apiPublicKey: process.env.EXPO_PUBLIC_TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.EXPO_PUBLIC_TURNKEY_API_PRIVATE_KEY!,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  const { organizationIds } = await client.getSubOrgIds({
    organizationId: TURNKEY_PARENT_ORG_ID,
    filterType: "EMAIL",
    filterValue: user.email,
  });

  if (organizationIds.length > 0) {
    console.log("User with this email already exists", user.email);
    return;
  }

  try {
    const now = new Date();
    // ID isn't visible by users, but needs to be random enough and valid base64 (for Android)
    const userId = Buffer.from(String(Date.now())).toString("base64");

    const authenticatorParams = await createPasskey({
      // This doesn't matter much, it will be the name of the authenticator persisted on the Turnkey side.
      // Won't be visible by default.
      authenticatorName: "End-User Passkey",
      rp: {
        id: PASSKEY_CONFIG.RP_ID,
        name: PASSKEY_CONFIG.RP_NAME,
      },
      user: {
        id: userId,
        name: user.username,
        displayName: user.email,
      },
      authenticatorSelection: {
        residentKey: "required",
        requireResidentKey: true,
        userVerification: "preferred",
      },
    });
    console.log("passkey registration succeeded: ", authenticatorParams);
    const decodedAttestationObj = await decodeAttestationObj({
      rawId: authenticatorParams.attestation.credentialId,
      response: {
        clientDataJson: authenticatorParams.attestation.clientDataJson,
        attestationObject: authenticatorParams.attestation.attestationObject,
      },
    });
    console.log("decoded attestation object: ", decodedAttestationObj);

    const response = await createSubOrganization(authenticatorParams, user);
    if (!response) return;
    console.log("created sub-org", response);
    return { authenticatorParams, subOrgCreationResponse: response };
  } catch (e) {
    console.error("error during passkey creation", e);
  }
}

export async function onPasskeySignature(): Promise<
  | {
      organizationId: string;
      organizationName: string;
      userId: string;
      username: string;
    }
  | undefined
> {
  if (!isSupported()) {
    alert("Passkeys are not supported on this device");
    return;
  }
  try {
    const stamper = new PasskeyStamper({
      rpId: PASSKEY_CONFIG.RP_ID,
    });
    const turnkeyClient = new TurnkeyClient(
      { baseUrl: TURNKEY_API_URL },
      stamper
    );
    const getWhoamiResult = await turnkeyClient.getWhoami({
      organizationId: TURNKEY_PARENT_ORG_ID,
    });

    console.log("authenticated user: ", getWhoamiResult);
    return getWhoamiResult;
  } catch (e) {
    console.error("error during passkey signature", e);
  }
}

export async function handleOtpAuthClient(params: ParamsType<"otpAuth">) {
  const {
    otpId,
    otpCode,
    organizationId,
    targetPublicKey,
    expirationSeconds,
    invalidateExisting,
  } = params;

  const stamper = new ApiKeyStamper({
    apiPublicKey: process.env.EXPO_PUBLIC_TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.EXPO_PUBLIC_TURNKEY_API_PRIVATE_KEY!,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  try {
    const result = await client.otpAuth({
      type: "ACTIVITY_TYPE_OTP_AUTH",
      timestampMs: String(Date.now()),
      organizationId,
      parameters: {
        otpId,
        otpCode,
        targetPublicKey,
        expirationSeconds,
        invalidateExisting,
      },
    });

    return result;
  } catch (error) {
    console.error("error during otpAuth", error);
  }
}

export async function createSubOrganization(
  authenticatorParams: Awaited<ReturnType<typeof createPasskey>>,
  user: {
    username: string;
    email: string;
  }
) {
  const stamper = new ApiKeyStamper({
    apiPublicKey: process.env.EXPO_PUBLIC_TURNKEY_API_PUBLIC_KEY!,
    apiPrivateKey: process.env.EXPO_PUBLIC_TURNKEY_API_PRIVATE_KEY!,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  const data = await client.createSubOrganization({
    type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
    timestampMs: String(Date.now()),
    organizationId: TURNKEY_PARENT_ORG_ID,
    parameters: {
      subOrganizationName: `Sub-organization - ${user.email} ${String(
        Date.now()
      )}`,
      rootQuorumThreshold: 1,
      rootUsers: [
        {
          userName: user.username,
          userEmail: user.email,
          apiKeys: [],
          authenticators: [authenticatorParams],
          oauthProviders: [],
        },
      ],
      wallet: {
        walletName: "ETH wallet",
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      },
    },
  });
  return data;
}

export async function deleteSubOrganization() {
  const stamper = new PasskeyStamper({
    rpId: PASSKEY_CONFIG.RP_ID,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);
  const getWhoamiResult = await client.getWhoami({
    organizationId: TURNKEY_PARENT_ORG_ID,
  });
  const data = await client.deleteSubOrganization({
    type: "ACTIVITY_TYPE_DELETE_SUB_ORGANIZATION",
    timestampMs: String(Date.now()),
    organizationId: getWhoamiResult.organizationId,
    parameters: {
      deleteWithoutExport: true,
    },
  });
  console.log("delete sub-org", data);
  return data;
}

export const returnTurnkeyAlchemyLightAccountClient = async (
  user: User
): Promise<{
  accountClient: AlchemySmartAccountClient;
  viemClient: WalletClient;
}> => {
  console.log("user wallet address", user.wallets[0].accounts[0].address);
  const stamper = new PasskeyStamper({
    rpId: PASSKEY_CONFIG.RP_ID,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  // test
  // client.stamper.stamp("test");

  const viemAccount = await createAccount({
    client,
    organizationId: user.organizationId,
    signWith: user.wallets[0].accounts[0].address,
    ethereumAddress: user.wallets[0].accounts[0].address,
  });

  const viemClient = createWalletClient({
    account: viemAccount as Account,
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });

  console.log("viemClient", viemClient.account.address);

  const signer: SmartAccountSigner = new WalletClientSigner(
    viemClient,
    "json-rpc" // signerType
  );

  // const xc = await signer.signMessage("hello");
  // console.log("smart account signed>>>", xc);

  // Tested Turnkey Signer works and signs also but currently testing out SmartAccountSigner
  // const turnkeySigner: unknown = new TurnkeySigner({
  //   client,
  //   organizationId: user.organizationId,
  //   signWith: user.wallets[0].accounts[0].address,
  // });

  // we need to test out our own smart contract
  // https://accountkit.alchemy.com/third-party/smart-contracts

  const accountClient = await createLightAccountClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.EXPO_PUBLIC_ALCHEMY_API_KEY}`
    ),
    signer,
  });

  // const xv = await accountClient.signMessage({ message: "hello" });
  // console.log("accountClient signed message", xv);

  // console.log("accountClient", accountClient.getAddress());
  // console.log(
  //   "block transaction count",
  //   await accountClient.getBlockTransactionCount()
  // );

  return {
    accountClient: accountClient as unknown as AlchemySmartAccountClient,
    viemClient,
  };
};

// this is the way to send transactions and signed requests for validation
export const stampGetWhoami = async (organizationId: string) => {
  const stamper = new PasskeyStamper({
    rpId: PASSKEY_CONFIG.RP_ID,
  });
  const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  // we can do client.stampSentTransaction
  const signedRequest = await client.stampGetWhoami({
    organizationId,
  });

  console.log("signedRequest", signedRequest);

  const { url, body, stamp } = signedRequest;

  const clientDataJson = JSON.parse(stamp.stampHeaderValue).clientDataJson;
  const signature = JSON.parse(stamp.stampHeaderValue).signature;
  const sigBytes = base64UrlToBuffer(signature);
  const { r, s } = parseDEREncodedSignature(sigBytes);
  const decodedClientDataJson = decodeClientDataJSON(clientDataJson);
  console.log("decodedClientDataJSON:", decodedClientDataJson);
  console.log("r:", r);
  console.log("s:", s);

  // Forward the signed request to the Turnkey API for validation
  const resp = await fetch(url, {
    method: "POST",
    body,
    headers: {
      [stamp.stampHeaderName]: stamp.stampHeaderValue,
    },
  });

  console.log("response from validation", await resp.json());

  return resp.json();
};
