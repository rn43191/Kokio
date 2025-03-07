import { PasskeyCreateResult } from "react-native-passkey";

export type TPasskeyRegistrationConfig = {
  // The RPID ("Relying Party ID") for your app.
  // See https://github.com/f-23/react-native-passkey?tab=readme-ov-file#configuration to set this up.
  rp: {
    id: string;
    name: string;
  };

  // Properties for passkey display: user name and email will show up in the prompts
  user: {
    id: string;
    name: string;
    displayName: string;
  };

  // Name of the authenticator (affects Turnkey only, won't be shown on passkey prompts)
  // TODO: document restrictions on character sets
  authenticatorName: string;

  // Optional challenge. If not provided, a new random challenge will be generated
  challenge?: string;

  // Optional timeout value. Defaults to 5 minutes.
  timeout?: number;

  // Optional override for UV flag. Defaults to "preferred".
  userVerification?: UserVerificationRequirement;

  // Optional list of credentials to exclude from registration. Defaults to empty
  excludeCredentials?: PublicKeyCredentialDescriptor[];

  // Authenticator selection params
  // Defaults if not passed:
  // - authenticatorAttachment: undefined
  //   (users can enroll yubikeys -- aka "cross-platform authenticator" -- or "platform" authenticator like faceID)
  // - requireResidentKey: true
  // - residentKey: "required"
  // - userVerification: "preferred"
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    requireResidentKey?: boolean;
    residentKey?: string;
    userVerification?: string;
  };

  // Optional attestation param. Defaults to "none"
  attestation?: string;

  // Optional extensions. Defaults to empty.
  extensions?: Record<string, unknown>;
};

export type BrokenPasskeyCreateResult = PasskeyCreateResult | string;
