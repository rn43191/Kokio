import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: true,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerTitle: () => {
              const route = navigation.getId;
              const tabName = route?.name?.charAt(0).toUpperCase() + route?.name?.slice(1);
              return <HeaderTitle title={tabName || 'Home'} />;
            },
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

const HeaderTitle = ({ title }: { title: string }) => (
  <ThemedText style={styles.headerTitle}>{title}</ThemedText>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
  },
  headerTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  backButton: {
    marginLeft: 10,
  },
});