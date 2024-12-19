import { useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from 'expo-sqlite';
import * as WebBrowser from 'expo-web-browser';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/nativewindui/Button';

const LoginScreen = () => {
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { top } = useSafeAreaInsets();

  const handleAppleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await appleAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  const openLink = async () => {
    WebBrowser.openBrowserAsync('https://github.com/chibek/health-routine-app');
  };

  const db = useSQLiteContext();
  useDrizzleStudio(db);
  return (
    <View style={{ paddingTop: top }} className="mt-10 flex-1 items-center gap-16">
      <Image
        source={require('@/assets/images/todoist-logo.png')}
        style={{ height: 40, resizeMode: 'contain', alignSelf: 'center' }}
      />
      <Image
        source={require('@/assets/images/login.png')}
        style={{ height: 280, resizeMode: 'contain' }}
      />
      <Text className="text-center text-xl font-bold">Organize your work and life, finally.</Text>

      <View className="mx-10 gap-4">
        <Button size="lg" onPress={handleAppleLogin}>
          <Ionicons name="logo-apple" size={24} color="white" />
          <Text>Continue with Apple</Text>
        </Button>

        <Button size="lg" onPress={handleGoogleLogin}>
          <Ionicons name="logo-google" size={24} />
          <Text>Continue with Google</Text>
        </Button>

        <Button size="lg" onPress={handleAppleLogin}>
          <Ionicons name="mail" size={24} />
          <Text>Continue with Email</Text>
        </Button>

        <Text className="text-xs text-gray-600">
          By continuing you agree to Todoist's <Text onPress={openLink}>Terms of Service</Text> and{' '}
          <Text onPress={openLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
