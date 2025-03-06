import { useAlchemyAuthSession } from "@/context/AlchemyAuthSessionProvider";
import { AuthenticatingState } from "@/context/types";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import crypto from "crypto";
import { encode, decode } from "cbor";

const windowWidth = Dimensions.get("window").width;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { signInWithOTP, authState } = useAlchemyAuthSession();

  const onSignIn = useCallback(async () => {
    try {
      await signInWithOTP(email);
    } catch (e) {
      console.error(
        "Unable to send OTP to user. Ensure your credentials are properly set: ",
        e
      );
    }
  }, [email]);

  useEffect(() => {
    if (authState === AuthenticatingState.AWAITING_OTP) {
      router.navigate("/otp-modal");
    }
  }, [authState]);

  if (authState === AuthenticatingState.AUTHENTICATED) {
    return <Redirect href={"/"} />;
  }

  const signInDisabled = email.length < 1;

  return (
    <View style={conatinerStyles({ top, bottom })}>
      <View style={styles.formContainer}>
        <Text style={styles.titleText}>
          {`Welcome! \nEnter Your Email to Sign In.`}
          {crypto.createHash("sha256").digest("hex") || ""}
		  {encode(undefined, 2).toString('hex') || ""}
        </Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(val) => setEmail(val.toLowerCase())}
            placeholder="john@doe.com"
          />
          <Pressable onPress={onSignIn} disabled={signInDisabled}>
            {({ pressed }) => (
              <View
                style={[
                  styles.signInButton,
                  {
                    opacity: pressed || signInDisabled ? 0.5 : 1,
                    transform: [
                      {
                        scale: pressed ? 0.98 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.signInText]}>Sign In</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

interface StyleProps {
  top: number;
  bottom: number;
}
const conatinerStyles = ({
  top,
  bottom,
}: StyleProps): StyleProp<ViewStyle> => ({
  paddingTop: top + 10,
  paddingBottom: bottom,
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  backgroundColor: "rgba(50, 50, 50, 0.2)",
});

const styles = StyleSheet.create({
  formContainer: {
    width: windowWidth * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#585757",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  titleText: {
    fontFamily: "SpaceMono",
  },
  textInputContainer: {
    marginTop: 10,
    width: "100%",
  },

  textInput: {
    width: "100%",
    height: 40,
    borderColor: "rgba(0,0,0,0.095)",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.025)",
    marginBottom: 10,
    borderRadius: 10,
  },

  signInButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
  },

  signInText: {
    color: "white",
    fontFamily: "SpaceMono",
  },
});
