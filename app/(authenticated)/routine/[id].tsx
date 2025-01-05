import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Clock from '@/components/Clock';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { Button } from '@/components/nativewindui/Button';
import { db } from '@/db/db';
import { routines } from '@/db/schema';
import { resetAllStores } from '@/stores/generic';

const RoutineView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useLiveQuery(
    db.query.routines.findFirst({
      with: {
        exercises: {
          with: {
            exercise: true,
            sets: true,
          },
        },
      },
      where: eq(routines.id, Number(id)),
    })
  );

  // Detect when the screen component is unmounted
  useEffect(() => {
    return () => {
      resetAllStores();
    };
  }, []);

  //TODO: Handle empty data
  if (!data || !data.exercises.length) return null;

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView>
        <View className="flex-1 gap-3 py-4">
          {data.exercises.map(({ exercise, sets, id }) => (
            <ExerciseCard
              key={exercise.id}
              {...exercise}
              exercisesRoutineId={id}
              sets={sets.filter((set) => set.exercisesRoutineId === id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const Header: React.FC = () => {
  const router = useRouter();
  const handleFinishRoutine = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} className="sticky top-0 border-b-4 pb-4">
      <View className="flex-row items-center justify-between  px-4">
        <View className="flex-row items-center gap-2">
          <Text>Duracion: </Text>
          <Clock />
        </View>

        <Button onPress={() => handleFinishRoutine()} size="lg">
          <Text>Terminar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default RoutineView;
