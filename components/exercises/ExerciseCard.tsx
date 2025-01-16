import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Image, LayoutAnimation, Text, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';

import { Button } from '@/components/nativewindui/Button';
import SetsRow from '@/components/sets/SetsRow';
import { DEFAULT_SET } from '@/db/constants';
import { exerciseSetsSelectSchemaType, exercisesSelectSchemaType } from '@/db/schema';
import { useSetsStore } from '@/stores/selectSets';
import { StoreSet } from '@/stores/sets';

type ExerciseCardProps = exercisesSelectSchemaType & {
  sets: exerciseSetsSelectSchemaType[];
  exercisesRoutineId: number;
};

const ExerciseCard = ({ id, exercisesRoutineId, name, sets: selectSets }: ExerciseCardProps) => {
  const { initializeSets, setsByExercise, addSets, pendingSets } = useSetsStore((s) => s);
  const sets = setsByExercise[id] ?? [];
  const newSets = pendingSets[id] ?? [];

  useEffect(() => {
    initializeSets(id, selectSets);
  }, [selectSets]);

  const handleAddSet = async () => {
    const newSet: StoreSet = {
      ...DEFAULT_SET,
      exercisesRoutineId,
      exerciseId: id,
      order: setsByExercise[id].length + 1,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addSets(id, [newSet]);
  };

  return (
    <LayoutAnimationConfig>
      <Animated.View className="flex gap-6 bg-background">
        <View className="flex flex-row items-center gap-2">
          <Image src="https://picsum.photos/200" className="aspect-square size-16 rounded-lg" />
          <Text className="text-xl font-bold">{name}</Text>
        </View>
        <View>
          <View className="flex-row items-center gap-6">
            <Text className="w-20 text-center text-xl font-bold">Serie</Text>
            <Text className="w-20 text-center text-xl font-bold">Peso</Text>
            <Text className="w-20 text-center text-xl font-bold">Reps</Text>
          </View>
          {sets.map((set, index) => (
            <SetsRow
              key={set.id}
              {...set}
              weight={undefined}
              reps={undefined}
              exerciseId={id}
              order={index + 1}
              oldReps={selectSets.find((s) => s.id === set.id)?.reps ?? undefined}
              oldWeight={selectSets.find((s) => s.id === set.id)?.weight ?? undefined}
            />
          ))}
          {newSets.map((set, index) => (
            <SetsRow
              key={set.tempId}
              {...set}
              exerciseId={id}
              order={sets.length + index + 1}
              oldReps={selectSets.find((s) => s.id === set.id)?.reps ?? undefined}
              oldWeight={selectSets.find((s) => s.id === set.id)?.weight ?? undefined}
            />
          ))}
        </View>
        <Button size="lg" className="w-full" onPress={() => handleAddSet()}>
          <Ionicons name="add-circle-outline" size={24} />
          <Text>Agregar serie</Text>
        </Button>
      </Animated.View>
    </LayoutAnimationConfig>
  );
};

export default ExerciseCard;
