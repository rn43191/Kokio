// styles.ts
import { StyleSheet } from 'react-native';
// colors.ts
export const Colors = {
  light: {
    text: 'white',
    background: '#000',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    highlight: '#FFCC00',
    secondaryBackground: '#242427',
    inactive: '#777777',
  },
  dark: {
    text: 'white',
    background: '#000',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    highlight: '#FFCC00',
    secondaryBackground: '#242427',
    inactive: '#777777',
  },
};

export const Theme = {
  colors: {
    ...Colors.dark, // Using dark theme as default
    highlight: '#FFCC00',
    background: '#242427',
    inactive: '#777777',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
};

export const createStyles = (StyleSheet: any) => StyleSheet.create({
  tabBar: {
    backgroundColor: Theme.colors.background,
    borderTopColor: Theme.colors.background,
    height: 60,
    paddingBottom: Theme.spacing.xs,
  },
  tabBarIcon: {
    marginTop: Theme.spacing.xs,
  },
});



export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    backgroundColor: Colors.light.secondaryBackground,
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
    color: Colors.light.text,
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
  tabBar: {
    backgroundColor: Colors.light.secondaryBackground,
    borderTopColor: Colors.light.secondaryBackground,
  },
});