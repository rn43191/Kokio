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
const SERVER_BASE_URL = `${extra.serverBaseUrl}:3000`;

// Helper function to handle POST requests and common error checking
async function post(endpoint: string, body: any) {
  const url = `${SERVER_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
    const errorMessage = errorData.error || `Server responded with status ${response.status}`;

    console.error(`API Error on ${endpoint}:`, errorData);
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Initiates OTP auth by calling the server endpoint.
 * Original signature: handleInitEmailOtpAuth({ email }: { email: string })
 */
export async function handleInitEmailOtpAuth({ email }: { email: string }) {
  try {
    const result = await post('/api/init-email-otp-auth', { email });
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
    const result = await post('/api/otp-auth', params);
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

  const turnkeyClient = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);

  const timestampMs = Date.now().toString();

  try {
    await turnkeyClient.deleteSubOrganization({
      type: "ACTIVITY_TYPE_DELETE_SUB_ORGANIZATION",
      timestampMs: timestampMs,
      organizationId: organizationIdToDelete,
      parameters: { deleteWithoutExport: true }
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
    const response = await post("/api/create-sub-organization", {
        user: user,
        passkey: passkey,
        apiKeys: apiKeys,
      }
    );
    
    return response;
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
    const result = await post('/api/check-email', { email });

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
