import { useCallback, useEffect, useRef } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { useTurnkey } from "@turnkey/sdk-react-native";
import { ThemedText } from "./ThemedText";
import { useRouter } from "expo-router";
import { useKokio } from "@/hooks/useKokio";
import { BlurView } from "expo-blur";
import { Easing } from "react-native-reanimated";

export function AuthenticationModal() {
  const sheetRef = useRef<BottomSheet>(null);

  const { authenticate, state, loginWithPasskey } = useAuthRelay();
  const { kokio } = useKokio();
  const { session } = useTurnkey();
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

  const loginWithPasskeyOrAuthenticate = useCallback(async () => {
    if (session) {
      await authenticate().then(() => {
        sheetRef.current?.close({
          duration: 250,
          easing: Easing.out(Easing.quad),
        });
      });
    } else {
      loginWithPasskey().then(() => {
        sheetRef.current?.close({
          duration: 250,
          easing: Easing.out(Easing.quad),
        });
      });
    }
  }, [authenticate, loginWithPasskey, session]);

  useEffect(() => {
    if (!state.authenticated && kokio.userData) {
      sheetRef.current?.expand({
        duration: 250,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [state, kokio.userData, session]);

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
        <Pressable onPress={loginWithPasskeyOrAuthenticate}>
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
