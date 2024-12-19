import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import RoutineCard from '@/components/RoutineCard';
import { Button } from '@/components/nativewindui/Button';

const Workout = () => {
  const router = useRouter();
  const onPressNewRoutine = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('../routine/new');
  };

  return (
    <ScrollView>
      <View className="flex-1 gap-2 p-4">
        <Text className="text-lg font-bold">Rutinas</Text>
        <View className="flex-1 flex-row gap-4">
          <Button onPress={onPressNewRoutine} size="lg" className="grow text-center">
            <Ionicons name="clipboard-outline" size={24} />
            <Text>Nueva rutina</Text>
          </Button>
          <Button size="lg" className="grow text-center">
            <Ionicons name="search-outline" size={24} />
            <Text>Rutinas</Text>
          </Button>
        </View>
        <Text className="text-gray-500">Mis rutinas</Text>
        <RoutineCard />
      </View>
    </ScrollView>
  );
};

export default Workout;
