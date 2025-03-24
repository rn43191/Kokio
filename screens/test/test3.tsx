/* eslint-disable import/extensions */
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
// import { isSupported } from "@turnkey/react-native-passkey-stamper";


export default function TestScreen() {


  return (
    <View style={styles.container}>
      {/* {isSupported() ? (
        <View className="flex flex-col gap-4">
          <TouchableOpacity
            style={styles.button}
            disabled={!!state.loading}
            onPress={() => loginWithPasskey()}
          >
            <Text>Log in with passkey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signUpWithPasskey()}
            style={styles.button}
          >
            <Text className="text-base font-semibold text-blue-700">
              Sign up with passkey
            </Text>
          </TouchableOpacity>
        </View>
      ) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginTop: 20,
    marginBottom: 10,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    width: 200,
    padding: 10,
    height: 50,
    backgroundColor: "rgb(147, 197, 253)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  userText: {
    marginBottom: 10,
    fontSize: 18,
  },
});
