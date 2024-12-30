import { Ionicons } from '@expo/vector-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import RoutineCard from '@/components/RoutineCard';
import { Button } from '@/components/nativewindui/Button';
import { getRoutines } from '@/services/routines';

const Workout = () => {
  const router = useRouter();
  const { data } = useLiveQuery(getRoutines());

  const onPressNewRoutine = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/new-routine');
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-background">
      <View className="gap-2 p-4">
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
        {data.map((routine) => (
          <RoutineCard key={routine.id} {...routine} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Workout;
