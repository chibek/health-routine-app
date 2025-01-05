import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Image, LayoutAnimation, Text, View } from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { useStore } from 'zustand';

import { Button } from '@/components/nativewindui/Button';
import SetsRow from '@/components/sets/SetsRow';
import { DEFAULT_SET } from '@/db/constants';
import { exerciseSetsSelectSchemaType, exercisesSelectSchemaType } from '@/db/schema';
import { addSet } from '@/services/sets';
import { createSetsStore, SetsContext, StoreSet } from '@/stores/sets';

type ExerciseCardProps = exercisesSelectSchemaType & {
  sets: exerciseSetsSelectSchemaType[];
  exercisesRoutineId: number;
};

const ExerciseCard = ({ id, exercisesRoutineId, name, sets: selectSets }: ExerciseCardProps) => {
  const store = useRef(createSetsStore({ sets: selectSets })).current;
  const { sets, addSets } = useStore(store, (s) => s);

  const handleAddSet = async () => {
    const newSet: StoreSet = {
      ...DEFAULT_SET,
      exercisesRoutineId,
      exerciseId: id,
      order: sets.length + 1,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const inserted = await addSet(newSet);
    addSets(inserted);
  };

  return (
    <SetsContext.Provider value={store}>
      <LayoutAnimationConfig>
        <Animated.View className="flex gap-6 bg-background">
          <View className="flex flex-row items-center gap-2">
            <Image src="https://picsum.photos/200" className="aspect-square size-16" />
            <Text>{name}</Text>
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
                order={index + 1}
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
    </SetsContext.Provider>
  );
};

export default ExerciseCard;
