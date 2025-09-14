import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useKokio } from "@/hooks/useKokio";
import { useAuthRelay } from "@/hooks/useAuthRelayer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTurnkey } from "@turnkey/sdk-react-native";
import { deleteSubOrganization } from "@/utils/api";
import * as Updates from "expo-updates";

const MenuItem = ({
  title,
  iconLeft,
  iconRight,
  action,
}: {
  title: string;
  iconLeft: string;
  iconRight: string;
  action: (() => void) | undefined;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => action && action()}>
    <View style={styles.menuItemContent}>
      <Ionicons
        /* @ts-ignore */
        name={iconLeft}
        size={24}
        color="white"
        style={styles.iconLeft}
      />
      <ThemedText style={styles.menuItemText}>{title}</ThemedText>
      <Ionicons
        /* @ts-ignore */
        name={iconRight}
        size={24}
        color="white"
        style={styles.iconRight}
      />
    </View>
  </TouchableOpacity>
);

export default function MenuScreen() {
  const { loginWithPasskey, signUpWithPasskey, reauthenticate } =
    useAuthRelay();
  const { clearKokioUser } = useKokio();
  const { clearAllSessions } = useTurnkey();
  const router = useRouter();
  const menuItems = [
    {
      id: "1",
      title: "Profile",
      iconLeft: "person-outline",
      iconRight: "chevron-forward-outline",
    },
    {
      id: "2",
      title: "Notifications",
      iconLeft: "notifications-outline",
      iconRight: "chevron-forward-outline",
    },
    {
      id: "3",
      title: "Privacy",
      iconLeft: "lock-closed-outline",
      iconRight: "chevron-forward-outline",
    },
    {
      id: "4",
      title: "General",
      iconLeft: "settings-outline",
      iconRight: "chevron-forward-outline",
    },
    {
      id: "5",
      title: "About",
      iconLeft: "information-circle-outline",
      iconRight: "chevron-forward-outline",
    },
    {
      id: "6",
      title: "Login with Passkey",
      iconLeft: "log-in-outline",
      iconRight: "chevron-forward-outline",
      action: async () => {
        router.push("/");
        loginWithPasskey();
      },
    },
    {
      id: "7",
      title: "Logout and Clear Data",
      iconLeft: "log-out-outline",
      iconRight: "chevron-forward-outline",
      action: async () => {
        deleteSubOrganization();
        clearAllSessions()
          .then(async () => {
            await clearKokioUser();
          })
          .finally(() => {
            reauthenticate();
            Updates.reloadAsync();
          });
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <FlatList
          data={menuItems}
          renderItem={({ item }) => (
            <MenuItem
              title={item.title}
              iconLeft={item.iconLeft}
              iconRight={item.iconRight}
              action={item.action}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    backgroundColor: "#242427",
    borderRadius: 25,
    maxHeight: "auto",
    padding: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  iconLeft: {
    marginRight: 16,
  },
  iconRight: {
    marginLeft: 16,
  },
});
