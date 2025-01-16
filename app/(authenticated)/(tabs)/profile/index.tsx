import { useAuth, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();
  return (
    <View className="flex-1 p-4">
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
    </View>
  );
};

export default Profile;
