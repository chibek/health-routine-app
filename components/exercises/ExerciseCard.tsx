import { Ionicons } from '@expo/vector-icons';
import { useContext, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import { useStore } from 'zustand';

import { Button } from '@/components/nativewindui/Button';
import SetsRow from '@/components/sets/SetsRow';
import { exerciseSetsSelectSchemaType, exercisesSelectSchemaType } from '@/db/schema';
import { createSetsStore, SetsContext } from '@/stores/sets';

type ExerciseCardProps = exercisesSelectSchemaType & { sets: exerciseSetsSelectSchemaType[] };

const ExerciseCard = ({ name, sets: selectSets }: ExerciseCardProps) => {
  const store = useRef(createSetsStore({ sets: selectSets })).current;
  const { sets, addSets } = useStore(store, (s) => s);

  return (
    <SetsContext.Provider value={store}>
      <View className="flex gap-6 bg-background">
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
          {sets.map((set) => (
            <SetsRow key={set.order} {...set} />
          ))}
        </View>
        <Button size="lg" className="w-full" onPress={() => addSets}>
          <Ionicons name="add-circle-outline" size={24} />
          <Text>Agregar serie</Text>
        </Button>
      </View>
    </SetsContext.Provider>
  );
};

export default ExerciseCard;
