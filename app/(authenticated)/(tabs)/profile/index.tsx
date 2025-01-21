import { useAuth, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { NativeModules, Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const { TimerWidgetModule } = NativeModules;

const Profile = () => {
  console.log(NativeModules);
  const { user } = useUser();
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();
  return (
    <View className="flex-1 gap-4 p-4">
      <Avatar alt="Profile Avatar">
        <AvatarImage
          source={{
            uri: user?.imageUrl,
          }}
        />
        <AvatarFallback>
          <Text className="text-foreground">NUI</Text>
        </AvatarFallback>
      </Avatar>
      <Text>Profile</Text>
      <Button variant="plain" onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Button>
      <Button variant="plain" onPress={() => toggleColorScheme()}>
        <Text>Toggle Color theme</Text>
      </Button>
      <Button
        onPress={() => {
          TimerWidgetModule.startLiveActivity();
        }}>
        <Text>Start Timer</Text>
      </Button>
      <Button
        onPress={() => {
          TimerWidgetModule.stopLiveActivity();
        }}>
        <Text>Stop Timer</Text>
      </Button>
    </View>
  );
};

export default Profile;
