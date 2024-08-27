import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { StyleSheet } from 'react-native';

const HIGHLIGHT_COLOR = '#FFCC00';
const BACKGROUND_COLOR = '#242427';
const INACTIVE_COLOR = '#777777';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: HIGHLIGHT_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarShowLabel: false, // This hides the tab labels
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="phone"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'call' : 'call-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BACKGROUND_COLOR,
    borderTopColor: '#242427',
  },
});