import { useAuth, useUser } from '@clerk/clerk-expo';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { NativeModules, Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const { TimerWidgetModule } = NativeModules;

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
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
      <Button onPress={handlePresentModalPress}>
        <Text>Hola</Text>
      </Button>
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        index={1}>
        <BottomSheetView>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default Profile;
