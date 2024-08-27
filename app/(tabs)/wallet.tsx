import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { id: '1', title: 'Profile', iconLeft: 'person-outline', iconRight: 'chevron-forward-outline' },
  { id: '2', title: 'Notifications', iconLeft: 'notifications-outline', iconRight: 'chevron-forward-outline' },
  { id: '3', title: 'Privacy', iconLeft: 'lock-closed-outline', iconRight: 'chevron-forward-outline' },
  { id: '4', title: 'General', iconLeft: 'settings-outline', iconRight: 'chevron-forward-outline' },
  { id: '5', title: 'About', iconLeft: 'information-circle-outline', iconRight: 'chevron-forward-outline' },
];

const MenuItem = ({ title, iconLeft, iconRight }: { title: string, iconLeft: string, iconRight: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuItemContent}>
      <Ionicons name={iconLeft} size={24} color="white" style={styles.iconLeft} />
      <ThemedText style={styles.menuItemText}>{title}</ThemedText>
      <Ionicons name={iconRight} size={24} color="white" style={styles.iconRight} />
    </View>
  </TouchableOpacity>
);

export default function MenuScreen() {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => <MenuItem title={item.title} iconLeft={item.iconLeft} iconRight={item.iconRight} />}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    backgroundColor: '#242427',
    borderRadius: 25,
    maxHeight: 'auto',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  iconLeft: {
    marginRight: 16,
  },
  iconRight: {
    marginLeft: 16,
  },
});