import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors, globalStyles } from '@/constants/Colors';

const menuItems = [
  { id: '1', title: 'Profile', iconLeft: 'person-outline', iconRight: 'chevron-forward-outline' },
  { id: '2', title: 'Notifications', iconLeft: 'notifications-outline', iconRight: 'chevron-forward-outline' },
  { id: '3', title: 'Privacy', iconLeft: 'lock-closed-outline', iconRight: 'chevron-forward-outline' },
  { id: '4', title: 'General', iconLeft: 'settings-outline', iconRight: 'chevron-forward-outline' },
  { id: '5', title: 'About', iconLeft: 'information-circle-outline', iconRight: 'chevron-forward-outline' },
];

const MenuItem = ({ title, iconLeft, iconRight }: { title: string, iconLeft: string, iconRight: string }) => (
  <TouchableOpacity style={globalStyles.menuItem}>
    <View style={globalStyles.menuItemContent}>
      { /* @ts-ignore */ }
      <Ionicons name={iconLeft} size={24} color={Colors.light.icon} style={globalStyles.iconLeft} />
      <ThemedText style={globalStyles.menuItemText}>{title}</ThemedText>
      { /* @ts-ignore */ }
      <Ionicons name={iconRight} size={24} color={Colors.light.icon} style={globalStyles.iconRight} />
    </View>
  </TouchableOpacity>
);

export default function MenuScreen() {
  return (
    <ThemedView style={globalStyles.container}>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => <MenuItem title={item.title} iconLeft={item.iconLeft} iconRight={item.iconRight} />}
        keyExtractor={item => item.id}
        style={globalStyles.list}
      />
    </ThemedView>
  );
}