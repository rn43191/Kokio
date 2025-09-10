import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { User, useTurnkey } from "@turnkey/sdk-react-native";
import { ThemedText } from "./ThemedText";
import { useRouter } from "expo-router";
import { useKokio } from "@/hooks/useKokio";
import { BlurView } from "expo-blur";
import { Easing } from "react-native-reanimated";

export function AuthenticationModal() {
  const [loading, setLoading] = useState<boolean>(false);
  const sheetRef = useRef<BottomSheet>(null);

  const { state, loginWithPasskey, signUpWithPasskey } = useAuthRelay();
  const {
    kokio,
    setupKokioDeviceUID,
    setupKokioUserData,
    setupKokioUserPasskey,
  } = useKokio();
  const { clearAllSessions } = useTurnkey();
  const router = useRouter();

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        pressBehavior={"none"}
      >
        <BlurView
          intensity={100}
          tint="systemChromeMaterialDark"
          experimentalBlurMethod="none"
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        />
      </BottomSheetBackdrop>
    ),
    []
  );

  const loginOrSignUpWithPasskey = useCallback(async () => {
    setLoading(true);
    if (kokio.deviceUID) {
      try {
        await loginWithPasskey().then(() => {
          setLoading(false);
          sheetRef.current?.close({
            duration: 250,
            easing: Easing.out(Easing.quad),
          });
        });
      } catch (e) {
        console.error("Error signing in", e);
      }
    } else {
      try {
        await signUpWithPasskey({})
          .then((data) => {
            if (data) {
              setupKokioDeviceUID(data.deviceUID);
              setupKokioUserData(data.deviceUID, data.user as User);
              setupKokioUserPasskey(data.deviceUID, {
                x:
                  data.decodedAttestationObject?.decodedAttestationObjectCbor
                    ?.x || "",
                y:
                  data.decodedAttestationObject?.decodedAttestationObjectCbor
                    ?.y || "",
                attestationObject:
                  data.authenticatorParams?.attestation.attestationObject || "",
                clientDataJson:
                  data.authenticatorParams.attestation.clientDataJson,
                credentialId:
                  data.authenticatorParams?.attestation?.credentialId,
              });
            }
          })
          .finally(() => {
            setLoading(false);
            sheetRef.current?.close({
              duration: 250,
              easing: Easing.out(Easing.quad),
            });
          });
      } catch (e) {
        console.error("Error signing in", e);
        setLoading(false);
      }
    }
  }, [signUpWithPasskey, loginWithPasskey, kokio]);

  useEffect(() => {
    // Show the modal if not authenticated and we have user data (meaning user has set up passkey)
    if (!state.authenticated) {
      clearAllSessions();
      sheetRef.current?.expand({
        duration: 250,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [state.authenticated]);

  return (
    <BottomSheet
      ref={sheetRef}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      handleComponent={null}
      enablePanDownToClose={false}
      animateOnMount={true}
      style={{ borderRadius: 25, flex: 1 }}
      backgroundStyle={{ backgroundColor: "rgba(24, 24, 27, 0.97)" }}
    >
      <BottomSheetView style={{ alignItems: "center", flex: 1, padding: 20 }}>
        <Image
          source={require("@/assets/images/kokio-text.png")}
          style={{
            height: 60,
            marginTop: 10,
            resizeMode: "contain",
          }}
        />
        <ThemedText
          style={{
            fontSize: 24,
            fontWeight: "300",
            color: "white",
            fontFamily: "Lexend-Light",
            marginTop: 32,
          }}
        >
          Authentication Required
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 13,
            marginTop: 12,
            fontWeight: "300",
            color: "white",
            fontFamily: "Lexend-Light",
          }}
        >
          Secure your account using your fingerprint
        </ThemedText>
        <Pressable onPress={loginOrSignUpWithPasskey}>
          <Image
            source={require("@/assets/images/fingerprint.png")}
            style={{
              height: 80,
              marginTop: 24,
              marginBottom: 5,
              resizeMode: "contain",
            }}
          />
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: "300",
              color: "white",
              fontFamily: "Lexend-Light",
            }}
          >
            Touch the fingerprint sensor
          </ThemedText>
        </Pressable>
        <Pressable
          disabled={loading}
          onPress={() =>
            sheetRef.current?.close({
              duration: 250,
              easing: Easing.out(Easing.quad),
            })
          }
          style={{ alignSelf: "flex-start", marginTop: 64, marginBottom: 32 }}
        >
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: "300",
              fontFamily: "Lexend-Light",
              color: "#64D2FF",
            }}
          >
            Cancel
          </ThemedText>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({});
