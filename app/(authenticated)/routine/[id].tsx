import { useActionSheet } from '@expo/react-native-action-sheet';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Clock from '@/components/Clock';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { Button } from '@/components/nativewindui/Button';
import { db } from '@/db/db';
import { routines } from '@/db/schema';
import { deleteSets, insertSets, updateSets } from '@/services/sets';
import { createWorkoutHistoryService } from '@/services/workout-history';
import { resetAllStores } from '@/stores/generic';
import { useSetsStore } from '@/stores/selectSets';

const RoutineView = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showActionSheetWithOptions } = useActionSheet();
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

  const handleActionSheet = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ['Descartar', 'Cancel'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === 0) router.dismiss();
      }
    );
  }, []);

  //TODO: Handle empty data
  if (!data || !data.exercises.length) return null;

  return (
    <View className="flex-1 bg-white">
      <Header routineId={data.id} />
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
        <SafeAreaView edges={['bottom']} className="px-4 pb-4">
          <Button variant="plain" onPress={() => handleActionSheet()} size="lg">
            <Text className="font-bold text-destructive">Descartar Entreno</Text>
          </Button>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const Header: React.FC<{ routineId: number }> = ({ routineId }) => {
  const router = useRouter();
  const { setsByExercise, pendingSets, removedSets } = useSetsStore((s) => s);

  const handleFinishRoutine = async () => {
    await deleteSets(removedSets);
    const insertedSets = await insertSets(pendingSets);
    const updatedSets = await updateSets(setsByExercise);
    [...updatedSets, ...insertedSets].forEach(
      async (s) =>
        await createWorkoutHistoryService({
          routineId,
          exerciseSetId: s.id,
          notes: '',
        })
    );
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
