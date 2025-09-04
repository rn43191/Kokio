import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { useTurnkey } from "@turnkey/sdk-react-native";

export function AuthenticationModal() {
  const { authenticate } = useAuthRelay();
  const { session } = useTurnkey();
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "50%"], []);
  const handleShowSheet = () => {
    sheetRef.current?.snapToIndex(1);
  };
  const handleCloseSheet = () => {
    sheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose
      style={{
        paddingBottom: 10,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
      }}
      backgroundStyle={{ backgroundColor: "rgba(37, 37, 37, 0.95)" }}
    >
      <Text>Authentication</Text>
      <Pressable onPress={() => authenticate()}>
        <Text>Authenticate</Text>
      </Pressable>
      <Pressable onPress={() => sheetRef.current?.close()}>
        <Text>Close</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({});
