import {
  DEFAULT_ETHEREUM_ACCOUNTS,
  TURNKEY_API_URL,
  TURNKEY_PARENT_ORG_ID,
} from "@/constants/passkey.constants";

// Assuming types.ts is still available for ParamsType
import { APIKeysT, ParamsType, PasskeyT } from "./types";
import Constants from "expo-constants";
import { AppExtraConfig, Config } from "@/appKeys";
import { PasskeyStamper, TurnkeyClient } from "@turnkey/sdk-react-native";

const extra = Constants.expoConfig?.extra as AppExtraConfig;
const SERVER_BASE_URL = `${extra.serverBaseUrl}`;

// Helper function to handle POST requests and common error checking
async function post(endpoint: string, body: any) {
  const url = `${SERVER_BASE_URL}${endpoint}`;
  console.log(`POST ${url}`);
  console.log("Request body:", body);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Fetch network error:", e);
    throw new Error("Network request failed");
  }

  console.log("Response status:", response.status);

  let json;
  try {
    json = await response.json();
  } catch {
    console.error("Response was not JSON");
    throw new Error("Invalid JSON response");
  }

  if (!response.ok) {
    console.error("API Error:", json);
    throw new Error(json.error || `Server error (${response.status})`);
  }

  return json;
}

/**
 * Initiates OTP auth by calling the server endpoint.
 * Original signature: handleInitEmailOtpAuth({ email }: { email: string })
 */
export async function handleInitEmailOtpAuth({ email }: { email: string }) {
  try {
    const result = await post("/api/init-email-otp-auth", { email });
    // Expected server response: { result: InitOtpAuthResponse, organizationId: string }
    return result;
  } catch (error) {
    console.error("error during handleInitEmailOtpAuth", error);
    throw error;
  }
}

/**
 * Completes OTP authentication by calling the server endpoint.
 * Original signature: handleOtpAuth(params: ParamsType<"otpAuth">)
 */
export async function handleOtpAuth(params: ParamsType<"otpAuth">) {
  try {
    // params directly match the server's expected request body
    const result = await post("/api/otp-auth", params);
    return result;
  } catch (error) {
    console.error("error during otpAuth", error);
    throw error;
  }
}

/**
 * Deletes a sub-organization.
 * The sub-org can be deleted by a session or an API key belonging to the sub-org itself
 * Easy to delete as passkey is the session signer
 * This is not done in backend, as backend will have to then store API keys for
 * each sub-org created by the client
 */
export async function deleteSubOrganization(organizationIdToDelete: string) {
  console.log("organizationIdToDelete: ", organizationIdToDelete);
  if (!organizationIdToDelete) {
    throw new Error("Missing organization ID required for secure deletion.");
  }
  const stamper = new PasskeyStamper({
    rpId: Config.EXPO_PUBLIC_RP_ID as string,
  });

  const turnkeyClient = new TurnkeyClient(
    { baseUrl: TURNKEY_API_URL },
    stamper
  );

  const timestampMs = Date.now().toString();

  try {
    await turnkeyClient.deleteSubOrganization({
      type: "ACTIVITY_TYPE_DELETE_SUB_ORGANIZATION",
      timestampMs: timestampMs,
      organizationId: organizationIdToDelete,
      parameters: { deleteWithoutExport: true },
    });
  } catch (e) {
    console.error("Error deleting sub-org: ", e);
  }
}

/**
 * Creates a sub-organization, user, and wallet via the server.
 * Also initiates a session for user's passkey
 */
export async function createSubOrganization(
  user: {
    userId: string;
    username?: string;
    email?: string;
  },
  passkey: PasskeyT,
  apiKeys: APIKeysT
) {
  if (!passkey || !user || !user.userId) {
    throw new Error("Missing required parameters for sub-organization creation.");
  }

  try {
    const data = await post("/api/create-sub-organization", {
      user,
      passkey,
      apiKeys,
    });

    if (!data.ok) {
      throw new Error(data.error || "Server error");
    }

    return data;
  } catch (error) {
    console.error("error during createSubOrganization", error);
    throw error;
  }
}

/**
 * Checks if a sub-organization exists for an email via the server.
 * Original signature: checkIfEmailInUse({ email }: { email: string }): Promise<boolean | string[]>
 */
export async function checkIfEmailInUse({
  email,
}: {
  email: string;
}): Promise<boolean | string[]> {
  if (!email) {
    throw new Error("Email is required for check.");
  }

  try {
    // The server returns { inUse: boolean, organizationIds: string[] }
    const result = await post("/api/check-email", { email });

    // Match the original function's return type: boolean (false) or string[] (organization IDs)
    if (result.inUse) {
      return result.organizationIds;
    } else {
      return false;
    }
  } catch (error) {
    console.error("error during checkIfEmailInUse", error);
    throw error;
  }
}
