import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Theme } from "@/constants/Colors";

const ICON_SIZE = 16;

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  containerStyle,
  inputStyle,
}: {
  placeholder?: string;
  onSearch: (text: string) => void;
  onClear: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = useCallback(
    (text: string) => {
      setSearchText(text);
      if (onSearch) {
        onSearch(text);
      }
    },
    [setSearchText, onSearch]
  );

  const handleClear = useCallback(() => {
    setSearchText("");
    if (onClear) {
      onClear("");
    }
  }, [setSearchText, onClear]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchIconContainer}>
        <Ionicons
          name="search"
          size={ICON_SIZE}
          color={useThemeColor({}, "foreground")}
        />
      </View>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleTextChange}
        placeholderTextColor={useThemeColor({}, "foreground")}
      />
      {searchText.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons
            name="close"
            size={ICON_SIZE}
            color={useThemeColor({}, "foreground")}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: useThemeColor({}, "input"),
    borderRadius: Theme.spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  input: {
    width: "100%",
    flex: 1,
    color: useThemeColor({}, "foreground"),
  },
  clearButton: {
    padding: Theme.spacing.xs,
  },
});

export default SearchBar;
