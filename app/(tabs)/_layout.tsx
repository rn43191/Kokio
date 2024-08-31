import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { StyleSheet } from 'react-native';
import { Theme, createStyles } from '@/constants/Colors';

const styles = createStyles(StyleSheet);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.highlight,
        tabBarInactiveTintColor: Theme.colors.inactive,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'cart' : 'cart-outline'} 
              color={color} 
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'wallet' : 'wallet-outline'} 
              color={color} 
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="phone"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'call' : 'call-outline'} 
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
              name={focused ? 'menu' : 'menu-outline'} 
              color={color} 
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
}