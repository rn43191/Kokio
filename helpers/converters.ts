import { base64 } from "@hexagon/base64";
import { Buffer } from "buffer";

export function parseDEREncodedSignature(signature: Uint8Array): {
  r: string;
  s: string;
} {
  let offset = 0;
  if (signature[offset++] !== 0x30) throw new Error("Invalid DER sequence");

  const length = signature[offset++];
  if (signature[offset++] !== 0x02) throw new Error("Expected integer for r");

  const rLen = signature[offset++];
  const r = signature.slice(offset, offset + rLen);
  offset += rLen;

  if (signature[offset++] !== 0x02) throw new Error("Expected integer for s");
  const sLen = signature[offset++];
  const s = signature.slice(offset, offset + sLen);

  return {
    r: Buffer.from(r).toString("hex"),
    s: Buffer.from(s).toString("hex"),
  };
}

export function base64UrlToBuffer(base64url: string): Buffer {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd((base64url.length + 3) & ~3, "=");
  return Buffer.from(base64, "base64");
}

export function decodeClientDataJSON(base64url: string): any {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd((base64url.length + 3) & ~3, "=");
  const jsonString = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(jsonString);
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
