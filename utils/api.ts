import {
  DEFAULT_ETHEREUM_ACCOUNTS,
  TURNKEY_API_URL,
  TURNKEY_PARENT_ORG_ID,
} from "@/constants/passkey.constants";

// Assuming types.ts is still available for ParamsType
import { APIKeysT, ParamsType, PasskeyT } from "./types";
import Constants from "expo-constants";
import { AppExtraConfig } from "@/appKeys";

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
 * Original signature: handleInitOtpAuth({ email }: { email: string })
 */
export async function handleInitOtpAuth({ email }: { email: string }) {
  try {
    const result = await post('/api/init-otp-auth', { email });
    // Expected server response: { result: InitOtpAuthResponse, organizationId: string }
    return result;
  } catch (error) {
    console.error("error during handleInitOtpAuth", error);
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

export async function deleteSubOrganization(organizationIdToDelete: string) {
  if (!organizationIdToDelete) {
    throw new Error("Missing organization ID required for secure deletion.");
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

export async function checkIfEmailInUse({
  email,
}: {
  email: string;
}): Promise<boolean | string[]> {
  if (!email) {
    throw new Error("Email is required for check.");
  }
  
  return false;
}
