import { useColorScheme as nativeUseColorScheme } from "react-native";

export function useColorScheme() {
  return "dark" || nativeUseColorScheme();
}
