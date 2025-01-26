import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Clock from '@/components/Clock';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { Button } from '@/components/nativewindui/Button';
import { db } from '@/db/db';
import { routines } from '@/db/schema';
import { deleteSets, insertSets, updateSets } from '@/services/sets';
import { createWorkoutHistoryService } from '@/services/workout-history';
import { useClockStore } from '@/stores/clock';
import { resetAllStores } from '@/stores/generic';
import { useSetsStore } from '@/stores/selectSets';

const RoutineView = () => {
  const router = useRouter();
  const [note, setNote] = useState<string | undefined>(undefined);
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
      <Header routineId={data.id} note={note} />
      <TextInput
        value={note}
        onChangeText={setNote}
        className="mt-4 max-h-14 p-2"
        multiline
        placeholderTextColor="#9A9A9A"
        placeholder="Agregar notas aqui..."
      />
      <KeyboardAwareScrollView>
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
      </KeyboardAwareScrollView>
    </View>
  );
};

const Header: React.FC<{ routineId: number; note?: string }> = ({ routineId, note }) => {
  const router = useRouter();
  const { setsByExercise, pendingSets, removedSets } = useSetsStore((s) => s);
  const clock = useClockStore((state) => state.clocks['training_time']);

  const handleFinishRoutine = async () => {
    await deleteSets(removedSets);
    const insertedSets = await insertSets(pendingSets);
    const updatedSets = await updateSets(setsByExercise);
    [...updatedSets, ...insertedSets].forEach(
      async (s) =>
        await createWorkoutHistoryService({
          routineId,
          exerciseSetId: s.id,
          notes: note,
          trainDuration: clock.elapsedTime,
        })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} className="sticky top-0 border-b-4 pb-4">
      <View className="flex-row items-center justify-between  px-4">
        <View className="flex items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Text>Tiempo:</Text>
            <Clock className="min-w-[70px] text-xl font-bold" id="training_time" />
          </View>
          <View className="flex-row items-center gap-2">
            <Text>Set:</Text>
            <Clock className="min-w-[70px] text-xs" id="set_time" enableActivityLife />
          </View>
        </View>
        <Button onPress={() => handleFinishRoutine()} size="lg">
          <Text>Terminar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default RoutineView;
