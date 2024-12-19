import { useAuth, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { Button } from '@/components/nativewindui/Button';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
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
    </View>
  );
};

export default Profile;
