import { AlchemySmartAccountClient } from "@account-kit/infra";
import { User } from "@account-kit/signer";

export enum AuthenticatingState {
	UNAUTHENTICATED = "unauthenticated",
	AWAITING_OTP = "awaiting-otp",
	AUTHENTICATED = "authenticated",
}

export interface AlchemyAuthSessionContextType {
	user: User | null;
	authState: AuthenticatingState | null;
	loading: boolean;
	lightAccountClient: AlchemySmartAccountClient | null;
	signInWithOTP: (email: string) => void;
	signInWithPasskey: (email: string) => void;
	verifyUserOTP: (otp: string) => void;
	signOutUser: () => void;
}