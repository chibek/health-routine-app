import '../global.css';
import 'expo-dev-client';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator, LogBox, View, NativeModules } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';

import { db, expoDB } from '@/db/db';
import migrations from '@/drizzle/migrations';
import { useColorScheme, useInitialAndroidBarSync } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';
import { COLORS } from '@/theme/colors';
import { addDBData } from '@/utils/addDBData';
import { tokenCache } from '@/utils/cache';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const { DynamicIsland } = NativeModules;
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);

const InitialLayout = () => {
  const router = useRouter();
  useInitialAndroidBarSync();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(authenticated)/(tabs)/home');
    } else if (!isSignedIn && pathname !== '/') {
      router.replace('/');
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: COLORS.light.background,
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
};

function Loading() {
  return <ActivityIndicator size="large" />;
}

const RootLayout = () => {
  const { success } = useMigrations(db, migrations);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  useDrizzleStudio(expoDB);
  useEffect(() => {
    if (!success) return;
    addDBData(db);
  }, [success]);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName="workouts.db"
            options={{ enableChangeListener: true }}
            useSuspense>
            <StatusBar
              key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
              style={isDarkColorScheme ? 'light' : 'dark'}
            />
            <ActionSheetProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Toaster />
                <NavThemeProvider value={NAV_THEME[colorScheme]}>
                  <InitialLayout />
                </NavThemeProvider>
              </GestureHandlerRootView>
            </ActionSheetProvider>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
