// Buffer is available in Node and react-native contexts but needs to be imported
import { base64 } from "@hexagon/base64";
import { Buffer } from "buffer";
import { createHash } from "sha256-uint8array";

// Needs to return a base64-encoded string
export function getChallengeFromPayload(payload: string): string {
  const hexString = createHash().update(payload).digest("hex");
  const hexBuffer = Buffer.from(hexString, "utf8");
  return hexBuffer.toString("base64");
}

// ! taken from https://github.com/MasterKale/SimpleWebAuthn/blob/e02dce6f2f83d8923f3a549f84e0b7b3d44fa3da/packages/browser/src/helpers/bufferToBase64URLString.ts
/**
 * Convert the given array buffer into a Base64URL-encoded string. Ideal for converting various
 * credential response ArrayBuffers to string for sending back to the server as JSON.
 *
 * Helper method to compliment `base64URLStringToBuffer`
 */
export function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// ! taken from https://github.com/MasterKale/SimpleWebAuthn/blob/e02dce6f2f83d8923f3a549f84e0b7b3d44fa3da/packages/browser/src/helpers/utf8StringToBuffer.ts
/**
 * A helper method to convert an arbitrary string sent from the server to an ArrayBuffer the
 * authenticator will expect.
 */
export function utf8StringToBuffer(value: string): ArrayBuffer {
  // @ts-ignore
  return new TextEncoder().encode(value);
}

/**
 * Decode a base64url string into its original string
 */
export function base64UrlToString(base64urlString: Base64URLString): string {
  return base64.toString(base64urlString, true);
}

// Function to return 32 random bytes encoded as hex
// (e.g "5e4c2c235fc876a9bef433506cf596f2f7db19a959e3e30c5a2d965ec149d40f")
// ----
// Important note: this function doesn't return strong cryptographic randomness (Math.random is a PRNG),
// but this is good enough for registration challenges.
// If the challenge was not random at all the risk is that someone can replay a previous
// signature to register an authenticator they don't own. However:
// - we are creating a brand new authenticator here, which means keygen is happening right as we call this library
//   (this makes the replay attack hard-to-impossible)
// - even if a replay attack went through, the authenticator wouldn't be usable given Turnkey has anti-replay in place in activity payloads
//   (there is a `timestampMs` in activity payloads, see https://docs.turnkey.com/api-introduction#queries-and-submissions)
// ----
// As for "why Math.random in the first place?": it lets us avoid a dependency on webcrypto + associated polyfills
// (in react-native webcrypto isn't available)
export function getRandomChallenge(): string {
  let randomHexChars: string[] = [];
  const hexChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];

  for (let i = 0; i < 64; i++) {
    randomHexChars.push(hexChars[Math.floor(Math.random() * 16)]!);
  }
  return randomHexChars.join("");
}
