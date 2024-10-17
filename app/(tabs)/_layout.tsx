import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { StyleSheet } from "react-native";
import { Theme, createStyles } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const styles = createStyles(StyleSheet);

const Header = ({ options }: { options: { title: string } }) => (
  <ThemedView
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: Theme.spacing.sm,
    }}
  >
    <ThemedText type="subtitle">{options?.title}</ThemedText>
  </ThemedView>
);

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Theme.colors.highlight,
          tabBarInactiveTintColor: Theme.colors.inactive,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerShown:false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(shop)"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cart" : "cart-outline"}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "eSIM Wallet",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "wallet" : "wallet-outline"}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="phone"
          options={{
            title: "eSIMs",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "call" : "call-outline"}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "menu" : "menu-outline"}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
